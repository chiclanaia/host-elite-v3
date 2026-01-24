import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { TranslationService } from '../../../services/translation.service';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface CalendarSource {
    id: string;
    name: string;
    url?: string;
    color: string;
    type: 'external' | 'internal';
    property_id: string;
    visible?: boolean;
}

export interface CalendarEvent {
    id?: string;
    title: string;
    start: string; // ISO string
    end?: string;
    description?: string;
    sourceId?: string; // To link back to source for color
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    isManual?: boolean;
    extendedProps?: any;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    private supabase = inject(SupabaseService);
    private ts = inject(TranslationService);

    // Signals for state
    sources = signal<CalendarSource[]>([]);
    isLoading = signal(false);

    constructor() { }

    // --- TRANSLATION HELPERS ---
    translate(key: string, params?: Record<string, string | number>): string {
        return this.ts.translate(key, params);
    }

    locale(): string {
        return this.ts.currentLang();
    }

    // --- SOURCES MANAGEMENT ---
    private propertyPalette = [
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#f97316', // Orange
        '#84cc16', // Lime
        '#6366f1'  // Indigo
    ];

    private getPropertyColor(propertyId: string): string {
        if (!propertyId) return this.propertyPalette[0];
        let hash = 0;
        for (let i = 0; i < propertyId.length; i++) {
            hash = propertyId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % this.propertyPalette.length;
        return this.propertyPalette[index];
    }

    private loadingProps = new Set<string>();

    async loadSources(propertyId: string, propertyName?: string) {
        if (!propertyId || this.loadingProps.has(propertyId)) return;

        this.loadingProps.add(propertyId);
        try {
            // First pass: Fetch existing sources
            let { data: sources, error } = await this.supabase.supabase
                .from('calendar_sources')
                .select('*')
                .eq('property_id', propertyId);

            if (error) throw error;
            let currentSources = sources || [];

            // Check internal sources
            const internalSources = currentSources.filter(s => s.type === 'internal');

            // 1. Creation/Cleanup if needed
            if (internalSources.length !== 1) {
                if (internalSources.length > 1) {
                    console.log(`[CalendarService] Multiple internal sources for ${propertyId}, cleaning up...`);
                    for (let i = 1; i < internalSources.length; i++) {
                        await this.deleteSource(internalSources[i].id);
                    }
                } else if (internalSources.length === 0) {
                    const name = propertyName || 'Calendrier';
                    const color = this.getPropertyColor(propertyId);
                    console.log(`[CalendarService] No internal source for ${propertyId}, creating '${name}' with color ${color}...`);
                    await this.addSource({
                        name: name,
                        type: 'internal',
                        color: color,
                        property_id: propertyId
                    });
                }

                // Final pass: Re-fetch after creation/cleanup
                const { data: refreshedData, error: refreshError } = await this.supabase.supabase
                    .from('calendar_sources')
                    .select('*')
                    .eq('property_id', propertyId);

                if (refreshError) throw refreshError;
                currentSources = refreshedData || [];
            }

            // Exactly one internal calendar exists now or we've updated it
            const internal = currentSources.find(s => s.type === 'internal');
            const primaryColor = this.getPropertyColor(propertyId);

            if (internal && propertyName && (internal.name !== propertyName || internal.color !== primaryColor)) {
                await this.supabase.supabase
                    .from('calendar_sources')
                    .update({ name: propertyName, color: primaryColor })
                    .eq('id', internal.id);
                internal.name = propertyName;
                internal.color = primaryColor;
            }

            // Sort and set signal
            const sortedSources = [...currentSources].sort((a, b) => {
                if (a.type === 'internal') return -1;
                if (b.type === 'internal') return 1;
                return a.name.localeCompare(b.name);
            });

            this.sources.set(sortedSources.map(s => ({ ...s, visible: true })));
        } finally {
            this.loadingProps.delete(propertyId);
        }
    }

    toggleVisibility(id: string) {
        this.sources.update(sources => sources.map(s =>
            s.id === id ? { ...s, visible: !s.visible } : s
        ));
    }

    async addSource(source: Omit<CalendarSource, 'id'>) {
        // Prevent adding multiple internal sources
        if (source.type === 'internal') {
            const hasInternal = this.sources().some(s => s.type === 'internal');
            if (hasInternal) {
                console.warn('[CalendarService] Internal calendar already exists, skipping duplicate.');
                return this.sources().find(s => s.type === 'internal');
            }
        }

        const { data, error } = await this.supabase.supabase
            .from('calendar_sources')
            .insert(source)
            .select()
            .single();

        if (error) throw error;
        this.sources.update(old => [...old, { ...data, visible: true }]);
        return data;
    }

    async deleteSource(id: string) {
        const { error } = await this.supabase.supabase
            .from('calendar_sources')
            .delete()
            .eq('id', id);

        if (error) throw error;
        this.sources.update(old => old.filter(s => s.id !== id));
    }

    // --- EVENTS FETCHING ---

    /**
     * Fetches all events: Manual internal events + Parsed external iCals
     */
    async getAllEvents(propertyId: string, propertyName?: string): Promise<CalendarEvent[]> {
        this.isLoading.set(true);
        try {
            const currentSources = this.sources();
            // ALWAYS reload sources if the propertyId has changed or if it's empty
            // This ensures context isolation and auto-creation for legacy properties
            const needsReload = currentSources.length === 0 || currentSources.some(s => s.property_id !== propertyId);

            if (needsReload) {
                console.log(`[CalendarService] Context switch or empty sources detected for ${propertyId}, reloading...`);
                await this.loadSources(propertyId, propertyName).catch((err) => {
                    console.error('[CalendarService] Error loading sources:', err);
                });
            }

            const finalSources = this.sources();
            const allEvents: CalendarEvent[] = [];

            // 1. Fetch Internal Manual Events
            const { data: manualEvents } = await this.supabase.supabase
                .from('calendar_events')
                .select('*')
                .eq('property_id', propertyId);

            if (manualEvents) {
                allEvents.push(...manualEvents.map(e => {
                    const source = finalSources.find(s => s.id === e.source_id);
                    return {
                        id: e.id,
                        title: e.title,
                        start: e.start,
                        end: e.end,
                        description: e.description,
                        backgroundColor: source?.color || '#10b981',
                        borderColor: source?.color || '#10b981',
                        sourceId: e.source_id,
                        isManual: true,
                        extendedProps: {
                            isManual: true,
                            description: e.description
                        }
                    };
                }));
            }

            // 2. Fetch External iCals via Edge Function
            const externalPromises = finalSources
                .filter(s => s.type === 'external' && s.url)
                .map(async (source) => {
                    try {
                        console.log(`[CalendarService] Calling Edge Function for: ${source.name}`);

                        // Add a timeout of 10s to Edge Function call
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Timeout')), 10000)
                        );

                        const invokePromise = this.supabase.supabase.functions.invoke('fetch-ical', {
                            body: { url: source.url }
                        });

                        const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

                        if (error) {
                            console.error(`[CalendarService] Edge Function error for ${source.name}:`, error);
                            return [];
                        }

                        if (!data?.events) {
                            console.warn(`[CalendarService] No events in response for ${source.name}`, data);
                            return [];
                        }

                        console.log(`[CalendarService] Successfully fetched ${data.events.length} events from ${source.name}`);

                        // Map Edge Function events to FullCalendar format
                        return data.events.map((e: any) => ({
                            title: e.title,
                            start: e.start?.split('T')[0],
                            end: e.end?.split('T')[0],
                            description: e.description,
                            backgroundColor: source.color,
                            borderColor: source.color,
                            sourceId: source.id,
                            isManual: false
                        }));
                    } catch (err) {
                        console.error(`[CalendarService] Exception or Timeout processing source ${source.name}:`, err);
                        return [];
                    }
                });

            const externalResults = await Promise.all(externalPromises);
            externalResults.forEach(events => allEvents.push(...events));

            return allEvents;
        } finally {
            this.isLoading.set(false);
        }
    }

    async getGlobalEvents(): Promise<CalendarEvent[]> {
        this.isLoading.set(true);
        try {
            const { user } = await this.supabase.getUser();
            if (!user) return [];

            // 1. Fetch all properties to get their IDs and Names
            const { data: properties } = await this.supabase.supabase
                .from('properties')
                .select('id, name')
                .eq('owner_id', user.id);

            if (!properties || properties.length === 0) return [];

            const propertyIds = properties.map(p => p.id);

            // 2. Fetch all internal calendar sources for these properties
            const { data: sources } = await this.supabase.supabase
                .from('calendar_sources')
                .select('*')
                .in('property_id', propertyIds)
                .eq('type', 'internal');

            const internalSources = sources || [];
            this.sources.set(internalSources.map(s => ({
                ...s,
                visible: true,
                color: this.getPropertyColor(s.property_id)
            })));

            // 3. Fetch all internal events for these properties
            const { data: manualEvents } = await this.supabase.supabase
                .from('calendar_events')
                .select('*')
                .in('property_id', propertyIds);

            const allEvents: CalendarEvent[] = [];
            if (manualEvents) {
                allEvents.push(...manualEvents.map(e => {
                    const source = internalSources.find(s => s.id === e.source_id);
                    const prop = properties.find(p => p.id === e.property_id);
                    const propColor = e.property_id ? this.getPropertyColor(e.property_id) : '#10b981';

                    return {
                        id: e.id,
                        title: prop ? `[${prop.name}] ${e.title}` : e.title,
                        start: e.start,
                        end: e.end,
                        description: e.description,
                        backgroundColor: propColor,
                        borderColor: propColor,
                        sourceId: e.source_id,
                        isManual: true,
                        extendedProps: {
                            isManual: true,
                            description: e.description,
                            propertyName: prop?.name
                        }
                    };
                }));
            }

            return allEvents;
        } catch (err) {
            console.error('[CalendarService] Error in getGlobalEvents:', err);
            return [];
        } finally {
            this.isLoading.set(false);
        }
    }

    // --- MANUAL EVENT MANAGEMENT ---

    async addManualEvent(event: any) {
        // Automatically find the internal source if not provided
        if (!event.source_id) {
            const internalSource = this.sources().find(s => s.type === 'internal');
            if (internalSource) {
                event.source_id = internalSource.id;
            } else {
                console.warn('[CalendarService] No internal source found for manual event');
                // We'll let it fail at DB level if truly null, but loadSources should have created one
            }
        }

        const { data, error } = await this.supabase.supabase
            .from('calendar_events')
            .insert(event)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async updateManualEvent(id: string, updates: any) {
        const { data, error } = await this.supabase.supabase
            .from('calendar_events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async deleteManualEvent(id: string) {
        const { error } = await this.supabase.supabase
            .from('calendar_events')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    /**
     * Ensures a source for "Local Events" exists and returns its ID
     */
    async ensureLocalEventsSource(propertyId: string): Promise<string> {
        // Check if we already have it in local state
        const existing = this.sources().find(s => s.property_id === propertyId && s.name === 'Local Events');
        if (existing) return existing.id;

        // Check DB
        const { data: sources } = await this.supabase.supabase
            .from('calendar_sources')
            .select('id')
            .eq('property_id', propertyId)
            .eq('name', 'Local Events')
            .eq('type', 'internal')
            .maybeSingle();

        if (sources) return sources.id;

        // Create it
        const newSource = await this.addSource({
            name: 'Local Events',
            type: 'internal',
            color: '#8b5cf6', // Violet for local events
            property_id: propertyId
        });

        return (newSource as any).id;
    }
}

import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
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

    // Signals for state
    sources = signal<CalendarSource[]>([]);
    isLoading = signal(false);

    constructor() { }

    // --- SOURCES MANAGEMENT ---

    private isAutoCreating = false;

    async loadSources(propertyId: string, propertyName?: string) {
        if (this.isAutoCreating) return;

        const { data, error } = await this.supabase.supabase
            .from('calendar_sources')
            .select('*')
            .eq('property_id', propertyId);

        if (error) throw error;

        const sources = data || [];
        const internalSources = sources.filter(s => s.type === 'internal');

        // Requirement: Only ONE internal calendar shall be displayed that is the property one
        // If 0, create it. If > 1, cleanup.
        if (internalSources.length !== 1) {
            this.isAutoCreating = true;
            try {
                if (internalSources.length > 1) {
                    console.log(`[CalendarService] Multiple internal sources found for ${propertyId}, cleaning up...`);
                    // Keep the first one, delete others
                    for (let i = 1; i < internalSources.length; i++) {
                        await this.deleteSource(internalSources[i].id);
                    }
                } else if (internalSources.length === 0) {
                    const name = propertyName || 'Calendrier';
                    console.log(`[CalendarService] No internal source found for ${propertyId}, creating '${name}'...`);
                    await this.addSource({
                        name: name,
                        type: 'internal',
                        color: '#10b981',
                        property_id: propertyId
                    });
                }
            } finally {
                this.isAutoCreating = false;
            }
            // Re-fetch to get correct state
            return this.loadSources(propertyId, propertyName);
        }

        // Exactly one internal calendar exists
        const internal = internalSources[0];
        const primaryColor = '#10b981'; // Fixed green for property calendar

        // Ensure name corresponds to property name AND color is correct
        if (propertyName && (internal.name !== propertyName || internal.color !== primaryColor)) {
            await this.supabase.supabase
                .from('calendar_sources')
                .update({ name: propertyName, color: primaryColor })
                .eq('id', internal.id);
            internal.name = propertyName;
            internal.color = primaryColor;
        }

        // Sort: internal first, then others by name
        const sortedSources = [...sources].sort((a, b) => {
            if (a.type === 'internal') return -1;
            if (b.type === 'internal') return 1;
            return a.name.localeCompare(b.name);
        });

        // Initialize visibility (internal is ALWAYS visible)
        const sourcesWithVisibility = sortedSources.map(s => ({
            ...s,
            visible: true
        }));
        this.sources.set(sourcesWithVisibility);
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
            if (currentSources.length === 0) {
                // Try loading if empty (might be first run)
                await this.loadSources(propertyId, propertyName).catch(() => { });
            }

            const sourcesToFetch = this.sources();
            const allEvents: CalendarEvent[] = [];

            // 1. Fetch Internal Manual Events
            const { data: manualEvents } = await this.supabase.supabase
                .from('calendar_events')
                .select('*')
                .eq('property_id', propertyId);

            if (manualEvents) {
                allEvents.push(...manualEvents.map(e => {
                    const source = currentSources.find(s => s.id === e.source_id);
                    return {
                        id: e.id,
                        title: e.title,
                        start: e.start_date,
                        end: e.end_date,
                        description: e.description,
                        backgroundColor: source?.color || '#10b981',
                        borderColor: source?.color || '#10b981',
                        sourceId: e.source_id,
                        isManual: true,
                        extendedProps: { isManual: true }
                    };
                }));
            }

            // 2. Fetch External iCals via Edge Function
            const externalPromises = sourcesToFetch
                .filter(s => s.type === 'external' && s.url)
                .map(async (source) => {
                    try {
                        console.log(`[CalendarService] Calling Edge Function for: ${source.name}`);
                        console.log(`[CalendarService] URL to fetch: ${source.url}`);

                        const { data, error } = await this.supabase.supabase.functions.invoke('fetch-ical', {
                            body: { url: source.url }
                        });

                        console.log(`[CalendarService] Response for ${source.name}:`, { data, error });

                        if (error) {
                            console.error(`[CalendarService] Edge Function error for ${source.name}:`, error);
                            console.error(`[CalendarService] Error details:`, JSON.stringify(error, null, 2));
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
                        console.error(`[CalendarService] Exception processing source ${source.name}:`, err);
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
}

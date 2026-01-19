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

    async loadSources(propertyId: string) {
        const { data, error } = await this.supabase.supabase
            .from('calendar_sources')
            .select('*')
            .eq('property_id', propertyId);

        if (error) throw error;

        // Initialize visibility
        const sourcesWithVisibility = (data || []).map(s => ({ ...s, visible: true }));
        this.sources.set(sourcesWithVisibility);
    }

    toggleVisibility(id: string) {
        this.sources.update(sources => sources.map(s =>
            s.id === id ? { ...s, visible: !s.visible } : s
        ));
    }

    async addSource(source: Omit<CalendarSource, 'id'>) {
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
    async getAllEvents(propertyId: string): Promise<CalendarEvent[]> {
        this.isLoading.set(true);
        try {
            const currentSources = this.sources();
            if (currentSources.length === 0) {
                // Try loading if empty (might be first run)
                await this.loadSources(propertyId).catch(() => { });
            }

            const sourcesToFetch = this.sources();
            const allEvents: CalendarEvent[] = [];

            // 1. Fetch Internal Manual Events
            const { data: manualEvents } = await this.supabase.supabase
                .from('calendar_events')
                .select('*')
                .eq('property_id', propertyId);

            if (manualEvents) {
                allEvents.push(...manualEvents.map(e => ({
                    id: e.id,
                    title: e.title,
                    start: e.start_date,
                    end: e.end_date,
                    description: e.description,
                    backgroundColor: '#10b981', // Green for manual
                    borderColor: '#059669',
                    isManual: true,
                    extendedProps: { isManual: true }
                })));
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
        const { data, error } = await this.supabase.supabase
            .from('calendar_events')
            .insert(event)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface LocalEvent {
    id: string;
    title: string;
    description: string;
    category: string;
    startDate: Date;
    endDate?: Date;
    location: string;
    distance: number; // km from property
    url?: string;
    imageUrl?: string;
}

interface GeocodingResult {
    lat: number;
    lng: number;
}

@Injectable({
    providedIn: 'root'
})
export class EventsDiscoveryService {
    private http = inject(HttpClient);

    // For now, using a mock implementation
    // In production, integrate with SerpAPI, Predictable, or Eventbrite
    async searchEvents(
        address: string,
        radiusKm: number,
        startDate: Date,
        endDate: Date
    ): Promise<LocalEvent[]> {
        try {
            console.log(`[EventsDiscovery] Searching for events near: ${address} within ${radiusKm}km`);

            // Step 1: Geocode the address
            const coords = await this.geocodeAddress(address);
            console.log(`[EventsDiscovery] Geocoded to: ${coords.lat}, ${coords.lng}`);

            // Step 2: Search for events
            // We use the AI-assisted search from the component as the primary "real" source for now,
            // while this service provides the geocoding and potential future direct API calls.
            return this.getMockEvents(coords, radiusKm, startDate, endDate);
        } catch (error) {
            console.error('[EventsDiscovery] Error searching events:', error);
            return [];
        }
    }

    async geocodeAddress(address: string): Promise<GeocodingResult> {
        // Using OpenStreetMap Nominatim for free geocoding
        // In production, consider Google Maps API or similar
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

            const response = await firstValueFrom(
                this.http.get<any[]>(url, {
                    headers: {
                        'User-Agent': 'HoteException/1.0'
                    }
                })
            );

            if (response && response.length > 0) {
                return {
                    lat: parseFloat(response[0].lat),
                    lng: parseFloat(response[0].lon)
                };
            }

            // Fallback: Paris coordinates if geocoding fails
            return { lat: 48.8566, lng: 2.3522 };
        } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback coordinates
            return { lat: 48.8566, lng: 2.3522 };
        }
    }

    private getMockEvents(
        coords: GeocodingResult,
        radiusKm: number,
        startDate: Date,
        endDate: Date
    ): LocalEvent[] {
        // Mock events for development
        // TODO: Replace with real API integration
        const now = new Date();

        return [
            {
                id: '1',
                title: 'Festival de Jazz Local',
                description: 'Concert de jazz en plein air avec des artistes locaux et internationaux.',
                category: 'Music',
                startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
                location: 'Parc Municipal',
                distance: 2.5,
                url: 'https://example.com/jazz-festival',
                imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400'
            },
            {
                id: '2',
                title: 'Marché des Producteurs',
                description: 'Marché hebdomadaire avec produits locaux et artisanaux.',
                category: 'Food & Drink',
                startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                location: 'Place Centrale',
                distance: 1.2,
                imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400'
            },
            {
                id: '3',
                title: 'Marathon de la Ville',
                description: 'Course annuelle à travers les rues historiques de la ville.',
                category: 'Sports',
                startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
                location: 'Centre-ville',
                distance: 5.8,
                url: 'https://example.com/marathon'
            },
            {
                id: '4',
                title: 'Exposition d\'Art Contemporain',
                description: 'Nouvelle exposition présentant des artistes émergents.',
                category: 'Arts & Culture',
                startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                location: 'Galerie Municipale',
                distance: 3.7,
                url: 'https://example.com/art-expo',
                imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400'
            },
            {
                id: '5',
                title: 'Fête de la Musique',
                description: 'Concerts gratuits dans toute la ville pour célébrer la musique.',
                category: 'Music',
                startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
                location: 'Plusieurs lieux',
                distance: 4.2,
                imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'
            }
        ].filter(event => {
            // Filter by date range
            return event.startDate >= startDate && event.startDate <= endDate;
        }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    async getSearchRadius(): Promise<number> {
        // TODO: Fetch from admin_settings table
        // For now, return default value
        return 20; // km
    }
}

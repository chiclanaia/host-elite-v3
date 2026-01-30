
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface MaintenanceTicket {
    id: string;
    property_id?: string; // Optional for now if we don't have property context hard strict
    title: string;
    description: string;
    status: 'open' | 'assigned' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reported_by: string; // DB column: reported_by
    created_at: string;  // DB column: created_at
    vendor?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    private supabase = inject(SupabaseService);

    async getTickets(propertyId?: string): Promise<MaintenanceTicket[]> {
        if (!this.supabase.isConfigured) {
            console.warn('Supabase not configured, returning mock data due to fallback logic in service.');
            return [];
        }

        let query = this.supabase.supabase
            .from('maintenance_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (propertyId) {
            query = query.eq('property_id', propertyId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }

        return data as MaintenanceTicket[];
    }

    async createTicket(ticket: Omit<MaintenanceTicket, 'id' | 'created_at'>): Promise<MaintenanceTicket | null> {
        if (!this.supabase.isConfigured) return null;

        const { data, error } = await this.supabase.supabase
            .from('maintenance_tickets')
            .insert(ticket)
            .select()
            .single();

        if (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }

        return data as MaintenanceTicket;
    }

    async updateTicket(id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket | null> {
        if (!this.supabase.isConfigured) return null;

        const { data, error } = await this.supabase.supabase
            .from('maintenance_tickets')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }

        return data as MaintenanceTicket;
    }

    async assignVendor(id: string, vendorName: string): Promise<MaintenanceTicket | null> {
        return this.updateTicket(id, {
            status: 'assigned',
            vendor: vendorName
        });
    }

    async closeTicket(id: string): Promise<MaintenanceTicket | null> {
        return this.updateTicket(id, { status: 'closed' });
    }
}

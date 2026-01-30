import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface LmnpSimulation {
    id?: string;
    user_id?: string;
    name: string;
    parameters: any;
    results: any;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LmnpService {
    private supabase = inject(SupabaseService);

    async saveSimulation(simulation: Omit<LmnpSimulation, 'id' | 'created_at' | 'user_id'>): Promise<LmnpSimulation | null> {
        try {
            const { data, error } = await this.supabase.supabase
                .from('lmnp_simulations')
                .insert(simulation)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.error('Error saving simulation', e);
            // Fallback for mocked environment if needed, or rethrow
            return null;
        }
    }

    async getSimulations(): Promise<LmnpSimulation[]> {
        try {
            const { data, error } = await this.supabase.supabase
                .from('lmnp_simulations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error('Error loading simulations', e);
            return [];
        }
    }
}

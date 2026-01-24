import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Checklist {
    id: string;
    category: 'cleaning' | 'maintenance' | 'checkin' | 'checkout' | 'turnover' | 'emergency';
    name_key: string;
    description_key?: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'TIER_1' | 'TIER_2' | 'TIER_3';
    icon?: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ChecklistItem {
    id: string;
    checklist_id: string;
    item_text_key: string;
    section?: string;
    order_index: number;
    is_critical: boolean;
    estimated_minutes?: number;
    created_at: string;
}

export interface ChecklistWithItems extends Checklist {
    items: ChecklistItem[];
}

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {
    private supabase = inject(SupabaseService);

    /**
     * Get all active checklists
     */
    async getAllChecklists(): Promise<Checklist[]> {
        const { data, error } = await this.supabase.supabase
            .from('checklists')
            .select('*')
            .eq('is_active', true)
            .order('category', { ascending: true })
            .order('tier', { ascending: true })
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching checklists:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get checklists by category
     */
    async getChecklistsByCategory(category: string): Promise<Checklist[]> {
        const { data, error } = await this.supabase.supabase
            .from('checklists')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('tier', { ascending: true })
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching checklists by category:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get checklists by tier (for subscription-based filtering)
     */
    async getChecklistsByTier(tier: string): Promise<Checklist[]> {
        // Get checklists for this tier and all lower tiers
        let allowedTiers: string[] = [];

        // Map legacy names or Handle TIER_X
        if (tier === 'Gold' || tier === 'TIER_3') {
            allowedTiers = ['Bronze', 'Silver', 'Gold', 'TIER_1', 'TIER_2', 'TIER_3'];
        } else if (tier === 'Silver' || tier === 'TIER_2') {
            allowedTiers = ['Bronze', 'Silver', 'TIER_1', 'TIER_2'];
        } else {
            allowedTiers = ['Bronze', 'TIER_1'];
        }

        const { data, error } = await this.supabase.supabase
            .from('checklists')
            .select('*')
            .in('tier', allowedTiers)
            .eq('is_active', true)
            .order('category', { ascending: true })
            .order('tier', { ascending: true })
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching checklists by tier:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get a single checklist with all its items
     */
    async getChecklistWithItems(checklistId: string): Promise<ChecklistWithItems | null> {
        // Get the checklist
        const { data: checklist, error: checklistError } = await this.supabase.supabase
            .from('checklists')
            .select('*')
            .eq('id', checklistId)
            .eq('is_active', true)
            .single();

        if (checklistError && checklistError.code !== 'PGRST116') {
            console.error('Error fetching checklist:', checklistError);
            throw checklistError;
        }

        if (!checklist) return null;

        // Get the items
        const { data: items, error: itemsError } = await this.supabase.supabase
            .from('checklist_items')
            .select('*')
            .eq('checklist_id', checklistId)
            .order('order_index', { ascending: true });

        if (itemsError) {
            console.error('Error fetching checklist items:', itemsError);
            throw itemsError;
        }

        return {
            ...checklist,
            items: items || []
        };
    }

    /**
     * Get items for a specific checklist
     */
    async getChecklistItems(checklistId: string): Promise<ChecklistItem[]> {
        const { data, error } = await this.supabase.supabase
            .from('checklist_items')
            .select('*')
            .eq('checklist_id', checklistId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching checklist items:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get checklists grouped by category
     */
    async getChecklistsGroupedByCategory(): Promise<Map<string, Checklist[]>> {
        const checklists = await this.getAllChecklists();
        const grouped = new Map<string, Checklist[]>();

        checklists.forEach(checklist => {
            if (!grouped.has(checklist.category)) {
                grouped.set(checklist.category, []);
            }
            grouped.get(checklist.category)!.push(checklist);
        });

        return grouped;
    }

    /**
     * Calculate total estimated time for a checklist
     */
    async getChecklistEstimatedTime(checklistId: string): Promise<number> {
        const items = await this.getChecklistItems(checklistId);
        return items.reduce((total, item) => total + (item.estimated_minutes || 0), 0);
    }
}

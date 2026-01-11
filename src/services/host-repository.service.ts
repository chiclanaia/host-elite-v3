
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ContextData, Scores, ReportData, UserProfile, AppPlan, ApiKey, PlanConfig, AppSettings, View, Property } from '../types';

@Injectable({
    providedIn: 'root'
})
export class HostRepository {
    private supabaseService = inject(SupabaseService);

    // Helper to access raw client if needed, guarded by service configuration
    private get supabase() { return this.supabaseService.supabase; }

    // Static sub-views configuration
    private readonly defaultSubViews: View[] = [
        { id: 'manage-property', title: 'Gérer', icon: 'settings' },
        { id: 'property-data', title: 'Détails du bien', icon: 'home' },
        { id: 'welcome-booklet', title: 'Livret d\'Accueil', icon: 'info', featureId: 'booklet' },
        { id: 'widget-library', title: 'Bibliothèque Widgets', icon: 'widgets', featureId: 'microsite' },
        { id: 'vocal-concierge', title: 'Concierge Vocal', icon: 'concierge', featureId: 'vocal-concierge' },
    ];

    async hasDiagnostic(userId: string): Promise<boolean> {
        if (!this.supabaseService.isConfigured) return false;
        const { count, error } = await this.supabase
            .from('diagnostics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            // Si la table n'existe pas, on considère qu'il n'y a pas de diagnostic
            if (error.code === '42P01') return false;
            console.warn("Error checking diagnostic:", error);
            return false;
        }
        return (count || 0) > 0;
    }

    async getLatestDiagnostic(userId: string): Promise<{ scores: Scores; report: ReportData; context: ContextData } | null> {
        if (!this.supabaseService.isConfigured) return null;

        const { data, error } = await this.supabase
            .from('diagnostics')
            .select(`
              *,
              diagnostic_points (*)
          `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;

        const scores: Scores = {
            marketing: data.score_marketing,
            experience: data.score_experience,
            operations: data.score_operations,
            pricing: data.score_pricing,
            accomodation: data.score_accomodation,
            legal: data.score_legal,
            mindset: data.score_mindset
        };

        const context: ContextData = {
            situation: data.situation,
            challenge: data.challenge
        };

        const strengths = data.diagnostic_points
            .filter((p: any) => p.type === 'strength')
            .map((p: any) => p.content);

        const opportunities = data.diagnostic_points
            .filter((p: any) => p.type === 'opportunity')
            .map((p: any) => p.content);

        const report: ReportData = {
            recommendedPlan: data.recommended_plan,
            planJustification: data.plan_justification,
            strengths,
            opportunities
        };

        return { scores, report, context };
    }

    async saveDiagnosticResult(context: ContextData, scores: Scores, report: ReportData): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { user } = await this.supabaseService.getUser();
        if (!user) throw new Error("User not authenticated");

        // 1. Insert the main Diagnostic row
        const { data: diagnostic, error: diagError } = await this.supabase
            .from('diagnostics')
            .insert({
                user_id: user.id,
                situation: context.situation,
                challenge: context.challenge,
                score_marketing: scores.marketing,
                score_experience: scores.experience,
                score_operations: scores.operations,
                score_pricing: scores.pricing,
                score_accomodation: scores.accomodation,
                score_legal: scores.legal,
                score_mindset: scores.mindset,
                recommended_plan: report.recommendedPlan,
                plan_justification: report.planJustification
            })
            .select('id')
            .single();

        if (diagError) {
            console.error('Error saving diagnostic (DB):', diagError);
            throw new Error(`Erreur Base de Données: ${diagError.message} (Code: ${diagError.code})`);
        }

        if (!diagnostic) {
            throw new Error("Erreur: Le diagnostic n'a pas pu être créé (pas de données retournées).");
        }

        // 2. Insert Strengths and Opportunities
        const points = [
            ...report.strengths.map(s => ({ diagnostic_id: diagnostic.id, type: 'strength', content: s })),
            ...report.opportunities.map(o => ({ diagnostic_id: diagnostic.id, type: 'opportunity', content: o }))
        ];

        const { error: pointsError } = await this.supabase
            .from('diagnostic_points')
            .insert(points);

        if (pointsError) {
            console.error('Error saving points:', pointsError);
        }
    }

    async getProperties(): Promise<Property[]> {
        if (!this.supabaseService.isConfigured) return [];

        const { user } = await this.supabaseService.getUser();
        if (!user) return [];

        const { data, error } = await this.supabase
            .from('properties')
            .select('id, name')
            .eq('owner_id', user.id);

        if (error) {
            // Table doesn't exist yet or other error
            if (error.code !== '42P01') console.error('Error fetching properties:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data.map(row => ({
            id: row.id,
            name: row.name,
            subViews: this.defaultSubViews
        }));
    }

    async getPropertyByName(name: string): Promise<any> {
        if (!this.supabaseService.isConfigured) return null;
        const { user } = await this.supabaseService.getUser();
        if (!user) return null;

        const { data, error } = await this.supabase
            .from('properties')
            .select(`
            *,
            property_equipments (name, manual_url),
            property_photos (url, category)
        `)
            .eq('owner_id', user.id)
            .eq('name', name)
            .single();

        if (error) {
            console.error("Error fetching property details:", error);
            return null;
        }
        return data;
    }

    async createProperty(ownerId: string, name: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { error } = await this.supabase.from('properties').insert({
            owner_id: ownerId,
            name: name,
            listing_title: name,
            address: 'Adresse à compléter'
        });

        if (error) {
            console.error("Error creating property:", JSON.stringify(error));
            throw new Error(error.message || "Impossible de créer la propriété");
        }
    }

    async updatePropertyData(propertyId: string, formData: any): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const flatData = {
            listing_title: formData.marketing?.title,
            listing_description: formData.marketing?.description,
            cover_image_url: formData.marketing?.coverImageUrl,
            address: formData.operational?.address,
            ical_url: formData.operational?.icalUrl,
            cleaning_contact_info: formData.operational?.cleaningContact,
            wifi_code: formData.experience?.wifiCode,
            arrival_instructions: formData.experience?.arrivalInstructions,
            house_rules_text: formData.experience?.houseRules,
            emergency_contact_info: formData.experience?.emergencyContact,
        };

        const { error: propError } = await this.supabase
            .from('properties')
            .update(flatData)
            .eq('id', propertyId);

        if (propError) throw propError;

        // Handle Equipments
        if (formData.equipments && Array.isArray(formData.equipments.checklist)) {
            // Checklist is now an array of {name, checked, manualUrl} objects
            const selectedEquipments = formData.equipments.checklist
                .filter((item: any) => item.checked)
                .map((item: any) => ({
                    property_id: propertyId,
                    name: item.name,
                    manual_url: item.manualUrl || null
                }));

            await this.supabase.from('property_equipments').delete().eq('property_id', propertyId);

            if (selectedEquipments.length > 0) {
                await this.supabase.from('property_equipments').insert(selectedEquipments);
            }
        }

        // Handle Photos via updatePropertyData (if called from property-data-view)
        if (formData.photos && Array.isArray(formData.photos)) {
            await this.savePropertyPhotos(propertyId, formData.photos);
        }
    }

    async savePropertyPhotos(propertyId: string, photos: { url: string, category: string }[]): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        // Delete existing photos to replace with new set (simplest approach for order/updates)
        // In production, we might want to be smarter to avoid ID churn, but this works for now.
        await this.supabase.from('property_photos').delete().eq('property_id', propertyId);

        const validPhotos = photos
            .filter(p => p.url && p.url.trim() !== '')
            .map(p => ({
                property_id: propertyId,
                url: p.url,
                category: p.category
            }));

        if (validPhotos.length > 0) {
            const { error } = await this.supabase.from('property_photos').insert(validPhotos);
            if (error) throw error;
        }
    }

    // NEW: Recuperer les données du livret
    async getBooklet(propertyName: string): Promise<any> {
        if (!this.supabaseService.isConfigured) return null;

        const { data: propData } = await this.supabase
            .from('properties')
            .select('id')
            .eq('name', propertyName)
            .single();

        if (!propData) return null;

        const { data } = await this.supabase
            .from('booklet_content')
            .select('*')
            .eq('property_id', propData.id);

        if (!data || data.length === 0) return null;

        const result: any = {};

        data.forEach((row: any) => {
            if (row.section_id === 'general') {
                // Champs racine (ex: coverImageUrl)
                result[row.field_key] = row.field_value;
            } else if (row.section_id === 'widgets') {
                // Widgets special handling - assume it's JSON stored as value or multiple keys
                if (!result['widgets']) result['widgets'] = {};
                result['widgets'][row.field_key] = (row.field_value === 'true');
            } else if (row.section_id === 'configuration' && row.field_key === 'photo_categories') {
                // Custom Categories List stored as JSON string
                try {
                    result['photo_categories'] = JSON.parse(row.field_value);
                } catch (e) {
                    result['photo_categories'] = [];
                }
            } else {
                // Champs imbriqués (sections)
                if (!result[row.section_id]) {
                    result[row.section_id] = {};
                }
                let val = row.field_value;
                // Conversion basique pour les booléens (toggles)
                if (row.section_id === 'toggles') {
                    val = (val === 'true');
                }
                result[row.section_id][row.field_key] = val;
            }
        });
        return result;
    }

    async saveBooklet(propertyName: string, bookletFormValue: any): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { data: propData } = await this.supabase
            .from('properties')
            .select('id')
            .eq('name', propertyName)
            .single();

        if (!propData) throw new Error("Property not found");

        const propertyId = propData.id;
        const rowsToUpsert: any[] = [];

        Object.entries(bookletFormValue).forEach(([sectionId, sectionData]) => {
            // Skip 'photos' as it's handled separately in savePropertyPhotos call usually,
            // but if it leaks here, we ignore it for booklet_content table.
            if (sectionId === 'photos') return;

            // Custom Categories handling (passed as a virtual section or root key)
            if (sectionId === 'photo_categories') {
                rowsToUpsert.push({
                    property_id: propertyId,
                    section_id: 'configuration',
                    field_key: 'photo_categories',
                    field_value: JSON.stringify(sectionData)
                });
                return;
            }

            if (typeof sectionData === 'object' && sectionData !== null) {
                // Sections imbriquées (ex: 'cuisine', 'toggles', 'widgets')
                Object.entries(sectionData as object).forEach(([fieldKey, fieldValue]) => {
                    let valToStore = String(fieldValue);
                    if (fieldValue === null || fieldValue === undefined) valToStore = '';

                    rowsToUpsert.push({
                        property_id: propertyId,
                        section_id: sectionId, // 'widgets' will fall here
                        field_key: fieldKey,
                        field_value: valToStore
                    });
                });
            } else if (typeof sectionData === 'string') {
                // Champs racine (ex: 'coverImageUrl') sauvegardés dans une section virtuelle 'general'
                rowsToUpsert.push({
                    property_id: propertyId,
                    section_id: 'general',
                    field_key: sectionId,
                    field_value: sectionData
                });
            }
        });

        if (rowsToUpsert.length > 0) {
            const { error } = await this.supabase
                .from('booklet_content')
                .upsert(rowsToUpsert, { onConflict: 'property_id,section_id,field_key' });

            if (error) throw error;
        }
    }

    // --- Helpers for Category Management ---

    async getPropertyCategories(propertyName: string): Promise<string[] | null> {
        const data = await this.getBooklet(propertyName);
        return data?.photo_categories || null;
    }

    async savePropertyCategories(propertyName: string, categories: string[]): Promise<void> {
        await this.saveBooklet(propertyName, { photo_categories: categories });
    }

    // --- App Settings (Global) ---

    async getGlobalSettings(): Promise<AppSettings> {
        if (!this.supabaseService.isConfigured) return { show_plan_badges: false };

        const { data, error } = await this.supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'global_config')
            .single();

        if (error || !data) {
            // Return default if not set or error
            return { show_plan_badges: false };
        }
        return data.value as AppSettings;
    }

    async updateGlobalSettings(settings: AppSettings): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("DB not configured");

        const { error } = await this.supabase
            .from('app_settings')
            .upsert({ key: 'global_config', value: settings });

        if (error) throw error;
    }

    // --- Plan Management (Admin) ---

    async getPlans(): Promise<PlanConfig[]> {
        if (!this.supabaseService.isConfigured) return [];
        const { data, error } = await this.supabase
            .from('app_plans')
            .select('*')
            .order('price', { ascending: true });

        if (error) {
            console.error('Error fetching plans:', error);
            return [];
        }

        // Robustly handle 'features' whether it comes as an array or a JSON string
        return (data || []).map((p: any) => {
            let features = p.features;
            if (typeof features === 'string') {
                try {
                    features = JSON.parse(features);
                } catch (e) {
                    console.warn(`Failed to parse features for plan ${p.id}`, e);
                    features = [];
                }
            }
            return {
                id: p.id,
                price: p.price,
                features: Array.isArray(features) ? features : []
            };
        });
    }

    async getPlanFeatures(planId: string): Promise<string[]> {
        if (!this.supabaseService.isConfigured) return [];
        const { data, error } = await this.supabase
            .from('app_plans')
            .select('features')
            .eq('id', planId)
            .single();

        if (error || !data) {
            return [];
        }

        let features = data.features;
        // Handle stringified JSON just in case
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch (e) {
                features = [];
            }
        }

        return Array.isArray(features) ? features : [];
    }

    async updatePlanConfig(planId: string, price: number, features: string[]): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("DB not configured");

        const { data, error } = await this.supabase
            .from('app_plans')
            .update({ price, features: features })
            .eq('id', planId)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            const err = new Error("Impossible de mettre à jour le plan.");
            (err as any).code = "RLS_BLOCKED_PLAN"; // Critical for UI handler
            throw err;
        }
    }

    // --- User Administration ---

    async getUserProfile(userId: string): Promise<UserProfile | null> {
        if (!this.supabaseService.isConfigured) return null;

        const { data, error } = await this.supabase.from('profiles').select('*').eq('id', userId).single();
        if (error || !data) return null;

        return {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            plan: data.plan,
            subscription_status: data.subscription_status,
            email_confirmed: data.email_confirmed ?? false
        };
    }

    async getAllUsers(): Promise<UserProfile[]> {
        if (!this.supabaseService.isConfigured) return [];

        const { data, error } = await this.supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching users", error);
            return [];
        }
        return data.map((row: any) => ({
            id: row.id,
            email: row.email,
            full_name: row.full_name,
            avatar_url: row.avatar_url,
            role: row.role,
            plan: row.plan,
            stripe_customer_id: row.stripe_customer_id,
            subscription_status: row.subscription_status,
            email_confirmed: row.email_confirmed ?? false
        }));
    }

    async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const payload: any = {};

        // Explicitly check for keys to ensure even false/empty values are transmitted if intended
        if ('plan' in updates) payload.plan = updates.plan;
        if ('role' in updates) payload.role = updates.role;
        if ('full_name' in updates) payload.full_name = updates.full_name;
        if ('email' in updates) payload.email = updates.email;
        if ('email_confirmed' in updates) payload.email_confirmed = updates.email_confirmed;

        // Use select() to ensure the row was actually found and updated
        const { data, error } = await this.supabase
            .from('profiles')
            .update(payload)
            .eq('id', userId)
            .select();

        if (error) {
            console.error("Update User Error:", error);
            throw error;
        }

        if (!data || data.length === 0) {
            // This usually happens if RLS blocks the update or ID doesn't exist
            const err = new Error("Mise à jour échouée (RLS ou ID invalide)");
            (err as any).code = "RLS_BLOCKED_PROFILE"; // Critical for UI handler
            throw err;
        }
    }

    async toggleUserConfirmation(userId: string, isConfirmed: boolean): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { error } = await this.supabase.rpc('toggle_user_confirmation', {
            target_user_id: userId,
            should_confirm: isConfirmed
        });

        if (error) {
            console.error('RPC Error:', error);
            throw new Error(error.message || "Erreur lors de la synchronisation du statut email.");
        }
    }

    async createProfile(id: string, email: string, fullName: string, role: string = 'user', plan: string = 'Freemium'): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { error } = await this.supabase.from('profiles').upsert({
            id: id,
            email: email,
            full_name: fullName,
            role: role,
            plan: plan,
            subscription_status: 'active'
        }, { onConflict: 'id' });

        if (error) {
            console.error("Error creating profile:", JSON.stringify(error));
            throw new Error(error.message || "Erreur lors de la création du profil");
        }
    }

    async deleteUser(userId: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const { error } = await this.supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
    }

    async createUser(user: { email: string; fullName: string; role: string; plan: string; email_confirmed: boolean }, explicitId?: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("Database not configured");

        const id = explicitId || crypto.randomUUID();
        const { error } = await this.supabase.from('profiles').insert({
            id: id,
            email: user.email,
            full_name: user.fullName,
            role: user.role,
            plan: user.plan,
            subscription_status: 'active',
            email_confirmed: user.email_confirmed
        });

        if (error) {
            console.error("Error creating user row:", JSON.stringify(error));
            throw new Error(error.message);
        }
    }

    async resetUserPassword(email: string): Promise<void> {
        const { error } = await this.supabaseService.sendPasswordResetEmail(email);
        if (error) {
            console.error("Password reset error:", error);
            throw new Error(error.message || "Impossible d'envoyer l'email de réinitialisation.");
        }
    }

    // --- API Key Management (RPC) ---

    async listApiKeys(): Promise<ApiKey[]> {
        if (!this.supabaseService.isConfigured) return [];
        const { data, error } = await this.supabase.rpc('list_api_keys');
        if (error) throw error;
        return data as ApiKey[];
    }

    async addApiKey(name: string, clearKey: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("DB not configured");
        const { error } = await this.supabase.rpc('add_api_key', { key_name: name, clear_key: clearKey });
        if (error) throw error;
    }

    async setActiveApiKey(id: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("DB not configured");

        // Try using the RPC function first
        const { error: rpcError } = await this.supabase.rpc('set_active_api_key', { target_id: id });

        if (!rpcError) return;

        // Fallback: If RPC is missing (error code 42883) or fails, try direct manipulation
        console.warn("RPC set_active_api_key failed, attempting manual fallback. Error:", JSON.stringify(rpcError));

        // Use system_api_keys (secure table) instead of api_keys based on DB errors
        const tableName = 'system_api_keys';

        // 1. Deactivate all keys
        const { error: deactivateError } = await this.supabase
            .from(tableName)
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (deactivateError) {
            console.error("Manual fallback: deactivation failed", JSON.stringify(deactivateError));
        }

        // 2. Activate the specific key
        const { error: activateError } = await this.supabase
            .from(tableName)
            .update({ is_active: true })
            .eq('id', id);

        if (activateError) {
            const msg = typeof activateError === 'object' && activateError !== null
                ? (activateError.message || activateError.details || JSON.stringify(activateError))
                : String(activateError);

            const enhancedError = new Error(`Manual Activation Failed: ${msg}`);
            (enhancedError as any).code = (activateError as any)?.code;
            throw enhancedError;
        }
    }

    async deleteApiKey(id: string): Promise<void> {
        if (!this.supabaseService.isConfigured) throw new Error("DB not configured");
        const { error } = await this.supabase.rpc('delete_api_key', { target_id: id });
        if (error) throw error;
    }
}

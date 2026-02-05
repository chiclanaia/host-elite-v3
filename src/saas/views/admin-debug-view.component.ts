import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStore } from '../../state/session.store';
import { TranslationService } from '../../services/translation.service';
import { HostRepository } from '../../services/host-repository.service';
import { SupabaseService } from '../../services/supabase.service';
import { AppPlan, UserProfile } from '../../types';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-admin-debug-view',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col pt-6 px-6">
      <header class="flex justify-between items-center mb-8 flex-shrink-0">
          <div>
              <h1 class="text-3xl font-bold text-white mb-2">Debug Console</h1>
              <p class="text-slate-400">Outils de développement et de test.</p>
          </div>
      </header>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-8">
        
        <!-- SECTION 1: Plan Simulation -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 font-mono">01</span>
                Simulate Plan
            </h2>
            <div class="p-4 bg-slate-900/50 rounded-lg">
                <p class="text-sm text-slate-400 mb-4">Force the application to behave as if the user has a specific plan.</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button *ngFor="let plan of plans" 
                            (click)="setPlan(plan)"
                            class="px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center space-y-3 group"
                            [class]="currentPlan() === plan 
                                ? getPlanClasses(plan, true)
                                : getPlanClasses(plan, false)">
                        <div class="flex items-center space-x-2">
                             <div class="w-2 h-2 rounded-full" [class]="getTierIndicatorClass(plan)"></div>
                             <span class="font-bold uppercase text-[11px] tracking-widest">{{ plan }}</span>
                        </div>
                        <div class="w-full h-1 rounded-full bg-black/20 overflow-hidden">
                             <div class="h-full transition-all duration-500" [class.w-full]="currentPlan() === plan" [class.w-0]="currentPlan() !== plan" [class.bg-white]="currentPlan() === plan"></div>
                        </div>
                    </button>
                </div>
            </div>
        </section>

        <!-- SECTION 2: Debug Tools -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mr-3 font-mono">02</span>
                Display Tools
            </h2>
            
            <!-- Toggle Display Tag -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div>
                    <h3 class="font-bold text-white">Display Types</h3>
                    <p class="text-xs text-slate-400 mt-1">Show translation keys on hover in a tooltip.</p>
                </div>
                <button (click)="toggleDebugTags()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-green-500]="isDebugTags()"
                        [class.bg-slate-700]="!isDebugTags()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="isDebugTags()"
                         [class.translate-x-0]="!isDebugTags()"></div>
                </button>
            </div>

            <!-- Toggle Plan Badges (Was in Users View) -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors mt-4">
                <div>
                    <h3 class="font-bold text-white">Afficher les pastilles</h3>
                    <p class="text-xs text-slate-400 mt-1">Show feature badges in sidebar based on plan.</p>
                </div>
                <button (click)="toggleBadges()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-green-500]="store.showPlanBadges()"
                        [class.bg-slate-700]="!store.showPlanBadges()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="store.showPlanBadges()"
                         [class.translate-x-0]="!store.showPlanBadges()"></div>
                </button>
            </div>

            <!-- Toggle Notification Test Button -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors mt-4">
                <div>
                    <h3 class="font-bold text-white">Bouton Test Notification</h3>
                    <p class="text-xs text-slate-400 mt-1">Affiche un bouton de test dans le centre de notifications.</p>
                </div>
                <button (click)="toggleNotifDebug()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-amber-500]="notifService.showDebugTestButton()"
                        [class.bg-slate-700]="!notifService.showDebugTestButton()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="notifService.showDebugTestButton()"
                         [class.translate-x-0]="!notifService.showDebugTestButton()"></div>
                </button>
            </div>
            
            <!-- Toggle Language Switcher -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors mt-4">
                <div>
                    <h3 class="font-bold text-white">Sélecteur de Langue</h3>
                    <p class="text-xs text-slate-400 mt-1">Afficher le sélecteur de langue en haut à droite.</p>
                </div>
                <button (click)="toggleLanguageSwitcher()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-blue-500]="store.showLanguageSwitcher()"
                        [class.bg-slate-700]="!store.showLanguageSwitcher()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="store.showLanguageSwitcher()"
                         [class.translate-x-0]="!store.showLanguageSwitcher()"></div>
                </button>
            </div>
            
        </section>

        <!-- SECTION 3: Notification Sender -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mr-3 font-mono">03</span>
                Envoyeur de Notifications
            </h2>
            
            <div class="p-6 bg-slate-900/50 rounded-lg space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- User Dropdown -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Destinataire</label>
                        <select [(ngModel)]="notifForm.userId" 
                                (ngModelChange)="onUserChange()"
                                class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors">
                            <option value="">Sélectionner un utilisateur...</option>
                            @for (u of allUsers(); track u.id) {
                                <option [value]="u.id">
                                    {{ u.full_name || u.email }} ({{ u.role }})
                                </option>
                            }
                        </select>
                    </div>

                    <!-- Property Dropdown -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Propriété (Optionnel)</label>
                        <select [(ngModel)]="notifForm.propertyId" 
                                [disabled]="!notifForm.userId"
                                class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50">
                            <option value="">Toutes / Aucune spécifique</option>
                            @for (p of userProperties(); track p.id) {
                                <option [value]="p.id">{{ p.name }}</option>
                            }
                        </select>
                        @if (isLoadingProperties()) {
                            <p class="text-[10px] text-orange-400 animate-pulse mt-1">Chargement des données...</p>
                        }
                    </div>

                    <!-- Type Selector -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Type</label>
                        <div class="flex gap-2">
                            @for (t of notifTypes; track t) {
                                <button (click)="notifForm.type = t"
                                        class="flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all"
                                        [class]="notifForm.type === t 
                                            ? 'bg-orange-500 border-orange-500 text-slate-900' 
                                            : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'">
                                    {{ t | uppercase }}
                                </button>
                            }
                        </div>
                    </div>
                </div>

                <!-- Title & Message -->
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Titre</label>
                        <input [(ngModel)]="notifForm.title" 
                               placeholder="Ex: Alerte Maintenance"
                               class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Message</label>
                        <textarea [(ngModel)]="notifForm.message" 
                                  rows="3"
                                  placeholder="Contenu de la notification..."
                                  class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"></textarea>
                    </div>
                </div>

                <!-- Send Button -->
                <button (click)="sendCustomNotif()" 
                        [disabled]="isSendingNotif() || !notifForm.userId || !notifForm.title || !notifForm.message"
                        class="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20">
                    <span *ngIf="!isSendingNotif()">Envoyer la Notification</span>
                    <span *ngIf="isSendingNotif()">Envoi en cours...</span>
                    
                    <svg *ngIf="!isSendingNotif()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
                
                @if (notifFeedback()) {
                    <p class="text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2"
                       [class.text-green-400]="notifFeedback() === 'Succès !'"
                       [class.text-red-400]="notifFeedback()?.includes('Erreur')">
                        {{ notifFeedback() }}
                    </p>
                }
            </div>
        </section>

        <!-- SECTION 4: Housekeeping -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mr-3 font-mono">04</span>
                Maintenance & Nettoyage
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Calendar Housekeeping -->
                <div class="p-6 bg-slate-900/50 rounded-lg space-y-4 border border-white/5">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 bg-teal-500/10 rounded-lg">
                            <svg class="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 class="font-bold text-white text-lg">Calendrier</h3>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Seuil d'ancienneté (Mois)</label>
                        <div class="flex gap-4 items-center">
                            <input type="number" [(ngModel)]="calendarMonthThreshold" 
                                   class="w-24 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
                                   min="1" max="24">
                            <span class="text-sm text-slate-500">Nettoyer les événements plus vieux que {{ calendarMonthThreshold() }} mois.</span>
                        </div>
                    </div>

                    <button (click)="cleanupCalendar()" 
                            [disabled]="isCleaningCalendar()"
                            class="w-full py-3 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 hover:border-teal-500/50 font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                        <span *ngIf="!isCleaningCalendar()">Nettoyer le Calendrier</span>
                        <span *ngIf="isCleaningCalendar()">Nettoyage en cours...</span>
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    
                    @if (calendarFeedback()) {
                        <p class="text-[10px] text-center font-bold"
                           [class.text-teal-400]="!calendarFeedback()?.includes('Erreur')"
                           [class.text-red-400]="calendarFeedback()?.includes('Erreur')">
                            {{ calendarFeedback() }}
                        </p>
                    }
                </div>

                <!-- Notifications Housekeeping -->
                <div class="p-6 bg-slate-900/50 rounded-lg space-y-4 border border-white/5">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="p-2 bg-orange-500/10 rounded-lg">
                            <svg class="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 class="font-bold text-white text-lg">Notifications</h3>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase">Seuil d'ancienneté (Jours)</label>
                        <div class="flex gap-4 items-center">
                            <input type="number" [(ngModel)]="notificationDayThreshold" 
                                   class="w-24 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                   min="1" max="365">
                            <span class="text-sm text-slate-500">Nettoyer les notifications plus vieilles que {{ notificationDayThreshold() }} jours.</span>
                        </div>
                    </div>

                    <button (click)="cleanupNotifications()" 
                            [disabled]="isCleaningNotifications()"
                            class="w-full py-3 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/50 font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                        <span *ngIf="!isCleaningNotifications()">Nettoyer les Notifications</span>
                        <span *ngIf="isCleaningNotifications()">Nettoyage en cours...</span>
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    @if (notifCleanupFeedback()) {
                        <p class="text-[10px] text-center font-bold"
                           [class.text-orange-400]="!notifCleanupFeedback()?.includes('Erreur')"
                           [class.text-red-400]="notifCleanupFeedback()?.includes('Erreur')">
                            {{ notifCleanupFeedback() }}
                        </p>
                    }
                </div>
            </div>
        </section>

      </div>
    </div>
  `
})
export class AdminDebugViewComponent {
    public store = inject(SessionStore);
    ts = inject(TranslationService);
    repository = inject(HostRepository);
    supabaseService = inject(SupabaseService);
    notifService = inject(NotificationService);

    plans: AppPlan[] = ['TIER_0', 'TIER_1', 'TIER_2', 'TIER_3'];
    allUsers = signal<UserProfile[]>([]);
    userProperties = signal<any[]>([]);
    isLoadingProperties = signal(false);
    isSendingNotif = signal(false);
    notifFeedback = signal<string | null>(null);
    notifTypes: any[] = ['info', 'success', 'warning', 'event'];

    // Housekeeping
    calendarMonthThreshold = signal(1);
    notificationDayThreshold = signal(30);
    isCleaningCalendar = signal(false);
    isCleaningNotifications = signal(false);
    calendarFeedback = signal<string | null>(null);
    notifCleanupFeedback = signal<string | null>(null);

    notifForm = {
        userId: '',
        propertyId: '',
        title: '',
        message: '',
        type: 'info' as any
    };

    constructor() {
        this.loadUsers();
    }

    async loadUsers() {
        const users = await this.repository.getAllUsers();
        this.allUsers.set(users);
    }

    async onUserChange(loadAll: boolean = false) {
        this.notifForm.propertyId = '';
        this.userProperties.set([]);

        if (this.notifForm.userId || loadAll) {
            try {
                this.isLoadingProperties.set(true);
                this.notifFeedback.set(null);

                console.log('[AdminDebug] Fetching properties...', loadAll ? '(All)' : `(User: ${this.notifForm.userId})`);

                // We fetch all properties visible to the user to debug if it's a data mismatch or RLS
                let query = this.supabaseService.supabase
                    .from('properties')
                    .select('id, name, owner_id');

                if (!loadAll) {
                    query = query.eq('owner_id', this.notifForm.userId);
                }

                const { data, error } = await query;

                if (error) {
                    console.error('[AdminDebug] Supabase error:', error);
                    this.notifFeedback.set(`Erreur DB [${error.code}]: ${error.message}`);
                    return;
                }

                if (data) {
                    console.log('[AdminDebug] Raw data length:', data.length);
                    if (data.length === 0) {
                        console.warn('[AdminDebug] No properties returned. This usually means RLS is blocking access (even for admins) or the table is empty.');
                    }
                    this.userProperties.set(data);
                }
            } catch (err: any) {
                console.error('[AdminDebug] Catch:', err);
                this.notifFeedback.set(`Erreur: ${err.message}`);
            } finally {
                this.isLoadingProperties.set(false);
            }
        }
    }

    async sendCustomNotif() {
        if (!this.notifForm.userId || !this.notifForm.title || !this.notifForm.message) return;

        try {
            this.isSendingNotif.set(true);
            this.notifFeedback.set(null);

            // Directly push to DB via notification service logic
            await this.postManualNotification(this.notifForm);

            this.notifFeedback.set('Succès !');
            this.notifForm.title = '';
            this.notifForm.message = '';

            setTimeout(() => this.notifFeedback.set(null), 3000);
        } catch (e: any) {
            this.notifFeedback.set('Erreur: ' + (e.message || 'Inconnue'));
            console.error(e);
        } finally {
            this.isSendingNotif.set(false);
        }
    }

    // Direct insert to public.notifications for target user
    private async postManualNotification(data: any) {
        let propertyName = '';

        if (data.propertyId) {
            const prop = this.userProperties().find(p => p.id === data.propertyId);
            if (prop) {
                propertyName = prop.name;
            }
        }

        const { error } = await this.supabaseService.supabase
            .from('notifications')
            .insert({
                user_id: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'info',
                payload: propertyName ? { property_name: propertyName, property_id: data.propertyId } : {}
            });
        if (error) throw error;
    }

    // --- HOUSEKEEPING METHODS ---

    async cleanupCalendar() {
        try {
            this.isCleaningCalendar.set(true);
            this.calendarFeedback.set(null);

            const thresholdDate = new Date();
            thresholdDate.setMonth(thresholdDate.getMonth() - this.calendarMonthThreshold());

            console.log(`[Housekeeping] Deleting calendar events older than ${thresholdDate.toISOString()}...`);

            const { count, error } = await this.supabaseService.supabase
                .from('calendar_events')
                .delete({ count: 'exact' })
                .lt('start', thresholdDate.toISOString());

            if (error) throw error;

            this.calendarFeedback.set(`${count || 0} événements supprimés.`);
            setTimeout(() => this.calendarFeedback.set(null), 5000);
        } catch (e: any) {
            console.error('[Housekeeping] Calendar error:', e);
            this.calendarFeedback.set(`Erreur: ${e.message}`);
        } finally {
            this.isCleaningCalendar.set(false);
        }
    }

    async cleanupNotifications() {
        try {
            this.isCleaningNotifications.set(true);
            this.notifCleanupFeedback.set(null);

            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() - this.notificationDayThreshold());

            console.log(`[Housekeeping] Deleting notifications older than ${thresholdDate.toISOString()}...`);

            const { count, error } = await this.supabaseService.supabase
                .from('notifications')
                .delete({ count: 'exact' })
                .lt('created_at', thresholdDate.toISOString());

            if (error) throw error;

            this.notifCleanupFeedback.set(`${count || 0} notifications supprimées.`);
            setTimeout(() => this.notifCleanupFeedback.set(null), 5000);
        } catch (e: any) {
            console.error('[Housekeeping] Notification error:', e);
            this.notifCleanupFeedback.set(`Erreur: ${e.message}`);
        } finally {
            this.isCleaningNotifications.set(false);
        }
    }

    currentPlan = this.store.userProfile()?.plan ? () => this.store.userProfile()!.plan : () => 'TIER_0';

    setPlan(plan: AppPlan) {
        this.store.setPlan(plan);
    }

    getPlanClasses(plan: string, active: boolean): string {
        const base = "border-2 shadow-inner ";
        if (active) {
            switch (plan) {
                case 'TIER_1': return base + "bg-amber-900/40 border-amber-500/50 text-amber-200";
                case 'TIER_2': return base + "bg-slate-700/60 border-slate-400 text-slate-100 shadow-slate-900/50";
                case 'TIER_3': return base + "bg-yellow-900/40 border-yellow-500/50 text-yellow-200 shadow-yellow-900/50";
                default: return base + "bg-slate-800 border-white/30 text-white";
            }
        } else {
            return "bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-800/60 hover:text-slate-300";
        }
    }

    getTierIndicatorClass(tier: string): string {
        switch (tier) {
            case 'TIER_1': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
            case 'TIER_2': return 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]';
            case 'TIER_3': return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]';
            default: return 'bg-slate-600';
        }
    }

    // Toggle Tag Mode
    isDebugTags = this.ts.debugMode;

    toggleDebugTags() {
        this.ts.toggleDebugMode();
    }

    async toggleBadges() {
        const isChecked = !this.store.showPlanBadges();

        // 1. Update Global Store (Instant feedback for Sidebar)
        this.store.showPlanBadges.set(isChecked);

        // 2. Persist to DB
        try {
            await this.repository.updateGlobalSettings({ show_plan_badges: isChecked });
        } catch (e) {
            console.error(e);
            // Revert on error
            this.store.showPlanBadges.set(!isChecked);
            alert("Error saving setting to DB.");
        }
    }

    toggleNotifDebug() {
        this.notifService.showDebugTestButton.update(v => !v);
    }

    toggleLanguageSwitcher() {
        this.store.showLanguageSwitcher.update(v => !v);
    }
}

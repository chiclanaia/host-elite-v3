
import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../services/notification.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'saas-notification-center',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" (click)="close.emit()"></div>

            <!-- Modal Content -->
            <div class="relative w-full max-w-4xl bg-slate-900/95 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                
                <!-- Close button top right -->
                <button (click)="close.emit()" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Header -->
                <div class="px-8 py-6 border-b border-white/10 bg-white/5 flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-2xl font-bold text-white tracking-tight">{{ 'NOTIF.Title' | translate }}</h3>
                            <p class="text-sm text-slate-400 mt-1">Gérez vos alertes et rappels d'événements</p>
                        </div>
                        <div class="flex items-center gap-4 mr-10">
                            @if (notifService.showDebugTestButton()) {
                                <button (click)="testNotification()" 
                                        [disabled]="testStatus() === 'Envoi...'"
                                        class="px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl transition-all flex items-center gap-2">
                                    @if (!testStatus()) {
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    }
                                    {{ testStatus() || 'Tester' }}
                                </button>
                            }
                            @if (unreadCount() > 0) {
                                <button (click)="markAllAsRead()" class="px-4 py-2 text-sm font-bold text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all">
                                    {{ 'NOTIF.MarkAllRead' | translate }}
                                </button>
                            }
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                        @for (filter of filters; track filter.id) {
                            <button (click)="activeFilter.set(filter.id)"
                                    class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
                                    [class.bg-white]="activeFilter() === filter.id"
                                    [class.text-slate-900]="activeFilter() === filter.id"
                                    [class.text-slate-400]="activeFilter() !== filter.id"
                                    [class.hover:text-white]="activeFilter() !== filter.id">
                                {{ filter.label | translate }}
                            </button>
                        }
                    </div>
                </div>

                <!-- List -->
                <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div class="space-y-4">
                        @for (notif of filteredNotifications(); track notif.id) {
                            <div [class.bg-white/5]="!notif.read_status" 
                                 [class.border-blue-500/30]="!notif.read_status"
                                 class="p-8 border border-white/5 rounded-[2rem] hover:bg-white/[0.08] transition-all group relative cursor-pointer shadow-lg"
                                 (click)="onNotificationClick(notif)">
                                
                                <div class="flex gap-8">
                                    <!-- Icon/Type Indicator -->
                                    <div class="shrink-0">
                                        <div [ngClass]="getTypeClass(notif.type)" class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                                            @switch (notif.type) {
                                                @case ('event') {
                                                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                }
                                                @case ('success') {
                                                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                                }
                                                @case ('warning') {
                                                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                }
                                                @default {
                                                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                }
                                            }
                                        </div>
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between mb-2">
                                            <h4 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {{ notif.title }}
                                            </h4>
                                            <span class="text-sm text-slate-500 font-medium">
                                                {{ notif.created_at | date:'dd MMM, HH:mm' }}
                                            </span>
                                        </div>
                                        <p class="text-slate-300 text-lg leading-relaxed">
                                            {{ notif.message }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Read indicator -->
                                @if (!notif.read_status) {
                                    <div class="absolute right-8 top-8 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                                }
                            </div>
                        } @empty {
                            <div class="py-24 flex flex-col items-center justify-center text-center px-12">
                                <div class="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-slate-600 border border-white/10">
                                    <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <h4 class="text-2xl font-bold text-white mb-3">{{ 'NOTIF.Empty' | translate }}</h4>
                                <p class="text-lg text-slate-400 max-w-md mx-auto">
                                    @switch (activeFilter()) {
                                        @case ('read') { Vous n'avez aucune notification lue. }
                                        @case ('unread') { Vous n'avez aucune notification non lue. Félicitations ! }
                                        @default { Revenez plus tard pour voir les notifications de vos événements. }
                                    }
                                </p>
                            </div>
                        }
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-8 bg-white/5 border-t border-white/10 flex justify-center">
                    <button (click)="close.emit()" class="px-12 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl transition-all border border-white/10">
                        {{ 'NOTIF.Close' | translate }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `]
})
export class NotificationCenterComponent {
    notifService = inject(NotificationService);
    notifications = this.notifService.notifications;
    unreadCount = this.notifService.unreadCount;
    close = output<void>();

    activeFilter = signal<'all' | 'read' | 'unread'>('all');

    filters: { id: 'all' | 'read' | 'unread', label: string }[] = [
        { id: 'all', label: 'NOTIF.FilterAll' },
        { id: 'unread', label: 'NOTIF.FilterUnread' },
        { id: 'read', label: 'NOTIF.FilterRead' }
    ];

    filteredNotifications = computed(() => {
        const list = this.notifications();
        const filter = this.activeFilter();

        if (filter === 'read') return list.filter(n => n.read_status);
        if (filter === 'unread') return list.filter(n => !n.read_status);
        return list;
    });

    testStatus = signal<string | null>(null);

    async testNotification() {
        try {
            this.testStatus.set('Envoi...');
            await this.notifService.postNotification({
                title: 'Test Notification center',
                message: 'Ceci est une notification de test générée depuis le panneau.',
                type: 'info'
            });
            this.testStatus.set('Succès !');
            setTimeout(() => this.testStatus.set(null), 3000);
        } catch (e) {
            this.testStatus.set('Erreur DB');
            console.error('Test notification failed:', e);
            setTimeout(() => this.testStatus.set(null), 5000);
        }
    }

    getTypeClass(type: string): string {
        switch (type) {
            case 'success': return 'bg-emerald-500 shadow-emerald-500/50';
            case 'warning': return 'bg-amber-500 shadow-amber-500/50';
            case 'error': return 'bg-red-500 shadow-red-500/50';
            case 'event': return 'bg-blue-600 shadow-blue-600/50';
            default: return 'bg-slate-600 shadow-slate-600/50';
        }
    }

    markAllAsRead() {
        this.notifService.markAllAsRead();
    }

    onNotificationClick(notif: AppNotification) {
        if (!notif.read_status) {
            this.notifService.markAsRead(notif.id);
        }
    }
}

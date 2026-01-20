
import { Injectable, inject, signal, effect } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SessionStore } from '../state/session.store';

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'event';
    read_status: boolean;
    created_at: string;
    payload: any;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private supabaseService = inject(SupabaseService);
    private store = inject(SessionStore);

    notifications = signal<AppNotification[]>([]);
    unreadCount = signal(0);
    isModalOpen = signal(false);
    showDebugTestButton = signal(localStorage.getItem('DEBUG_SHOW_NOTIF_TEST') === 'true');
    private isInitialized = false;

    constructor() {
        // Persist debug button setting
        effect(() => {
            localStorage.setItem('DEBUG_SHOW_NOTIF_TEST', this.showDebugTestButton().toString());
        });

        // Automatically fetch and subscribe when user is authenticated
        effect(() => {
            const user = this.store.userProfile();
            if (user && !this.isInitialized) {
                this.init(user.id);
            } else if (!user) {
                this.isInitialized = false;
                this.notifications.set([]);
                this.unreadCount.set(0);
            }
        });
    }

    private async init(userId: string) {
        this.isInitialized = true;
        await this.loadNotifications(userId);
        this.subscribeToRealtime(userId);
    }

    private async loadNotifications(userId: string) {
        if (!this.supabaseService.isConfigured) return;

        const { data, error } = await this.supabaseService.supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) {
            this.notifications.set(data);
            this.updateUnreadCount();
        }
    }

    private subscribeToRealtime(userId: string) {
        if (!this.supabaseService.isConfigured) return;

        this.supabaseService.supabase
            .channel(`notifs:${userId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newNotif = payload.new as AppNotification;
                    this.notifications.update(list => [newNotif, ...list]);
                } else if (payload.eventType === 'UPDATE') {
                    const updated = payload.new as AppNotification;
                    this.notifications.update(list => list.map(n => n.id === updated.id ? updated : n));
                } else if (payload.eventType === 'DELETE') {
                    const deletedId = payload.old.id;
                    this.notifications.update(list => list.filter(n => n.id !== deletedId));
                }
                this.updateUnreadCount();
            })
            .subscribe();
    }

    private updateUnreadCount() {
        const count = this.notifications().filter(n => !n.read_status).length;
        this.unreadCount.set(count);
    }

    async markAsRead(id: string) {
        if (!this.supabaseService.isConfigured) return;

        const { error } = await this.supabaseService.supabase
            .from('notifications')
            .update({ read_status: true })
            .eq('id', id);

        if (error) console.error('Error marking as read:', error);
    }

    async markAllAsRead() {
        const userId = this.store.userProfile()?.id;
        if (!userId || !this.supabaseService.isConfigured) return;

        const { error } = await this.supabaseService.supabase
            .from('notifications')
            .update({ read_status: true })
            .eq('user_id', userId)
            .eq('read_status', false);

        if (error) console.error('Error marking all as read:', error);
    }

    /**
     * Post a notification from any component
     */
    async postNotification(notif: { title: string, message: string, type?: AppNotification['type'], payload?: any }) {
        const userId = this.store.userProfile()?.id;
        if (!userId || !this.supabaseService.isConfigured) return;

        const { error } = await this.supabaseService.supabase
            .from('notifications')
            .insert({
                user_id: userId,
                title: notif.title,
                message: notif.message,
                type: notif.type || 'info',
                payload: notif.payload || {}
            });

        if (error) {
            console.error('Error posting notification:', error);
            throw error;
        }
    }
}

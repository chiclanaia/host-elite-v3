
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationCenterComponent } from './notification-center.component';

@Component({
    selector: 'saas-notification-bell',
    standalone: true,
    imports: [CommonModule, NotificationCenterComponent],
    template: `
        <div class="relative">
            <!-- Bell Button -->
            <button (click)="toggleCenter()" 
                class="relative p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 group focus:outline-none"
                [class.text-white]="isOpen()"
                [class.bg-white/10]="isOpen()">
                <svg class="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                <!-- Red Dot Indicator -->
                @if (unreadCount() > 0) {
                    <span class="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-slate-900 shadow-sm"></span>
                    </span>
                }
            </button>
        </div>
    `
})
export class NotificationBellComponent {
    private notifService = inject(NotificationService);
    unreadCount = this.notifService.unreadCount;
    isOpen = this.notifService.isModalOpen;

    toggleCenter() {
        this.isOpen.update(v => !v);
    }

    close() {
        this.isOpen.set(false);
    }
}

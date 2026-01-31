import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface Ticket {
    id: string;
    title: string;
    priority: 'Urgent' | 'Medium' | 'Low';
    reportedBy: string;
    reportedAt: string;
    status: 'Open';
}

@Component({
    selector: 'ops-10-maintenance-tracker',
    standalone: true,
    imports: [CommonModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
            🔧 Ops Engine
        </div>
      </div>

      <!-- Tier 0: Simple List -->
      @if (tier() === 'TIER_0' || tier() === 'Freemium') {
          <div class="bg-slate-800 rounded-xl border border-white/10 p-8 text-center">
              <div class="text-4xl mb-4">📝</div>
              <h3 class="text-xl font-bold text-white mb-2">{{ 'MAINTENANC.ManualMaintenanceLog' | translate }}</h3>
              <p class="text-slate-400 max-w-md mx-auto mb-6">{{ 'MAINTENANC.KeepTrackOfYourRepairs' | translate }}</p>
              <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">{{ 'MAINTENANC.DownloadTemplate' | translate }}</button>
          </div>
      } @else {
          <!-- Tier 1/2/3: Digital Board -->
          <div class="flex-1 min-h-0 bg-slate-800 rounded-xl border border-white/10 flex flex-col">
               <!-- Toolbar -->
               <div class="p-4 border-b border-white/10 flex justify-between items-center">
                   <div class="flex gap-2">
                       <button class="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20" data-debug-id="maint-filter-open">{{ 'MAINTENANC.Open2' | translate }}</button>
                       <button class="px-3 py-1.5 text-slate-400 text-xs hover:text-white" data-debug-id="maint-filter-closed">{{ 'MAINTENANC.Closed12' | translate }}</button>
                   </div>
                   <button (click)="addTicket()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg flex items-center gap-2" data-debug-id="maint-new-ticket-btn">
                       <span>+</span>{{ 'MAINTENANC.NewTicket' | translate }}</button>
               </div>

               <!-- Ticket List -->
               <div class="flex-1 overflow-y-auto p-4 space-y-3">
                   @for (ticket of tickets(); track ticket.id) {
                       <!-- Ticket Item -->
                       <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group" [attr.data-debug-id]="'maint-ticket-' + ticket.id">
                           <div class="flex justify-between items-start">
                               <div>
                                   <div class="flex items-center gap-2 mb-1">
                                       <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold" 
                                             [class.bg-rose-500/20]="ticket.priority === 'Urgent'"
                                             [class.text-rose-300]="ticket.priority === 'Urgent'"
                                             [class.bg-amber-500/20]="ticket.priority === 'Medium'" 
                                             [class.text-amber-300]="ticket.priority === 'Medium'"
                                             [class.bg-blue-500/20]="ticket.priority === 'Low'"
                                             [class.text-blue-300]="ticket.priority === 'Low'">
                                           {{ ticket.priority }}
                                       </span>
                                       <span class="text-sm font-bold text-white">{{ ticket.title }}</span>
                                   </div>
                                   <p class="text-xs text-slate-400">Reported by {{ ticket.reportedBy }} • {{ ticket.reportedAt }}</p>
                               </div>
                               <div class="text-right">
                                   <p class="text-xs text-slate-500">#{{ ticket.id }}</p>
                               </div>
                           </div>
                           
                           @if (tier() === 'TIER_3') {
                               <!-- Tier 3: Automations -->
                               <div class="mt-4 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <span class="text-xs text-emerald-400 flex items-center gap-1">
                                        <span class="material-icons text-sm">link</span>{{ 'MAINTENANC.LinkedToSecurityDeposit' | translate }}</span>
                                   <button class="px-3 py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-600">{{ 'MAINTENANC.AssignVendor' | translate }}</button>
                               </div>
                           }
                       </div>
                   } @empty {
                       <div class="flex flex-col items-center justify-center h-40 text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
                           <p class="text-sm italic">No open tickets found.</p>
                       </div>
                   }
               </div>
          </div>
       }
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
            <div class="flex items-start gap-3">
               <span class="text-xl">🔨</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">{{ 'MAINTENANC.WearTearVsDamage' | translate }}</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">A worn carpet is "Wear & Tear" (your cost). A red wine stain is "Damage" (Guest's cost). Use this tracker to tag them correctly for claims.</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class MaintenanceTrackerComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_10',
        name: this.translate.instant('MAINTRAC.Title'),
        description: this.translate.instant('MAINTRAC.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    tickets = signal<Ticket[]>([
        {
            id: 'TK-1024',
            title: 'Leaky Faucet in Kitchen',
            priority: 'Urgent',
            reportedBy: 'Guest',
            reportedAt: '2 hours ago',
            status: 'Open'
        },
        {
            id: 'TK-1025',
            title: 'Wifi Signal Weak in Bedroom',
            priority: 'Medium',
            reportedBy: 'Cleaner',
            reportedAt: 'Yesterday',
            status: 'Open'
        }
    ]);

    addTicket() {
        const newId = 'TK-' + Math.floor(1000 + Math.random() * 9000);
        const newTicket: Ticket = {
            id: newId,
            title: 'New Maintenance Issue',
            priority: 'Medium',
            reportedBy: 'Self',
            reportedAt: 'Just now',
            status: 'Open'
        };
        this.tickets.update(prev => [newTicket, ...prev]);
    }
}

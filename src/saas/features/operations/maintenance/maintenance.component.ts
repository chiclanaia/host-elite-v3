import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'assigned' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reportedBy: string;
    createdAt: string;
    vendor?: string;
}

@Component({
    selector: 'ops-05-maintenance',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Maintenance Commander</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Track defects, assign contractors, and protect your asset value.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-rose-500/20 text-rose-300 border-rose-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Dispatch AI' : (isTier2() ? 'Contractor Mgmt' : 'Manual Log') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Actions & Status -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <!-- Health Status -->
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <span class="material-icons text-emerald-400">health_and_safety</span> Asset Health
                   </h3>
                   <div class="flex items-center gap-4 mb-4">
                       <div class="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                           94%
                       </div>
                       <div>
                           <div class="text-sm text-slate-300">Operational</div>
                           <div class="text-xs text-slate-500">2 Minor Issues</div>
                       </div>
                   </div>
                   <div class="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Recent Cost</div>
                   <div class="h-16 w-full flex items-end gap-1 border-b border-slate-700 pb-1">
                       <div class="w-1/6 bg-indigo-900/50 h-[20%] rounded-t"></div>
                       <div class="w-1/6 bg-indigo-900/50 h-[40%] rounded-t"></div>
                       <div class="w-1/6 bg-indigo-900/50 h-[10%] rounded-t"></div>
                       <div class="w-1/6 bg-rose-500 h-[80%] rounded-t relative group">
                           <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">€450 Heater</div>
                       </div>
                       <div class="w-1/6 bg-indigo-900/50 h-[30%] rounded-t"></div>
                       <div class="w-1/6 bg-indigo-900/50 h-[15%] rounded-t"></div>
                   </div>
               </div>

                <!-- Coach -->
                <div class="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg mt-auto">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Wear & Tear vs Damage: A worn carpet is your cost. A red wine stain is the guest's cost. Tag tickets correctly to win Airbnb resolution claims."
                    </p>
                </div>
           </div>

           <!-- Ticket Board -->
           <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
               <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-hidden">
                   <!-- Toolbar -->
                   <div class="flex justify-between items-center mb-6">
                       <div class="flex gap-2">
                           <button class="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 transition-colors border border-white/5 active:bg-white/20" 
                                   [class.bg-white-20]="filter() === 'open'"
                                   (click)="filter.set('open')">Open ({{ openCount() }})</button>
                           <button class="px-3 py-1.5 text-slate-400 text-xs hover:text-white transition-colors"
                                   [class.text-white]="filter() === 'closed'"
                                   (click)="filter.set('closed')">Closed</button>
                       </div>
                       <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20" 
                               data-debug-id="maint-new-ticket-btn">
                           <span class="material-icons text-sm">add</span> New Issue
                       </button>
                   </div>

                   <!-- List -->
                   <div class="flex-1 overflow-y-auto space-y-3 pr-2">
                       @for (ticket of visibleTickets(); track ticket.id) {
                           <div class="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                               <div class="flex justify-between items-start z-10 relative">
                                   <div class="flex gap-4">
                                       <div class="w-10 h-10 rounded flex items-center justify-center text-lg"
                                            [ngClass]="{
                                                'bg-rose-500/20 text-rose-400': ticket.priority === 'urgent',
                                                'bg-amber-500/20 text-amber-400': ticket.priority === 'high',
                                                'bg-blue-500/20 text-blue-400': ticket.priority === 'medium',
                                                'bg-slate-500/20 text-slate-400': ticket.priority === 'low'
                                            }">
                                           <span class="material-icons text-lg">
                                               {{ ticket.priority === 'urgent' ? 'warning' : 'build' }}
                                           </span>
                                       </div>
                                       <div>
                                           <div class="flex items-center gap-2 mb-0.5">
                                               <span class="text-sm font-bold text-white">{{ ticket.title }}</span>
                                               @if(ticket.status === 'assigned') {
                                                   <span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Assigned: {{ticket.vendor}}</span>
                                               }
                                           </div>
                                           <p class="text-xs text-slate-400 line-clamp-1">{{ ticket.description }}</p>
                                           <div class="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                                               <span>Reported by {{ ticket.reportedBy }}</span>
                                               <span>•</span>
                                               <span>{{ ticket.createdAt }}</span>
                                           </div>
                                       </div>
                                   </div>
                                   
                                   @if(ticket.status === 'open') {
                                       <button class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400" (click)="assignTicket(ticket.id)">
                                           <span class="material-icons text-sm">more_vert</span>
                                       </button>
                                   } @else {
                                       <span class="material-icons text-emerald-500 text-sm">check_circle</span>
                                   }
                               </div>

                               <!-- Tier 3: Auto Dispatch Mock -->
                               @if(isTier3() && ticket.status === 'open') {
                                    <div class="mt-3 pl-[3.5rem] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-[10px] flex items-center gap-1 font-bold"
                                                (click)="assignTicket(ticket.id)">
                                            <span class="material-icons text-[10px]">auto_fix_high</span> Auto-Dispatch to Plumber
                                        </button>
                                    </div>
                               }
                           </div>
                       }
                       
                       @if (visibleTickets().length === 0) {
                           <div class="h-32 flex flex-col items-center justify-center text-slate-500">
                               <span class="material-icons text-3xl mb-2 opacity-50">task_alt</span>
                               <span class="text-xs">No {{ filter() }} tickets found. Good job!</span>
                           </div>
                       }
                   </div>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class MaintenanceComponent {
    feature = computed(() => ({
        id: 'OPS_05',
        name: 'Maintenance Tracker',
        description: 'Issue & Contractor Management',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    filter = signal<'open' | 'closed'>('open');

    tickets = signal<Ticket[]>([
        { id: '1', title: 'Leaky Faucet', description: 'Kitchen sink dripping rapidly.', status: 'open', priority: 'urgent', reportedBy: 'Guest', createdAt: '2 hours ago' },
        { id: '2', title: 'Wifi Signal Weak', description: 'Master bedroom signal drops.', status: 'open', priority: 'medium', reportedBy: 'Guest', createdAt: 'Yesterday' },
        { id: '3', title: 'Broken Chair', description: 'Dining chair leg wobbly.', status: 'closed', priority: 'low', reportedBy: 'Cleaner', createdAt: 'Last Week' },
    ]);

    visibleTickets = computed(() => this.tickets().filter(t =>
        this.filter() === 'open' ? t.status !== 'closed' : t.status === 'closed'
    ));

    openCount = computed(() => this.tickets().filter(t => t.status !== 'closed').length);

    assignTicket(id: string) {
        if (!this.isTier3()) {
            alert("Upgrade to Gold for Auto-Dispatch!");
            return;
        }
        // Mock Dispatch
        alert("Dispatching job to 'QuickFix Plumbing Ltd' via Email/SMS...");
        this.tickets.update(ts => ts.map(t => t.id === id ? { ...t, status: 'assigned', vendor: 'QuickFix Plumbing' } : t));
    }
}

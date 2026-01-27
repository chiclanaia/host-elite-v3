import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-08-automation',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-pink-500/10 text-pink-300 rounded-lg border border-pink-500/30 text-xs font-mono">
           ⚡ Workflows
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
           <!-- Workflow Builder -->
            <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6">
                <h3 class="text-white font-bold mb-6">Active Automations</h3>
                
                <div class="space-y-4">
                    <!-- Rule 1 -->
                    <div class="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/5 relative overflow-hidden group">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                         <div class="h-10 w-10 rounded bg-slate-700 flex items-center justify-center text-xl">🧹</div>
                         <div class="flex-1">
                             <div class="text-white font-bold text-sm">Clean after Checkout</div>
                             <div class="text-[10px] text-slate-500 font-mono">IF Checkout == Today THEN Create Task "Cleaning"</div>
                         </div>
                         <div class="flex items-center gap-2">
                             <span class="text-xs text-emerald-400 font-bold">Active</span>
                             <div class="h-4 w-8 bg-emerald-500/20 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500"></div></div>
                         </div>
                    </div>

                    <!-- Rule 2 -->
                     <div class="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/5 relative overflow-hidden group">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                         <div class="h-10 w-10 rounded bg-slate-700 flex items-center justify-center text-xl">🔑</div>
                         <div class="flex-1">
                             <div class="text-white font-bold text-sm">Send Code</div>
                             <div class="text-[10px] text-slate-500 font-mono">IF Check-in == -48h THEN Send SMS "Code: {{'{'}}Code{{'}'}}"</div>
                         </div>
                         <div class="flex items-center gap-2">
                             <span class="text-xs text-emerald-400 font-bold">Active</span>
                             <div class="h-4 w-8 bg-emerald-500/20 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500"></div></div>
                         </div>
                    </div>
                </div>

                @if (tier() === 'TIER_3') {
                    <button class="mt-6 w-full border border-dashed border-slate-600 rounded-lg p-4 text-slate-400 text-sm hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2">
                        <span class="material-icons">add_circle</span> New Workflow
                    </button>
                }
            </div>

            <!-- Event Log -->
            <div class="bg-slate-900 rounded-xl border border-white/10 p-6 overflow-hidden flex flex-col">
                <h3 class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Event Stream</h3>
                <div class="flex-1 overflow-y-auto space-y-3 font-mono text-[10px]">
                    <div class="flex gap-2">
                        <span class="text-slate-600">10:42</span>
                        <span class="text-indigo-400">Trigger</span>
                        <span class="text-slate-300">Checkout Detected (Booking #992)</span>
                    </div>
                     <div class="flex gap-2">
                        <span class="text-slate-600">10:42</span>
                        <span class="text-emerald-400">Action</span>
                        <span class="text-slate-300">Created Task: Clean (Alice)</span>
                    </div>
                     <div class="flex gap-2">
                        <span class="text-slate-600">09:15</span>
                        <span class="text-indigo-400">Trigger</span>
                        <span class="text-slate-300">New Booking (Airbnb)</span>
                    </div>
                </div>
            </div>
       </div>
       
       <!-- Coach -->
       <div class="lg:col-span-3 mt-4 p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <div class="flex items-start gap-3">
               <span class="text-xl">🚀</span>
               <div>
                   <h4 class="font-bold text-pink-300 text-sm">The "Early Checkout" Opportunity</h4>
                   <p class="text-xs text-pink-200/80 mt-1">If a guest checks out early (via Smart Lock sensor), trigger an instant cleaning task. You might get the unit ready for a same-day booking!</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class TaskAutomationComponent {
    feature = computed(() => ({
        id: 'OPS_08',
        name: 'Task Automation',
        description: 'Event-Driven Operations Engine',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

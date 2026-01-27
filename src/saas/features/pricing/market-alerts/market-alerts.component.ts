import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'pri-03-market-alerts',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-red-500/10 text-red-300 rounded-lg border border-red-500/30 text-xs font-mono">
           🔔 Intelligence
        </div>
      </div>

       <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex-1">
           <h3 class="text-white font-bold mb-6">Active Monitors</h3>
           
           <div class="space-y-3">
               <div class="p-4 bg-slate-900 rounded-lg border border-white/5 flex justify-between items-center group hover:border-indigo-500 transition-colors">
                   <div class="flex items-center gap-4">
                       <div class="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                           <span class="material-icons">trending_up</span>
                       </div>
                       <div>
                           <div class="text-white font-bold">Competitor Price Spike</div>
                           <div class="text-xs text-slate-500">Alert me if > 3 neighbors raise price by 15%</div>
                       </div>
                   </div>
                   <div class="flex items-center gap-2">
                       <span class="text-emerald-400 text-xs font-bold">Active</span>
                       <div class="h-4 w-8 bg-emerald-500/20 rounded-full relative cursor-pointer" data-debug-id="market-alert-toggle-price-spike"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500"></div></div>
                   </div>
               </div>

                <div class="p-4 bg-slate-900 rounded-lg border border-white/5 flex justify-between items-center group hover:border-indigo-500 transition-colors">
                   <div class="flex items-center gap-4">
                       <div class="h-10 w-10 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center">
                           <span class="material-icons">event</span>
                       </div>
                       <div>
                           <div class="text-white font-bold">New Major Event</div>
                           <div class="text-xs text-slate-500">Concerts/Sports > 50k attendees</div>
                       </div>
                   </div>
                   <div class="flex items-center gap-2">
                        @if (tier() === 'TIER_3') {
                            <span class="text-emerald-400 text-xs font-bold">Active</span>
                            <div class="h-4 w-8 bg-emerald-500/20 rounded-full relative cursor-pointer" data-debug-id="market-alert-toggle-event"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500"></div></div>
                        } @else {
                            <span class="text-slate-500 text-xs">Tier 3 Only</span>
                            <span class="material-icons text-slate-600 text-sm">lock</span>
                        }
                   </div>
               </div>

               <!-- Coach Tip -->
               <div class="mt-6 p-4 bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-red-300 font-bold text-sm uppercase">Coach Tip</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Event Compression: Prices skyrocket for events. Don't sell out too early for dates like the Olympics or large concerts!"
                    </p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class MarketAlertsComponent {
    feature = computed(() => ({
        id: 'PRI_03',
        name: 'Market Alerts',
        description: 'Real-time Competitor Intelligence',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

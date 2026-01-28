import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

interface Competitor {
    name: string;
    price: number;
    occupancy: number;
    rating: number;
}

@Component({
    selector: 'pri-03-market-alerts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Market Intelligence Radar</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Spy on your neighbors. Legally.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-red-500/20 text-red-300 border-red-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Real-Time Scraper' : (isTier2() ? 'Daily Alerts' : 'Manual Alerts') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Alerts Config -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4">Watchlist Triggers</h3>
                   
                   <div class="space-y-3">
                       <!-- Price Spike -->
                       <div class="p-4 bg-slate-900 rounded-lg border border-white/5 group hover:border-indigo-500 transition-colors">
                           <div class="flex justify-between items-start mb-2">
                               <div class="flex items-center gap-3">
                                   <div class="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                       <span class="material-icons text-sm">trending_up</span>
                                   </div>
                                   <span class="text-sm font-bold text-white">Price Surge</span>
                               </div>
                               <div class="h-4 w-8 bg-emerald-500 rounded-full relative cursor-pointer" data-debug-id="market-alert-toggle-price"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-white"></div></div>
                           </div>
                           <p class="text-[10px] text-slate-500">Alert me if 3+ neighbors raise rates by > 15%</p>
                       </div>

                       <!-- Undercut Alert -->
                       <div class="p-4 bg-slate-900 rounded-lg border border-white/5 group hover:border-rose-500 transition-colors">
                           <div class="flex justify-between items-start mb-2">
                               <div class="flex items-center gap-3">
                                   <div class="h-8 w-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                       <span class="material-icons text-sm">trending_down</span>
                                   </div>
                                   <span class="text-sm font-bold text-white">Undercut Warning</span>
                               </div>
                               <div class="h-4 w-8 bg-slate-600 rounded-full relative cursor-pointer" data-debug-id="market-alert-toggle-undercut"><div class="absolute left-1 top-1 h-2 w-2 rounded-full bg-slate-400"></div></div>
                           </div>
                           <p class="text-[10px] text-slate-500">Alert me if similar listings drop below €80</p>
                       </div>

                       <!-- Event Watch (Tier 3) -->
                       <div class="p-4 bg-slate-900 rounded-lg border border-white/5 group hover:border-amber-500 transition-colors opacity-90">
                           <div class="flex justify-between items-start mb-2">
                               <div class="flex items-center gap-3">
                                   <div class="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                       <span class="material-icons text-sm">event</span>
                                   </div>
                                   <span class="text-sm font-bold text-white">Event Detection</span>
                               </div>
                               @if(isTier3()) {
                                   <div class="h-4 w-8 bg-emerald-500 rounded-full relative cursor-pointer" data-debug-id="market-alert-toggle-event"><div class="absolute right-1 top-1 h-2 w-2 rounded-full bg-white"></div></div>
                               } @else {
                                   <span class="material-icons text-slate-600 text-xs">lock</span>
                               }
                           </div>
                           <p class="text-[10px] text-slate-500">Scan Ticketmaster/Eventbrite for +50k attendees</p>
                       </div>
                   </div>
               </div>

               <!-- Coach -->
               <div class="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-red-300 font-bold text-sm uppercase">Coach Tip</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Don't Blink. During the Taylor Swift tour, hosts who updated rates 6 months out made 300% more. Tier 3 'Event Detection' catches these spikes early."
                   </p>
               </div>
           </div>

           <!-- Right: Competitor Radar -->
           <div class="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-8 flex flex-col relative overflow-hidden">
               
               <div class="flex justify-between items-center mb-6">
                   <h3 class="text-white font-bold text-lg">Competitor Pulse</h3>
                   @if(isTier3()) {
                       <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full animate-pulse">
                           <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                           <span class="text-xs text-emerald-400 font-mono">LIVE SCRAPER</span>
                       </div>
                   }
               </div>

               <!-- Radar Chart Simulation (CSS) -->
               <div class="flex-1 relative flex items-center justify-center">
                   <!-- Rings -->
                   <div class="absolute w-[300px] h-[300px] rounded-full border border-white/5"></div>
                   <div class="absolute w-[200px] h-[200px] rounded-full border border-white/10"></div>
                   <div class="absolute w-[100px] h-[100px] rounded-full border border-white/20"></div>
                   
                   <!-- Axes -->
                   <div class="absolute w-full h-[1px] bg-white/5 top-1/2"></div>
                   <div class="absolute h-full w-[1px] bg-white/5 left-1/2"></div>

                   <!-- You (Center) -->
                   <div class="absolute w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(99,102,241,0.8)] z-20">
                       <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-400 whitespace-nowrap">YOU</div>
                   </div>

                   <!-- Competitors -->
                   @for(comp of competitors(); track comp.name) {
                       <div class="absolute w-3 h-3 bg-red-500 rounded-full hover:scale-150 transition-transform cursor-pointer group z-10"
                            [style.top]="(50 - (comp.price - 100) / 2) + '%'"
                            [style.left]="(50 + (comp.occupancy - 50) * 1.5) + '%'">
                           
                           <!-- Tooltip -->
                           <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-white/10 rounded text-center opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30">
                               <div class="font-bold text-white text-xs">{{ comp.name }}</div>
                               <div class="text-[10px] text-emerald-400">€{{ comp.price }} • {{ comp.occupancy }}% Occ</div>
                           </div>
                       </div>
                   }
               </div>
               
               <div class="grid grid-cols-2 gap-4 mt-6">
                   <div class="text-center">
                        <div class="text-xs text-slate-500 uppercase mb-1">Market Avg Price</div>
                        <div class="text-xl font-mono text-white">€112</div>
                   </div>
                   <div class="text-center">
                        <div class="text-xs text-slate-500 uppercase mb-1">Market Occupancy</div>
                        <div class="text-xl font-mono text-white">68%</div>
                   </div>
               </div>

           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class MarketAlertsComponent {
    feature = computed(() => ({
        id: 'PRI_02',
        name: 'Market Alerts',
        description: 'Real-time Competitor Intelligence',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    competitors = signal<Competitor[]>([
        { name: 'Seaside Loft', price: 125, occupancy: 75, rating: 4.8 },
        { name: 'Cozy Studio', price: 95, occupancy: 60, rating: 4.5 },
        { name: 'Luxury Villa', price: 180, occupancy: 40, rating: 4.9 },
        { name: 'City Apt', price: 110, occupancy: 85, rating: 4.7 },
        { name: 'Beach Hut', price: 80, occupancy: 50, rating: 4.2 },
    ]);
}

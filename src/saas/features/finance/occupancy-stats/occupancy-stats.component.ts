import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-05-occupancy-stats',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2">{{ feature().description }}</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Basic Stats' : (isTier3() ? 'Predictive Benchmarking' : 'Personal Stats') }}
         </div>
      </div>

       <!-- Stats Grid -->
       <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Occupancy Rate -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
                 <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Occupancy Rate</h3>
                 <div class="flex items-baseline gap-2">
                     <span class="text-4xl font-black text-white">72%</span>
                     <span class="text-xs text-emerald-400">+5% vs Market</span>
                 </div>
                 <div class="w-full bg-slate-700 rounded-full h-1.5 mt-4 overflow-hidden">
                     <div class="bg-indigo-500 h-full" style="width: 72%"></div>
                 </div>
                 <!-- Tooltip for educational value -->
                 <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span class="material-icons text-slate-500 text-sm cursor-help" title="High occupancy isn't always good. If you are 100% full, you might be too cheap.">info</span>
                 </div>
            </div>

            <!-- ADR (Average Daily Rate) -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">ADR</h3>
                 <div class="flex items-baseline gap-2">
                     <span class="text-4xl font-black text-white">€145</span>
                     <span class="text-xs text-rose-400">-12% vs Market</span>
                 </div>
                  <div class="mt-4 text-xs text-slate-500">
                     Avg. Daily Rate over last 30 days
                 </div>
            </div>

            <!-- RevPAR -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm border-l-4 border-l-emerald-500">
                 <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">RevPAR (Key Metric)</h3>
                 <div class="flex items-baseline gap-2">
                     <span class="text-4xl font-black text-white">€104</span>
                 </div>
                 <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                     Your actual revenue per available room night. This is the true measure of efficiency.
                 </p>
            </div>
       </div>

       <!-- Chart Area (Tier 3 Benchmarking) -->
       <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col">
           <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                    <span class="material-icons text-indigo-400">equalizer</span> Performance vs Comp-Set
                </h3>
                @if (isTier3()) {
                    <div class="flex gap-2 text-xs">
                        <span class="flex items-center gap-1 text-indigo-300"><div class="w-2 h-2 rounded-full bg-indigo-500"></div> You</span>
                        <span class="flex items-center gap-1 text-slate-500"><div class="w-2 h-2 rounded-full bg-slate-600"></div> Market Avg</span>
                        <span class="flex items-center gap-1 text-emerald-300"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Top 10%</span>
                    </div>
                }
           </div>

           @if (isTier3()) {
               <div class="flex-1 flex items-end justify-between px-4 gap-2 opacity-90">
                   @for (day of days; track day) {
                       <div class="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                           <!-- Market Bar -->
                           <div class="w-full bg-slate-700/30 rounded-t" [style.height.%]="day.market"></div>
                           <!-- Your Bar (Overlay) -->
                           <div class="w-2/3 bg-indigo-500 absolute bottom-0 rounded-t transition-all hover:bg-indigo-400"
                                [style.height.%]="day.you"
                                [class.bg-rose-500]="day.you < day.market * 0.8"
                                [class.bg-emerald-500]="day.you > day.market * 1.1">
                           </div>
                           
                           <!-- Tooltip on hover -->
                           <div class="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded whitespace-nowrap z-20 border border-slate-700">
                               RevPAR: €{{day.revpar}}<br>
                               Market: €{{day.revparMarket}}
                           </div>
                       </div>
                   }
               </div>
               <div class="h-px bg-white/10 w-full mt-2"></div>
               <div class="flex justify-between px-4 mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                   <span>Week 1</span>
                   <span>Week 2</span>
                   <span>Week 3</span>
                   <span>Week 4</span>
               </div>
           } @else {
               <div class="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <span class="text-3xl">📊</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Unlock Competitive Intelligence</h3>
                    <p class="text-slate-400 max-w-md mb-6">Stop guessing. Compare your RevPAR against the top 10% of properties in your exact neighborhood to spot under-pricing.</p>
                    <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all">
                        Upgrade to Market Explorer
                    </button>
                </div>
           }
       </div>

       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div class="flex items-start gap-3">
               <span class="text-xl">🎓</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">The RevPAR Myth</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">Don't obsess over Occupancy. Selling out a month in advance usually means you were too cheap. Aim for 85-90% occupancy with higher rates to maximize total revenue (RevPAR).</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class OccupancyStatsComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    // Computed
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    // Mock Data for Tier 3 chart
    days = Array.from({ length: 28 }, (_, i) => ({
        day: i + 1,
        you: Math.random() * 60 + 20, // 20-80%
        market: Math.random() * 50 + 30, // 30-80%
        revpar: Math.floor(Math.random() * 50 + 80),
        revparMarket: Math.floor(Math.random() * 50 + 90)
    }));
}

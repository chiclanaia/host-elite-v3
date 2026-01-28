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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Occupancy Optimizer</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Stop leaving money on the table. Optimize your rates to hit the "Golden Zone" (85-92% Occupancy).</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Basic Counters' : (isTier3() ? 'Revenue Forensics' : 'Smart Pricing') }}
         </div>
      </div>

       <!-- Key Metrics Grid -->
       <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Occupancy Rate -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
                 <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Occupancy Rate (30d)</h3>
                 <div class="flex items-baseline gap-2">
                     <span class="text-4xl font-black text-white" [class.text-rose-400]="occupancyRate() > 95" [class.text-emerald-400]="occupancyRate() >= 85 && occupancyRate() <= 95">{{ occupancyRate() }}%</span>
                     <span class="text-xs text-slate-400" *ngIf="occupancyRate() > 95">TOO HIGH!</span>
                 </div>
                 <div class="w-full bg-slate-700 rounded-full h-1.5 mt-4 overflow-hidden">
                     <div class="bg-indigo-500 h-full transition-all duration-1000" [style.width.%]="occupancyRate()"></div>
                 </div>
                 <!-- Tooltip -->
                 <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] text-white">
                     Target: 85-92%
                 </div>
            </div>

            <!-- Smart Pricing (Tier 2+) -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                 <div class="flex justify-between items-start mb-2">
                     <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next 7 Days ADR</h3>
                     @if (!isTier0()) {
                         <span class="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">AI SUGGESTED</span>
                     }
                 </div>
                 
                 @if (isTier0()) {
                     <div class="flex flex-col items-center justify-center h-20 text-center opacity-50">
                         <span class="material-icons text-2xl mb-1">lock</span>
                         <span class="text-xs">Unlock Basic Plan</span>
                     </div>
                 } @else {
                     <div class="flex items-baseline gap-2">
                         <span class="text-4xl font-black text-white">€145</span>
                         <span class="text-xs text-emerald-400 flex items-center gap-1">
                             <span class="material-icons text-xs">trending_up</span> +12%
                         </span>
                     </div>
                     <p class="text-[10px] text-slate-400 mt-2">
                         Demand is spiking for next weekend. Recommended: <strong>raise prices by €15</strong>.
                     </p>
                 }
            </div>

            <!-- Revenue Loss Forensics (Tier 3) -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden" [class.border-rose-500]="isTier3() && lostRevenue > 0">
                 <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Revenue Opportunity</h3>
                 
                 @if (isTier3()) {
                     <div class="flex items-baseline gap-2">
                         <span class="text-4xl font-black text-rose-400">-€{{ lostRevenue }}</span>
                     </div>
                     <p class="text-[10px] text-rose-200/80 mt-2">
                         Missed revenue last month due to under-pricing weekends.
                     </p>
                     <div class="absolute -bottom-4 -right-4 text-9xl text-rose-500/10 pointer-events-none rotate-12">
                         ⚠
                     </div>
                 } @else {
                     <div class="flex flex-col items-center justify-center h-20 text-center opacity-50">
                         <span class="material-icons text-2xl mb-1">lock</span>
                         <span class="text-xs">Unlock Forensics (Gold)</span>
                     </div>
                 }
            </div>
       </div>

       <!-- VISUAL: Occupancy Heatmap (Calendar) -->
       <div class="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col">
           <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                    <span class="material-icons text-indigo-400">calendar_month</span> Occupancy Heatmap
                </h3>
                <div class="flex gap-4 text-[10px] uppercase font-bold text-slate-500">
                    <span class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-slate-800 border border-slate-700"></div> Empty</span>
                    <span class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-indigo-500/40"></div> Low Rate</span>
                    <span class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-indigo-500"></div> High Rate</span>
                    <span class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-rose-500"></div> Sold Out (Too Cheap?)</span>
                </div>
           </div>

           <div class="grid grid-cols-7 gap-1 h-full min-h-[300px]">
               <!-- Days Header -->
               <div class="text-center text-xs text-slate-500 font-bold py-2">Mon</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Tue</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Wed</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Thu</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Fri</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Sat</div>
               <div class="text-center text-xs text-slate-500 font-bold py-2">Sun</div>

               <!-- Calendar Grid -->
               @for (day of calendarDays; track day.date) {
                   <div class="relative group rounded-lg transition-all duration-300 border border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 hover:scale-105 hover:z-10"
                        [ngClass]="getDayClass(day)">
                       <span class="text-xs font-mono font-bold">{{ day.date | date:'d' }}</span>
                       <span class="text-[10px] opacity-70">€{{ day.price }}</span>
                       
                       <!-- Tooltip -->
                       <div class="absolute bottom-full mb-2 hidden group-hover:block bg-black/90 text-white text-[10px] p-2 rounded whitespace-nowrap z-20 pointer-events-none shadow-xl border border-white/10">
                           <div class="font-bold border-b border-white/10 pb-1 mb-1">{{ day.date | date:'mediumDate' }}</div>
                           <div>Status: {{ day.status }}</div>
                           <div>Price: €{{ day.price }}</div>
                           @if (isTier3() && day.status === 'Sold Out' && day.price < 120) {
                               <div class="text-rose-400 font-bold mt-1">⚠ Was Too Cheap</div>
                           }
                       </div>
                   </div>
               }
           </div>
           
           @if (isTier0()) {
               <div class="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-8">
                   <div class="p-4 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/50 mb-4 animate-bounce">
                       <span class="material-icons text-3xl text-white">visibility_off</span>
                   </div>
                   <h3 class="text-2xl font-bold text-white mb-2">Blind Pricing?</h3>
                   <p class="text-slate-300 max-w-md mb-6">You are flying blind without a visual demand calendar. Upgrade to see which dates are selling too fast (underpriced) or not at all (overpriced).</p>
               </div>
           }
       </div>

       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
            <div class="p-2 bg-indigo-500/20 rounded-full">
                <span class="text-2xl">🎓</span>
            </div>
            <div>
                <h4 class="font-bold text-indigo-300 text-sm">The 80% Occupancy Rule</h4>
                <p class="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                    Many hosts celebrate 100% occupancy. <strong>This is a mistake.</strong> It usually means you left money on the table. 
                    Aim for 80-92%. The empty nights are just proof that you pushed the price as high as the market could bear.
                </p>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class OccupancyStatsComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    occupancyRate = signal(96); // Intentionally high to trigger "Too High" warning
    lostRevenue = 450; // Mock value for Tier 3

    // Mock Calendar Data
    calendarDays = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);

        // Randomly assign status
        const rand = Math.random();
        let status = 'Available';
        let price = 100;

        if (rand > 0.7) {
            status = 'Sold Out';
            price = 90 + Math.floor(Math.random() * 20); // 90-110 (Cheap)
        } else if (rand > 0.4) {
            status = 'Booked High';
            price = 140 + Math.floor(Math.random() * 40); // 140-180 (Good)
        } else {
            status = 'Available';
            price = 120 + Math.floor(Math.random() * 30);
        }

        // Force some "bad" data for forensic demonstration
        if (i === 5) { status = 'Sold Out'; price = 85; } // Too cheap

        return {
            date,
            status,
            price
        };
    });

    getDayClass(day: any) {
        if (day.status === 'Available') return 'bg-slate-800 text-slate-400 hover:bg-slate-700';
        if (day.status === 'Booked High') return 'bg-indigo-600/80 text-white border-indigo-500 shadow-lg shadow-indigo-500/20';
        if (day.status === 'Sold Out') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
        return 'bg-slate-800';
    }
}

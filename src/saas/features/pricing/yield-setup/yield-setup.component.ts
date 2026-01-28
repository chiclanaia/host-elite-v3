import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pri-01-yield-setup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Yield Strategy Engine</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Dynamic pricing rules to maximize RevPAR.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': !isTier0()
             }">
             {{ isTier3() ? 'AI Market Demand' : (isTier2() ? 'Smart Rules' : 'Manual Rules') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Rules & Strategy -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <!-- Baseline Costs -->
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4">Baseline Strategy</h3>
                   <div class="space-y-4">
                       <div>
                           <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Break-Even Price</label>
                           <div class="text-2xl font-mono text-white">€85.00</div>
                           <p class="text-[10px] text-slate-500">Fixed costs + Cleaning / 30 nights</p>
                       </div>
                       <div>
                           <div class="flex justify-between text-xs text-slate-400 mb-2">
                               <span>Minimum Margin</span>
                               <span class="text-emerald-400 font-bold">+{{ margin() }}%</span>
                           </div>
                           <input type="range" [(ngModel)]="margin" min="0" max="100" class="w-full h-1 bg-slate-600 rounded appearance-none" [disabled]="isTier0()">
                       </div>
                   </div>
               </div>

               <!-- Advanced Rules (Tier 2) -->
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <span class="material-icons text-indigo-400">tune</span> Smart Adjustments
                   </h3>
                   
                   @if (isTier2()) {
                       <div class="space-y-3">
                           <label class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-indigo-500/50 transition-colors">
                               <div class="flex items-center gap-3">
                                   <input type="checkbox" checked class="rounded border-slate-600 text-indigo-500 focus:ring-0 bg-transparent">
                                   <div>
                                       <div class="text-sm text-white font-bold">Orphan Night Filler</div>
                                       <div class="text-[10px] text-slate-400">Discount 1-night gaps by 15%</div>
                                   </div>
                               </div>
                           </label>
                           <label class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-indigo-500/50 transition-colors">
                               <div class="flex items-center gap-3">
                                   <input type="checkbox" class="rounded border-slate-600 text-indigo-500 focus:ring-0 bg-transparent">
                                   <div>
                                       <div class="text-sm text-white font-bold">Last Minute Deal</div>
                                       <div class="text-[10px] text-slate-400">-10% within 48h arrival</div>
                                   </div>
                               </div>
                           </label>
                       </div>
                   } @else {
                       <div class="p-4 bg-indigo-900/10 rounded-lg text-center border border-indigo-500/20">
                           <p class="text-indigo-300 text-xs mb-2">Unlock Smart Rules with Silver</p>
                           <button class="text-[10px] bg-indigo-600 text-white px-3 py-1 rounded">Upgrade Now</button>
                       </div>
                   }
               </div>

               <!-- Coach -->
               <div class="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-emerald-300 font-bold text-sm uppercase">Coach Tip</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Kill the Orphans. 'Orphan nights' (1-2 day gaps) wreck occupancy. Tier 2 'Orphan Filler' automatically discounts these hard-to-sell dates."
                   </p>
               </div>
           </div>

           <!-- Right: Heatmap & Forecast -->
           <div class="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-8 flex flex-col relative overflow-hidden">
               
               <div class="flex justify-between items-center mb-8">
                   <h3 class="text-white font-bold text-lg">12-Month Demand Forecast</h3>
                   <div class="flex gap-4 text-xs">
                       <div class="flex items-center gap-2">
                           <div class="w-3 h-3 bg-slate-700 rounded-sm"></div> <span class="text-slate-400">Low</span>
                       </div>
                       <div class="flex items-center gap-2">
                           <div class="w-3 h-3 bg-emerald-500 rounded-sm"></div> <span class="text-slate-400">Good</span>
                       </div>
                       <div class="flex items-center gap-2">
                           <div class="w-3 h-3 bg-amber-500 rounded-sm"></div> <span class="text-slate-400">High</span>
                       </div>
                   </div>
               </div>

               <!-- Heatmap Bars -->
               <div class="flex-1 flex items-end justify-between gap-1 border-b border-white/10 pb-4 relative">
                   
                   @if(isTier3()) {
                       <!-- AI Projection Line Overlay -->
                       <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10" preserveAspectRatio="none">
                           <path d="M0,80 Q50,90 100,60 T200,40 T300,80 T400,20 T500,50 T600,10" 
                                 fill="none" stroke="#6366f1" stroke-width="3" stroke-dasharray="5,5" 
                                 class="opacity-60 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]"></path>
                       </svg>
                       <div class="absolute top-0 right-0 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-[10px] px-2 py-1 rounded backdrop-blur">
                           ✨ AI Predictive Demand
                       </div>
                   }

                   <!-- Bars -->
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 40%">
                       <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Jan: €95</div>
                   </div>
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 35%"></div>
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 45%"></div>
                   <div class="w-full bg-emerald-600 hover:bg-emerald-500 transition-all rounded-t relative group" style="height: 60%">
                       <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Apr: €120</div>
                   </div>
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 55%"></div>
                   <div class="w-full bg-amber-500 hover:bg-amber-400 transition-all rounded-t relative group" style="height: 80%">
                       <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Jun: €180</div>
                   </div>
                   <div class="w-full bg-amber-500 hover:bg-amber-400 transition-all rounded-t relative group" style="height: 90%"></div>
                   <div class="w-full bg-amber-500 hover:bg-amber-400 transition-all rounded-t relative group" style="height: 95%"></div>
                   <div class="w-full bg-emerald-600 hover:bg-emerald-500 transition-all rounded-t relative group" style="height: 65%"></div>
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 50%"></div>
                   <div class="w-full bg-slate-700 hover:bg-slate-600 transition-all rounded-t relative group" style="height: 40%"></div>
                   <div class="w-full bg-emerald-600 hover:bg-emerald-500 transition-all rounded-t relative group" style="height: 70%">
                       <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Dec: €140</div>
                   </div>
               </div>
               
               <div class="flex justify-between text-xs text-slate-500 mt-4 px-2 uppercase font-mono tracking-widest">
                   <span>Jan</span>
                   <span>Feb</span>
                   <span>Mar</span>
                   <span>Apr</span>
                   <span>May</span>
                   <span>Jun</span>
                   <span>Jul</span>
                   <span>Aug</span>
                   <span>Sep</span>
                   <span>Oct</span>
                   <span>Nov</span>
                   <span>Dec</span>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class YieldSetupComponent {
    feature = computed(() => ({
        id: 'PRI_01',
        name: 'Yield Setup',
        description: 'Market-Adaptive Pricing Configurator',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    margin = signal(20);
}

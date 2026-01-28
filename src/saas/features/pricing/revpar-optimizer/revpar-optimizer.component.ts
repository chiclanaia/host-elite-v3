import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pri-03-revpar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">RevPAR Speedometer</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Revenue Per Available Room optimization engine.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-amber-500/20 text-amber-300 border-amber-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Pilot Mode' : (isTier2() ? 'Smart Suggestions' : 'Manual Stats') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Rules & Toggles -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4">Optimization Rules</h3>
                   
                   <div class="space-y-3">
                       <label class="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-white/5 cursor-pointer hover:border-amber-500/50 transition-colors">
                           <div class="flex items-center gap-3">
                               <input type="checkbox" checked class="rounded border-slate-600 text-amber-500 focus:ring-0 bg-transparent">
                               <div>
                                   <div class="text-sm text-white font-bold">Gap Filler</div>
                                   <div class="text-[10px] text-slate-400">Sell 1-night gaps at -10%</div>
                               </div>
                           </div>
                       </label>
                       
                       <label class="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-white/5 cursor-pointer hover:border-amber-500/50 transition-colors">
                           <div class="flex items-center gap-3">
                               <input type="checkbox" checked class="rounded border-slate-600 text-amber-500 focus:ring-0 bg-transparent">
                               <div>
                                   <div class="text-sm text-white font-bold">Last Minute Boost</div>
                                   <div class="text-[10px] text-slate-400">Increase visibility 48h out</div>
                               </div>
                           </div>
                       </label>

                       <!-- Tier 3 Rules -->
                       <div class="p-3 bg-slate-900 rounded-lg border border-white/5 opacity-90">
                           <div class="flex items-center justify-between mb-1">
                               <div class="flex items-center gap-3">
                                   <div class="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center">
                                       <div *ngIf="isTier3()" class="h-2 w-2 bg-emerald-500 rounded-full"></div>
                                   </div>
                                   <span class="text-sm font-bold text-white">Event Auto-Surge</span>
                               </div>
                               <span *ngIf="!isTier3()" class="text-[10px] text-slate-500 border border-slate-700 rounded px-1">PRO</span>
                           </div>
                           <p class="text-[10px] text-slate-500 ml-7">Automatically raise rates for detected events > 20k attendees.</p>
                       </div>
                   </div>
               </div>

                <!-- Simulation Config -->
                <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                    <h3 class="text-white font-bold mb-4 text-sm">Sensitivity Analysis</h3>
                    <div>
                        <div class="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Aggression Level</span>
                            <span class="text-amber-400 font-bold">High</span>
                        </div>
                        <input type="range" class="w-full h-1 bg-slate-600 rounded appearance-none" min="1" max="5" value="4">
                        <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Safe</span>
                            <span>Risky</span>
                        </div>
                    </div>
                </div>

               <!-- Coach -->
               <div class="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-amber-300 font-bold text-sm uppercase">Coach Tip</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "RevPAR is King. It's better to sell a €100 room at €80 than let it sit empty (€0). Our 'Gap Filler' rule ensures zero vacancy."
                   </p>
               </div>
           </div>

           <!-- Right: Speedometer & Stats -->
           <div class="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-8 flex flex-col relative overflow-hidden">
               
               <div class="flex justify-between items-center mb-6">
                   <h3 class="text-white font-bold text-lg">Daily Performance Pulse</h3>
                   @if(isTier3()) {
                       <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded shadow-lg animate-pulse" data-debug-id="revpar-autopilot-btn">
                           ✨ Auto-Pilot Active
                       </button>
                   }
               </div>

               <!-- Speedometer Visual -->
               <div class="flex-1 flex flex-col items-center justify-center relative">
                   <div class="relative w-64 h-32 overflow-hidden mb-6">
                       <!-- Gauge Arc -->
                       <div class="absolute w-64 h-64 rounded-full border-[20px] border-slate-700 box-border top-0 left-0"></div>
                       <div class="absolute w-64 h-64 rounded-full border-[20px] border-transparent border-t-emerald-500 border-r-amber-500 border-l-red-500 top-0 left-0 rotate-[-45deg]" style="clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); transform: rotate(-180deg);"></div>
                       
                       <!-- Needle -->
                       <div class="absolute bottom-0 left-1/2 w-1 h-28 bg-white origin-bottom transition-transform duration-1000 ease-out z-10 shadow-lg"
                            [style.transform]="'translateX(-50%) rotate(' + (revParScore() * 1.8 - 90) + 'deg)'"></div>
                       <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-slate-200 rounded-full z-20 shadow-xl"></div>
                   </div>

                   <div class="text-center z-10 -mt-4">
                       <div class="text-sm text-slate-400 uppercase font-bold mb-1">Current RevPAR</div>
                       <div class="text-5xl font-mono text-white font-bold mb-2">€{{ currentRevPar() }}</div>
                       <div class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30">
                           ↑ 14% vs Market Avg
                       </div>
                   </div>
               </div>

               <!-- Key Metrics -->
               <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                   <div class="text-center border-r border-white/10">
                       <div class="text-xs text-slate-500 uppercase mb-1">Occ Rate</div>
                       <div class="text-xl font-bold text-white">82%</div>
                   </div>
                   <div class="text-center border-r border-white/10">
                       <div class="text-xs text-slate-500 uppercase mb-1">ADR</div>
                       <div class="text-xl font-bold text-white">€145</div>
                   </div>
                   <div class="text-center">
                       <div class="text-xs text-slate-500 uppercase mb-1">Proj. Rev</div>
                       <div class="text-xl font-bold text-emerald-400">€3,520</div>
                   </div>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class RevparOptimizerComponent {
    feature = computed(() => ({
        id: 'PRI_03',
        name: 'RevPAR Optimizer',
        description: 'AI-Driven Dynamic Pricing Algorithm',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    currentRevPar = signal(118);
    revParScore = signal(75); // 0-100 for gauge
}

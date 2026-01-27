import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
  selector: 'fin-00-profitability-suite',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header with Pedagogical Objective -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        
        <!-- Coach / Pedagogical Tooltip -->
        <div class="relative group">
            <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono cursor-help flex items-center gap-2">
               <span class="text-lg">🎓</span> Diversification
            </div>
            <div class="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
               <h4 class="text-white font-bold mb-1">Strategic Vision</h4>
               <p class="text-slate-400 text-xs leading-relaxed">
                   Investors often fail by viewing properties in isolation. This suite teaches the 'Portfolio mindset,' showing how macro-trends and micro-decisions intersect over a 10-year horizon.
               </p>
            </div>
        </div>
      </div>

      <!-- Tier-Based Content -->
      @if (tier() === 'TIER_0' || tier() === 'Freemium') {
         <!-- TIER 0: Dashboard Sandbox (Static Data) -->
         <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4 flex items-center gap-3">
            <span class="text-amber-500 text-xl">⚠️</span>
            <p class="text-amber-200 text-sm">Sandbox Mode: Viewing static sample data. Upgrade to connect your real properties.</p>
         </div>
      }

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        
        <!-- ROI Card -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div class="absolute top-0 right-0 p-4 opacity-50"><span class="material-icons text-white/10 text-4xl">trending_up</span></div>
          <h3 class="text-xl font-bold text-white mb-4">Portfolio ROI</h3>
          <div class="h-32 flex items-center justify-center flex-col">
            <div class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                {{ isSandbox() ? '8.5%' : '0.0%' }}
            </div>
            <span class="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span class="text-lg">↑</span> 1.2% vs Market
            </span>
          </div>
          <p class="text-sm text-slate-500 text-center">Net Yield (Simulated)</p>
        </div>

        <!-- Equity Growth Card -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div class="absolute top-0 right-0 p-4 opacity-50"><span class="material-icons text-white/10 text-4xl">savings</span></div>
          <h3 class="text-xl font-bold text-white mb-4">Equity Growth</h3>
          <div class="h-32 flex items-center justify-center flex-col">
             <div class="text-4xl font-bold text-blue-400">
                {{ isSandbox() ? '+€12,400' : '€0' }}
             </div>
             <span class="text-xs text-blue-300/60 mt-2">Year 1 Projection</span>
          </div>
           <p class="text-sm text-slate-500 text-center">Principal Paydown</p>
        </div>

        <!-- Tax Burden Card -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div class="absolute top-0 right-0 p-4 opacity-50"><span class="material-icons text-white/10 text-4xl">account_balance</span></div>
          <h3 class="text-xl font-bold text-white mb-4">Tax Efficiency</h3>
           <div class="h-32 flex items-center justify-center flex-col">
             <div class="text-3xl font-bold text-amber-400">
                 {{ isSandbox() ? 'Micro-BIC' : 'N/A' }}
             </div>
             <div class="w-full bg-white/10 rounded-full h-1.5 mt-4 overflow-hidden">
                 <div class="bg-amber-400 h-full" style="width: 70%"></div>
             </div>
          </div>
           <p class="text-sm text-slate-500 text-center">Tax Burden Heatmap</p>
        </div>

        <!-- Main Chart Area (Heat Map / Consolidated View) -->
        <div class="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1 min-h-[300px] flex flex-col relative overflow-hidden">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span class="material-icons text-slate-400">map</span> 10-Year Heat Map
            </h3>
            
            @if (isTier3() || isSandbox()) {
                 <!-- Fake Heatmap Visual for Demo -->
                 <div class="flex-1 w-full grid grid-cols-12 gap-1 opacity-80">
                    @for (year of [1,2,3,4,5,6,7,8,9,10]; track year) {
                        <div class="col-span-1 rounded bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors flex items-end justify-center pb-2 text-xs text-slate-400 h-full relative group cursor-pointer">
                             <div class="absolute bottom-0 w-full bg-emerald-500" [style.height.%]="year * 8 + 20"></div>
                             <span class="relative z-10 font-bold text-white mix-blend-difference">Y{{year}}</span>
                             
                             <!-- Tooltip -->
                             <div class="absolute bottom-full mb-2 bg-black text-white text-xs p-2 rounded hidden group-hover:block whitespace-nowrap z-20">
                                Year {{year}}: +{{year * 8 + 20}}% Equity
                             </div>
                        </div>
                    }
                     <!-- Remaining columns filler if needed -->
                 </div>
                 
                 @if (isTier3()) {
                    <div class="mt-4 flex justify-end">
                         <button class="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/50 rounded-lg hover:bg-rose-500/30 transition-colors text-xs font-bold flex items-center gap-2">
                            <span class="text-lg">⚡</span> Run Stress Test (-20% Market)
                         </button>
                    </div>
                 }
            } @else {
                <!-- Locked State for Tier 1/2 -->
                <div class="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <span class="text-3xl">🔒</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Predictive Command Center Locked</h3>
                    <p class="text-slate-400 max-w-md mb-6">Aggregate real-time portfolio data and simulate 10-year market cycles with the Expert Tier.</p>
                    <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25">
                        Upgrade to Expert
                    </button>
                </div>
            }
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
export class ProfitabilitySuiteComponent {
  feature = input.required<Feature>();
  session = inject(SessionStore);

  // Computed Properties
  tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

  isSandbox = computed(() => this.tier() === 'TIER_0' || this.tier() === 'Freemium');
  isTier3 = computed(() => this.tier() === 'TIER_3' || this.tier() === 'Gold');
}

import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

type Ecosystem = 'urban' | 'ski' | 'coastal' | 'rural';
type Residency = 'resident' | 'non-resident-eu' | 'non-resident-global';

@Component({
  selector: 'fin-00-profitability-suite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Investment Thesis Advisor</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Strategic onboarding to define your Investor Profile and Eco-system.</p>
        </div>
        <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
           <span>⚡</span> Start Here
        </div>
      </div>

      <!-- Coach Tip -->
      <div class="p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
           <div class="flex items-center gap-2 mb-1">
               <span class="text-lg">💡</span>
               <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
           </div>
           <p class="text-slate-300 text-xs italic">
               "Strategy precedes math. Beginners look for 'properties'; experts build 'theses'. Your tax residency determines your buying power more than the property price."
           </p>
       </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <!-- Left: Input Engine -->
          <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
              <!-- Step 1: Residency -->
              <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase mb-2">1. Where do you pay taxes?</label>
                  <div class="grid grid-cols-1 gap-2">
                       <button (click)="residency.set('resident')" [class.bg-indigo-600]="residency() === 'resident'" class="p-3 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group" data-debug-id="fin-00-res-resident">
                           <span class="text-xl">🇫🇷</span>
                           <div>
                               <div class="text-white font-bold text-sm">France (Resident)</div>
                               <div class="text-[10px] text-slate-500 group-hover:text-slate-300">LTV up to 110% available</div>
                           </div>
                       </button>
                       <button (click)="residency.set('non-resident-eu')" [class.bg-indigo-600]="residency() === 'non-resident-eu'" class="p-3 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group" data-debug-id="fin-00-res-eu">
                           <span class="text-xl">🇪🇺</span>
                           <div>
                               <div class="text-white font-bold text-sm">EU Resident (Non-French)</div>
                               <div class="text-[10px] text-slate-500 group-hover:text-slate-300">LTV capped at 70-80%</div>
                           </div>
                       </button>
                       <button (click)="residency.set('non-resident-global')" [class.bg-indigo-600]="residency() === 'non-resident-global'" class="p-3 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group" data-debug-id="fin-00-res-global">
                           <span class="text-xl">🌎</span>
                           <div>
                               <div class="text-white font-bold text-sm">Non-Resident (Global)</div>
                               <div class="text-[10px] text-slate-500 group-hover:text-slate-300">Strict LTV cap (50-60%)</div>
                           </div>
                       </button>
                  </div>
              </div>

               <!-- Step 2: Ecosystem (Tier 2+) -->
               <div [class.opacity-50]="!isTier2OrAbove()" [class.pointer-events-none]="!isTier2OrAbove()">
                   <div class="flex justify-between mb-2">
                       <label class="block text-xs font-bold text-slate-400 uppercase">2. Target Ecosystem</label>
                        @if (!isTier2OrAbove()) { <span class="text-[10px] text-amber-400 border border-amber-400/30 px-1.5 rounded">SILVER +</span> }
                   </div>
                  <div class="grid grid-cols-2 gap-2">
                       <button (click)="ecosystem.set('urban')" [class.ring-2]="ecosystem() === 'urban'" class="p-3 rounded-lg bg-slate-700/50 border border-white/5 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2" data-debug-id="fin-00-eco-urban">
                           <span class="text-2xl">🏙️</span>
                           <span class="text-xs text-white">Urban</span>
                       </button>
                        <button (click)="ecosystem.set('ski')" [class.ring-2]="ecosystem() === 'ski'" class="p-3 rounded-lg bg-slate-700/50 border border-white/5 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2" data-debug-id="fin-00-eco-ski">
                           <span class="text-2xl">🏔️</span>
                           <span class="text-xs text-white">Ski</span>
                       </button>
                        <button (click)="ecosystem.set('coastal')" [class.ring-2]="ecosystem() === 'coastal'" class="p-3 rounded-lg bg-slate-700/50 border border-white/5 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2" data-debug-id="fin-00-eco-coastal">
                           <span class="text-2xl">🏖️</span>
                           <span class="text-xs text-white">Coastal</span>
                       </button>
                        <button (click)="ecosystem.set('rural')" [class.ring-2]="ecosystem() === 'rural'" class="p-3 rounded-lg bg-slate-700/50 border border-white/5 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2" data-debug-id="fin-00-eco-rural">
                           <span class="text-2xl">🏡</span>
                           <span class="text-xs text-white">Rural</span>
                       </button>
                  </div>
               </div>
          </div>

          <!-- Right: Feasibility Output -->
          <div class="bg-black rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden">
               <h3 class="text-xl font-bold text-white mb-6 z-10">Strategy Radar</h3>
               
               <!-- Tier 3 Radar Chart (Simulated) -->
                @if (isTier3()) {
                   <div class="flex-1 flex items-center justify-center relative z-10">
                        <!-- Pseudo Radar Chart -->
                        <div class="relative w-64 h-64">
                            <!-- Axis Lines -->
                            <div class="absolute inset-0 flex items-center justify-center"><div class="w-full h-px bg-slate-700"></div></div>
                            <div class="absolute inset-0 flex items-center justify-center"><div class="h-full w-px bg-slate-700"></div></div>
                            <div class="absolute inset-0 flex items-center justify-center"><div class="w-full h-px bg-slate-700 rotate-45"></div></div>
                            <div class="absolute inset-0 flex items-center justify-center"><div class="h-full w-px bg-slate-700 rotate-45"></div></div>
                            
                            <!-- Radar Shape (Polygon) -->
                            <!-- Points: Cashflow(Top), Apprec(Right), Reg(BotRight), Fin(BotLeft), Tax(Left) -->
                            <!-- Just a rough SVG for visual check -->
                           <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                               <polygon points="50,10 90,40 70,90 30,90 10,40" fill="rgba(16, 185, 129, 0.2)" stroke="#34D399" stroke-width="2" />
                           </svg>
                           
                           <!-- Labels -->
                           <span class="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-[10px] text-emerald-400 uppercase font-bold">Cashflow</span>
                           <span class="absolute top-[30%] right-0 -mr-8 text-[10px] text-emerald-400 uppercase font-bold">Appreciation</span>
                           <span class="absolute bottom-0 right-[20%] text-[10px] text-emerald-400 uppercase font-bold">Regulation</span>
                           <span class="absolute bottom-0 left-[20%] text-[10px] text-emerald-400 uppercase font-bold">Financing</span>
                           <span class="absolute top-[30%] left-0 -ml-8 text-[10px] text-emerald-400 uppercase font-bold">Tax</span>
                        </div>
                   </div>
                   
                   <div class="mt-6 flex justify-between z-10">
                       <div class="text-center">
                           <div class="text-2xl font-bold text-white">85<span class="text-sm text-slate-500">/100</span></div>
                           <div class="text-[10px] text-slate-400 uppercase">Thesis Score</div>
                       </div>
                        <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg flex items-center gap-2" data-debug-id="fin-00-export-thesis">
                           <span class="material-icons text-sm">picture_as_pdf</span> Export Strategy
                       </button>
                   </div>
                } @else {
                    <div class="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover opacity-10 blur-sm"></div>
                    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                            <span class="text-2xl text-white font-bold">🔒</span>
                        </div>
                        <h3 class="text-white font-bold mb-2">Unlock Virtual Banker</h3>
                        <p class="text-slate-400 text-xs max-w-xs mb-6">Expert Tier analyzes your residency + ecosystem to generate a 'Bank-Ready' Investment Thesis PDF.</p>
                         <button class="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-transform" data-debug-id="fin-00-upgrade-btn">
                            Upgrade to Gold
                        </button>
                    </div>
                }
          </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; }`]
})
export class ProfitabilitySuiteComponent {
  feature = input.required<Feature>();
  session = inject(SessionStore);

  tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
  isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3', 'Silver', 'Gold'].includes(this.tier()));
  isTier3 = computed(() => ['TIER_3', 'Gold'].includes(this.tier()));

  residency = signal<Residency>('resident');
  ecosystem = signal<Ecosystem>('urban');
}

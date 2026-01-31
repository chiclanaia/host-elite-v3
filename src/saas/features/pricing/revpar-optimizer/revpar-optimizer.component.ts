import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'pri-02-revpar',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'REVPAR.RevparSpeedometer' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'REVPAR.RevenuePerAvailableRoomOptimization' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Pilot Mode' : (isTier2() ? 'Smart Suggestions' : 'Manual Stats') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Rules & Toggles -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                       <span class="material-icons text-amber-400 text-sm">settings_suggest</span>
                       {{ 'REVPAR.OptimizationRules' | translate }}
                   </h3>
                   
                   <div class="space-y-4">
                       <label class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-amber-500/50 transition-all group">
                           <div class="flex items-center gap-4">
                               <input type="checkbox" checked class="h-5 w-5 rounded border-slate-600 text-amber-500 focus:ring-0 bg-transparent">
                               <div>
                                   <div class="text-sm text-white font-bold group-hover:text-amber-300 transition-colors">{{ 'REVPAR.GapFiller' | translate }}</div>
                                   <div class="text-[10px] text-slate-400">{{ 'REVPAR.Sell1nightGapsAt10' | translate }}</div>
                               </div>
                           </div>
                       </label>
                       
                       <label class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-amber-500/50 transition-all group">
                           <div class="flex items-center gap-4">
                               <input type="checkbox" checked class="h-5 w-5 rounded border-slate-600 text-amber-500 focus:ring-0 bg-transparent">
                               <div>
                                   <div class="text-sm text-white font-bold group-hover:text-amber-300 transition-colors">{{ 'REVPAR.LastMinuteBoost' | translate }}</div>
                                   <div class="text-[10px] text-slate-400">{{ 'REVPAR.IncreaseVisibility48hOut' | translate }}</div>
                               </div>
                           </div>
                       </label>

                       <!-- Tier 3 Rules -->
                       <div class="p-4 bg-slate-900 rounded-xl border border-white/5 group relative overflow-hidden" [class.opacity-50]="!isTier3()">
                           <div class="flex items-center justify-between mb-2">
                               <div class="flex items-center gap-4">
                                   <div class="h-5 w-5 rounded-md border border-slate-600 flex items-center justify-center transition-all"
                                        [class.bg-emerald-500]="isTier3()" [class.border-emerald-500]="isTier3()">
                                       @if(isTier3()) { <span class="material-icons text-white text-[10px]">check</span> }
                                   </div>
                                   <span class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{{ 'REVPAR.EventAutosurge' | translate }}</span>
                               </div>
                               @if(!isTier3()) {
                                   <span class="material-icons text-slate-600 text-xs">lock</span>
                               }
                           </div>
                           <p class="text-[10px] text-slate-500 ml-9">Automatically raise rates for detected events > 20k attendees.</p>
                       </div>
                   </div>
               </div>

                <!-- Simulation Config -->
                <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                    <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                        <span class="material-icons text-amber-400 text-sm">bolt</span>
                        {{ 'REVPAR.SensitivityAnalysis' | translate }}
                    </h3>
                    <div class="p-4 bg-black/20 rounded-xl">
                        <div class="flex justify-between text-[10px] text-slate-400 mb-3 uppercase tracking-tighter">
                            <span>{{ 'REVPAR.AggressionLevel' | translate }}</span>
                            <span class="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">{{ aggressionLabel() }}</span>
                        </div>
                        <input type="range" [(ngModel)]="aggression" (input)="updateStats()" class="w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-amber-500" min="1" max="5">
                        <div class="flex justify-between text-[9px] text-slate-600 mt-2 font-bold">
                            <span>{{ 'REVPAR.Safe' | translate }}</span>
                            <span>{{ 'REVPAR.Risky' | translate }}</span>
                        </div>
                    </div>
                </div>

               <!-- Coach -->
               <div class="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl relative overflow-hidden">
                    <div class="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12">
                        <span class="material-icons text-6xl text-amber-400">trending_up</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-amber-400 font-bold text-[10px] uppercase tracking-widest">{{ 'REVPAR.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-400 text-[11px] leading-relaxed italic">
                        "RevPAR is King. It's better to sell a €100 room at €80 than let it sit empty (€0). Our 'Gap Filler' rule ensures zero vacancy."
                    </p>
               </div>
           </div>

           <!-- Right: Speedometer & Stats -->
           <div class="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-white/10 p-10 flex flex-col relative overflow-hidden shadow-2xl">
                
                <div class="flex justify-between items-center mb-10">
                    <div>
                        <h3 class="text-white font-bold text-xl tracking-tight">{{ 'REVPAR.DailyPerformancePulse' | translate }}</h3>
                        <p class="text-xs text-slate-500 mt-1">Real-time revenue efficiency metrics</p>
                    </div>
                    @if(isTier3()) {
                        <button class="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                            ✨ AUTO-PILOT ACTIVE
                        </button>
                    }
                </div>

                <!-- Speedometer Visual -->
                <div class="flex-1 flex flex-col items-center justify-center relative py-10">
                    <div class="relative w-80 h-40 overflow-hidden group">
                        <!-- Gauge Background -->
                        <div class="absolute w-80 h-80 rounded-full border-[25px] border-slate-800/50 box-border top-0 left-0"></div>
                        <!-- Gauge Active -->
                        <div class="absolute w-80 h-80 rounded-full border-[25px] border-transparent border-t-emerald-500 border-r-amber-500 border-l-rose-500 top-0 left-0 rotate-[-45deg] transition-all duration-1000 ease-out" 
                             style="clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); transform: rotate(-180deg);"
                             [style.filter]="'hue-rotate(' + (revParScore() - 75) + 'deg)'"></div>
                        
                        <!-- Needle -->
                        <div class="absolute bottom-0 left-1/2 w-1.5 h-32 bg-white origin-bottom transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                             [style.transform]="'translateX(-50%) rotate(' + (revParScore() * 1.8 - 90) + 'deg)'">
                            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-slate-200 rounded-full z-20 shadow-2xl border-4 border-slate-900"></div>
                    </div>

                    <div class="text-center z-10 mt-6 animate-fade-in">
                        <div class="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">{{ 'REVPAR.CurrentRevpar' | translate }}</div>
                        <div class="text-6xl font-mono text-white font-bold mb-4 tracking-tighter">€{{ currentRevPar() }}</div>
                        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                            <span class="material-icons text-sm">trending_up</span>
                            ↑ 14.2% VS MARKET AVG
                        </div>
                    </div>
                </div>

                <!-- Key Metrics -->
                <div class="grid grid-cols-3 gap-8 mt-10 pt-8 border-t border-white/5">
                    <div class="text-center border-r border-white/5">
                        <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{{ 'REVPAR.OccRate' | translate }}</div>
                        <div class="text-2xl font-mono font-bold text-white">{{ occRate() }}%</div>
                    </div>
                    <div class="text-center border-r border-white/5">
                        <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">AVG DAILY RATE</div>
                        <div class="text-2xl font-mono font-bold text-white">€{{ adr() }}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{{ 'REVPAR.ProjRev' | translate }}</div>
                        <div class="text-2xl font-mono font-bold text-emerald-400">€{{ projRev().toLocaleString() }}</div>
                    </div>
                </div>
            </div>
       </div>
    </div>
    `,
    styles: [`
        :host { display: block; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px; width: 16px; border-radius: 50%;
            background: #f59e0b; cursor: pointer;
            box-shadow: 0 0 10px rgba(245,158,11,0.3);
            border: 2px solid #0f172a;
        }
    `]
})
export class RevparOptimizerComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'PRI_02',
        name: this.translate.instant('REVPOPTI.Title'),
        description: this.translate.instant('REVPOPTI.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    currentRevPar = signal(118);
    revParScore = signal(75);
    aggression = signal(4);

    occRate = signal(82);
    adr = signal(145);
    projRev = signal(3520);

    aggressionLabel = computed(() => {
        const labels = ['', 'Conservative', 'Balanced', 'Optimized', 'Aggressive', 'Risky'];
        return labels[this.aggression()];
    });

    updateStats() {
        // Dynamic simulation based on aggression
        const factor = this.aggression() / 4;
        const baseAdr = 145;
        const baseOcc = 82;

        const newAdr = Math.round(baseAdr * factor);
        const newOcc = Math.round(baseOcc / (factor * 0.9));

        this.adr.set(newAdr);
        this.occRate.set(Math.min(100, newOcc));

        const revpar = Math.round((newAdr * this.occRate()) / 100);
        this.currentRevPar.set(revpar);
        this.revParScore.set(Math.min(100, Math.max(0, (revpar / 200) * 100)));
        this.projRev.set(revpar * 30);
    }
}

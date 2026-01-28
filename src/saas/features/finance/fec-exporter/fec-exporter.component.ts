import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-06-fec-exporter',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Audit-Proof Exporter (FEC)</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">France demands the 'Fichier des Écritures Comptables' (FEC). One mistake, and your accounts are rejected.</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Basic Export' : (isTier3() ? 'Compliance Shield' : 'Tagging Engine') }}
         </div>
      </div>

       <!-- Main Dashboard -->
       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
           
           <!-- COL 1: Audit Readiness Score (Visual) -->
           <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
               <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Audit Readiness</h3>
               
               <!-- Gauge Chart (CSS) -->
               <div class="relative w-48 h-24 overflow-hidden mb-4">
                   <div class="absolute w-full h-full bg-slate-700 rounded-t-full origin-bottom"></div>
                   <div class="absolute w-full h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-t-full origin-bottom transition-transform duration-1000 ease-out"
                        [style.transform]="'rotate(' + ((readinessScore() / 100) * 180 - 180) + 'deg)'"></div>
               </div>
               <div class="text-5xl font-black text-white mb-2">{{ readinessScore() }}%</div>
               <div class="text-xs text-slate-400 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">
                   {{ getScoreLabel() }}
               </div>

               <!-- Tier 3 Validator -->
               @if (isTier3()) {
                   <div class="mt-8 w-full">
                       <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
                           <span>Receipts Match</span>
                           <span class="text-emerald-400">100%</span>
                       </div>
                       <div class="w-full h-1 bg-slate-700 rounded-full mb-4 overflow-hidden">
                           <div class="h-full bg-emerald-500 w-full"></div>
                       </div>
                       
                       <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
                           <span>VAT Sequencing</span>
                           <span class="text-amber-400">98%</span>
                       </div>
                       <div class="w-full h-1 bg-slate-700 rounded-full mb-4 overflow-hidden">
                           <div class="h-full bg-amber-500 w-[98%]"></div>
                       </div>
                   </div>
               }
           </div>

           <!-- COL 2: Transaction Tagging (Tier 2 Action) -->
           <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden">
               <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                   <span class="material-icons text-indigo-400">label</span> Smart Tagger
               </h3>
               
               <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                   <!-- Item 1 -->
                   <div class="p-3 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors group">
                       <div class="flex justify-between items-start mb-2">
                           <span class="text-xs text-slate-300 font-medium">Leroy Merlin - Kitchen</span>
                           <span class="text-xs text-slate-500">-€450.00</span>
                       </div>
                       <div class="flex gap-2">
                           <button class="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] text-white">Renovation</button>
                           <button class="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300">Furniture</button>
                       </div>
                   </div>
                   
                   <!-- Item 2 -->
                   <div class="p-3 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors">
                       <div class="flex justify-between items-start mb-2">
                           <span class="text-xs text-slate-300 font-medium">Uber Eats (Misc)</span>
                           <span class="text-xs text-slate-500">-€25.00</span>
                       </div>
                       <div class="flex gap-2">
                           <button class="px-2 py-1 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 rounded text-[10px] border border-rose-500/30">Reject (Personal)</button>
                       </div>
                   </div>

                   <!-- Item 3 -->
                   <div class="p-3 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors">
                       <div class="flex justify-between items-start mb-2">
                           <span class="text-xs text-slate-300 font-medium">EDF Energy</span>
                           <span class="text-xs text-slate-500">-€85.00</span>
                       </div>
                       <div class="flex gap-2 items-center">
                           <div class="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-[10px] border border-emerald-500/30 flex items-center gap-1">
                               <span class="material-icons text-[10px]">check</span> Auto-Tagged: Utilities
                           </div>
                       </div>
                   </div>
               </div>

               @if (isTier0()) {
                   <div class="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                       <span class="text-3xl mb-2">🤖</span>
                       <h3 class="text-sm font-bold text-white mb-2">Automate Your Books</h3>
                       <p class="text-xs text-slate-400 mb-4">Let AI categorize your bank feed automatically.</p>
                       <div class="px-3 py-1 bg-indigo-600 rounded text-[10px] font-bold text-white">Silver Feature</div>
                   </div>
               }
           </div>

           <!-- COL 3: Action & Export -->
           <div class="flex flex-col gap-6">
               <!-- FEC Generator Card -->
               <div class="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-500/20 relative overflow-hidden group hover:shadow-indigo-500/40 transition-all cursor-pointer" (click)="generateFEC()">
                   <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                   
                   <div class="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                       <div>
                           <div class="flex items-center gap-2 mb-2">
                               <span class="material-icons text-white/80">file_download</span>
                               <span class="text-xs font-mono bg-black/20 px-2 py-0.5 rounded text-white/70">.txt</span>
                           </div>
                           <h3 class="text-2xl font-bold text-white">Generate FEC</h3>
                           <p class="text-indigo-200 text-xs mt-1">Fiscal Year 2024</p>
                       </div>
                       
                       <div class="flex items-center justify-between mt-4">
                           <span class="text-xs font-bold text-white bg-black/20 px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:text-indigo-600 transition-colors">START EXPORT</span>
                           @if (isExporting()) {
                               <span class="material-icons animate-spin text-white">sync</span>
                           }
                       </div>
                   </div>
               </div>

               <!-- Coach -->
               <div class="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div class="flex items-start gap-3 h-full">
                       <span class="text-xl">⚖️</span>
                       <div>
                           <h4 class="font-bold text-indigo-300 text-sm">The Cost of Messy Books</h4>
                           <p class="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                               A rejected FEC file during a tax audit triggers an <strong>automatic taxation on turnover</strong> (not profit) plus a 40% penalty. 
                               Ensure your "Readiness Score" is 100% before exporting.
                           </p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class FecExporterComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    isExporting = signal(false);
    readinessScore = computed(() => this.isTier3() ? 92 : 45); // Mock scores based on tier

    getScoreLabel() {
        const score = this.readinessScore();
        if (score >= 90) return 'Audit Ready';
        if (score >= 70) return 'Needs Review';
        return 'High Risk';
    }

    generateFEC() {
        if (this.isExporting()) return;
        this.isExporting.set(true);
        // Simulate export process
        setTimeout(() => {
            this.isExporting.set(false);
            // Ideally trigger download or success toast here
        }, 2000);
    }
}

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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2">{{ feature().description }}</p>
        </div>
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border-indigo-500/30">
            {{ isTier3() ? 'Direct Sync' : 'CSV Export' }}
         </div>
      </div>

      <!-- Main Action Area -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Export Card -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
              <div class="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <span class="material-icons text-emerald-400 text-4xl">description</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">FEC File Generator</h3>
              <p class="text-slate-400 text-sm max-w-xs mb-8">Generate your compliant "Fichier des Écritures Comptables" for French tax audits.</p>
              
              <div class="flex flex-col gap-3 w-full max-w-xs">
                  <button (click)="export('2024')" class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all group">
                      <span class="material-icons group-hover:animate-bounce">download</span> Export 2024 (Txt)
                  </button>
                  <button (click)="export('2023')" class="w-full bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 py-3 rounded-lg text-sm transition-all">
                      Export 2023 Archive
                  </button>
              </div>

               @if (lastExport()) {
                  <div class="mt-6 text-xs text-emerald-400 flex items-center gap-1 animate-fade-in">
                      <span class="material-icons text-sm">check_circle</span> Generated successfully
                  </div>
              }
          </div>

          <!-- Configuration / Tier 3 Sync -->
          <div class="flex flex-col gap-6">
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Accounting Status</h3>
                   <div class="flex justify-between items-center py-3 border-b border-white/5">
                       <span class="text-slate-300">Journal Balance</span>
                       <span class="text-emerald-400 font-mono">0.00 € (OK)</span>
                   </div>
                    <div class="flex justify-between items-center py-3 border-b border-white/5">
                       <span class="text-slate-300">Missing Receipts</span>
                       <span class="text-rose-400 font-bold">2 items</span>
                   </div>
                   <div class="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-200 text-xs flex items-start gap-2">
                       <span class="material-icons text-sm">warning</span>
                       Two transactions are missing proof. FEC export will be flagged as incomplete.
                   </div>
               </div>

               <!-- Tier 3 Direct Sync -->
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 group">
                    <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                        <span class="material-icons text-indigo-400">sync</span> Software Sync
                    </h3>
                    
                    @if (isTier3()) {
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer transition-colors">
                                <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">QB</div>
                                <span class="text-slate-300 flex-1">Quickbooks</span>
                                <span class="text-xs text-emerald-400">Connected</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5 opacity-50 cursor-not-allowed">
                                <div class="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-xs font-bold text-white">X</div>
                                <span class="text-slate-300 flex-1">Xero</span>
                                <span class="text-xs text-slate-500">Connect</span>
                            </div>
                        </div>
                    } @else {
                        <div class="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                            <span class="text-2xl mb-2">🔒</span>
                            <h3 class="text-sm font-bold text-white mb-2">Automate Accounting</h3>
                            <p class="text-xs text-slate-400 mb-4">Sync directly with Quickbooks, Xero, or Pennylane.</p>
                            <button class="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 transition-colors">Upgrade</button>
                        </div>
                    }
               </div>
          </div>
      </div>

       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div class="flex items-start gap-3">
               <span class="text-xl">⚖️</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">French Compliance</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">The FEC is mandatory for any commercial activity in France (LMNP/LMP). Failure to produce it during an audit can result in a rejection of ALL your accounts. Keep it safe.</p>
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
export class FecExporterComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    lastExport = signal<boolean>(false);

    export(year: string) {
        // Mock Export
        this.lastExport.set(true);
        setTimeout(() => this.lastExport.set(false), 3000);
    }
}

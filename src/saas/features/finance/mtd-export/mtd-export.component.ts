import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-07-mtd-export',
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
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'HMRC API Bridge' : 'Manual Mode' }}
         </div>
      </div>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Submission Area -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
              <div class="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 relative">
                  <span class="material-icons text-indigo-400 text-4xl">backup</span>
                  @if (isTier3()) {
                      <div class="absolute top-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                          <span class="material-icons text-[10px] text-white">link</span>
                      </div>
                  }
              </div>
              
              <h3 class="text-xl font-bold text-white mb-2">Making Tax Digital (MTD)</h3>
              <p class="text-slate-400 text-sm max-w-xs mb-8">Quarterly submission for UK VAT and Income Tax. Ensure "Digital Links" are preserved.</p>
              
              @if (isTier3()) {
                   <div class="w-full max-w-xs space-y-3">
                       <button (click)="submitToHmrc()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20" data-debug-id="mtd-submit-btn">
                           <span class="material-icons">cloud_upload</span> Submit Q1 2025
                       </button>
                       <div class="flex justify-between text-xs text-slate-500 px-2">
                           <span>Next Deadline:</span>
                           <span class="text-amber-400">07 April</span>
                       </div>
                   </div>
                   
                   @if (submissionStatus()) {
                       <div class="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 animate-fade-in text-left">
                           <span class="material-icons text-emerald-400">verified</span>
                           <div>
                               <p class="text-xs font-bold text-emerald-300">Submission Accepted</p>
                               <p class="text-[10px] text-emerald-200/70">Receipt: IR-MARK-23948230</p>
                           </div>
                       </div>
                   }
              } @else {
                  <div class="w-full max-w-xs space-y-3">
                       <button class="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all" data-debug-id="mtd-download-csv-btn">
                           <span class="material-icons">table_view</span> Download CSV (HMRC Ready)
                       </button>
                       <p class="text-[10px] text-slate-500 mt-2">Manual upload required via HMRC workaround.</p>
                  </div>
              }
          </div>

          <!-- Compliance Checklist -->
          <div class="flex flex-col gap-6">
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Digital Audit Trail</h3>
                   
                   <div class="space-y-4">
                       <div class="flex items-center gap-3">
                           <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                               <span class="material-icons text-emerald-400 text-xs">check</span>
                           </div>
                           <span class="text-sm text-slate-300">Bank Feed Connected</span>
                       </div>
                       <div class="flex items-center gap-3">
                           <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                               <span class="material-icons text-emerald-400 text-xs">check</span>
                           </div>
                           <span class="text-sm text-slate-300">Digital Receipts Matched (98%)</span>
                       </div>
                       <div class="flex items-center gap-3 opacity-50">
                           <div class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                               <span class="material-icons text-slate-400 text-xs">hourglass_empty</span>
                           </div>
                           <span class="text-sm text-slate-300">VAT Return Calculated</span>
                       </div>
                   </div>
               </div>
               
               <!-- Tier 3 Feature Lock Teaser -->
               @if (!isTier3()) {
                   <div class="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-4 opacity-10">
                           <span class="material-icons text-6xl text-white">api</span>
                       </div>
                       <h4 class="font-bold text-indigo-300 mb-2">Go Fully Digital</h4>
                       <p class="text-xs text-slate-400 mb-4">Tier 3 allows direct API submission to HMRC without spreadsheets. Reduce error risk to 0%.</p>
                       <button class="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 px-3 py-1.5 rounded border border-indigo-500/30 transition-colors">Upgrade Plan</button>
                   </div>
               }
          </div>
      </div>

       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div class="flex items-start gap-3">
               <span class="text-xl">🇬🇧</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">What are 'Digital Links'?</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">HMRC forbids "copy-pasting" data. Data must flow digitally from invoice to return. Use our API bridge or "Download CSV" features to remain compliant.</p>
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
export class MtdExportComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    submissionStatus = signal<boolean>(false);

    submitToHmrc() {
        // Mock API call
        setTimeout(() => {
            this.submissionStatus.set(true);
        }, 1500);
    }
}

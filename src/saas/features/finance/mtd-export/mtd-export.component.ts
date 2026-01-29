import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-07-mtd-export',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'MTD.UkComplianceHubMtd' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'MTD.MakingTaxDigitalIsMandatory' | translate }}</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'HMRC Bridge (Auto)' : 'Deadline Tracker' }}
         </div>
      </div>

       <!-- VISUAL: Submission Timeline (Deadline Defender) -->
       <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
           <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8">{{ 'MTD.FiscalTimelineQuarterly' | translate }}</h3>
           
           <div class="relative px-4">
               <!-- Line -->
               <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 z-0"></div>
               
               <!-- Steps -->
               <div class="relative z-10 flex justify-between">
                   <!-- Past -->
                   <div class="flex flex-col items-center gap-2 group">
                       <div class="w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                           <span class="material-icons text-white text-xs">check</span>
                       </div>
                       <div class="text-center">
                           <div class="text-[10px] text-slate-400 font-bold uppercase">{{ 'ME.Q42024' | translate }}</div>
                           <div class="text-[10px] text-emerald-400">{{ 'MTD.Filed' | translate }}</div>
                       </div>
                   </div>

                   <!-- Current (Active) -->
                   <div class="flex flex-col items-center gap-2 group">
                       <div class="w-10 h-10 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center shadow-lg shadow-indigo-500/40 relative">
                           <span class="material-icons text-white text-sm animate-pulse">edit_document</span>
                            <div class="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-slate-900"></div>
                       </div>
                       <div class="text-center">
                           <div class="text-xs text-white font-bold uppercase">{{ 'ME.Q12025' | translate }}</div>
                           <div class="text-[10px] text-amber-400 font-mono">{{ 'MTD.Due07Apr' | translate }}</div>
                       </div>
                   </div>

                   <!-- Future -->
                   <div class="flex flex-col items-center gap-2 group opacity-50">
                       <div class="w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center">
                           <span class="text-xs text-slate-500 font-bold">Q2</span>
                       </div>
                       <div class="text-center">
                           <div class="text-[10px] text-slate-500 font-bold uppercase">{{ 'ME.Q22025' | translate }}</div>
                           <div class="text-[10px] text-slate-600">07 JUL</div>
                       </div>
                   </div>
                   
                    <!-- Future -->
                   <div class="flex flex-col items-center gap-2 group opacity-50">
                       <div class="w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center">
                           <span class="text-xs text-slate-500 font-bold">Q3</span>
                       </div>
                       <div class="text-center">
                           <div class="text-[10px] text-slate-500 font-bold uppercase">{{ 'ME.Q32025' | translate }}</div>
                           <div class="text-[10px] text-slate-600">07 OCT</div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
          
          <!-- Tier 3: HMRC Direct Link -->
          <div class="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm relative overflow-hidden group">
              @if (isTier3()) {
                  <div class="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500">
                      <span class="material-icons text-indigo-400 text-5xl">cloud_sync</span>
                      <div class="absolute top-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg animate-bounce">
                          <span class="material-icons text-xs text-white">lock</span>
                      </div>
                  </div>
                  
                  <h3 class="text-xl font-bold text-white mb-2">{{ 'MTD.HmrcDirectLink' | translate }}</h3>
                  <p class="text-indigo-200 text-sm max-w-xs mb-8">{{ 'MTD.YourVatReturnIsCalculated' | translate }}</p>
                  
                  <div class="w-full max-w-xs space-y-3 relative z-10">
                      <button (click)="submitToHmrc()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50" data-debug-id="mtd-submit-btn">
                          <span class="material-icons">send</span> SUBMIT Q1 RETURN
                      </button>
                      
                       @if (submissionStatus()) {
                           <div class="absolute top-full left-0 w-full mt-4 p-3 bg-emerald-500/90 backdrop-blur text-white rounded-lg flex items-center gap-3 animate-fade-in shadow-xl">
                               <span class="material-icons">check_circle</span>
                               <div class="text-left">
                                   <div class="text-xs font-bold">{{ 'MTD.ReceiptIdIr88392x' | translate }}</div>
                                   <div class="text-[10px]">{{ 'MTD.SubmittedJustNow' | translate }}</div>
                               </div>
                           </div>
                       }
                  </div>
              } @else {
                  <div class="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                       <span class="text-3xl mb-4">🇬🇧</span>
                       <h3 class="text-xl font-bold text-white mb-2">{{ 'MTD.ManualSubmissionOnly' | translate }}</h3>
                       <p class="text-slate-400 text-sm mb-6 max-w-xs">{{ 'MTD.OnTheSilverPlanYou' | translate }}</p>
                       <button class="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2" data-debug-id="mtd-download-csv-btn">
                           <span class="material-icons text-sm">download</span>{{ 'MTD.DownloadCsv' | translate }}</button>
                  </div>
              }
          </div>

          <!-- Coach Check -->
          <div class="flex flex-col gap-6">
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1">
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{{ 'MTD.AuditValidation' | translate }}</h3>
                   
                   <div class="space-y-4">
                       <div class="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                           <div class="flex items-center gap-3">
                               <span class="material-icons text-emerald-400 text-sm">receipt_long</span>
                               <span class="text-sm text-slate-300">{{ 'MTD.TotalSalesBox6' | translate }}</span>
                           </div>
                           <span class="text-white font-mono font-bold">£12,450.00</span>
                       </div>
                       <div class="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                           <div class="flex items-center gap-3">
                               <span class="material-icons text-emerald-400 text-sm">shopping_cart</span>
                               <span class="text-sm text-slate-300">{{ 'MTD.TotalPurchasesBox7' | translate }}</span>
                           </div>
                           <span class="text-white font-mono font-bold">£3,200.00</span>
                       </div>
                       <div class="flex items-center justify-between p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                           <div class="flex items-center gap-3">
                               <span class="material-icons text-indigo-400 text-sm">account_balance</span>
                               <span class="text-sm text-indigo-200">{{ 'MTD.VatDueBox5' | translate }}</span>
                           </div>
                           <span class="text-indigo-300 font-mono font-bold">£1,850.00</span>
                       </div>
                   </div>
               </div>
               
               <!-- Coach -->
               <div class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                       <span class="text-xl">⚖️</span>
                       <div>
                           <h4 class="font-bold text-rose-300 text-sm">{{ 'MTD.PenaltyNotice30dayRule' | translate }}</h4>
                           <p class="text-xs text-rose-200/80 mt-1 leading-relaxed">{{ 'MTD.HmrcNowChargesPointsFor' | translate }}<br><strong class="text-rose-300">{{ 'MTD.CurrentStatus18DaysRemaining' | translate }}</strong>
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
export class MtdExportComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    submissionStatus = signal<boolean>(false);

    submitToHmrc() {
        if (!this.isTier3()) return;
        // Mock API call
        setTimeout(() => {
            this.submissionStatus.set(true);
        }, 1500);
    }
}

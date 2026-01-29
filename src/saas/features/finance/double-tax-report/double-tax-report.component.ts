import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-10-double-tax-report',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'DTAX.GlobalTaxOptimizer' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'DTAX.StopLeavingMoneyOnThe' | translate }}</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Relief Claim Auto-Filler' : 'Credit Simulator' }}
         </div>
      </div>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
           
           <!-- Configuration & Simulator (Tier 2) -->
           <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                <h3 class="text-xl font-bold text-white mb-6">{{ 'DTAX.CrossborderContext' | translate }}</h3>
                <form [formGroup]="form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'DTAX.FiscalResidenceHome' | translate }}</label>
                         <select formControlName="residence" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm" data-debug-id="dtr-select-residence">
                               <option value="UK">{{ 'DTAX.UnitedKingdom' | translate }}</option>
                               <option value="US">USA</option>
                               <option value="DE">{{ 'DTAX.Germany' | translate }}</option>
                               <option value="FR">{{ 'DTAX.France' | translate }}</option>
                         </select>
                    </div>
                    
                     <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'DTAX.PropertyLocationSource' | translate }}</label>
                         <select formControlName="source" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm" data-debug-id="dtr-select-source">
                               <option value="FR">{{ 'DTAX.France' | translate }}</option>
                               <option value="ES">{{ 'DTAX.Spain' | translate }}</option>
                               <option value="IT">{{ 'DTAX.Italy' | translate }}</option>
                               <option value="PT">{{ 'DTAX.Portugal' | translate }}</option>
                         </select>
                    </div>
                    
                    <div class="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                             <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'DTAX.GrossForeignIncome' | translate }}</label>
                             <input type="number" formControlName="grossIncome" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" data-debug-id="dtr-input-gross">
                        </div>
                        <div>
                             <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'DTAX.TaxPaidAtSource' | translate }}</label>
                             <input type="number" formControlName="taxPaid" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" data-debug-id="dtr-input-taxpaid">
                        </div>
                    </div>
                </form>

                <!-- VISUAL: Relief Flowchart (Mock Sankey) -->
                <div class="flex-1 mt-6 relative bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center">
                    <h4 class="text-xs font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">{{ 'DTAX.TaxFlowReliefVisualization' | translate }}</h4>
                    
                    <div class="flex items-center justify-between text-xs font-mono relative z-10">
                        <div class="flex flex-col items-center gap-2">
                             <div class="px-2 py-1 bg-white/10 rounded">{{ formValues().source }} Tax</div>
                             <div class="w-px h-8 bg-white/20"></div>
                             <div class="font-bold text-rose-400">-{{ formValues().taxPaid | currency:'EUR':'symbol':'1.0-0' }}</div>
                        </div>

                        <!-- Arrow -->
                        <div class="flex-1 h-px bg-gradient-to-r from-rose-500/50 to-emerald-500/50 mx-4 relative top-[-10px]">
                            <div class="absolute inset-0 bg-gradient-to-r from-rose-500 to-emerald-500 opacity-20 blur-sm"></div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                             <div class="px-2 py-1 bg-white/10 rounded">{{ formValues().residence }} Credit</div>
                             <div class="w-px h-8 bg-white/20"></div>
                             <div class="font-bold text-emerald-400">+{{ formValues().taxPaid | currency:'EUR':'symbol':'1.0-0' }}</div>
                        </div>
                    </div>

                    <div class="mt-4 text-center">
                        <div class="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-300">{{ 'DTAX.NetDoubleTaxImpact' | translate }}<span class="font-bold">€0.00</span> (Qualified for Relief)
                        </div>
                    </div>
                </div>
           </div>

           <!-- Report / Filing Map -->
           <div class="flex flex-col gap-6">
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 group flex flex-col">
                    <h3 class="text-xl font-bold text-white mb-4">{{ 'DTAX.ReliefClaimGenerator' | translate }}</h3>
                    
                    @if (isTier3()) {
                        <div class="flex-1 bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto custom-scrollbar shadow-inner relative">
                             <!-- Copy Button -->
                             <button class="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white" title="{{ \'DTAX.CopyToClipboard\' | translate }}" data-debug-id="dtr-copy-btn">
                                 <span class="material-icons text-sm">content_copy</span>
                             </button>

                             <p class="mb-4 text-indigo-300">// Copy-paste this into the 'Additional Information' section on your {{ formValues().residence }} tax return.</p>
                             
                             <p>
                                 <span class="text-rose-300">{{ 'DTR.ClaimForForeignTaxCreditRelief' | translate }}</span><br><br>
                                 I claim relief against {{ formValues().residence }} tax for foreign tax paid in {{ formValues().source }} on income arising from immovable property.<br><br>
                                 
                                 <span class="text-slate-500">{{ 'DTR.Details' | translate }}</span><br>
                                 - Gross Foreign Income: {{ formValues().grossIncome | currency:'EUR':'symbol':'1.0-0' }}<br>
                                 - Foreign Tax Paid: {{ formValues().taxPaid | currency:'EUR':'symbol':'1.0-0' }}<br>
                                 - Treaty Reference: {{ formValues().residence }}-{{ formValues().source }} Double Taxation Convention, Article 23.<br><br>
                                 
                                 Please reduce my {{ formValues().residence }} tax liability by the lesser of the foreign tax paid or the {{ formValues().residence }} tax attributable to this income.
                             </p>
                        </div>
                        
                        <div class="mt-4 flex justify-between items-center">
                            <span class="text-[10px] text-slate-500">{{ 'DTAX.VerifiedByOurLegalDatabase' | translate }}</span>
                            <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all" data-debug-id="dtr-export-btn">{{ 'DTAX.ExportAdvicePdf' | translate }}</button>
                        </div>

                    } @else {
                        <div class="relative flex-1 bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs text-slate-500 overflow-hidden">
                             <p class="blur-[3px] select-none">{{ 'DTAX.IClaimReliefAgainstUk' | translate }}</p>
                             <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-transparent to-slate-900/90">
                                 <span class="text-3xl mb-3">📝</span>
                                 <h3 class="text-lg font-bold text-white mb-2">{{ 'DTAX.AutowriteMyTaxClaim' | translate }}</h3>
                                 <p class="text-xs text-slate-300 mb-4 max-w-xs">{{ 'DTAX.DontKnowWhatToWrite' | translate }}</p>
                                 <button class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all" data-debug-id="dtr-upgrade-btn">{{ 'DTAX.UnlockGoldFeature' | translate }}</button>
                             </div>
                        </div>
                    }
               </div>

                <!-- Coach -->
                <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">📆</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">{{ 'DTAX.The183dayRule' | translate }}</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">Be careful! If you spend >183 days in the source country, you become a <strong>{{ 'DTAX.TaxResident' | translate }}</strong> there, taxing your WORLDWIDE income. Check your passport stamps.</p>
                        </div>
                    </div>
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
export class DoubleTaxReportComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            residence: ['UK', Validators.required],
            source: ['FR', Validators.required],
            grossIncome: [25000, Validators.required],
            taxPaid: [5000, Validators.required]
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }
}

import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-09-non-resident-tax',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'NRTAX.ExpatTaxShield' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'NRTAX.DontPayTwiceNavigateDouble' | translate }}</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Rate Directory' : (isTier3() ? 'Auto-Fill Engine' : 'Treaty Database') }}
         </div>
      </div>

      <!-- TIER 0: Directory (Static) -->
      @if (isTier0()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-white/5 border border-white/10 rounded-2xl p-6">
              <div class="col-span-full mb-4 text-center">
                   <h3 class="text-xl font-bold text-white mb-2">{{ 'NRTAX.NonresidentTaxRates' | translate }}</h3>
                   <p class="text-slate-400 text-sm">{{ 'NRTAX.BaseRatesForForeignOwners' | translate }}</p>
              </div>
              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center"><div class="flex items-center gap-3"><span class="text-2xl">🇫🇷</span><div><div class="font-bold text-white">{{ 'NRTAX.France' | translate }}</div><div class="text-[10px] text-slate-500">{{ 'NRTAX.IncomeTax' | translate }}</div></div></div><div class="text-right"><div class="font-mono text-emerald-400">20%</div><div class="text-[10px] text-slate-500">{{ 'NRTAX.MinRate' | translate }}</div></div></div>
              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center"><div class="flex items-center gap-3"><span class="text-2xl">🇪🇸</span><div><div class="font-bold text-white">{{ 'NRTAX.SpainEu' | translate }}</div><div class="text-[10px] text-slate-500">{{ 'NRT.Irnr' | translate }}</div></div></div><div class="text-right"><div class="font-mono text-emerald-400">19%</div><div class="text-[10px] text-slate-500">{{ 'NRTAX.OnNet' | translate }}</div></div></div>
              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center"><div class="flex items-center gap-3"><span class="text-2xl">🇪🇸</span><div><div class="font-bold text-white">{{ 'NRTAX.SpainNoneu' | translate }}</div><div class="text-[10px] text-slate-500">{{ 'NRT.Irnr' | translate }}</div></div></div><div class="text-right"><div class="font-mono text-amber-400">24%</div><div class="text-[10px] text-slate-500">{{ 'NRTAX.OnGross' | translate }}</div></div></div>
          </div>
      } 
      
      <!-- TIER 2/3: Advanced View -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
               <!-- COL 1: Map / Context -->
               <div class="lg:col-span-1 bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{{ 'NRTAX.TaxResidencyMap' | translate }}</h3>
                   
                   <!-- CSS Mock Map -->
                   <div class="flex-1 relative w-full rounded-xl bg-slate-800/50 overflow-hidden border border-white/5 group">
                       <!-- Stylized dots/lines representing map -->
                       <div class="absolute top-1/2 left-1/4 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                       <div class="absolute top-1/2 left-1/4 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white shadow-lg"></div>
                       
                       <div class="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>

                       <!-- Connection Line -->
                       <svg class="absolute inset-0 w-full h-full pointer-events-none">
                           <path d="M 100 150 Q 200 50 300 100" fill="none" class="stroke-slate-500/50" stroke-width="2" stroke-dasharray="4 4" />
                       </svg>

                       <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded text-xs text-white">
                           <div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full bg-indigo-500"></span>{{ 'NRTAX.HomeUkResidency' | translate }}</div>
                           <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>{{ 'NRTAX.AssetSpainSource' | translate }}</div>
                       </div>
                   </div>
                   
                   <div class="mt-4 p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-xs text-indigo-200">
                       <span class="font-bold">{{ 'NRTAX.TreatyActive' | translate }}</span>{{ 'NRTAX.UkspainDoubleTaxationConvention1976' | translate }}</div>
               </div>

               <!-- COL 2: Calculator -->
               <div class="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                   <h3 class="text-xl font-bold text-white mb-6">{{ 'NRTAX.LiabilityCalculator' | translate }}</h3>
                   <form [formGroup]="form" class="space-y-4">
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'NRTAX.SourceCountry' | translate }}</label>
                           <select formControlName="country" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500" data-debug-id="nrt-select-country">
                              <option value="ES_EU">{{ 'NRTAX.SpainEuResident' | translate }}</option>
                              <option value="ES_NON_EU">{{ 'NRTAX.SpainNoneuUk' | translate }}</option>
                              <option value="FR">{{ 'NRTAX.France' | translate }}</option>
                              <option value="IT">{{ 'NRTAX.Italy' | translate }}</option>
                           </select>
                       </div>

                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'NRTAX.GrossAnnualIncome' | translate }}</label>
                           <input type="number" formControlName="gross" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="nrt-input-gross">
                       </div>
                       
                        <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'NRTAX.DeductibleExpenses' | translate }}</label>
                           <input type="number" formControlName="expenses" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="nrt-input-expenses">
                           @if (isNonEuSpain()) {
                               <div class="flex items-start gap-2 mt-2 p-2 bg-rose-500/10 rounded border border-rose-500/20">
                                   <span class="material-icons text-rose-400 text-xs mt-0.5">block</span>
                                   <p class="text-[10px] text-rose-300">{{ 'NRTAX.AsANoneuResidentEg' | translate }}</p>
                               </div>
                           }
                       </div>
                   </form>
               </div>

               <!-- COL 3: Results -->
               <div class="lg:col-span-1 flex flex-col gap-6">
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{{ 'NRTAX.EstimatedTaxDue' | translate }}</h3>
                       
                       <div class="text-5xl font-black text-white mb-2 relative z-10">
                           {{ calculateTax() | currency:'EUR':'symbol':'1.0-0' }}
                       </div>
                       <p class="text-xs text-slate-500 mb-6">{{ 'NRTAX.EffectiveRate' | translate }}<span class="text-white font-bold">{{ (calculateTax() / (formValues().gross || 1)) * 100 | number:'1.1-1' }}%</span>
                       </p>

                       @if (isTier3()) {
                           <div class="w-full max-w-xs bg-emerald-600 hover:bg-emerald-500 rounded-xl p-4 cursor-pointer transition-all group shadow-lg shadow-emerald-600/20" data-debug-id="nrt-generate-form-btn">
                               <div class="flex items-center justify-center gap-2 text-white font-bold mb-1">
                                    <span class="material-icons group-hover:rotate-12 transition-transform">description</span>
                                    <span>{{ 'NRTAX.DownloadForm210' | translate }}</span>
                               </div>
                               <p class="text-[10px] text-emerald-100">{{ 'NRTAX.PrefilledPdfForAgenciaTributaria' | translate }}</p>
                           </div>
                       } @else {
                           <div class="p-3 bg-black/40 rounded border border-white/5 max-w-xs mx-auto">
                               <p class="text-[10px] text-slate-400">{{ 'NRTAX.UpgradeToGoldTo' | translate }}<strong class="text-white">auto-generate</strong> official submission forms and avoid accountant fees.</p>
                           </div>
                       }
                   </div>
                   
                   <!-- Coach -->
                   <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">🌍</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">{{ 'NRTAX.AvoidDoubleTaxation' | translate }}</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">This €{{ calculateTax() | number:'1.0-0' }} is a 'Withholding Tax'. Declare it as a <strong>{{ 'NRTAX.ForeignTaxCredit' | translate }}</strong> in your home return to reduce your liability there.</p>
                           </div>
                       </div>
                   </div>
               </div>
          </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class NonResidentTaxComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            country: ['ES_EU', Validators.required],
            gross: [20000, Validators.required],
            expenses: [5000]
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }

    isNonEuSpain() {
        return this.formValues().country === 'ES_NON_EU';
    }

    calculateTax() {
        const val = this.formValues();
        const gross = val.gross || 0;
        const expenses = val.expenses || 0;

        switch (val.country) {
            case 'ES_EU':
                return Math.max(0, gross - expenses) * 0.19;
            case 'ES_NON_EU':
                return gross * 0.24;
            case 'FR':
                return Math.max(0, gross - expenses) * 0.20;
            case 'IT':
                return gross * 0.21;
            default:
                return 0;
        }
    }
}

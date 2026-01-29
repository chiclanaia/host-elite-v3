import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-03-lmnp-tax-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'LMNP.FrenchTaxOptimizer' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'LMNP.ComparateurMicrobicVsRgimeRel' | translate }}</p>
        </div>
        
        <div class="flex gap-2">
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>🇫🇷</span> Fiscalité
            </div>
             <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
                <span>📉</span>{{ 'LMNP.TaxShield' | translate }}</div>
         </div>
      </div>

      <!-- TIER 0: Theory Guide -->
      @if (isTier0()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl min-h-[400px]">
              <div class="flex flex-col items-center text-center">
                  <div class="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                    <span class="text-5xl">🇫🇷</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-2">{{ 'LMNP.MicrobicVsRel' | translate }}</h3>
                  <p class="text-slate-400 max-w-sm">In France, choosing the 'Réel' regime allows you to deduct not just expenses, but also 'Amortization' of the walls, furniture, and works.</p>
              </div>
              <div class="flex flex-col gap-4">
                  <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-indigo-500 shadow-lg">
                      <h4 class="font-bold text-white flex justify-between">Micro-BIC <span class="text-xs bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded-full">{{ 'LMNP.Simple' | translate }}</span></h4>
                      <p class="text-xs text-slate-400 mt-1">{{ 'LMNP.Flat50AbatementYouAre' | translate }}</p>
                  </div>
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-emerald-500 shadow-lg relative overflow-hidden">
                       <div class="absolute top-0 right-0 p-1 bg-emerald-500 text-white text-[10px] font-bold rounded-bl">{{ 'LTS.Recommended' | translate }}</div>
                      <h4 class="font-bold text-white">{{ 'LMNP.RgimeRel' | translate }}</h4>
                      <p class="text-xs text-slate-400 mt-1">Deduct ALL real expenses + Amortization (structure, works, furniture). Often results in 0€ tax for 10+ years.</p>
                  </div>
                  <button class="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25" data-debug-id="lmnp-start-simulator-btn">{{ 'LMNP.StartSimulator' | translate }}</button>
              </div>
          </div>
      } 
      
      <!-- TIER 1/2/3: Simulator -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
               <!-- Left Column: Inputs & Waterproof Coach -->
               <div class="flex flex-col gap-6">
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto custom-scrollbar">
                       <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                           <span class="material-icons text-slate-400">edit_note</span>{{ 'LMNP.PropertyDetails' | translate }}</h3>
                       <form [formGroup]="form" class="space-y-4">
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">{{ 'LMNP.TotalPrice' | translate }}</label>
                                   <input type="number" formControlName="price" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="lmnp-input-price">
                               </div>
                               <div>
                                   <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">{{ 'LMNP.RentalIncomeyr' | translate }}</label>
                                   <input type="number" formControlName="income" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="lmnp-input-income">
                               </div>
                           </div>
                           
                           <div class="p-4 bg-black/20 rounded-xl border border-white/5">
                                <h4 class="text-xs font-bold text-indigo-300 mb-3 uppercase tracking-wider">{{ 'LMNP.AmortizableAssets' | translate }}</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">{{ 'LMNP.FurnitureValue' | translate }}</label>
                                        <input type="number" formControlName="furniture" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs" data-debug-id="lmnp-input-furniture">
                                        <div class="text-[10px] text-slate-500 mt-1">7yr Linear</div>
                                    </div>
                                     <div>
                                        <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">{{ 'LMNP.RenovationWorks' | translate }}</label>
                                        <input type="number" formControlName="works" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs" data-debug-id="lmnp-input-works">
                                        <div class="text-[10px] text-slate-500 mt-1">10yr Linear</div>
                                    </div>
                                </div>
                                @if (!isTier2OrAbove()) {
                                    <div class="mt-2 flex items-center gap-2 text-[10px] text-amber-500/80">
                                        <span class="material-icons text-xs">lock</span>{{ 'LMNP.AdvancedComponentDepreciationRoofFacade' | translate }}</div>
                                }
                           </div>
                           
                           <div>
                               <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">{{ 'LMNP.RealExpensesAnnual' | translate }}</label>
                               <div class="relative">
                                    <input type="number" formControlName="expenses" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="lmnp-input-expenses">
                                    @if(formValues().expenses === 0) {
                                       <span class="absolute right-3 top-2.5 text-xs text-amber-500 italic">{{ 'LMNP.Autoestimating25' | translate }}</span>
                                    }
                               </div>
                           </div>
                       </form>
                   </div>
                   
                   <!-- Coach -->
                    <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                         <div class="flex items-start gap-3">
                            <span class="text-xl">👻</span>
                            <div>
                                <h4 class="font-bold text-indigo-300 text-sm">{{ 'LMNP.TheGhostExpense' | translate }}</h4>
                                <p class="text-xs text-indigo-200/80 mt-1">Amortization is a 'paper expense'. You don't pay cash for it now, but it lowers your taxable profit to zero. This is the secret to tax-free rental income.</p>
                            </div>
                        </div>
                    </div>
               </div>

               <!-- Right Column: Results & Viz -->
               <div class="flex flex-col gap-6">
                   <!-- Waterfall Comparison -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                       <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">{{ 'LMNP.TaxBaseCalculation' | translate }}</h3>
                       
                       <div class="flex items-end gap-2 h-40 mb-4 px-4">
                           <!-- Micro Base -->
                           <div class="flex-1 flex flex-col items-center group">
                                <div class="w-full bg-rose-500/20 border border-rose-500/50 rounded-t relative transition-all group-hover:bg-rose-500/30" style="height: 50%">
                                    <div class="absolute top-2 left-0 right-0 text-center text-xs font-bold text-white">{{ results().microBicTaxable | currency:'EUR':'symbol':'1.0-0' }}</div>
                                </div>
                                <div class="mt-2 text-[10px] text-slate-400 uppercase font-bold">{{ 'LMNP.MicrobicBase' | translate }}</div>
                           </div>

                           <div class="text-slate-600 font-bold mb-8">VS</div>

                           <!-- Reel Waterfall -->
                           <div class="flex-1 flex flex-col items-center h-full justify-end group">
                               <!-- Revenue Full Height ref (virtual) -->
                               <div class="w-full flex flex-col-reverse relative h-full">
                                   <!-- Taxable (Residue) -->
                                   <div class="w-full bg-emerald-500 border border-emerald-400 rounded-t transition-all" [style.height.%]="getReelHeight('taxable')">
                                       @if (results().reelTaxable > 0) {
                                        <div class="text-center text-[10px] font-bold text-white pt-1">{{ results().reelTaxable | currency:'EUR':'symbol':'1.0-0' }}</div>
                                       }
                                   </div>
                                    <!-- Amortization -->
                                   <div class="w-full bg-indigo-500/50 border-x border-t border-indigo-500/30 transition-all cursor-help" [style.height.%]="getReelHeight('amortization')" title="{{ \'LMNP.AmortizationGhostExpense\' | translate }}">
                                       <div class="text-center text-[10px] text-indigo-200 pt-1">{{ 'LMNP.Amort' | translate }}</div>
                                   </div>
                                   <!-- Real Expenses -->
                                   <div class="w-full bg-slate-600/50 border-x border-t border-slate-500/30 rounded-b transition-all" [style.height.%]="getReelHeight('expenses')">
                                       <div class="text-center text-[10px] text-slate-400 pt-1">{{ 'LMNP.Exp' | translate }}</div>
                                   </div>
                               </div>
                               <div class="mt-2 text-[10px] text-slate-400 uppercase font-bold">{{ 'LMNP.RelBase' | translate }}</div>
                           </div>
                       </div>
                       
                       <div class="text-center pt-4 border-t border-white/10">
                            <p class="text-sm text-white">{{ 'LMNP.AnnualTaxSavings' | translate }}<strong class="text-emerald-400">{{ (results().microBicTaxable - results().reelTaxable) * 0.3 | currency:'EUR':'symbol':'1.0-0' }}</strong>
                                <span class="text-xs text-slate-500 ml-1">(est. at 30% TMI)</span>
                            </p>
                       </div>
                   </div>

                   <!-- Amortization Schedule (Tier 2/3) -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col min-h-[250px]">
                       <div class="flex justify-between items-center mb-4">
                           <h3 class="text-white font-bold flex items-center gap-2">
                               <span class="material-icons text-indigo-400">calendar_today</span> 10-Year Projection
                           </h3> 
                           @if(isTier3()) {
                               <button class="text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors" data-debug-id="lmnp-export-fec">
                                   <span class="material-icons text-[10px]">receipt_long</span>{{ 'LMNP.ExportFec' | translate }}</button>
                           }
                       </div>

                       @if (isTier2OrAbove()) {
                            <div class="flex-1 overflow-auto custom-scrollbar">
                                <table class="w-full text-xs text-left">
                                    <thead class="text-slate-500 border-b border-white/10 sticky top-0 bg-[#1e293b]">
                                        <tr>
                                            <th class="pb-2 pl-2">{{ 'LMNP.Year' | translate }}</th>
                                            <th class="pb-2">{{ 'LMNP.Amortization' | translate }}</th>
                                            <th class="pb-2 text-right pr-2">{{ 'LMNP.TaxableBase' | translate }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-slate-300">
                                        @for (year of [1,2,3,4,5,6,7,8,9,10]; track year) {
                                            <tr class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td class="py-2 pl-2 text-slate-500 font-mono">Y{{ year }}</td>
                                                <td class="py-2 text-indigo-300">-{{ results().amortizationTotal | number:'1.0-0' }}</td>
                                                <td class="py-2 text-right pr-2 font-bold font-mono" [class.text-emerald-400]="isReelZero(year)" [class.text-white]="!isReelZero(year)">
                                                    {{ getTaxable(year) | currency:'EUR':'':'1.0-0' }}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                       } @else {
                           <div class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center p-4 text-center backdrop-blur-[1px]">
                               <div>
                                   <span class="text-2xl mb-2 block">🔒</span>
                                   <p class="text-xs text-indigo-200 mb-2 font-bold">{{ 'LMNP.StandardFeature' | translate }}</p>
                                   <p class="text-[10px] text-slate-400">{{ 'LMNP.UnlockThe10yearAmortizationEngine' | translate }}</p>
                               </div>
                           </div>
                       }
                   </div>
               </div>
          </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class LmnpTaxSimulatorComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    // Computed
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3', 'Silver', 'Gold'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            price: [200000, Validators.required],
            furniture: [10000],
            works: [20000],
            income: [15000, Validators.required],
            expenses: [0] // If 0, auto-calc
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }

    getExpenses() {
        const val = this.formValues();
        if (val.expenses > 0) return val.expenses;
        const monthlyRent = val.income / 12;
        // Auto-est: 15% misc + 1 month prop tax + insurance ~ 25% total
        return val.income * 0.25;
    }

    results = computed(() => {
        const val = this.formValues();
        const income = val.income || 0;

        // Micro-BIC: 50% abatement
        const microBicTaxable = income * 0.5;

        // Réel Logic
        // Structure (85% of price) over 30 years (Simplified)
        // Furniture over 7 years
        // Works over 10 years
        const structAmort = (val.price * 0.85) / 30;
        const furnAmort = val.furniture / 7;
        const worksAmort = val.works / 10;

        const amortizationTotal = structAmort + furnAmort + worksAmort;
        const realExpenses = this.getExpenses();

        let reelTaxable = income - realExpenses - amortizationTotal;
        if (reelTaxable < 0) reelTaxable = 0; // Deficits deferrable, but simplified to 0 for demo

        return {
            microBicTaxable,
            reelTaxable,
            amortizationTotal,
            realExpenses,
            income
        };
    });

    getReelHeight(type: 'taxable' | 'amortization' | 'expenses'): number {
        const r = this.results();
        const totalHeightBase = r.income;
        if (totalHeightBase === 0) return 0;

        if (type === 'expenses') return (r.realExpenses / totalHeightBase) * 100;
        if (type === 'amortization') return (r.amortizationTotal / totalHeightBase) * 100;
        if (type === 'taxable') return (r.reelTaxable / totalHeightBase) * 100;
        return 0;
    }

    getTaxable(year: number) {
        // Simplified constant amortization for demo
        return this.results().reelTaxable;
    }

    isReelZero(year: number) {
        return this.getTaxable(year) <= 0;
    }
}

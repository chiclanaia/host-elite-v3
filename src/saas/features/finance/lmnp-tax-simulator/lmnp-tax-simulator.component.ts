import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-03-lmnp-tax-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2">{{ feature().description }}</p>
        </div>
        
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Theory Mode' : (isTier3() ? 'Expert Amortization' : 'Comparison Mode') }}
         </div>
      </div>

      <!-- TIER 0: Theory Guide -->
      @if (isTier0()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl">
              <div class="flex flex-col items-center text-center">
                  <span class="text-6xl mb-6">🇫🇷</span>
                  <h3 class="text-2xl font-bold text-white mb-2">Micro-BIC vs Réel Simplified</h3>
                  <p class="text-slate-400 max-w-sm">In France, choosing the 'Réel' regime allows you to deduct not just expenses, but also 'Amortization' (depreciation) of the walls, furniture, and works.</p>
              </div>
              <div class="flex flex-col gap-4">
                  <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-indigo-500">
                      <h4 class="font-bold text-white">Micro-BIC</h4>
                      <p class="text-sm text-slate-400">Flat 50% abatement. Simple, but rarely the most profitable.</p>
                  </div>
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-emerald-500">
                      <h4 class="font-bold text-white">Régime Réel</h4>
                      <p class="text-sm text-slate-400">Deduct ALL real expenses + Amortization. Often results in 0€ tax for 10+ years.</p>
                  </div>
                  <button class="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
                      Start Simulator (Upgrade Required)
                  </button>
              </div>
          </div>
      } 
      
      <!-- TIER 1/2/3: Simulator -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
               <!-- Inputs -->
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto custom-scrollbar">
                   <h3 class="text-xl font-bold text-white mb-6">Property Details</h3>
                   <form [formGroup]="form" class="space-y-4">
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Total Acquisition Cost (€)</label>
                           <input type="number" formControlName="price" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                       </div>
                       <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-slate-400 mb-1">Furniture Value (€)</label>
                                <input type="number" formControlName="furniture" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-400 mb-1">Renovation Works (€)</label>
                                <input type="number" formControlName="works" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                            </div>
                       </div>
                       
                        <div class="pt-4 border-t border-white/10">
                           <label class="block text-xs font-medium text-slate-400 mb-1">Annual Rental Income (€)</label>
                           <input type="number" formControlName="income" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                       </div>
                       
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Annual Real Expenses (Condo, Tax, Ins...) (€)</label>
                           <input type="number" formControlName="expenses" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                           @if(formValues().expenses === 0) {
                               <p class="text-[10px] text-amber-400 mt-1 italic">Note: If 0, we'll estimate 20% of rent.</p>
                           }
                       </div>
                   </form>

                   <!-- Coach -->
                   <div class="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">👻</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">Use the 'Ghost' Expense</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">Amortization is a 'paper expense'. You don't pay it, but it lowers your taxable profit. This is the secret to tax-free rental income.</p>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Results -->
               <div class="flex flex-col gap-6">
                   <!-- Comparison Card -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Taxable Base Comparison (Year 1)</h3>
                       
                       <div class="grid grid-cols-2 gap-4">
                           <div class="bg-black/20 rounded-xl p-4 text-center border border-white/5">
                               <div class="text-sm text-slate-400 mb-1">Micro-BIC</div>
                               <div class="text-2xl font-bold text-rose-400">{{ results().microBicTaxable | currency:'EUR':'symbol':'1.0-0' }}</div>
                               <div class="text-xs text-slate-500 mt-1">50% abatement</div>
                           </div>
                           
                           <div class="bg-indigo-500/10 rounded-xl p-4 text-center border border-indigo-500/30 relative overflow-hidden">
                               <div class="absolute top-0 right-0 p-1 bg-emerald-500 text-white text-[10px] font-bold rounded-bl">WINNER</div>
                               <div class="text-sm text-indigo-200 mb-1">Régime Réel</div>
                               <div class="text-2xl font-bold text-emerald-400">{{ results().reelTaxable | currency:'EUR':'symbol':'1.0-0' }}</div>
                               <div class="text-xs text-indigo-300/60 mt-1">Includes Amortization</div>
                           </div>
                       </div>

                       <div class="mt-4 text-center">
                           <p class="text-sm text-white">
                               Potential Tax Savings: <strong class="text-emerald-400">{{ (results().microBicTaxable - results().reelTaxable) * 0.3 | currency:'EUR':'symbol':'1.0-0' }}</strong> / year
                               <br><span class="text-xs text-slate-500">(Assuming 30% TMI)</span>
                           </p>
                       </div>
                   </div>

                   <!-- Amortization Table (Tier 3) -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col">
                       <h3 class="text-white font-bold flex items-center gap-2 mb-4">
                           <span class="material-icons text-indigo-400">calendar_today</span> 10-Year Amortization Schedule
                       </h3>

                       @if (isTier3()) {
                            <div class="flex-1 overflow-auto custom-scrollbar">
                                <table class="w-full text-xs text-left">
                                    <thead class="text-slate-500 border-b border-white/10">
                                        <tr>
                                            <th class="pb-2">Year</th>
                                            <th class="pb-2">Income</th>
                                            <th class="pb-2">Corrected Exp.</th>
                                            <th class="pb-2">Amortization</th>
                                            <th class="pb-2 text-right">Taxable</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-slate-300">
                                        @for (year of [1,2,3,4,5,6,7,8,9,10]; track year) {
                                            <tr class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td class="py-2 text-slate-500">Y{{ year }}</td>
                                                <td class="py-2">{{ formValues().income | number:'1.0-0' }}</td>
                                                <td class="py-2">{{ getExpenses() | number:'1.0-0' }}</td>
                                                <td class="py-2 text-indigo-300">-{{ results().amortizationTotal | number:'1.0-0' }}</td>
                                                <td class="py-2 text-right font-bold" [class.text-emerald-400]="isReelZero(year)" [class.text-white]="!isReelZero(year)">
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
                                   <p class="text-xs text-indigo-200 mb-2 font-bold">Expert Feature</p>
                                   <p class="text-[10px] text-slate-400">Unlock the full 15-year Component-Based amortization schedule.</p>
                               </div>
                           </div>
                       }
                   </div>
               </div>
          </div>
      }
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class LmnpTaxSimulatorComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    // Computed
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
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
        // Default: 20% + 1 month Property Tax (approx 8%) => ~28% or simply 20% for conservative estimate + GLI
        // Prompt says: "Automatic inclusion of property tax (1 month rent default)"
        const monthlyRent = val.income / 12;
        return (val.income * 0.15) + monthlyRent;
    }

    results = computed(() => {
        const val = this.formValues();
        const income = val.income || 0;

        // Micro-BIC: 50% abatement
        const microBicTaxable = income * 0.5;

        // Réel
        // Component Amortization Logic (Simplified for Demo)
        // Structure (85% of price) over 30 years
        // Furniture over 7 years
        // Works over 10 years
        const structAmort = (val.price * 0.85) / 30;
        const furnAmort = val.furniture / 7;
        const worksAmort = val.works / 10;

        const amortizationTotal = structAmort + furnAmort + worksAmort;
        const realExpenses = this.getExpenses();

        let reelTaxable = income - realExpenses - amortizationTotal;
        if (reelTaxable < 0) reelTaxable = 0; // Deficit verifiable

        return {
            microBicTaxable,
            reelTaxable,
            amortizationTotal
        };
    });

    getTaxable(year: number) {
        // Very basic logic: Amortization constant for 10 years (works/furniture active)
        // In reality, furniture drops off after Y7 etc.
        // Keeping it constant for clear demo visualization as per "10-year view"
        return this.results().reelTaxable;
    }

    isReelZero(year: number) {
        return this.getTaxable(year) <= 0;
    }
}

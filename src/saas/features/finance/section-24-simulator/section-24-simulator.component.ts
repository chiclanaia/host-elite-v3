import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-04-section-24-simulator',
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
             {{ isTier0() ? 'Theory Mode' : (isTier3() ? 'Stress Test Mode' : 'Calculator Mode') }}
         </div>
      </div>

      <!-- TIER 0: Theory Guide -->
      @if (isTier0()) {
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1">
              <span class="text-6xl mb-6">🇬🇧</span>
              <h3 class="text-2xl font-bold text-white mb-2">The 'Tenant Tax' (Section 24)</h3>
              <p class="text-slate-400 max-w-lg mb-6">Since 2020, UK landlords cannot deduct mortgage interest from rental income. This implies that you might pay tax even if you make NO profit.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-rose-500">
                      <h4 class="font-bold text-white">Personal Name</h4>
                      <p class="text-sm text-slate-400">Taxed on TURNOVER, not profit. Higher risk for Higher Rate payers.</p>
                  </div>
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-emerald-500">
                      <h4 class="font-bold text-white">Ltd Company (SPV)</h4>
                      <p class="text-sm text-slate-400">Interest is fully deductible (Corporation Tax). More admin, but tax efficient.</p>
                  </div>
              </div>
          </div>
      } 
      
      <!-- TIER 1/2/3: Simulator -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
               <!-- Inputs -->
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                   <h3 class="text-xl font-bold text-white mb-6">Scenario Parameters</h3>
                   <form [formGroup]="form" class="space-y-4">
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Annual Rental Income (£)</label>
                           <input type="number" formControlName="income" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="sec24-input-income">
                       </div>
                       
                        <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Mortgage Interest (Annual) (£)</label>
                           <input type="number" formControlName="interest" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="sec24-input-interest">
                       </div>
                       
                       <div class="pt-4 border-t border-white/10">
                           <label class="block text-xs font-medium text-slate-400 mb-1">Other Allowable Expenses (£)</label>
                           <input type="number" formControlName="expenses" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="sec24-input-expenses">
                       </div>
                       
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Your Tax Band</label>
                           <select formControlName="taxBand" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm" data-debug-id="sec24-select-taxband">
                              <option value="20">Basic Rate (20%)</option>
                              <option value="40">Higher Rate (40%)</option>
                              <option value="45">Additional Rate (45%)</option>
                           </select>
                       </div>
                       
                       @if (isTier3()) {
                           <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                <label class="block text-xs font-bold text-indigo-300 mb-2">Stress Test: Interest Rate Spike</label>
                                <input type="range" min="0" max="100" class="w-full accent-indigo-500" [value]="stressFactor" (input)="updateStress($event)" data-debug-id="sec24-stress-slider">
                                <div class="flex justify-between text-[10px] text-indigo-200 mt-1">
                                    <span>Current</span>
                                    <span>+{{stressFactor}}% Rate</span>
                                </div>
                                @if (stressFactor > 0) {
                                  <p class="text-xs text-indigo-200 mt-2">New Interest: <strong>£{{ getStressedInterest() | number:'1.0-0' }}</strong></p>
                                }
                           </div>
                       }
                   </form>
               </div>

               <!-- Results -->
               <div class="flex flex-col gap-6">
                   <!-- Comparison -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Net Profit Comparison</h3>
                       
                       <!-- Personal Name -->
                       <div class="mb-6 relative">
                           <div class="flex justify-between items-end mb-1">
                               <span class="text-white font-bold">Personal Name (Section 24)</span>
                               <span class="text-rose-400 font-bold text-xl">{{ results().personalNet | currency:'GBP':'symbol':'1.0-0' }}</span>
                           </div>
                           <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                               <div class="bg-rose-500 h-full" [style.width.%]="(results().personalNet / results().grossProfit) * 100"></div>
                           </div>
                           <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                               <span>Tax Bill: {{ results().personalTax | currency:'GBP':'symbol':'1.0-0' }}</span>
                               <span>Eff. Rate: {{ (results().personalTax / (results().grossProfit || 1)) * 100 | number:'1.0-0' }}%</span>
                           </div>
                       </div>
                       
                       <!-- Ltd Company -->
                       <div class="relative">
                           <div class="flex justify-between items-end mb-1">
                               <span class="text-white font-bold">Ltd Company (SPV)</span>
                               <span class="text-emerald-400 font-bold text-xl">{{ results().ltdNet | currency:'GBP':'symbol':'1.0-0' }}</span>
                           </div>
                           <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                               <div class="bg-emerald-500 h-full" [style.width.%]="(results().ltdNet / results().grossProfit) * 100"></div>
                           </div>
                           <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                               <span>Corp Tax (19-25%): {{ results().ltdTax | currency:'GBP':'symbol':'1.0-0' }}</span>
                               <span>Eff. Rate: {{ (results().ltdTax / (results().grossProfit || 1)) * 100 | number:'1.0-0' }}%</span>
                           </div>
                       </div>
                       
                       @if (results().personalNet < 0) {
                           <div class="mt-6 p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-200 text-xs font-bold animate-pulse text-center">
                               🚨 DANGER ZONE: You are paying tax on a LOSS!
                           </div>
                       }
                   </div>
                   
                   <!-- Coach -->
                   <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">👩‍⚖️</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">Regulatory Update</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">Incorporating is not always better (higher interest rates, accounting fees). Use this tool to find your specific breakeven point.</p>
                           </div>
                       </div>
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
export class Section24SimulatorComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    // Computed
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    stressFactor = 0; // Local mutable state for slider

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            income: [25000, Validators.required],
            interest: [12000, Validators.required],
            expenses: [3000],
            taxBand: ['40'] // Default Higher Rate
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }

    updateStress(event: any) {
        this.stressFactor = parseInt(event.target.value, 10);
    }

    getStressedInterest() {
        const baseInterest = this.formValues().interest;
        // Heuristic: Each +10 on slider = +10% increase in interest COST (not rate points) for simplicity
        // Or: if slider is 0..100%, we increase the cost by that %. 
        // Let's assume slider 50 = +50% cost.
        return baseInterest * (1 + this.stressFactor / 100);
    }

    results = computed(() => {
        const val = this.formValues();
        const income = val.income || 0;
        const expenses = val.expenses || 0;
        const interest = this.isTier3() ? this.getStressedInterest() : (val.interest || 0);
        const taxBand = parseInt(val.taxBand, 10) / 100;

        const grossProfit = income - expenses; // Before interest/tax

        // --- Personal Name (Section 24) ---
        // 1. Taxable Profit = Income - Operating Expenses (Interest NOT deducted)
        const taxablePersonal = income - expenses;
        // 2. Gross Tax Bill
        const grossTax = taxablePersonal * taxBand;
        // 3. Tax Credit (20% of Interest)
        const taxCredit = interest * 0.20;
        // 4. Net Tax
        const personalTax = Math.max(0, grossTax - taxCredit);
        // 5. Net Profit (Pocket) = Income - Expenses - Interest - Tax
        const personalNet = income - expenses - interest - personalTax;

        // --- Ltd Company ---
        // Interest IS deducted
        const taxableLtd = Math.max(0, income - expenses - interest);
        // Corp Tax (Simplified 19% for small profits, up to 25% for >50k - let's use 19% for demo)
        const corpTaxRate = taxableLtd > 50000 ? 0.25 : 0.19;
        const ltdTax = taxableLtd * corpTaxRate;
        const ltdNet = taxableLtd - ltdTax;
        // Note: Extracting money (Dividend tax) is extra step, but usually comparison stops at "Profit retained in SPV"

        return {
            grossProfit,
            personalNet,
            personalTax,
            ltdNet,
            ltdTax
        };
    });
}

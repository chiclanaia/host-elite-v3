import { Component, input, computed, inject, signal } from '@angular/core';
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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">UK Tax Shield (Section 24)</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">The "Tenant Tax" Simulator. Determine if you should incorporate (SPV) or stay personal.</p>
        </div>
        
         <div class="flex gap-2">
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>🇬🇧</span> UK Landlord
            </div>
             <div class="px-4 py-2 bg-rose-500/10 text-rose-300 rounded-lg border border-rose-500/30 text-xs font-mono flex items-center gap-2">
                <span>🛡️</span> Sec. 24
            </div>
         </div>
      </div>

      <!-- TIER 0: Theory Guide -->
      @if (isTier0()) {
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1 min-h-[400px]">
              <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                <span class="text-4xl">🇬🇧</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">The 'Tenant Tax' (Section 24)</h3>
              <p class="text-slate-400 max-w-lg mb-6">Since 2020, UK landlords cannot deduct mortgage interest from rental income. This implies that you might pay tax even if you make NO profit.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-rose-500 shadow-lg">
                      <h4 class="font-bold text-white flex justify-between">Personal Name <span class="text-xs bg-rose-900 text-rose-200 px-2 py-0.5 rounded-full">High Risk</span></h4>
                      <p class="text-xs text-slate-400 mt-1">Taxed on TURNOVER, not profit. Higher Rate payers effectively lose 20% tax credit cap.</p>
                  </div>
                   <div class="p-4 bg-slate-800 rounded-lg border-l-4 border-emerald-500 shadow-lg">
                      <h4 class="font-bold text-white flex justify-between">Ltd Company (SPV) <span class="text-xs bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full">Safe Haven</span></h4>
                      <p class="text-xs text-slate-400 mt-1">Interest is fully deductible (Corporation Tax). More admin, but typically more tax efficient.</p>
                  </div>
              </div>
          </div>
      } 
      
      <!-- TIER 1/2/3: Simulator -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
               <!-- Inputs -->
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto custom-scrollbar">
                   <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                       <span class="material-icons text-slate-400">tune</span> Scenario Parameters
                   </h3>
                   <form [formGroup]="form" class="space-y-6">
                       <div class="grid grid-cols-2 gap-4">
                           <div>
                               <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">Rental Income (£)</label>
                               <input type="number" formControlName="income" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="sec24-input-income">
                           </div>
                            <div>
                               <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">Mortgage Interest (£)</label>
                               <input type="number" formControlName="interest" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="sec24-input-interest">
                           </div>
                       </div>
                       
                       <div>
                           <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1">Total Operating Exp. (£)</label>
                           <input type="number" formControlName="expenses" class="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="sec24-input-expenses">
                       </div>
                       
                       <div class="p-4 bg-black/20 rounded-xl border border-white/5">
                            <label class="block text-[10px] text-slate-400 uppercase font-bold mb-2">Personal Tax Band</label>
                           <div class="flex gap-2">
                               <label class="flex-1 cursor-pointer">
                                   <input type="radio" formControlName="taxBand" value="20" class="peer sr-only">
                                   <div class="text-center p-2 rounded-lg border border-slate-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-checked:text-white text-slate-400 text-xs transition-all">
                                       Basic (20%)
                                   </div>
                               </label>
                               <label class="flex-1 cursor-pointer">
                                   <input type="radio" formControlName="taxBand" value="40" class="peer sr-only">
                                   <div class="text-center p-2 rounded-lg border border-slate-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-checked:text-white text-slate-400 text-xs transition-all">
                                       Higher (40%)
                                   </div>
                               </label>
                               <label class="flex-1 cursor-pointer">
                                   <input type="radio" formControlName="taxBand" value="45" class="peer sr-only">
                                   <div class="text-center p-2 rounded-lg border border-slate-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-checked:text-white text-slate-400 text-xs transition-all">
                                       Add. (45%)
                                   </div>
                               </label>
                           </div>
                       </div>
                       
                       @if (isTier3()) {
                           <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                <label class="block text-xs font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                    <span class="material-icons text-sm">trending_up</span> Stress Test: Rate Spike
                                </label>
                                <input type="range" min="0" max="100" class="w-full accent-indigo-500" [value]="stressFactor" (input)="updateStress($event)" data-debug-id="sec24-stress-slider">
                                <div class="flex justify-between text-[10px] text-indigo-200 mt-1">
                                    <span>Current</span>
                                    <span>+{{stressFactor}}% Rate</span>
                                </div>
                                @if (stressFactor > 0) {
                                  <p class="text-xs text-indigo-200 mt-2 bg-indigo-500/20 p-2 rounded text-center">New Interest Load: <strong>£{{ getStressedInterest() | number:'1.0-0' }}</strong></p>
                                }
                           </div>
                       } @else {
                           <div class="mt-6 p-4 bg-black/20 border border-white/5 rounded-xl opacity-60">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="text-xs font-bold text-slate-500">Stress Test Calculator</label>
                                    <span class="text-[10px] border border-amber-500/50 text-amber-500 px-1.5 rounded">GOLD</span>
                                </div>
                                <div class="h-1 bg-slate-700 rounded-full w-full"></div>
                                <p class="text-[10px] text-slate-500 mt-2">Simulate interest rate spikes (e.g. 5% -> 8%) to see break-even points.</p>
                           </div>
                       }
                   </form>
                   
                   <!-- Coach -->
                   <div class="mt-auto bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">👩‍⚖️</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">Advisor Note</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">Incorporating incurs higher mortgage rates (~1-1.5%) and accountancy fees. Don't rush to SPV unless the tax saving > £2k/year.</p>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Results -->
               <div class="flex flex-col gap-6">
                   <!-- Comparison -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1 flex flex-col justify-center">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8 text-center">Net Profit Analysis</h3>
                       
                       <div class="flex items-end justify-center gap-8 h-64 w-full px-8 pb-4">
                           <!-- Personal Bar -->
                           <div class="flex flex-col items-center w-24 group relative">
                               <div class="w-full rounded-t-lg transition-all duration-500 relative flex flex-col justify-end"
                                    [style.height.%]="getBarHeight('personal')"
                                    [class.bg-rose-500]="results().personalNet > 0"
                                    [class.bg-rose-900]="results().personalNet <= 0">
                                    
                                    <span class="absolute -top-6 w-full text-center font-bold" [class.text-rose-400]="results().personalNet > 0" [class.text-rose-600]="results().personalNet <= 0">
                                        {{ results().personalNet | currency:'GBP':'symbol':'1.0-0' }}
                                    </span>
                               </div>
                               <div class="mt-3 text-xs font-bold text-slate-400">Personal</div>
                               
                               <!-- Tooltip -->
                               <div class="absolute bottom-full mb-8 invisible group-hover:visible bg-black/90 p-2 rounded text-[10px] text-white whitespace-nowrap z-10">
                                   Tax Bill: {{ results().personalTax | currency:'GBP':'symbol':'1.0-0' }}
                               </div>
                           </div>

                           <!-- LTD Bar -->
                           <div class="flex flex-col items-center w-24 group relative">
                               <div class="w-full rounded-t-lg transition-all duration-500 relative flex flex-col justify-end"
                                    [style.height.%]="getBarHeight('ltd')" 
                                    [class.bg-emerald-500]="results().ltdNet > 0"
                                    [class.bg-emerald-900]="results().ltdNet <= 0">
                                    
                                    <span class="absolute -top-6 w-full text-center font-bold" [class.text-emerald-400]="results().ltdNet > 0" [class.text-emerald-600]="results().ltdNet <= 0">
                                        {{ results().ltdNet | currency:'GBP':'symbol':'1.0-0' }}
                                    </span>
                                    
                                    <!-- Recommended Badge -->
                                    @if (results().ltdNet > results().personalNet + 500) {
                                        <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                                            BETTER
                                        </div>
                                    }
                               </div>
                               <div class="mt-3 text-xs font-bold text-slate-400">Ltd (SPV)</div>
                               
                               <!-- Tooltip -->
                               <div class="absolute bottom-full mb-8 invisible group-hover:visible bg-black/90 p-2 rounded text-[10px] text-white whitespace-nowrap z-10">
                                   Corp Tax: {{ results().ltdTax | currency:'GBP':'symbol':'1.0-0' }}
                               </div>
                           </div>
                       </div>
                       
                       @if (results().personalNet < 0) {
                           <div class="mt-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-4 animate-pulse">
                               <span class="text-3xl">🚨</span>
                               <div>
                                   <div class="text-rose-300 font-bold text-sm">INSOLVENCY RISK</div>
                                   <div class="text-rose-200/70 text-xs">Section 24 is causing a fake profit tax while you are making a real loss.</div>
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
export class Section24SimulatorComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

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
        // 4. Net Tax (Cannot be negative)
        const personalTax = Math.max(0, grossTax - taxCredit);

        // 5. Net Profit (Pocket) = Income - Expenses - Interest - Tax
        // Note: It IS possible to have negative net profit (paying tax on loss)
        const personalNet = income - expenses - interest - personalTax;

        // --- Ltd Company ---
        // Interest IS deducted
        // Taxable Profit = Income - Expenses - Interest
        const taxableLtd = Math.max(0, income - expenses - interest); // Cannot be < 0 for tax purposes
        // Corp Tax (Simplified 19% for small profits, up to 25% for >50k - let's use 19% for demo)
        const corpTaxRate = taxableLtd > 50000 ? 0.25 : 0.19;
        const ltdTax = taxableLtd * corpTaxRate;

        // Ltd Net = Taxable Ltd - Corp Tax
        // CAREFUL: If company makes a loss (Income < Exp + Int), it pays 0 tax but still has negative equity.
        // So we calculate Raw Net first.
        const rawLtdNet = income - expenses - interest;
        const ltdNet = rawLtdNet - ltdTax;

        return {
            grossProfit,
            personalNet,
            personalTax,
            ltdNet,
            ltdTax
        };
    });

    getBarHeight(type: 'personal' | 'ltd'): number {
        const res = this.results();
        // Determine Max Scale
        const maxVal = Math.max(Math.abs(res.personalNet), Math.abs(res.ltdNet), 1000); // Min 1000 to avoid div/0

        const val = type === 'personal' ? res.personalNet : res.ltdNet;

        // Normalize to percentage of container (assuming container is centered for pos/neg, but here we just show relative height from 0 baseline using simple approach)
        // Let's stick to absolute height for positive values visualization for simplicity, 
        // or just clamp negative to small bar to show "loss" distinct from gain.

        if (val <= 0) return 10; // Small stub for loss

        // Scale to 0-100% of available height
        return (val / maxVal) * 90; // Uses up to 90% of height
    }
}

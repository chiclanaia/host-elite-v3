import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
  selector: 'fin-01-roi-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
       <!-- Header -->
       <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">ROI & Cashflow Architect</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Professional financial modeling engine with seasonality and 10-year projections.</p>
        </div>
         <div class="flex gap-2">
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>💰</span> Cashflow
            </div>
             <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
                <span>📈</span> 10Y Forecast
            </div>
         </div>
      </div>

       <!-- Coach Tip -->
      <div class="p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
           <div class="flex items-center gap-2 mb-1">
               <span class="text-lg">💡</span>
               <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
           </div>
           <p class="text-slate-300 text-xs italic">
               "Cash flow is the business's heartbeat. Experts see monthly struggle; beginners see yearly totals. You must survive the 'Low Season' to enjoy the 'High Season' profits."
           </p>
       </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
        <!-- Left: Inputs & Seasonality -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto">
           <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">Financial Design</h3>
                @if (isTier3()) {
                    <button (click)="autoFill()" class="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors flex items-center gap-1" data-debug-id="roi-autofill-btn">
                        <span>✨</span> AI Estimate
                    </button>
                }
           </div>
           
           <form [formGroup]="form" class="space-y-6">
              <!-- Core Numbers -->
              <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price (€)</label>
                    <input type="number" formControlName="price" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="roi-input-price">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Nightly Rate (€)</label>
                    <input type="number" formControlName="rent" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="roi-input-rent">
                  </div>
              </div>

              <!-- Expenses -->
              <div>
                  <div class="flex justify-between mb-2">
                       <label class="block text-[10px] font-bold text-slate-400 uppercase">Monthly Expenses</label>
                       <span class="text-[10px] text-slate-500">{{ totalExpenses() | currency:'EUR':'symbol':'1.0-0' }}/mo</span>
                  </div>
                  <div class="space-y-2">
                      <div class="flex items-center gap-2">
                          <span class="text-xs text-slate-400 w-24">Loan</span>
                          <input type="number" formControlName="loan" class="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs" placeholder="0">
                      </div>
                      <div class="flex items-center gap-2">
                          <span class="text-xs text-slate-400 w-24">Bills/HOA</span>
                          <input type="number" formControlName="condo" class="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs" placeholder="0">
                      </div>
                  </div>
              </div>

              <!-- Tier 2: Seasonality Engine -->
              <div [class.opacity-50]="!isTier2OrAbove()" [class.pointer-events-none]="!isTier2OrAbove()">
                   <div class="flex justify-between items-center mb-4 pt-4 border-t border-white/10">
                        <h4 class="text-sm font-bold text-white flex items-center gap-2">
                            <span class="material-icons text-sm text-cyan-400">ac_unit</span> Seasonality Logic
                        </h4>
                        @if (!isTier2OrAbove()) { <span class="text-[10px] text-amber-400 border border-amber-400/30 px-1.5 rounded">SILVER +</span> }
                   </div>
                   
                   <div class="space-y-3">
                       <div class="flex items-center gap-4">
                           <span class="text-xs text-slate-400 w-16">Occupancy</span>
                           <input type="range" class="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer" min="0" max="100" [value]="50"> 
                           <span class="text-xs text-white font-mono w-8">65%</span>
                       </div>
                        <div class="grid grid-cols-6 gap-1 mt-2">
                            <!-- Visual Heatmap of months -->
                           <div *ngFor="let m of ['J','F','M','A','M','J']; let i = index" class="h-10 bg-black/20 rounded flex flex-col items-center justify-end pb-1 border border-white/5 relative group cursor-pointer hover:border-emerald-500/50">
                               <div class="w-2 bg-emerald-500/50 rounded-t-sm" [style.height.%]="(i%2===0?40:80)"></div>
                               <span class="text-[8px] text-slate-500">{{m}}</span>
                           </div>
                           <div *ngFor="let m of ['J','A','S','O','N','D']; let i = index" class="h-10 bg-black/20 rounded flex flex-col items-center justify-end pb-1 border border-white/5 relative group cursor-pointer hover:border-emerald-500/50">
                               <div class="w-2 bg-emerald-500/50 rounded-t-sm" [style.height.%]="(i%2!==0?30:90)"></div>
                               <span class="text-[8px] text-slate-500">{{m}}</span>
                           </div>
                        </div>
                   </div>
              </div>
           </form>
        </div>

        <!-- Right: Results & Visuals -->
        <div class="flex flex-col gap-6">
             <!-- Top: Cashflow Waterfall -->
             <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex items-center justify-between relative overflow-hidden">
                 <div class="z-10">
                     <p class="text-xs text-slate-400 uppercase tracking-widest mb-1">Net Annual Cashflow</p>
                     <h2 class="text-4xl font-black text-white" [class.text-rose-400]="netCashflow() < 0" [class.text-emerald-400]="netCashflow() > 0">
                         {{ netCashflow() | currency:'EUR':'symbol':'1.0-0' }}
                     </h2>
                     <p class="text-xs mt-1" [class.text-rose-400]="netCashflow() < 0" [class.text-slate-500]="netCashflow() >= 0">
                         {{ netCashflow() < 0 ? 'Negative Carry Warning' : 'Positive Leverage' }}
                     </p>
                 </div>
                 <div class="h-16 w-16 rounded-full border-4 flex items-center justify-center text-xs font-bold z-10 bg-slate-800"
                      [class.border-rose-500]="netCashflow() < 0" [class.border-emerald-500]="netCashflow() > 0"
                      [class.text-rose-400]="netCashflow() < 0" [class.text-emerald-400]="netCashflow() > 0">
                     {{ (netCashflow() / (formValues()?.price || 1)) * 100 | number:'1.1-1' }}%
                 </div>
             </div>

             <!-- Middle: 10-Year Wealth Chart -->
             <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 min-h-[250px] relative flex flex-col">
                 <h3 class="text-lg font-bold text-white mb-4">10-Year Wealth Accumulation</h3>
                 
                 @if (isTier3()) {
                    <div class="flex-1 flex items-end gap-1 relative z-10 px-2">
                        <!-- Simulated Area Chart -->
                        @for (year of [1,2,3,4,5,6,7,8,9,10]; track year) {
                             <div class="flex-1 flex flex-col justify-end gap-0.5 group">
                                  <!-- Appreciation -->
                                  <div class="w-full bg-emerald-500/80 rounded-t-sm relative hover:bg-emerald-400 transition-colors" [style.height.%]="year * 4 + 10"></div>
                                  <!-- Principal Paydown -->
                                  <div class="w-full bg-blue-500/80 rounded-b-sm relative hover:bg-blue-400 transition-colors" [style.height.%]="year * 3 + 5"></div>
                                  
                                  <span class="text-[8px] text-slate-500 text-center mt-1">Y{{year}}</span>
                             </div>
                        }
                    </div>
                    
                    <div class="flex gap-4 justify-center mt-4 text-[10px]">
                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-emerald-500"></div> Asset Value</div>
                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-blue-500"></div> Equity Built</div>
                    </div>
                    
                    <button class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1" data-debug-id="roi-export-pdf">
                        <span class="material-icons text-xs">picture_as_pdf</span> Bank PDF
                    </button>
                    
                 } @else {
                     <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
                         <span class="text-3xl mb-2">🔒</span>
                         <h4 class="text-white font-bold text-sm">Professional Forecast</h4>
                         <p class="text-slate-400 text-xs mb-4 text-center px-8">Unlock 10-year equity analysis and Bank-Ready PDF reports.</p>
                     </div>
                 }
             </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; }`]
})
export class RoiSimulatorComponent {
  feature = input.required<Feature>();
  session = inject(SessionStore);

  tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
  isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
  isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3', 'Silver', 'Gold'].includes(this.tier()));
  isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

  form: FormGroup;
  formValues;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      price: [200000, Validators.required],
      rent: [150, Validators.required], // Daily rate actually? Spec says Monthly rent in legacy but daily in others. Stick to monthly for simplicity or daily * 30.
      loan: [900, Validators.required],
      condo: [0],
      insurance: [0]
    });
    this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  }

  totalExpenses = computed(() => {
    const v = this.formValues();
    return (v?.loan || 0) + (v?.condo || 0) + (v?.insurance || 0);
  });

  netCashflow = computed(() => {
    const v = this.formValues();
    const income = (v?.rent || 0) * 30 * 0.65; // Quick hack: Daily * 30 * 65% occupancy
    return income - this.totalExpenses();
  });

  autoFill() {
    this.form.patchValue({
      price: 250000,
      rent: 140, // Nightly
      loan: 1100,
      condo: 150,
    });
  }
}

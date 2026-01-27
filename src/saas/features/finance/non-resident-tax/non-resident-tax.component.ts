import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-09-non-resident-tax',
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
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Rate Directory' : (isTier3() ? 'Form Auto-Fill' : 'Tax Estimator') }}
         </div>
      </div>

      <!-- TIER 0: Directory -->
      @if (isTier0()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-white/5 border border-white/10 rounded-2xl p-6">
              <div class="col-span-full mb-4 text-center">
                   <h3 class="text-xl font-bold text-white mb-2">Non-Resident Tax Rates</h3>
                   <p class="text-slate-400 text-sm">Base rates for foreign owners (before treaties).</p>
              </div>
              
              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-3">
                      <span class="text-2xl">🇫🇷</span>
                      <div>
                          <div class="font-bold text-white">France</div>
                          <div class="text-[10px] text-slate-500">Income Tax</div>
                      </div>
                  </div>
                  <div class="text-right">
                      <div class="font-mono text-emerald-400">20%</div>
                      <div class="text-[10px] text-slate-500">Minimum Rate</div>
                  </div>
              </div>

               <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-3">
                      <span class="text-2xl">🇪🇸</span>
                      <div>
                          <div class="font-bold text-white">Spain</div>
                          <div class="text-[10px] text-slate-500">IRNR (EU)</div>
                      </div>
                  </div>
                  <div class="text-right">
                      <div class="font-mono text-emerald-400">19%</div>
                      <div class="text-[10px] text-slate-500">On Net Income</div>
                  </div>
              </div>
              
              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-3">
                      <span class="text-2xl">🇪🇸</span>
                      <div>
                          <div class="font-bold text-white">Spain</div>
                          <div class="text-[10px] text-slate-500">IRNR (Non-EU)</div>
                      </div>
                  </div>
                  <div class="text-right">
                      <div class="font-mono text-amber-400">24%</div>
                      <div class="text-[10px] text-slate-500">On Gross Income</div>
                  </div>
              </div>

              <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-3">
                      <span class="text-2xl">🇮🇹</span>
                      <div>
                          <div class="font-bold text-white">Italy</div>
                          <div class="text-[10px] text-slate-500">Cedolare Secca</div>
                      </div>
                  </div>
                  <div class="text-right">
                      <div class="font-mono text-emerald-400">21%</div>
                      <div class="text-[10px] text-slate-500">Flat Rate</div>
                  </div>
              </div>
          </div>
      } 
      
      <!-- TIER 1/2/3: Simulator -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
               <!-- Inputs -->
               <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                   <h3 class="text-xl font-bold text-white mb-6">Tax Liability Estimator</h3>
                   <form [formGroup]="form" class="space-y-4">
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Property Location</label>
                           <select formControlName="country" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm">
                              <option value="ES_EU">Spain (EU Resident)</option>
                              <option value="ES_NON_EU">Spain (Non-EU)</option>
                              <option value="FR">France</option>
                              <option value="IT">Italy</option>
                           </select>
                       </div>

                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Gross Annual Income (€)</label>
                           <input type="number" formControlName="gross" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                       </div>
                       
                        <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Deductible Expenses (€)</label>
                           <input type="number" formControlName="expenses" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                           @if (isNonEuSpain()) {
                               <p class="text-[10px] text-rose-400 mt-1">Note: Non-EU residents typically cannot deduct expenses in Spain.</p>
                           }
                       </div>
                   </form>
               </div>

               <!-- Results -->
               <div class="flex flex-col gap-6">
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Tax Due</h3>
                       
                       <div class="text-5xl font-black text-white mb-2">
                           {{ calculateTax() | currency:'EUR':'symbol':'1.0-0' }}
                       </div>
                       <p class="text-xs text-slate-500 mb-6">
                           Effective Rate: <span class="text-white font-bold">{{ (calculateTax() / (formValues().gross || 1)) * 100 | number:'1.1-1' }}%</span>
                       </p>

                       @if (isTier3()) {
                           <div class="w-full max-w-xs bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 cursor-pointer hover:bg-indigo-500/20 transition-all group">
                               <div class="flex items-center justify-center gap-2 text-indigo-300 font-bold mb-1">
                                    <span class="material-icons group-hover:animate-pulse">description</span>
                                    <span>Generate Tax Form</span>
                               </div>
                               <p class="text-[10px] text-indigo-200/60">Pre-fill Form 210 (Spain) or 2042-NR (France)</p>
                           </div>
                       } @else {
                           <div class="p-3 bg-black/40 rounded border border-white/5">
                               <p class="text-[10px] text-slate-400">Upgrade to Tier 3 to auto-generate the official PDF forms for submission.</p>
                           </div>
                       }
                   </div>
                   
                   <!-- Coach -->
                   <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">🌍</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">Withholding Tax Explained</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">The tax paid at source is a 'Withholding Tax'. You likely need to declare this income in your home country too, but claim this amount as a credit.</p>
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
                // 19% on Net
                return Math.max(0, gross - expenses) * 0.19;
            case 'ES_NON_EU':
                // 24% on Gross (Expenses not deductible)
                return gross * 0.24;
            case 'FR':
                // Minimum 20% on Net (simplified)
                return Math.max(0, gross - expenses) * 0.20;
            case 'IT':
                // Cedolare Secca 21% on Gross
                return gross * 0.21;
            default:
                return 0;
        }
    }
}

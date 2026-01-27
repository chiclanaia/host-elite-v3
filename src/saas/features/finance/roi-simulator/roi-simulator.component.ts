import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
  selector: 'fin-01-roi-simulator',
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
             {{ isTier0() ? 'Basic Mode' : 'Advanced Mode' }}
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        <!-- Input Section -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full">
           <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">Investment Parameters</h3>
                @if (isTier3()) {
                    <button (click)="autoFill()" class="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors flex items-center gap-1">
                        <span>✨</span> Auto-Fill (AI)
                    </button>
                }
           </div>
           
           <form [formGroup]="form" class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              <!-- Basic Fields (Tier 0+) -->
              <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Purchase Price (€)</label>
                    <input type="number" formControlName="price" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Monthly Rent (€)</label>
                    <input type="number" formControlName="rent" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                  </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1">Monthly Loan Payment (€)</label>
                <input type="number" formControlName="loan" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
              </div>

              <!-- Advanced Fields (Tier 1+) -->
              @if (!isTier0()) {
                  <div class="pt-4 border-t border-white/10">
                      <h4 class="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                          Hidden Leakages <span class="text-xs font-normal text-slate-500">(Monthly)</span>
                      </h4>
                      
                      <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-xs font-medium text-slate-400 mb-1">Condo Fees / Charges</label>
                            <input type="number" formControlName="condo" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-slate-400 mb-1">Insurance</label>
                            <input type="number" formControlName="insurance" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                          </div>
                      </div>

                      <div class="mt-4 relative group">
                        <label class="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                            Maintenance / Repairs Provision 
                            <span class="text-indigo-400 cursor-help material-icons text-[14px]">info</span>
                        </label>
                        <input type="number" formControlName="repairs" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                            [class.border-indigo-500]="showCoachTip()">
                        
                        <!-- Coach Popup -->
                        <div class="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 border border-indigo-500/30 p-3 rounded-lg shadow-xl z-20"
                             [class.hidden]="!showCoachTip()">
                             <p class="text-xs text-indigo-200">
                                💡 <strong>Coach Tip:</strong> We recommend setting aside at least 10% of rent for unexpected repairs (approx €{{ (formValues()?.rent || 0) * 0.1 | number:'1.0-0' }}).
                             </p>
                        </div>
                      </div>
                      
                      <div class="mt-4">
                        <label class="block text-xs font-medium text-slate-400 mb-1">Taxes (Monthly avg)</label>
                        <input type="number" formControlName="taxes" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                      </div>
                  </div>
              } @else {
                  <!-- Teaser for Tier 1 -->
                  <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center mt-4">
                      <p class="text-xs text-slate-400 mb-2">Detailed expense tracking (Insurance, Repairs, Taxes) available in Standard Plan.</p>
                      <button class="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Unlock Full Expense Itemization</button>
                  </div>
              }
           </form>

           <!-- Actions -->
           <div class="mt-6 pt-4 border-t border-white/10 flex justify-end">
               <button (click)="saveSimulation()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                   <span class="material-icons text-sm">save</span> Save Simulation
               </button>
           </div>
        </div>

        <!-- Result Section (Traffic Light) -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
            
            @if (validationError()) {
                <div class="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-8 text-center animate-fade-in">
                    <div>
                        <span class="text-4xl mb-4 block">🚫</span>
                        <h3 class="text-xl font-bold text-white mb-2">Unrealistic Data</h3>
                        <p class="text-slate-400 text-sm mb-6">{{ validationError() }}</p>
                        <button (click)="validationError.set(null)" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm">Adjust Values</button>
                    </div>
                </div>
            }

            <!-- Result Circle -->
            <div class="relative z-10 w-64 h-64 rounded-full flex flex-col items-center justify-center border-8 transition-colors duration-500 shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-slate-900/50"
                 [class.border-emerald-500]="cashflow() > 0"
                 [class.border-amber-500]="cashflow() === 0"
                 [class.border-rose-500]="cashflow() < 0"
                 [class.shadow-emerald-500-20]="cashflow() > 0"
                 [class.shadow-rose-500-20]="cashflow() < 0">
                 
                 <div class="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Net Cashflow</div>
                 <div class="text-4xl font-black text-white">
                   {{ cashflow() | currency:'EUR':'symbol':'1.0-0' }}
                 </div>
                 <div class="text-xs text-slate-500 mt-2">per month</div>
            </div>

            <!-- Status Text -->
            <div class="mt-8 text-center relative z-10">
              <h2 class="text-2xl font-bold text-white mb-2" 
                  [class.text-emerald-400]="cashflow() > 0"
                  [class.text-rose-400]="cashflow() < 0">
                  {{ cashflow() > 0 ? 'Positive Yield' : 'Negative Cashflow' }}
              </h2>
              <p class="text-slate-400 max-w-xs mx-auto text-sm">
                 {{ cashflow() > 0 ? 'Great! Your asset covers its own debt and generates liquid cash.' : 'Warning: You will need to subsidize this asset with your own salary.' }}
              </p>
            </div>
            
            <!-- Pedagogical Tip Box (Always visible) -->
            <div class="mt-8 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl max-w-sm">
                 <div class="flex items-start gap-2">
                   <span class="text-lg">💡</span>
                   <div>
                     <h4 class="font-bold text-indigo-300 text-xs">Pedagogical Objective</h4>
                     <p class="text-[10px] text-indigo-200/80 mt-1">Cash-flow is king. Beginners confuse revenue with profit. Use this tool to account for hidden leakages and focus on net monthly liquidity.</p>
                   </div>
                 </div>
            </div>

            <!-- Background Glow -->
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent to-white/5 pointer-events-none"></div>
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
export class RoiSimulatorComponent {
  feature = input.required<Feature>();
  session = inject(SessionStore);

  tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
  isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
  isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

  form: FormGroup;
  formValues; // Signal
  validationError = signal<string | null>(null);
  showCoachTip = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      price: [200000, Validators.required],
      rent: [1500, Validators.required],
      loan: [900, Validators.required],
      // Tier 1+ fields
      condo: [0],
      insurance: [0],
      repairs: [0],
      taxes: [0]
    });

    this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

    // Coach tip logic: Show tip if repairs field is focused or hover (simulated here by value check for demo)
    // Ideally handled via events, but focusing on simple reactive logic for now
  }

  cashflow = computed(() => {
    const val = this.formValues();
    const rent = val?.rent || 0;
    const loan = val?.loan || 0;

    if (this.isTier0()) {
      return rent - loan;
    } else {
      const condo = val?.condo || 0;
      const insurance = val?.insurance || 0;
      const repairs = val?.repairs || 0;
      const taxes = val?.taxes || 0;
      return rent - (loan + condo + insurance + repairs + taxes);
    }
  });

  autoFill() {
    if (!this.isTier3()) return;
    // Mock API call to central bank / market data
    this.form.patchValue({
      price: 250000,
      rent: 1850,
      loan: 1100,
      condo: 120,
      insurance: 35,
      repairs: 185, // 10% logic
      taxes: 90
    });
  }

  saveSimulation() {
    // Guardrail: Unrealistic Data
    const val = this.form.value;
    if (val.rent > val.price * 0.02) { // > 2% monthly yield is suspicious
      this.validationError.set("Your expected rent seems unrealistically high (>24% gross yield). Please verify market rates.");
      return;
    }

    if (this.isTier0()) {
      // RG-01: Trigger Upgrade Modal
      alert("Saving simulations requires the Standard Plan. Upgrade to save up to 5 properties."); // Replace with modal service call
      return;
    }

    // Save logic would go here
    alert("Simulation saved!");
  }
}

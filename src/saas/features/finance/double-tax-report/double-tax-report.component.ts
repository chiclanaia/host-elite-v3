import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-10-double-tax-report',
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
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border-indigo-500/30">
             {{ isTier3() ? 'Treaty Advisor' : 'Income Summary' }}
         </div>
      </div>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
          
          <!-- Configuration -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
               <h3 class="text-xl font-bold text-white mb-6">Cross-Border Context</h3>
               <form [formGroup]="form" class="space-y-4">
                   <div>
                       <label class="block text-xs font-medium text-slate-400 mb-1">Fiscal Residence (Home)</label>
                        <select formControlName="residence" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm">
                              <option value="UK">United Kingdom</option>
                              <option value="US">USA</option>
                              <option value="DE">Germany</option>
                        </select>
                   </div>
                   
                    <div>
                       <label class="block text-xs font-medium text-slate-400 mb-1">Property Location (Source)</label>
                        <select formControlName="source" class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm">
                              <option value="FR">France</option>
                              <option value="ES">Spain</option>
                              <option value="IT">Italy</option>
                        </select>
                   </div>
                   
                   <div class="pt-4 border-t border-white/10">
                       <label class="block text-xs font-medium text-slate-400 mb-1">Total Tax Paid at Source (€)</label>
                       <input type="number" formControlName="taxPaid" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
                   </div>
               </form>
               
               <div class="mt-8 flex-1 flex flex-col justify-end">
                   <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                       <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">Treaty Status</h4>
                       <div class="flex items-center gap-2 text-emerald-400">
                           <span class="material-icons text-sm">link</span>
                           <span class="text-sm font-bold">Double Tax Treaty Active</span>
                       </div>
                       <p class="text-[10px] text-slate-500 mt-1">OECD Model Convention applies.</p>
                   </div>
               </div>
          </div>

          <!-- Report / Filing Map -->
          <div class="flex flex-col gap-6">
              <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 group">
                   <h3 class="text-xl font-bold text-white mb-4">Filing Strategy</h3>
                   
                   @if (isTier3()) {
                       <div class="space-y-6">
                            <!-- Step 1 -->
                            <div class="flex gap-4">
                                <div class="flex-col items-center hidden md:flex">
                                    <div class="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm">1</div>
                                    <div class="h-full w-px bg-slate-700 my-2"></div>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white text-sm">Declare in {{formValues().source}}</h4>
                                    <p class="text-xs text-slate-400">Pay the local non-resident tax first.</p>
                                    <div class="mt-1 inline-block px-2 py-1 bg-white/10 rounded text-[10px] text-white">
                                        Paid: {{ formValues().taxPaid | currency:'EUR':'symbol':'1.0-0' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2 -->
                             <div class="flex gap-4">
                                <div class="flex-col items-center hidden md:flex">
                                    <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/50">2</div>
                                    <div class="h-full w-px bg-slate-700 my-2"></div>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white text-sm">Declare in {{formValues().residence}} (Home)</h4>
                                    <p class="text-xs text-slate-400">Report gross income on your annual return.</p>
                                </div>
                            </div>
                            
                            <!-- Step 3 (The Treat) -->
                             <div class="flex gap-4">
                                <div class="flex-col items-center hidden md:flex">
                                    <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">3</div>
                                </div>
                                <div class="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg w-full">
                                    <h4 class="font-bold text-emerald-300 text-sm">Claim Tax Credit</h4>
                                    <p class="text-xs text-emerald-200/80 mb-2">Use the "Foreign Tax Credit" mechanism to deduct the {{ formValues().taxPaid | currency:'EUR':'symbol':'1.0-0' }} already paid.</p>
                                    <div class="text-[10px] text-slate-500 font-mono">Ref: Article 23 (Elimination of Double Taxation)</div>
                                </div>
                            </div>
                       </div>
                   } @else {
                       <div class="space-y-4 opacity-50 blur-[2px] select-none pointer-events-none">
                           <div class="h-20 bg-slate-800 rounded-lg"></div>
                           <div class="h-20 bg-slate-800 rounded-lg"></div>
                           <div class="h-20 bg-slate-800 rounded-lg"></div>
                       </div>
                       <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                            <span class="text-3xl mb-3">🗺️</span>
                            <h3 class="text-lg font-bold text-white mb-2">Unlock Treaty Advisor</h3>
                            <p class="text-xs text-slate-300 mb-4 max-w-xs">Don't guess with international law. Get a step-by-step filing map for your specific country pair.</p>
                            <button class="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 transition-colors">Upgrade Plan</button>
                        </div>
                   }
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
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            residence: ['UK', Validators.required],
            source: ['FR', Validators.required],
            taxPaid: [2400, Validators.required]
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }
}

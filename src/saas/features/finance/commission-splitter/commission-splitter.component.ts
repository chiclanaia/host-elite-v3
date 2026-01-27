import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-08-commission-splitter',
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
             {{ isTier3() ? 'Auto-Payout Engine' : 'Split Calculator' }}
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
           
           <!-- Setup Card -->
           <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
               <h3 class="text-xl font-bold text-white mb-6">Commission Rules</h3>
               <form [formGroup]="form" class="space-y-4">
                   <div>
                       <label class="block text-xs font-medium text-slate-400 mb-1">Total Booking Gross (€)</label>
                       <input type="number" formControlName="gross" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="comm-input-gross">
                   </div>
                   
                   <div class="grid grid-cols-2 gap-4">
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Platform Fee (%)</label>
                           <input type="number" formControlName="platformFee" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="comm-input-platformfee">
                       </div>
                       <div>
                           <label class="block text-xs font-medium text-slate-400 mb-1">Your Commission (%)</label>
                           <input type="number" formControlName="myCommission" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="comm-input-commission">
                       </div>
                   </div>

                   <div class="pt-4 border-t border-white/10">
                       <label class="block text-xs font-medium text-slate-400 mb-1">Deductible Expenses (Cleaning, Maintenance) (€)</label>
                       <input type="number" formControlName="expenses" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm" data-debug-id="comm-input-expenses">
                   </div>

                   @if (isTier3()) {
                       <div class="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3">
                           <div class="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">S</div>
                           <div class="flex-1">
                               <p class="text-xs text-white font-bold">Stripe Connect Active</p>
                               <p class="text-[10px] text-slate-400">Payouts will be routed automatically.</p>
                           </div>
                           <label class="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" class="sr-only peer" checked data-debug-id="comm-stripe-toggle">
                              <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                           </label>
                       </div>
                   }
               </form>
           </div>

           <!-- Result Statement -->
           <div class="bg-white text-slate-900 rounded-2xl p-8 flex flex-col shadow-2xl relative overflow-hidden font-mono text-sm">
               <!-- Receipt Header -->
               <div class="border-b-2 border-slate-200 pb-4 mb-4 flex justify-between items-start">
                   <div>
                       <h4 class="font-bold text-lg">OWNER STATEMENT</h4>
                       <p class="text-xs text-slate-500">Aug 2025 • Property #123</p>
                   </div>
                   <div class="text-right">
                       <div class="text-xs font-bold bg-slate-200 px-2 py-1 rounded uppercase">
                           {{ isTier3() ? 'PAID' : 'DRAFT' }}
                       </div>
                   </div>
               </div>

               <!-- Line Items -->
               <div class="space-y-2 mb-6 flex-1">
                   <div class="flex justify-between">
                       <span>Booking Revenue</span>
                       <span class="font-bold">{{ formValues().gross | currency:'EUR':'symbol':'1.2-2' }}</span>
                   </div>
                   <div class="flex justify-between text-rose-600">
                       <span>Platform Fee ({{ formValues().platformFee }}%)</span>
                       <span>-{{ getPlatformFee() | currency:'EUR':'symbol':'1.2-2' }}</span>
                   </div>
                   <div class="flex justify-between text-slate-500 italic pb-2 border-b border-dashed border-slate-300">
                       <span>Net Platform</span>
                       <span>{{ (formValues().gross - getPlatformFee()) | currency:'EUR':'symbol':'1.2-2' }}</span>
                   </div>
                   
                   <div class="flex justify-between text-rose-600 pt-2">
                       <span>Expenses</span>
                       <span>-{{ formValues().expenses | currency:'EUR':'symbol':'1.2-2' }}</span>
                   </div>
                   <div class="flex justify-between text-indigo-600 font-bold">
                       <span>Mgmt Commission ({{ formValues().myCommission }}%)</span>
                       <span>-{{ getCommission() | currency:'EUR':'symbol':'1.2-2' }}</span>
                   </div>
               </div>

               <!-- Total -->
               <div class="bg-slate-100 p-4 rounded-lg flex justify-between items-center border-t-2 border-slate-900">
                   <span class="font-bold text-lg">NET TO OWNER</span>
                   <span class="font-black text-2xl">{{ getNetOwner() | currency:'EUR':'symbol':'1.2-2' }}</span>
               </div>
               
               @if (!isTier3()) {
                   <button class="mt-6 w-full border-2 border-slate-900 text-slate-900 font-bold py-2 rounded hover:bg-slate-50 transition-colors uppercase" data-debug-id="comm-download-pdf-btn">
                       Download PDF
                   </button>
               }
           </div>
      </div>

       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div class="flex items-start gap-3">
               <span class="text-xl">🤝</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">Transparency & Proofs</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">If you manage properties for others, "Hidden Fees" are a relationship killer. Always attach 'Expense Proofs' (receipts) to this statement to build trust.</p>
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
export class CommissionSplitterComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    form: FormGroup;
    formValues;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            gross: [1200, Validators.required],
            platformFee: [15, Validators.required],
            myCommission: [20, Validators.required],
            expenses: [50]
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    }

    getPlatformFee() {
        const val = this.formValues();
        return (val.gross || 0) * (val.platformFee / 100);
    }

    getCommission() {
        const val = this.formValues();
        // Commission usually on Gross, or Net Platform? Prompt doesn't specify deeply, but standard is Gross or Net-Platform.
        // Let's assume standard agency model: Commission on Gross Rent (Platform fee is usually paid by guest or deducted before, but let's assume simplified "Management Fee on Revenue").
        // Actually, fairer is usually Commission on (Gross - Platform).
        const netPlatform = (val.gross || 0) - this.getPlatformFee();
        return netPlatform * (val.myCommission / 100);
    }

    getNetOwner() {
        const val = this.formValues();
        const netPlatform = (val.gross || 0) - this.getPlatformFee();
        return netPlatform - (val.expenses || 0) - this.getCommission();
    }
}

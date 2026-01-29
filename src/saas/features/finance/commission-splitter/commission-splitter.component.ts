import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-08-commission-splitter',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'COMMISSION.CohostingRevenueEngine' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'COMMISSION.StopFightingOverSpreadsheetsAutomate' | translate }}</p>
        </div>
         <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Multi-Owner Ledger' : 'Invoice Generator' }}
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
            <!-- COL 1: Inputs & Config -->
            <div class="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto custom-scrollbar">
               <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{{ 'COMMISSION.BookingDetails' | translate }}</h3>
               <form [formGroup]="form" class="space-y-4">
                   <div>
                       <label class="block text-xs font-medium text-slate-400 mb-1">{{ 'COMMISSION.BookingGross' | translate }}</label>
                       <div class="relative">
                           <span class="absolute left-3 top-2.5 text-slate-500">€</span>
                           <input type="number" formControlName="gross" class="w-full bg-black/20 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm" data-debug-id="comm-input-gross">
                       </div>
                   </div>
                   
                   <div class="p-3 bg-black/20 rounded-lg border border-white/5 space-y-3">
                       <label class="block text-xs font-bold text-indigo-300 uppercase">{{ 'COMMISSION.CommissionRules' | translate }}</label>
                       <div class="grid grid-cols-2 gap-3">
                           <div>
                               <label class="block text-[10px] text-slate-500 mb-1">Platform Fee (%)</label>
                               <input type="number" formControlName="platformFee" class="w-full bg-slate-800 border border-white/10 rounded-md px-2 py-1.5 text-white text-xs text-center" data-debug-id="comm-input-platformfee">
                           </div>
                           <div>
                               <label class="block text-[10px] text-slate-500 mb-1">{{ 'COMMISSION.MgmtFee' | translate }}</label>
                               <input type="number" formControlName="myCommission" class="w-full bg-slate-800 border border-white/10 rounded-md px-2 py-1.5 text-white text-xs text-center" data-debug-id="comm-input-commission">
                           </div>
                       </div>
                   </div>

                   <div class="p-3 bg-black/20 rounded-lg border border-white/5 space-y-3">
                       <label class="block text-xs font-bold text-rose-300 uppercase">{{ 'COMMISSION.Deductibles' | translate }}</label>
                        <div>
                           <label class="block text-[10px] text-slate-500 mb-1">{{ 'COMMISSION.RepairsMaintenance' | translate }}</label>
                           <input type="number" formControlName="expenses" class="w-full bg-slate-800 border border-white/10 rounded-md px-2 py-1.5 text-white text-xs" data-debug-id="comm-input-expenses">
                       </div>
                       <!-- Todo: Add line item list for Tier 2+ -->
                   </div>

                   <!-- VISUAL: Distribution Pie Chart (CSS Conic Gradient) -->
                   <div class="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
                        <div class="relative w-16 h-16 rounded-full border-4 border-slate-800 shadow-xl"
                            [style.background]="getPieConicGradient()">
                        </div>
                        <div class="flex-1 space-y-1">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span class="text-[10px] text-slate-400">{{ 'COMMISSION.YouMgmt' | translate }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span class="text-[10px] text-slate-400">{{ 'COMMISSION.Owner' | translate }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span class="text-[10px] text-slate-400">{{ 'COMMISSION.Platformexp' | translate }}</span>
                            </div>
                        </div>
                   </div>
               </form>
            </div>

            <!-- COL 2: Output (Statement) -->
            <div class="lg:col-span-1 flex flex-col gap-6">
                <!-- Result Statement -->
                <div class="bg-white text-slate-900 rounded-lg flex flex-col shadow-2xl relative overflow-hidden font-mono text-sm max-w-sm mx-auto w-full transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <!-- Receipt Header -->
                    <div class="bg-slate-100 border-b border-slate-300 p-6 flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-lg tracking-tight">{{ 'CS.Statement' | translate }}</h4>
                            <p class="text-[10px] text-slate-500 uppercase tracking-wide">REF: #INV-2025-001</p>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded">
                                {{ isTier3() ? 'PAID' : 'DRAFT' }}
                            </div>
                        </div>
                    </div>

                    <!-- Line Items -->
                    <div class="p-6 space-y-3 flex-1">
                        <div class="flex justify-between items-end border-b border-slate-100 pb-2">
                            <span class="text-xs font-bold text-slate-700">{{ 'CS.GrossRevenue' | translate }}</span>
                            <span class="font-bold text-slate-900">{{ formValues().gross | currency:'EUR':'symbol':'1.2-2' }}</span>
                        </div>
                        
                        <div class="space-y-1 pt-2">
                            <div class="flex justify-between text-xs text-rose-600">
                                <span>{{ 'COMMISSION.PlatformFee' | translate }}</span>
                                <span>-{{ getPlatformFee() | currency:'EUR':'symbol':'1.2-2' }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-rose-600">
                                <span>{{ 'COMMISSION.Maintenance' | translate }}</span>
                                <span>-{{ formValues().expenses | currency:'EUR':'symbol':'1.2-2' }}</span>
                            </div>
                             <div class="flex justify-between text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded -mx-2">
                                <span>{{ 'COMMISSION.MgmtCommission' | translate }}</span>
                                <span>-{{ getCommission() | currency:'EUR':'symbol':'1.2-2' }}</span>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="pt-4 mt-4 border-t-2 border-slate-900 flex justify-between items-center">
                            <span class="font-bold text-sm">{{ 'CS.NetPayout' | translate }}</span>
                            <span class="font-black text-xl text-emerald-600">{{ getNetOwner() | currency:'EUR':'symbol':'1.2-2' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Teaser for PDF -->
                @if (!isTier3()) {
                    <button class="w-full max-w-sm mx-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all" data-debug-id="comm-download-btn">
                        <span class="material-icons text-sm">picture_as_pdf</span>{{ 'COMMISSION.DownloadClientPdf' | translate }}</button>
                }
            </div>

            <!-- COL 3: Tier 3 Ledger -->
            <div class="lg:col-span-1 flex flex-col gap-6">
                <!-- Multi-Owner Ledger (Tier 3) -->
                <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1 relative overflow-hidden group">
                     <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <span class="material-icons text-sm">account_balance_wallet</span>{{ 'COMMISSION.OwnerLedger' | translate }}</h3>

                     @if (isTier3()) {
                         <div class="space-y-3">
                             <div class="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                                 <div>
                                     <div class="text-xs text-slate-300 font-bold">{{ 'COMMISSION.JohnDoe' | translate }}</div>
                                     <div class="text-[10px] text-slate-500">2 Properties</div>
                                 </div>
                                 <div class="text-right">
                                     <div class="text-xs font-mono text-emerald-400">+€2,450.00</div>
                                     <div class="text-[10px] text-slate-500">{{ 'COMMISSION.Pending' | translate }}</div>
                                 </div>
                             </div>
                             <div class="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center opacity-50">
                                 <div>
                                     <div class="text-xs text-slate-300 font-bold">{{ 'COMMISSION.JaneSmith' | translate }}</div>
                                     <div class="text-[10px] text-slate-500">1 Property</div>
                                 </div>
                                 <div class="text-right">
                                     <div class="text-xs font-mono text-slate-400">€0.00</div>
                                     <div class="text-[10px] text-emerald-500">{{ 'COMMISSION.Paid' | translate }}</div>
                                 </div>
                             </div>
                             
                             <div class="mt-6 pt-4 border-t border-white/10">
                                 <button class="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all" data-debug-id="comm-payout-btn">
                                     <span class="material-icons text-sm">payments</span>{{ 'COMMISSION.TriggerStripePayout' | translate }}</button>
                             </div>
                         </div>
                     } @else {
                         <div class="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                             <span class="text-3xl mb-2">💎</span>
                             <h3 class="text-sm font-bold text-white mb-2">{{ 'COMMISSION.ManageMultipleOwners' | translate }}</h3>
                             <p class="text-xs text-slate-400 mb-4">{{ 'COMMISSION.TrackBalancesAcross50Owners' | translate }}</p>
                             <div class="px-3 py-1 bg-amber-500/20 text-amber-300 rounded text-[10px] border border-amber-500/30">{{ 'COMMISSION.GoldFeature' | translate }}</div>
                         </div>
                     }
                </div>

                <!-- Coach -->
                <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">⚖️</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">{{ 'COMMISSION.ContractClarity' | translate }}</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">Disputes happen when "Net Revenue" is defined poorly. Our generator clearly separates 'Platform Fees' from 'Management Commission' to avoid lawsuits.</p>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
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
        const netPlatform = (val.gross || 0) - this.getPlatformFee();
        return netPlatform * (val.myCommission / 100);
    }

    getNetOwner() {
        const val = this.formValues();
        const netPlatform = (val.gross || 0) - this.getPlatformFee();
        return netPlatform - (val.expenses || 0) - this.getCommission();
    }

    getPieConicGradient() {
        // Calculate percentages for pie chart
        const gross = this.formValues().gross || 1; // avoid divide by zero
        const platFee = this.getPlatformFee();
        const expenses = this.formValues().expenses || 0;
        const comm = this.getCommission();
        const owner = this.getNetOwner();

        const pPlat = (platFee / gross) * 100;
        const pExp = (expenses / gross) * 100;
        const pComm = (comm / gross) * 100;
        const pOwner = (owner / gross) * 100;

        // Colors: Rose (Plat+Exp), Indigo (Comm), Emerald (Owner)
        // Segments:
        // 1. Plat+Exp (Rose) 0 -> pPlat+pExp
        // 2. Comm (Indigo) pPlat+pExp -> +pComm
        // 3. Owner (Emerald) -> Rest

        const stop1 = pPlat + pExp;
        const stop2 = stop1 + pComm;

        return `conic-gradient(
            #f43f5e 0% ${stop1}%, 
            #6366f1 ${stop1}% ${stop2}%, 
            #10b981 ${stop2}% 100%
        )`;
    }
}

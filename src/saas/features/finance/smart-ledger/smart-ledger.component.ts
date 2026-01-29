
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'fin-11-smart-ledger',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            {{ 'FIN_11.Title' | translate: 'Smart General Ledger' }}
          </h2>
          <p class="text-slate-400 text-sm mt-1">{{ 'FIN_11.Subtitle' | translate: 'AI-powered bookkeeping and receipt management engine' }}</p>
        </div>
        <div class="flex items-center gap-2">
            <!-- Tier Badge -->
            <span class="px-3 py-1 rounded-full text-xs font-bold border"
                  [ngClass]="getTypeBadgeClass(currentTier())">
                  {{ getTypeLabel(currentTier()) }}
            </span>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        <!-- Left: Ledger / Transaction Feed -->
        <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
            <!-- Controls (Tier Dependent) -->
            <div class="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex flex-wrap gap-4 items-center">
                <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" /></svg>
                    New Transaction
                </button>
                
                @if (currentTier() >= 1) {
                    <button class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                        Import CSV
                    </button>
                }

                @if (currentTier() >= 2) {
                    <button class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 border border-white/10 relative group">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" /></svg>
                        Link Bank (Plaid)
                        <span class="absolute -top-1 -right-1 flex h-3 w-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    </button>
                }
            </div>

            <!-- Transaction List (Mock) -->
            <div class="flex-1 bg-slate-800/50 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar relative">
                <table class="w-full text-left text-sm text-slate-400">
                    <thead class="bg-white/5 text-xs uppercase font-bold text-slate-500 sticky top-0 backdrop-blur-md">
                        <tr>
                            <th class="px-4 py-3">Date</th>
                            <th class="px-4 py-3">Description</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3 text-right">Amount</th>
                            <th class="px-4 py-3 text-center">Receipt</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        <tr class="hover:bg-white/5 transition-colors group cursor-pointer">
                            <td class="px-4 py-3">Today</td>
                            <td class="px-4 py-3 font-medium text-white">Airbnb Payout HFK...99</td>
                            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">Revenue</span></td>
                            <td class="px-4 py-3 text-right text-green-400 font-bold">+$1,240.00</td>
                            <td class="px-4 py-3 text-center">
                                @if (currentTier() >= 3) {
                                    <span class="text-purple-400 text-[10px] border border-purple-500/30 px-1 rounded bg-purple-900/30">AI MATCHED</span>
                                }
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors group cursor-pointer">
                            <td class="px-4 py-3">Yesterday</td>
                            <td class="px-4 py-3 font-medium text-white">Plumber Fix</td>
                            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs">Maintenance</span></td>
                            <td class="px-4 py-3 text-right text-red-400 font-bold">-$150.00</td>
                            <td class="px-4 py-3 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto text-slate-600 group-hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>
                            </td>
                        </tr>
                         <!-- Empty State / Blur for lower tiers -->
                        @if (currentTier() === 0) {
                           <!-- Fake rows blurred -->
                           <tr class="blur-sm opacity-50 select-none"><td colspan="5" class="px-4 py-3 text-center">...</td></tr>
                           <tr class="blur-md opacity-30 select-none"><td colspan="5" class="px-4 py-3 text-center">...</td></tr>
                        }
                    </tbody>
                </table>
                 @if (currentTier() === 0) {
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="bg-slate-900/90 p-6 rounded-2xl border border-white/10 text-center shadow-2xl pointer-events-auto max-w-sm">
                            <h3 class="text-white font-bold mb-2">Unlock Automation</h3>
                            <p class="text-slate-400 text-xs mb-4">Connect your bank and scan receipts automatically with Silver tier.</p>
                        </div>
                    </div>
                }
            </div>
        </div>

        <!-- Right: Visuals & AI Link -->
        <div class="flex flex-col gap-6">
            
            <!-- Visual Requirement: Cashflow Pulse Chart -->
            <div class="bg-slate-800 rounded-xl p-5 border border-white/10 shadow-lg relative overflow-hidden group">
                 <h3 class="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" /></svg>
                    Cashflow Pulse
                </h3>
                
                <!-- Mock Chart Visual -->
                <div class="h-32 flex items-end justify-between gap-1 px-2">
                    <!-- Random Bars with Trend Line SVG Overlay -->
                     <div class="w-1/12 bg-green-500/20 rounded-t-sm h-[40%] hover:bg-green-500 transition-colors"></div>
                     <div class="w-1/12 bg-red-500/20 rounded-t-sm h-[20%] hover:bg-red-500 transition-colors"></div>
                     <div class="w-1/12 bg-green-500/20 rounded-t-sm h-[60%] hover:bg-green-500 transition-colors"></div>
                     <div class="w-1/12 bg-green-500/20 rounded-t-sm h-[30%] hover:bg-green-500 transition-colors"></div>
                     <div class="w-1/12 bg-red-500/20 rounded-t-sm h-[50%] hover:bg-red-500 transition-colors"></div>
                     <div class="w-1/12 bg-green-500/20 rounded-t-sm h-[80%] hover:bg-green-500 transition-colors"></div>
                     <div class="w-1/12 bg-green-500/20 rounded-t-sm h-[55%] hover:bg-green-500 transition-colors"></div>
                </div>
                
                <!-- Simple Trend Line SVG -->
                <svg class="absolute bottom-5 left-5 right-5 h-32 w-full pointer-events-none opacity-50" preserveAspectRatio="none">
                    <path d="M0,100 Q50,50 100,20 T200,80 T300,40" fill="none" class="stroke-blue-400" stroke-width="2" />
                </svg>

                <div class="mt-4 flex justify-between text-xs text-slate-500 font-mono">
                    <span>Oct 01</span>
                    <span>Today</span>
                </div>
            </div>

            <!-- Tier 3: AI Reconciliation Agent -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 border border-purple-500/20 shadow-lg relative overflow-hidden">
                <div class="absolute top-0 right-0 p-2 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                </div>

                <div class="relative z-10">
                    <h3 class="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                        <span class="pulse-dot bg-purple-500"></span>
                        AI Reconciliation Agent
                    </h3>
                    
                    @if (currentTier() >= 3) {
                        <div class="text-xs text-slate-400 space-y-3">
                            <p>Auto-matching Airbnb Payouts...</p>
                            <div class="bg-black/30 rounded p-2 font-mono text-green-400 text-[10px]">
                                > Match Found: Booking #B8892<br>
                                > Gross: $2000 -> Net: $1850<br>
                                > Fee: $150 (Auto-Deducted)
                            </div>
                            <button class="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs transition-colors">
                                View Audit Trail
                            </button>
                        </div>
                    } @else {
                        <div class="text-xs text-slate-500 mb-3">
                            Eliminate manual data entry. Our AI agent matches payouts to bookings and fees automatically.
                        </div>
                        <div class="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-center">
                            <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Gold Feature</span>
                        </div>
                    }
                </div>
            </div>

            <!-- Context / Coach -->
            <div class="bg-blue-900/10 rounded-xl p-4 border border-blue-500/20">
                <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">Coach: The Deductible Rule</h4>
                        <p class="text-xs text-slate-400 leading-relaxed">
                            "Fiscal hygiene prevents audits. Always separate Personal vs. Business expenses. If in doubt, ask: 'Did this expense generate revenue?'"
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
    `,
    styles: [`
        .pulse-dot {
            height: 8px; width: 8px; border-radius: 50%; display: inline-block;
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
            animation: pulse-purple 2s infinite;
        }
        @keyframes pulse-purple {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(168, 85, 247, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    `]
})
export class SmartLedgerComponent {
    private session = inject(SessionStore);

    // Tier Logic
    currentTier = computed(() => {
        const plan = this.session.userProfile()?.plan || 'Freemium';
        if (plan === 'Gold') return 3;
        if (plan === 'Silver') return 2;
        if (plan === 'Bronze') return 1;
        return 0;
    });

    getTypeBadgeClass(tier: number): string {
        if (tier >= 3) return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30';
        if (tier >= 2) return 'bg-slate-300/10 text-slate-300 border-slate-300/30';
        if (tier >= 1) return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
        return 'bg-slate-700/50 text-slate-500 border-slate-600 transition-all';
    }

    getTypeLabel(tier: number): string {
        if (tier >= 3) return 'GOLD: AI AGENT ACTIVE';
        if (tier >= 2) return 'SILVER: BANK SYNC';
        if (tier >= 1) return 'BRONZE: CSV IMPORT';
        return 'FREE: MANUAL MODE';
    }
}

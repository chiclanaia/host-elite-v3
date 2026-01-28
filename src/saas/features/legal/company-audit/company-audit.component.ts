import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-06-company-audit',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Tax Structure Architect</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Analyze and optimize your property holding structure (Personal vs. Company).</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Holding Simulator' : (isTier2() ? 'Expense Scanner' : 'Basic Check') }}
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
            <!-- Simulator Input -->
            <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-y-auto">
                <h3 class="text-xl font-bold text-white mb-6">Structure Configuration</h3>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Current Ownership Mode</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/10 flex-1 hover:bg-white/10 transition-colors" data-debug-id="audit-struct-personal">
                                <span class="w-4 h-4 rounded-full border border-white/50 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                                <span class="text-white text-sm font-bold">Personal Name</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/10 flex-1 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" data-debug-id="audit-struct-holding">
                                <span class="w-4 h-4 rounded-full border border-white/50"></span>
                                <span class="text-white text-sm">Company (SCI/LMNP)</span>
                            </label>
                        </div>
                    </div>

                    <div class="p-4 bg-slate-900/50 rounded-lg border border-white/5">
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Portfolio Value</label>
                        <div class="flex justify-between items-end mb-2">
                            <div class="text-3xl font-mono text-white">€1,200,000</div>
                            <div class="text-xs text-emerald-400 font-bold">+4.5% / yr</div>
                        </div>
                        <input type="range" class="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer hover:bg-slate-600 transition-colors" data-debug-id="audit-portfolio-range">
                    </div>

                    @if (isTier2()) {
                         <div class="border-t border-white/10 pt-4">
                            <label class="flex items-center justify-between mb-2">
                                <span class="text-slate-300 font-bold text-sm">Deductibility Scanner</span>
                                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                            </label>
                            <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                                <div class="flex items-center gap-1"><span class="text-emerald-500">✓</span> Loan Interest</div>
                                <div class="flex items-center gap-1"><span class="text-emerald-500">✓</span> Renovations</div>
                                <div class="flex items-center gap-1"><span class="text-emerald-500">✓</span> Agency Fees</div>
                                <div class="flex items-center gap-1"><span class="text-emerald-500">✓</span> Travel Costs</div>
                            </div>
                        </div>
                    }

                    @if (isTier3()) {
                        <div class="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                            <h4 class="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                                <span class="material-icons text-sm">hub</span> Holding Structure Sim
                            </h4>
                            <p class="text-xs text-slate-400 mb-3 leading-relaxed">Simulates <span class="text-white font-bold">Family Holding (SAS)</span> vs <span class="text-white font-bold">SCI IS</span>. Calculates exit tax leakage and dividend distribution efficiency.</p>
                            <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold shadow-lg transition-all" data-debug-id="audit-run-advanced-sim-btn">
                                Simulate Corporate Drift
                            </button>
                        </div>
                    }
                </div>
            </div>
            
            <!-- Visualization -->
            <div class="flex flex-col gap-6">
                <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden flex-1">
                     <h4 class="text-white font-bold mb-6 text-center z-10">Projected Net Wealth (20 Years)</h4>
                    
                    <div class="flex items-end justify-center gap-12 h-64 w-full px-8 z-10">
                        <!-- Personal -->
                        <div class="flex flex-col items-center gap-2 group cursor-pointer">
                            <div class="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">Personal</div>
                            <div class="w-16 h-32 bg-slate-700 rounded-t-lg relative overflow-hidden group-hover:bg-slate-600 transition-colors"></div>
                            <div class="text-xl font-mono text-slate-400 group-hover:text-white transition-colors">€2.1M</div>
                        </div>

                        <!-- Holding -->
                        <div class="flex flex-col items-center gap-2 group cursor-pointer relative">
                             @if(isTier3()) {
                                <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                                    RECOMMENDED
                                </div>
                             }
                            <div class="text-xs font-bold text-emerald-500/50 group-hover:text-emerald-400 transition-colors">Holding Co.</div>
                            <div class="w-16 h-56 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg shadow-[0_0_30px_rgba(52,211,153,0.2)] group-hover:shadow-[0_0_50px_rgba(52,211,153,0.4)] transition-all relative overflow-hidden">
                                <div class="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
                            </div>
                            <div class="text-xl font-mono text-emerald-400 group-hover:text-emerald-300 transition-colors font-bold">€3.4M</div>
                        </div>
                    </div>
                    
                    <div class="mt-8 text-center z-10">
                         <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-slate-400">
                             <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                             Potential Tax Savings: <span class="text-white font-bold">€1,300,000</span>
                         </div>
                    </div>
                </div>
                
                <!-- Coach -->
                <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">🎓</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">VAT Recovery (TVA)</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">Under specific conditions (providing 3 hotel-like services), you can recover 20% VAT on your property purchase or renovations. This requires a professional structure.</p>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class CompanyAuditComponent {
    feature = computed(() => ({
        id: 'LEG_06',
        name: 'Company Audit',
        description: 'Structural Wealth Optimization Simulator',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

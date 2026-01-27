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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
           🏛️ Wealth Structuring
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Simulator Input -->
            <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                <h3 class="text-xl font-bold text-white mb-6">Transition Simulator</h3>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Current Structure</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/10 flex-1">
                                <span class="w-4 h-4 rounded-full border border-white/50 bg-indigo-500"></span>
                                <span class="text-white text-sm">Personal Name</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/10 flex-1 opacity-50">
                                <span class="w-4 h-4 rounded-full border border-white/50"></span>
                                <span class="text-white text-sm">Holding Co.</span>
                            </label>
                        </div>
                    </div>

                     <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Portfolio Value</label>
                        <div class="text-3xl font-mono text-white">€1,200,000</div>
                        <input type="range" class="w-full mt-2 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer">
                    </div>

                    @if (tier() === 'TIER_3') {
                        <div class="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                            <h4 class="text-indigo-300 font-bold mb-2">Wealth Optimization Engine</h4>
                            <ul class="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                <li>Simulating Inheritance Tax (20 years)</li>
                                <li>Calculating Capital Gains on Exit</li>
                                <li>Analyzing Dividend vs. Salary Strategy</li>
                            </ul>
                        </div>
                    }

                    <button class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20">
                        Run Simulation
                    </button>
                </div>
            </div>
            
            <!-- Coach -->
            <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">🪤</span>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm">The "Personal Name" Trap</h4>
                        <p class="text-xs text-indigo-200/80 mt-1">Buying in your own name is easy, but shifting to a company later triggers Capital Gains Tax on the sale. Structure it right from day one.</p>
                    </div>
                </div>
            </div>

            <!-- Visualization -->
            <div class="flex flex-col justify-center">
                <div class="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                    <h4 class="text-white font-bold mb-4 text-center">Projected Net Wealth (20 Years)</h4>
                    
                    <div class="h-64 flex items-end justify-center gap-8 px-8">
                        <!-- Option A -->
                        <div class="w-24 group relative">
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-slate-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">€2.1M</div>
                            <div class="h-40 bg-slate-600 rounded-t-lg w-full"></div>
                            <div class="mt-2 text-center text-xs text-slate-400">Personal</div>
                        </div>

                        <!-- Option B -->
                        <div class="w-24 group relative">
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-emerald-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">€3.4M</div>
                            <div class="h-64 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg w-full shadow-[0_0_20px_rgba(52,211,153,0.3)]"></div>
                            <div class="mt-2 text-center text-xs text-emerald-400 font-bold">Structure X</div>
                        </div>
                    </div>

                    <p class="text-center text-xs text-slate-500 mt-6 max-w-sm mx-auto">
                        *Switching to a corporate structure could save you <span class="text-white">€1.3M</span> in tax leakage over 20 years.
                    </p>
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
}

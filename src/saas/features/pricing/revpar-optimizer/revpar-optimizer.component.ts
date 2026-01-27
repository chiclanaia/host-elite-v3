import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'pri-02-revpar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/30 text-xs font-mono">
           🤖 AI Dynamic Pricing
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                 <div class="bg-black/20 p-4 rounded-lg border border-white/5">
                     <div class="text-xs text-slate-500 uppercase font-bold">Current RevPAR</div>
                     <div class="text-2xl font-mono text-white">€112</div>
                     <div class="text-xs text-emerald-400">↑ 12% vs Market</div>
                 </div>
                 <div class="bg-black/20 p-4 rounded-lg border border-white/5">
                     <div class="text-xs text-slate-500 uppercase font-bold">Wait Time</div>
                     <div class="text-2xl font-mono text-white">4.2d</div>
                     <div class="text-xs text-slate-500">Avg booking window</div>
                 </div>
            </div>

            <!-- Coach Tip -->
            <div class="mb-6 mx-0 p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">💡</span>
                    <span class="text-purple-300 font-bold text-sm uppercase">Coach Tip</span>
                </div>
                <p class="text-slate-300 text-xs italic">
                    "Volume > Rate (Initially). Underprice slightly to get your first 10 reviews fast. High ratings unlock higher pricing power later."
                </p>
            </div>

            <div class="flex-1 bg-slate-900 rounded-lg p-6 relative overflow-hidden">
                <h3 class="text-white font-bold mb-4 z-10 relative">Demand Pulse (Next 30 Days)</h3>
                
                <!-- Mock Pulse Visual -->
                <div class="absolute inset-x-0 bottom-0 top-12 flex items-end px-4 gap-1 opacity-50">
                    @for (day of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track day) {
                        <div class="flex-1 bg-indigo-500/50 rounded-t transition-all hover:bg-indigo-400"
                             [style.height.%]="(day * 17) % 80 + 20"></div>
                    }
                </div>

                 @if (tier() === 'TIER_3') {
                     <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur border border-indigo-500/50 p-6 rounded-xl shadow-2xl text-center z-20">
                         <div class="text-indigo-400 font-bold mb-2">Event Detected: "Tech Conf Paris"</div>
                         <p class="text-white text-sm mb-4">Demand is spiking for Oct 14-16.</p>
                         <button class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded shadow-lg animate-pulse"
                                 data-debug-id="revpar-auto-price-btn">
                             Auto-Increase Price to €220
                         </button>
                     </div>
                 }
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class RevparOptimizerComponent {
    feature = computed(() => ({
        id: 'PRI_02',
        name: 'RevPAR Optimizer',
        description: 'AI-Driven Dynamic Pricing Algorithm',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

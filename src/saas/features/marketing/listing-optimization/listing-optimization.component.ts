import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'mkt-00-listing-optimization',
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
            🚀 Conversion Rate
        </div>
      </div>

      <!-- TIER 0: Static Checklist -->
      @if (tier() === 'TIER_0' || tier() === 'Freemium') {
         <div class="p-6 bg-slate-800 rounded-xl border border-white/10">
            <h3 class="text-xl font-bold text-white mb-4">Pro-Tips Checklist</h3>
            <ul class="space-y-3">
               <li class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                   <span class="text-emerald-400">✔️</span>
                   <span class="text-slate-300">Use "Hero" photo (best view) as cover.</span>
               </li>
               <li class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                   <span class="text-slate-500">⭕</span>
                   <span class="text-slate-300">Title length should be 50-60 chars max.</span>
               </li>
               <li class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                   <span class="text-slate-500">⭕</span>
                   <span class="text-slate-300">Answer "Wifi speed" in description.</span>
               </li>
            </ul>
         </div>
      }

      <!-- TIER 3: AI Audit -->
      @if (tier() === 'TIER_3') {
         <div class="p-6 bg-slate-800 rounded-xl border border-white/10 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-white mb-4">AI Listing Auditor</h3>
            
            <div class="flex gap-4 mb-6">
                <input type="text" placeholder="Paste Airbnb URL here..." class="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">
                    Analyze Listing
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Score Card -->
                <div class="p-6 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div class="text-5xl font-extrabold text-amber-400 mb-2">72/100</div>
                    <div class="text-sm font-bold text-slate-400 uppercase tracking-widest">Visibility Score</div>
                </div>

                <!-- Suggestions -->
                <div class="md:col-span-2 space-y-3">
                    <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 items-center">
                        <span class="text-2xl">⚠️</span>
                        <div>
                            <h4 class="text-red-300 font-bold">Missing "Workstation" Keyword</h4>
                            <p class="text-slate-400 text-xs">High demand in your area. Add a photo of the desk.</p>
                        </div>
                    </div>
                    <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex gap-3 items-center">
                        <span class="text-2xl">✅</span>
                        <div>
                            <h4 class="text-emerald-300 font-bold">Great Response Time</h4>
                            <p class="text-slate-400 text-xs">You are better than 80% of competitors.</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ListingOptimizationComponent {
    feature = computed(() => ({
        id: 'MKT_00',
        name: 'Listing Optimization',
        description: 'AI-Driven Conversion Auditor',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

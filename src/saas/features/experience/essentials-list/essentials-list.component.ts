import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'exp-01-essentials-list',
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
           🛒 Procurement
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
           <!-- Filters -->
           <div class="flex gap-4 mb-6 pb-6 border-b border-white/5">
                <button class="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20" data-debug-id="essential-filter-kitchen">Kitchen</button>
                <button class="px-4 py-2 rounded-full bg-transparent border border-white/10 text-slate-400 text-sm hover:text-white" data-debug-id="essential-filter-bathroom">Bathroom</button>
                <button class="px-4 py-2 rounded-full bg-transparent border border-white/10 text-slate-400 text-sm hover:text-white" data-debug-id="essential-filter-bedroom">Bedroom</button>
           </div>

           <!-- Coach Tip -->
           <div class="mb-6 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">💡</span>
                    <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                </div>
                <p class="text-slate-300 text-xs italic">
                    "The €5 Welcome Basket. A bottle of wine and some local chips costs you €5 but can prevent a 4-star review due to a minor issue."
                </p>
           </div>
           
           <!-- Grid -->
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
               <!-- Item 1 -->
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 transition-colors group">
                   <div class="flex justify-between items-start mb-2">
                       <h4 class="text-white font-bold">Nespresso Machine</h4>
                       <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Must Have</span>
                   </div>
                   <p class="text-xs text-slate-400 mb-4">Invest in durability. Most guests filter by 'Coffee Machine'.</p>
                   
                   @if (tier() === 'TIER_3') {
                       <div class="pt-3 border-t border-white/5 flex items-center justify-between">
                           <div>
                               <span class="text-xs text-slate-500 block">Lowest Price</span>
                               <span class="text-white font-mono font-bold">€79.00</span>
                           </div>
                           <button class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-bold" data-debug-id="essential-buy-nespresso">Buy Now</button>
                       </div>
                   } @else {
                        <div class="pt-3 border-t border-white/5">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-0" data-debug-id="essential-check-nespresso">
                                <span class="text-sm text-slate-300">Mark as Acquired</span>
                            </label>
                        </div>
                   }
               </div>

               <!-- Item 2 -->
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 transition-colors">
                   <div class="flex justify-between items-start mb-2">
                       <h4 class="text-white font-bold">Toaster (4-slice)</h4>
                       <span class="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">Standard</span>
                   </div>
                   <p class="text-xs text-slate-400 mb-4">Essential for families. Stainless steel is easier to clean.</p>
                   
                    @if (tier() === 'TIER_3') {
                       <div class="pt-3 border-t border-white/5 flex items-center justify-between">
                           <div>
                               <span class="text-xs text-slate-500 block">Lowest Price</span>
                               <span class="text-white font-mono font-bold">€34.99</span>
                           </div>
                           <button class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-bold" data-debug-id="essential-buy-toaster">Buy Now</button>
                       </div>
                   } @else {
                        <div class="pt-3 border-t border-white/5">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-0" data-debug-id="essential-check-toaster">
                                <span class="text-sm text-slate-300">Mark as Acquired</span>
                            </label>
                        </div>
                   }
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class EssentialsListComponent {
    feature = computed(() => ({
        id: 'EXP_01',
        name: 'Essentials List',
        description: 'Dynamic Procurement Optimizer',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

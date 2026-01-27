import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'pri-01-yield-setup',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-green-500/10 text-green-300 rounded-lg border border-green-500/30 text-xs font-mono">
           💲 Pricing Strategy
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
           <div class="lg:col-span-1 space-y-6">
               <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                   <h3 class="text-white font-bold mb-4">Cost-Plus Baseline</h3>
                   <div class="space-y-4">
                       <div>
                           <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Nightly Break-Even</label>
                           <div class="text-2xl font-mono text-white">€85.00</div>
                           <p class="text-[10px] text-slate-500">Calculated from Finance Module (Loan + Fixed)</p>
                       </div>
                       <div>
                           <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Desired Margin</label>
                           <input type="range" class="w-full h-1 bg-slate-600 rounded appearance-none" min="0" max="100" value="20" data-debug-id="yield-margin-range">
                           <div class="text-right text-xs text-emerald-400 font-bold">+20%</div>
                       </div>
                   </div>
               </div>

                <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                   <h3 class="text-white font-bold mb-4">Launch Strategy</h3>
                    <label class="flex items-start gap-3 p-3 rounded bg-indigo-500/10 border border-indigo-500/30 cursor-pointer">
                        <input type="radio" checked name="strat" class="mt-1 bg-slate-800 border-none text-indigo-500 focus:ring-0" data-debug-id="yield-strat-launch-input">
                        <div>
                            <div class="text-indigo-300 font-bold text-sm">New Listing Boost</div>
                            <p class="text-xs text-slate-400">-20% for first 3 bookings to get reviews fast.</p>
                        </div>
                    </label>

                    <!-- Coach Tip -->
                    <div class="mt-6 p-4 bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-lg">💡</span>
                            <span class="text-green-300 font-bold text-sm uppercase">Coach Tip</span>
                        </div>
                        <p class="text-slate-300 text-xs italic">
                            "Mind the Gaps. 'Orphan nights' (1-2 day gaps) kill occupancy. Allow 1-night stays if they fill a gap between bookings."
                        </p>
                    </div>
               </div>
           </div>

           <div class="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-6 relative flex flex-col">
                <h3 class="text-white font-bold mb-6">12-Month Price Forecast</h3>
                
                <!-- Mock Chart -->
                <div class="flex-1 flex items-end justify-between px-4 gap-2 border-b border-white/10 pb-4">
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[40%]" title="Jan"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[35%]" title="Feb"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[45%]" title="Mar"></div>
                    <div class="w-full bg-emerald-500 rounded-t h-[60%]" title="Apr (Easter)"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[55%]" title="May"></div>
                    <div class="w-full bg-amber-500 rounded-t h-[80%]" title="Jun (Summer)"></div>
                    <div class="w-full bg-amber-500 rounded-t h-[90%]" title="Jul (High)"></div>
                    <div class="w-full bg-amber-500 rounded-t h-[95%]" title="Aug (Peak)"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[65%]" title="Sep"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[50%]" title="Oct"></div>
                    <div class="w-full bg-slate-700 hover:bg-indigo-500 transition-colors rounded-t h-[40%]" title="Nov"></div>
                    <div class="w-full bg-emerald-500 rounded-t h-[70%]" title="Dec (Xmas)"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500 mt-2 px-1">
                    <span>Jan</span><span>Dec</span>
                </div>

                @if (tier() === 'TIER_3') {
                    <div class="absolute top-6 right-6 flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs text-emerald-400 font-bold">Live Market Data Active</span>
                    </div>
                }
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class YieldSetupComponent {
    feature = computed(() => ({
        id: 'PRI_01',
        name: 'Yield Setup',
        description: 'Market-Adaptive Pricing Configurator',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

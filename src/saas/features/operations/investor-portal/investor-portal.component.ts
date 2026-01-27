import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-07-investor-portal',
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
           📈 Owner Reporting
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
           <!-- Setup Column -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                <h3 class="text-xl font-bold text-white mb-6">Portal Configuration</h3>
                
                @if (tier() === 'TIER_3') {
                    <div class="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                         <div class="flex items-center gap-2 mb-2">
                             <span class="material-icons text-indigo-400">verified</span>
                             <span class="text-white font-bold">Whitelabel Enabled</span>
                         </div>
                         <p class="text-xs text-slate-400">Investors will see YOUR logo and brand colors, not ours.</p>
                    </div>
                }

                <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                        <div>
                             <h4 class="text-white font-bold">Mr. Smith (Owner 1)</h4>
                             <p class="text-xs text-slate-500">Owns: Loft Marais</p>
                        </div>
                        <button class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded" data-debug-id="investor-invite-btn">Send Invite</button>
                    </div>
                </div>
           </div>

            <!-- Preview Column -->
            <div class="bg-slate-100 rounded-xl p-6 text-slate-800 flex flex-col shadow-inner">
                 <div class="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                     <div class="font-serif text-xl font-bold italic text-slate-900">Elite Hosting</div>
                     <div class="text-xs text-slate-500 uppercase tracking-widest">October Report</div>
                 </div>

                 <div class="grid grid-cols-2 gap-4 mb-8">
                     <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
                         <div class="text-xs text-slate-500 uppercase font-bold">Net Payout</div>
                         <div class="text-3xl font-bold text-emerald-600">€2,450</div>
                     </div>
                     <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
                         <div class="text-xs text-slate-500 uppercase font-bold">Occupancy</div>
                         <div class="text-3xl font-bold text-slate-800">88%</div>
                     </div>
                 </div>

                 <div class="bg-white p-4 rounded shadow-sm border border-slate-200 flex-1">
                      <h4 class="font-bold mb-2">Manager's Note</h4>
                      <p class="text-sm text-slate-600 leading-relaxed italic">
                          "Great month despite the rain. We replaced the coffee machine (receipt attached) which immediately boosted reviews. November bookings are already up 20% YoY."
                      </p>
                      
                      <div class="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                          <button class="text-indigo-600 text-xs font-bold flex items-center gap-1" data-debug-id="investor-download-pdf-btn">
                              <span class="material-icons text-sm">download</span> Download PDF
                          </button>
                      </div>
                 </div>
                 
                  <!-- Coach -->
                  <div class="mt-6 pt-4 border-t border-slate-200">
                       <h4 class="text-indigo-600 font-bold text-sm mb-1">Context > Numbers</h4>
                       <p class="text-[10px] text-slate-500 italic">Always explain expenses. A €500 repair bill without context angers owners. With a note ("Boosted reviews"), it's an investment.</p>
                  </div>
             </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class InvestorPortalComponent {
    feature = computed(() => ({
        id: 'OPS_07',
        name: 'Investor Portal',
        description: 'Transparency & ROI Reporting Dashboard',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

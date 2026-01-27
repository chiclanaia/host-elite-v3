import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-08-foreign-id',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-teal-500/10 text-teal-300 rounded-lg border border-teal-500/30 text-xs font-mono">
           🌍 Expat Admin
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                 <h2 class="text-2xl font-bold text-white mb-6">Which ID do you need?</h2>
                 <div class="space-y-4">
                     <button class="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500 transition-all group">
                         <div class="flex justify-between items-center mb-1">
                             <div class="font-bold text-white group-hover:text-indigo-400">NIE (Spain)</div>
                             <span class="material-icons text-slate-500 group-hover:text-indigo-400">chevron_right</span>
                         </div>
                         <p class="text-xs text-slate-500">Foreigner ID Number. Mandatory for utilities & taxes.</p>
                     </button>
                     
                      <button class="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500 transition-all group">
                         <div class="flex justify-between items-center mb-1">
                             <div class="font-bold text-white group-hover:text-indigo-400">Siret (France)</div>
                             <span class="material-icons text-slate-500 group-hover:text-indigo-400">chevron_right</span>
                         </div>
                         <p class="text-xs text-slate-500">Business Registration Number. Mandatory for all hosts.</p>
                     </button>

                      <button class="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500 transition-all group">
                         <div class="flex justify-between items-center mb-1">
                             <div class="font-bold text-white group-hover:text-indigo-400">Codice Fiscale (Italy)</div>
                             <span class="material-icons text-slate-500 group-hover:text-indigo-400">chevron_right</span>
                         </div>
                         <p class="text-xs text-slate-500">Tax Code. Required for contracts.</p>
                     </button>
                 </div>
                  
                  <!-- Coach -->
                  <div class="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                       <div class="flex items-start gap-3">
                          <span class="text-xl">🆔</span>
                          <div>
                              <h4 class="font-bold text-indigo-300 text-sm">What is a NIE?</h4>
                              <p class="text-xs text-indigo-200/80 mt-1">In Spain, the NIE (Número de Identidad de Extranjero) is your unique fiscal ID. You cannot buy property, open a bank account, or pay taxes without it.</p>
                          </div>
                      </div>
                  </div>
             </div>

            <div class="bg-indigo-900/10 p-8 rounded-2xl border border-indigo-500/10 flex flex-col items-center text-center">
                 <div class="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-indigo-500/20">
                     🤖
                 </div>
                 <h3 class="text-xl font-bold text-white mb-2">Concierge Bridge</h3>
                 <p class="text-slate-400 text-sm mb-6">
                     Don't want to queue at the consulate? <br>
                     For Tier 3 members, we have direct API links with local partners who handle the paperwork for you.
                 </p>
                 
                 @if (tier() === 'TIER_3') {
                     <button class="px-8 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 shadow-xl transition-transform active:scale-95">
                         Connect with Partner
                     </button>
                 } @else {
                      <div class="text-xs text-slate-500 bg-black/20 px-3 py-1 rounded">Upgrade to Tier 3 to access Concierge Bridge</div>
                 }
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ForeignIdComponent {
    feature = computed(() => ({
        id: 'LEG_08',
        name: 'Foreign ID Assistant',
        description: 'International Admin Onboarding Agent',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

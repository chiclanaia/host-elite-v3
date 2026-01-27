import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-07-mandate',
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
           ⚖️ Contracts
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Config -->
           <div class="lg:col-span-1 space-y-6">
               <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                   <h3 class="text-white font-bold mb-4">Contract Terms</h3>
                   <div class="space-y-4">
                       <div>
                           <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Management Fee</label>
                           <div class="flex items-center gap-2">
                               <input type="number" value="20" class="bg-black/30 border border-white/10 rounded px-3 py-2 text-white w-20 text-center font-bold" data-debug-id="mandate-fee-input">
                               <span class="text-white font-bold">%</span>
                           </div>
                       </div>
                       
                        <div>
                           <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Liability Limit</label>
                           <select class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white" data-debug-id="mandate-liability-select">
                               <option>Standard (Gross Negligence only)</option>
                               <option>Full Liability (Premium)</option>
                           </select>
                       </div>
                   </div>
               </div>

                @if (tier() === 'TIER_3') {
                   <div class="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
                       <h3 class="text-white font-bold mb-2">e-Signature</h3>
                       <p class="text-xs text-slate-400 mb-4">Send directly to owner via DocuSign/HelloSign integration.</p>
                       <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2" data-debug-id="mandate-sign-btn">
                           <span class="material-icons text-sm">draw</span> Send for Signature
                       </button>
                   </div>
                }
                
                <!-- Coach -->
                <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">⚖️</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">Limit Your Liability</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">Never accept "Full Liability". Your contract should limit claims to "Gross Negligence" only, protecting you from minor guest accidents.</p>
                        </div>
                    </div>
                </div>
           </div>

           <!-- Preview -->
           <div class="lg:col-span-2 bg-white text-slate-900 p-12 rounded-xl shadow-2xl overflow-y-auto font-serif text-sm leading-relaxed">
               <h2 class="text-2xl font-bold text-center mb-8 uppercase tracking-widest">Property Management Mandate</h2>
               
               <p class="mb-4"><strong>BETWEEN:</strong></p>
               <p class="mb-6 pl-4 border-l-2 border-slate-300">
                   The Owner,<br>
                   [Owner Name]<br>
                   [Owner Address]
               </p>

               <p class="mb-4"><strong>AND:</strong></p>
                <p class="mb-8 pl-4 border-l-2 border-slate-300">
                   The Manager,<br>
                   [My Agency Name]<br>
                   [Agency Address]
               </p>

               <h3 class="font-bold mb-2">1. OBJECT</h3>
               <p class="mb-6 text-justify">The Owner mandates the Manager to manage the short-term rental of the property located at [Address].</p>

               <h3 class="font-bold mb-2">2. REMUNERATION</h3>
               <p class="mb-6 text-justify">In consideration for the services, the Manager shall receive a commission of <strong>20%</strong> of the Net Rental Income.</p>

               <h3 class="font-bold mb-2">3. TERMINATION</h3>
               <p class="mb-6 text-justify">This agreement may be terminated by either party with a notice period of 30 days.</p>
               
               <div class="mt-12 flex justify-between pt-12 border-t border-slate-200">
                   <div class="w-48 border-t border-slate-400 pt-2 text-center text-xs text-slate-500 uppercase">Signature (Owner)</div>
                   <div class="w-48 border-t border-slate-400 pt-2 text-center text-xs text-slate-500 uppercase">Signature (Manager)</div>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class MandateGeneratorComponent {
    feature = computed(() => ({
        id: 'LEG_07',
        name: 'Mandate Generator',
        description: 'Legal Property Management Contract Suite',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

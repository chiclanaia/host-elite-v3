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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Digital Mandate Suite</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Generate, customize, and sign property management agreements.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'e-Signature Vault' : (isTier2() ? 'Clause Editor' : 'Basic Template') }}
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
           <!-- Config -->
           <div class="lg:col-span-1 space-y-6 flex flex-col overflow-y-auto">
               <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                   <h3 class="text-xl font-bold text-white mb-6">Contract Configuration</h3>
                   
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
                               <option>Standard (Gross Negligence)</option>
                               <option>Full Liability (Not Recommended)</option>
                           </select>
                       </div>

                       @if (isTier2()) {
                           <div class="border-t border-white/10 pt-4 mt-4">
                               <label class="block text-slate-400 text-xs uppercase font-bold mb-3">Optional Clauses</label>
                               <div class="space-y-2">
                                   <label class="flex items-center gap-2 cursor-pointer group">
                                       <input type="checkbox" class="rounded border-slate-600 bg-slate-700 text-indigo-500" checked data-debug-id="mandate-clause-concierge">
                                       <span class="text-sm text-slate-300 group-hover:text-white">Concierge Services (+5%)</span>
                                   </label>
                                   <label class="flex items-center gap-2 cursor-pointer group">
                                       <input type="checkbox" class="rounded border-slate-600 bg-slate-700 text-indigo-500" data-debug-id="mandate-clause-maintenance">
                                       <span class="text-sm text-slate-300 group-hover:text-white">Maintenance Allowance</span>
                                   </label>
                               </div>
                           </div>
                       }
                   </div>
               </div>

                @if (isTier3()) {
                   <div class="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
                       <h3 class="text-white font-bold mb-2 flex items-center gap-2">
                           <span class="material-icons text-sm">draw</span> e-Signature
                       </h3>
                       <p class="text-xs text-slate-400 mb-4">Send directly to owner via DocuSign integration suitable for EU law.</p>
                       <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2 shadow-lg transition-all" data-debug-id="mandate-sign-btn">
                           Send for Signature
                       </button>
                   </div>
                }
                
                <!-- Coach -->
                <div class="mt-auto p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">⚠️</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">Exclusive vs Non-Exclusive</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">Always aim for an <span class="font-bold">Exclusive Mandate</span>. It prevents the owner from renting directly or using other agencies, guaranteeing your commission.</p>
                        </div>
                    </div>
                </div>
           </div>

           <!-- Preview -->
           <div class="lg:col-span-2 bg-white text-slate-900 p-12 rounded-xl shadow-2xl overflow-y-auto font-serif text-sm leading-relaxed relative">
               <!-- VISUAL: Wax Seal -->
               @if(isTier3()) {
                   <div class="absolute top-8 right-8 w-24 h-24 opacity-80 pointer-events-none">
                       <div class="w-full h-full rounded-full bg-red-800 flex items-center justify-center shadow-lg border-4 border-red-900/50 rotate-12">
                           <div class="text-red-900 font-bold text-[10px] text-center uppercase tracking-widest leading-tight">
                               Legally<br>Binding<br>Digital
                           </div>
                       </div>
                   </div>
               }

               <h2 class="text-2xl font-bold text-center mb-8 uppercase tracking-widest border-b-2 border-slate-900 pb-4">Property Management Mandate</h2>
               
               <p class="mb-4"><strong>BETWEEN:</strong></p>
               <p class="mb-6 pl-4 border-l-2 border-slate-300 italic text-slate-600">
                   The Owner,<br>
                   [Owner Name]<br>
                   [Owner Address]
               </p>

               <p class="mb-4"><strong>AND:</strong></p>
                <p class="mb-8 pl-4 border-l-2 border-slate-300 italic text-slate-600">
                   The Manager,<br>
                   [My Agency Name]<br>
                   [Agency Address]
               </p>

               <h3 class="font-bold mb-2 uppercase text-xs tracking-wider">1. Object</h3>
               <p class="mb-6 text-justify">The Owner mandates the Manager to manage the short-term rental of the property located at [Address]. The Manager accepts this mission and undertakes to carry it out with due diligence.</p>

               <h3 class="font-bold mb-2 uppercase text-xs tracking-wider">2. Term & Duration</h3>
               <p class="mb-6 text-justify">This agreement is valid for a period of 12 months, renewable by tacit agreement.</p>

               <h3 class="font-bold mb-2 uppercase text-xs tracking-wider">3. Remuneration</h3>
               <p class="mb-6 text-justify">In consideration for the services, the Manager shall receive a commission of <strong>20% (plus VAT)</strong> of the Net Rental Income.</p>

               @if(isTier2()) {
                   <div class="bg-slate-50 p-4 mb-6 border border-slate-200 rounded">
                       <h3 class="font-bold mb-2 uppercase text-xs tracking-wider text-indigo-900">4. Additional Services (Addendum)</h3>
                       <ul class="list-disc pl-4 space-y-1">
                           <li>Concierge Service (Check-in/Check-out management)</li>
                           <li class="text-slate-400 line-through">Maintenance Allowance Fund</li>
                       </ul>
                   </div>
               }

               <h3 class="font-bold mb-2 uppercase text-xs tracking-wider">5. Termination</h3>
               <p class="mb-6 text-justify">This agreement may be terminated by either party with a notice period of 30 days via registered mail.</p>
               
               <div class="mt-12 flex justify-between pt-12 border-t border-slate-200">
                   <div class="w-40 border-t border-slate-400 pt-2 text-center text-xs text-slate-400 uppercase">
                       Signature (Owner)
                       <div class="h-16 mt-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-[10px] text-slate-300 italic">
                           Waiting for e-sign...
                       </div>
                   </div>
                   <div class="w-40 border-t border-slate-400 pt-2 text-center text-xs text-slate-400 uppercase">
                       Signature (Manager)
                       <div class="h-16 mt-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-[10px] text-slate-300 italic">
                           Pending
                       </div>
                   </div>
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

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

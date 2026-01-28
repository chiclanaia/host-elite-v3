import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-05-impressum',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">German Impressum Shield</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Create a TMG-compliant legal notice for your booking site.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Live Hosting Active' : (isTier2() ? 'EU Validator On' : 'Static Text') }}
        </div>
      </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
            <!-- Inputs -->
            <div class="space-y-4 overflow-y-auto">
                <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                     <h3 class="text-white font-bold mb-4">Mandatory Details (§5 TMG)</h3>
                     <div class="grid grid-cols-1 gap-4">
                         <input type="text" placeholder="Full Name / Company Name" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white" data-debug-id="impressum-name-input">
                         <input type="text" placeholder="Address (Ladungsfähige Anschrift)" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white" data-debug-id="impressum-address-input">
                         
                         <div class="grid grid-cols-2 gap-4">
                            <input type="email" placeholder="Email" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white" data-debug-id="impressum-email-input">
                            <input type="text" placeholder="Phone (Required)" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white" data-debug-id="impressum-phone-input">
                         </div>

                         <div class="relative">
                             <input type="text" placeholder="VAT ID (USt-IdNr.)" class="w-full bg-black/30 border border-white/10 rounded px-4 py-2 text-white pl-12" data-debug-id="impressum-vat-input">
                             <span class="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">DE</span>
                         </div>
                     </div>
                </div>

                <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                     <h3 class="text-white font-bold mb-4">EU Dispute Resolution</h3>
                     <label class="flex items-center gap-3 cursor-pointer group">
                         <div class="relative flex items-center">
                             <input type="checkbox" checked class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-700 transition-all checked:border-indigo-500 checked:bg-indigo-500" data-debug-id="impressum-dispute-check">
                             <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-icons text-sm pointer-events-none">check</span>
                         </div>
                         <div class="flex flex-col">
                             <span class="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Include ODR Link (Reg. 524/2013)</span>
                             <span class="text-[10px] text-slate-500">Mandatory for all online bookings.</span>
                         </div>
                     </label>
                </div>
            </div>

            <!-- Preview -->
            <div class="bg-white text-slate-900 p-8 rounded-xl shadow-lg font-serif text-sm leading-relaxed overflow-y-auto relative min-h-[500px]">
                <!-- VISUAL: Legal Seal -->
                <div class="absolute top-4 right-4 h-24 w-24 border-4 border-slate-900 rounded-full flex items-center justify-center opacity-10 rotate-12 pointer-events-none select-none">
                    <div class="text-center">
                        <div class="text-[8px] uppercase tracking-widest font-bold">Verified</div>
                        <div class="text-2xl font-black">§5 TMG</div>
                        <div class="text-[8px] uppercase tracking-widest font-bold">Compliant</div>
                    </div>
                </div>

                <h2 class="text-xl font-bold mb-6 border-b pb-2 flex items-center justify-between">
                    Impressum
                    @if(isTier2()) {
                        <span class="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] rounded uppercase font-sans font-bold tracking-wider">EU Validated</span>
                    }
                </h2>
                
                <p class="mb-4">
                    <strong>Angaben gemäß § 5 TMG</strong><br>
                    Max Mustermann<br>
                    Musterstraße 1<br>
                    10115 Berlin
                </p>

                <p class="mb-4">
                    <strong>Kontakt</strong><br>
                    Telefon: +49 123 45678<br>
                    E-Mail: max@muster.de
                </p>

                <p class="mb-4">
                    <strong>Umsatzsteuer-ID</strong><br>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>
                    DE 123456789
                </p>

                <p class="mb-4 text-xs text-slate-500 mt-8 pt-4 border-t">
                    <strong>Streitschlichtung</strong><br>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr.<br>
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>

                @if (isTier3()) {
                    <div class="mt-8 p-4 bg-emerald-50 rounded border border-emerald-200 relative group cursor-pointer hover:shadow-md transition-all">
                        <div class="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div class="text-emerald-800 font-bold mb-1 flex items-center gap-2">
                            <span class="material-icons text-sm">public</span> Live Hosted Link
                        </div>
                        <code class="text-xs bg-white px-3 py-2 border rounded block mb-2 select-all font-mono text-emerald-700">https://hote.io/legal/impr/X92JkL</code>
                        <p class="text-[10px] text-emerald-600">This link auto-updates if laws change. Place this in your Airbnb profile settings.</p>
                    </div>
                } @else {
                    <div class="mt-8 pt-4 border-t border-slate-100 text-center">
                        <button class="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold hover:bg-slate-700 transition-colors" data-debug-id="impressum-copy-btn">
                            Copy Text to Clipboard
                        </button>
                    </div>
                }
            </div>
       </div>
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
           <div class="flex items-start gap-3">
              <span class="text-xl">🇩🇪</span>
              <div>
                  <h4 class="font-bold text-indigo-300 text-sm">Steuernummer vs VAT ID</h4>
                  <p class="text-xs text-indigo-200/80 mt-1">Your 'Impressum' must list your VAT ID (Umsatzsteuer-ID) if you have one. Do NOT publish your personal Tax Number (Steuernummer) for privacy.</p>
              </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ImpressumComponent {
    feature = computed(() => ({
        id: 'LEG_05',
        name: 'Impressum Generator',
        description: 'German Compliance Hosting Service',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

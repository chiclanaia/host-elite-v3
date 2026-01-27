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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 text-xs font-mono">
           §5 TMG Compliant
        </div>
      </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div class="space-y-4">
                <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                     <h3 class="text-white font-bold mb-4">Host Details</h3>
                     <div class="grid grid-cols-1 gap-4">
                         <input type="text" placeholder="Full Name / Company Name" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white">
                         <input type="text" placeholder="Address (Ladungsfähige Anschrift)" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white">
                         <input type="email" placeholder="Email" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white">
                         <input type="text" placeholder="VAT ID (USt-IdNr.)" class="bg-black/30 border border-white/10 rounded px-4 py-2 text-white">
                     </div>
                </div>

                <div class="bg-slate-800 p-6 rounded-xl border border-white/10">
                     <h3 class="text-white font-bold mb-4">Dispute Resolution</h3>
                     <label class="flex items-center gap-3">
                         <input type="checkbox" checked class="bg-transparent border-slate-600 rounded text-indigo-500">
                         <span class="text-slate-400 text-sm">Include OS-Plattform link (EU Reg. 524/2013)</span>
                     </label>
                </div>
            </div>

            <div class="bg-white text-slate-900 p-8 rounded-xl shadow-lg font-serif text-sm leading-relaxed overflow-y-auto max-h-[600px]">
                <h2 class="text-xl font-bold mb-6 border-b pb-2">Impressum</h2>
                
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

                @if (tier() === 'TIER_3') {
                    <div class="mt-8 p-4 bg-emerald-50 rounded border border-emerald-200">
                        <div class="text-emerald-800 font-bold mb-1">Live Hosted Link</div>
                        <code class="text-xs bg-white px-2 py-1 border rounded block mb-2 select-all">https://hote.io/legal/impr/X92JkL</code>
                        <p class="text-[10px] text-emerald-600">This link auto-updates if laws change.</p>
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
}

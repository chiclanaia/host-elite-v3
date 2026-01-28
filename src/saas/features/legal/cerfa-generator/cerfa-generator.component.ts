import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-03-cerfa-generator',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">French Admin Auto-Pilot</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Cerfa Generator & "Meublé de Tourisme" Classification.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-blue-500/20 text-blue-300 border-blue-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Fill Engine Active' : (isTier2() ? 'Smart Form Selector' : 'Forms List') }}
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-8 flex gap-8">
            <!-- Sidebar Selection -->
            <div class="w-64 space-y-4">
                <h3 class="text-white font-bold text-sm uppercase opacity-50 mb-4">Available Forms</h3>
                <button class="w-full text-left p-3 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-blue-500/20 ring-1 ring-blue-400">
                    <span>Cerfa 14004*04</span>
                    <span class="material-icons text-sm">check_circle</span>
                </button>
                <button class="w-full text-left p-3 rounded bg-white/5 hover:bg-white/10 text-slate-400 text-xs flex items-center justify-between transition-colors">
                     <span>Cerfa 11819*03 (Tax)</span>
                </button>
                <button class="w-full text-left p-3 rounded bg-white/5 hover:bg-white/10 text-slate-400 text-xs flex items-center justify-between transition-colors">
                     <span>Tourist Tax Receipt</span>
                </button>
                
                @if (isTier2()) {
                    <div class="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <h4 class="text-indigo-300 font-bold text-xs mb-2">Smart Selector</h4>
                        <p class="text-[10px] text-indigo-400">Based on your Paris location, you MUST file Cerfa 14004 within 15 days.</p>
                    </div>
                }
            </div>

            <!-- Form Preview -->
            <div class="flex-1 bg-white text-slate-900 p-8 rounded shadow-2xl relative min-h-[500px] transform transition-all duration-500"
                 [class.scale-95]="isTier3()" [class.origin-top]="isTier3()">
                 
                 @if(isTier3()) {
                     <div class="absolute -right-2 -top-2 z-20">
                         <span class="relative flex h-6 w-6">
                           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                           <span class="relative inline-flex rounded-full h-6 w-6 bg-blue-500 items-center justify-center">
                               <span class="material-icons text-white text-[10px]">edit</span>
                           </span>
                         </span>
                     </div>
                 }

                 <!-- Mock Cerfa Header -->
                 <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end backdrop-blur-sm">
                     <div>
                         <div class="text-xs uppercase font-bold tracking-widest text-slate-500">Cerfa N° 14004*04</div>
                         <h2 class="text-2xl font-serif font-bold mt-1">Déclaration de meublé de tourisme</h2>
                     </div>
                     <div class="h-12 w-12 border border-slate-300 rounded-full flex items-center justify-center font-serif font-bold italic text-slate-400">RF</div>
                 </div>

                 <div class="grid grid-cols-2 gap-8 relative">
                     <!-- Auto-Fill Overlay Animation -->
                     @if(isTier3()) {
                         <div class="absolute inset-0 bg-blue-500/5 z-0 pointer-events-none animate-pulse"></div>
                     }

                     <div class="space-y-4 z-10">
                         <div>
                             <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Identité du déclarant</label>
                             <div class="p-2 rounded border text-sm font-bold transition-all duration-1000"
                                  [class]="isTier3() ? 'bg-blue-100 border-blue-500 text-blue-900' : (isTier2() ? 'bg-slate-100 border-slate-300 text-slate-500' : 'bg-slate-50 border-slate-200 text-transparent select-none blur-sm')">
                                 {{ session.userProfile()?.full_name || 'Jean Dupont' }}
                             </div>
                         </div>
                          <div>
                             <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Adresse du meublé</label>
                             <div class="p-2 rounded border text-sm transition-all duration-1000 delay-100"
                                  [class]="isTier3() ? 'bg-blue-100 border-blue-500 text-blue-900' : (isTier2() ? 'bg-slate-100 border-slate-300 text-slate-500' : 'bg-slate-50 border-slate-200 text-transparent select-none blur-sm')">
                                 12 Rue de la Paix, 75001 Paris
                             </div>
                         </div>
                     </div>
                     
                     <div class="space-y-4 z-10">
                         <div>
                             <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Capacité d'accueil</label>
                             <div class="font-mono text-xl font-bold transition-all duration-1000 delay-200"
                                  [class]="isTier3() ? 'text-blue-600' : 'text-slate-300'">
                                 4 Personnes
                             </div>
                         </div>
                         <div>
                             <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Classement</label>
                             <div class="flex gap-1">
                                 <span class="text-yellow-500 material-icons text-sm">star</span>
                                 <span class="text-yellow-500 material-icons text-sm">star</span>
                                 <span class="text-yellow-500 material-icons text-sm">star</span>
                                 <span class="text-slate-300 material-icons text-sm">star</span>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div class="mt-8 pt-8 border-t border-slate-200">
                     <div class="bg-slate-100 p-4 rounded text-xs text-slate-600 mb-4">
                         <p class="mb-2 font-bold">Disclaimer:</p>
                         Tout changement concernant les informations fournies doit faire l'objet d'une nouvelle déclaration.
                     </div>
                 </div>
                 
                 <!-- Action Bar -->
                 <div class="absolute bottom-8 right-8 flex gap-4 z-20">
                      @if (isTier3()) {
                          <button class="bg-indigo-600 text-white px-6 py-3 rounded shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all hover:scale-105" data-debug-id="cerfa-submit-btn">
                              <span class="material-icons text-sm">send</span> Auto-Submit to City Hall
                          </button>
                      } @else {
                           @if (isTier2()) {
                                <button class="bg-slate-800 text-white px-6 py-3 rounded shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-700" data-debug-id="cerfa-download-btn">
                                  <span class="material-icons text-sm">download</span> Download Pre-filled PDF
                                </button>
                           } @else {
                                <button class="bg-slate-200 text-slate-400 px-6 py-3 rounded font-bold text-sm flex items-center gap-2 cursor-not-allowed" disabled>
                                    <span class="material-icons text-sm">lock</span> Upgrade to Fill
                                </button>
                           }
                      }
                 </div>
            </div>
       </div>

        <!-- Coach -->
        <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
           <div class="flex items-start gap-3">
              <span class="text-xl">⭐</span>
              <div>
                  <h4 class="font-bold text-indigo-300 text-sm">Tax Hack: "Classified Tourism"</h4>
                  <p class="text-xs text-indigo-200/80 mt-1">Getting your property "Classified" (Star Rated) unlocks a 71% tax allowance (abattement) instead of 50%. Use this tool to apply for classification.</p>
              </div>
           </div>
        </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class CerfaGeneratorComponent {
    feature = computed(() => ({
        id: 'LEG_03',
        name: 'Cerfa Generator',
        description: 'French Administrative Automation Bot',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

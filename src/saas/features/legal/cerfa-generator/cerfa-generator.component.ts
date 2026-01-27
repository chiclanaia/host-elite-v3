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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-lg border border-blue-500/30 text-xs font-mono">
           🇫🇷 French Admin
        </div>
      </div>

        <!-- Coach -->
        <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
           <div class="flex items-start gap-3">
              <span class="text-xl">⚖️</span>
              <div>
                  <h4 class="font-bold text-indigo-300 text-sm">Penalties for Non-Declaration</h4>
                  <p class="text-xs text-indigo-200/80 mt-1">Failure to declare (Cerfa 14004) can result in fines up to €450 for individuals. In Paris, non-registration fines can reach €50,000.</p>
              </div>
           </div>
        </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-8">
            <div class="max-w-3xl mx-auto">
                 <div class="bg-white text-slate-900 p-8 rounded shadow-2xl relative min-h-[500px]">
                      <!-- Mock Cerfa Header -->
                      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                          <div>
                              <div class="text-xs uppercase font-bold tracking-widest text-slate-500">Cerfa N° 14004*04</div>
                              <h2 class="text-2xl font-serif font-bold mt-1">Déclaration de meublé de tourisme</h2>
                          </div>
                          <div class="h-12 w-12 border border-slate-300 rounded-full flex items-center justify-center font-serif font-bold italic">RF</div>
                      </div>

                      <div class="grid grid-cols-2 gap-8">
                          <div class="space-y-4">
                              <div>
                                  <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Identité du déclarant</label>
                                  <div class="bg-blue-50 p-2 rounded border border-blue-200 text-sm font-bold text-blue-900">
                                      {{ session.userProfile()?.full_name || 'Jean Dupont' }}
                                  </div>
                              </div>
                               <div>
                                  <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Adresse du meublé</label>
                                  <div class="bg-blue-50 p-2 rounded border border-blue-200 text-sm text-blue-900">
                                      12 Rue de la Paix, 75001 Paris
                                  </div>
                              </div>
                          </div>
                          
                          <div class="space-y-4">
                              <div>
                                  <label class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Capacité d'accueil</label>
                                  <div class="font-mono text-xl font-bold">4 Personnes</div>
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
                      <div class="absolute bottom-8 right-8 flex gap-4">
                           @if (tier() === 'TIER_3') {
                              <button class="bg-indigo-600 text-white px-6 py-3 rounded shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700">
                                  <span class="material-icons text-sm">send</span> Auto-Submit to City Hall
                              </button>
                           } @else {
                               <button class="bg-slate-900 text-white px-6 py-3 rounded shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-700">
                                  <span class="material-icons text-sm">download</span> Download PDF
                              </button>
                           }
                      </div>
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
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-04-vut-license',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-yellow-500/10 text-yellow-300 rounded-lg border border-yellow-500/30 text-xs font-mono">
           🇪🇸 Spanish Licensing
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
               <h3 class="text-xl font-bold text-white mb-6">License Requirements</h3>
               
               <div class="space-y-4">
                   <div class="bg-white/5 p-4 rounded-lg flex items-start gap-3">
                       <input type="checkbox" checked class="mt-1 bg-transparent border-emerald-500 rounded text-emerald-500 focus:ring-0">
                       <div>
                           <div class="text-white font-bold text-sm">Cédula de Habitabilidad</div>
                           <p class="text-xs text-slate-500">Valid occupancy certificate required.</p>
                       </div>
                   </div>
                   <div class="bg-white/5 p-4 rounded-lg flex items-start gap-3">
                       <input type="checkbox" class="mt-1 bg-transparent border-slate-600 rounded text-emerald-500 focus:ring-0">
                       <div>
                           <div class="text-white font-bold text-sm">First Occupation License</div>
                           <p class="text-xs text-slate-500">Must be registered with the town hall.</p>
                       </div>
                   </div>
                   
                   @if (tier() === 'TIER_3') {
                       <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                           <h4 class="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                               <span class="material-icons text-sm">upload_file</span> Statute Analyzer (AI)
                           </h4>
                           <p class="text-xs text-slate-400 mb-3">Upload your building's "Estatutos" PDF to check for hidden anti-Airbnb clauses.</p>
                           <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold">Select PDF</button>
                       </div>
                   }
               </div>
           </div>
           
           <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center">
               <div class="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <span class="text-2xl">📋</span>
               </div>
               <h3 class="text-white font-bold mb-2">VUT Status: Pending</h3>
               <p class="text-slate-500 text-sm max-w-xs">You need to complete the checklist and verify your building statutes before applying for a VUT number.</p>
           </div>
       </div>
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
           <div class="flex items-start gap-3">
              <span class="text-xl">🇪🇸</span>
              <div>
                  <h4 class="font-bold text-indigo-300 text-sm">Declaración Responsable</h4>
                  <p class="text-xs text-indigo-200/80 mt-1">This legal concept is faster than a license. You declare, under oath, that you meet requirements and start renting immediately while they inspect.</p>
              </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class VutLicenseComponent {
    feature = computed(() => ({
        id: 'LEG_04',
        name: 'VUT License Assistant',
        description: 'Spanish Licensing Expert System',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-11-checklists',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-slate-600/10 text-slate-300 rounded-lg border border-slate-600/30 text-xs font-mono">
           ✓ SOPs
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
           <div class="flex gap-4 mb-6 overflow-x-auto pb-2">
               <button class="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg">{{ 'CHECKLISTS.Cleaning' | translate }}</button>
               <button class="px-4 py-2 bg-slate-700 text-slate-300 hover:text-white rounded-full text-sm font-bold">{{ 'CHECKLISTS.Maintenance' | translate }}</button>
               <button class="px-4 py-2 bg-slate-700 text-slate-300 hover:text-white rounded-full text-sm font-bold">{{ 'CHECKLISTS.Onboarding' | translate }}</button>
           </div>
           
           <div class="space-y-2 max-w-2xl">
               <div class="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5 group hover:border-indigo-500 transition-colors cursor-pointer">
                   <div class="h-5 w-5 rounded border border-slate-500 flex items-center justify-center text-indigo-500 group-hover:border-indigo-500">
                       <!-- Checked state mock -->
                   </div>
                   <span class="text-slate-300 group-hover:text-white transition-colors">{{ 'CHECKLISTS.CheckUnderTheBed' | translate }}</span>
               </div>
               
               <div class="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5 group hover:border-indigo-500 transition-colors cursor-pointer">
                   <div class="h-5 w-5 rounded border border-slate-500 flex items-center justify-center text-indigo-500 group-hover:border-indigo-500">
                   </div>
                   <span class="text-slate-300 group-hover:text-white transition-colors">{{ 'CHECKLISTS.RefillShampooBottles' | translate }}</span>
               </div>
               
               <div class="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5 group hover:border-indigo-500 transition-colors cursor-pointer">
                   <div class="h-5 w-5 rounded border border-slate-500 flex items-center justify-center text-indigo-500 group-hover:border-indigo-500">
                   </div>
                   <span class="text-slate-300 group-hover:text-white transition-colors">{{ 'CHECKLISTS.EmptyTrashBins' | translate }}</span>
               </div>
           </div>

           @if (tier() === 'TIER_3') {
               <div class="mt-8 pt-6 border-t border-white/10">
                   <h3 class="text-indigo-400 font-bold mb-2 text-sm">{{ 'CHECKLISTS.DigitizeYourSops' | translate }}</h3>
                   <p class="text-xs text-slate-500 mb-4">{{ 'CHECKLISTS.TurnPaperChecklistsIntoTracked' | translate }}</p>
                   <button class="flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-xs font-bold">
                       <span class="material-icons text-sm">upload</span>{{ 'CHECKLISTS.ImportCsv' | translate }}</button>
               </div>
           }
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ChecklistsToolComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_11',
        name: this.translate.instant('CHECTOOL.Title'),
        description: this.translate.instant('CHECTOOL.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

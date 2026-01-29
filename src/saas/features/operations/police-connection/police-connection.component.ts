import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-04-police',
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
        <div class="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/30 text-xs font-mono">
           👮 Regulatory
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
               <h3 class="text-white font-bold mb-6">{{ 'POLICE_CON.GuestReporting' | translate }}</h3>
               
               <div class="bg-white/5 rounded-lg p-4 mb-4">
                   <div class="flex justify-between items-center mb-2">
                       <span class="text-white font-bold">{{ 'POLICE_CON.Booking8392JohnDoe' | translate }}</span>
                       <span class="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">{{ 'POLICE_CON.Unreported' | translate }}</span>
                   </div>
                   <p class="text-xs text-slate-500 mb-4">{{ 'POLICE_CON.CheckinToday' | translate }}</p>
                   
                   <div class="flex gap-2">
                       <button class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded">{{ 'POLICE_CON.ManualCsv' | translate }}</button>
                       <button class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded bg-gradient-to-r from-indigo-500 to-blue-600">{{ 'POLICE_CON.ScanSend' | translate }}</button>
                   </div>
               </div>
           </div>

           <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center">
               <div class="h-24 w-24 border-4 border-dashed border-white/20 rounded-lg flex items-center justify-center mb-4">
                   <span class="material-icons text-4xl text-slate-600">qr_code_scanner</span>
               </div>
               <h3 class="text-white font-bold mb-2">{{ 'POLICE_CON.MobileScanner' | translate }}</h3>
               <p class="text-slate-500 text-sm max-w-xs">{{ 'POLICE_CON.UseYourPhoneToScan' | translate }}</p>
               
               @if (tier() !== 'TIER_3') {
                   <button class="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded">{{ 'POLICE_CON.UnlockOcrScannerTier3' | translate }}</button>
               }
           </div>
            
            <!-- Coach -->
            <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 lg:col-span-2">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">⏱️</span>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm">{{ 'POLICE_CON.The24hourRule' | translate }}</h4>
                        <p class="text-xs text-indigo-200/80 mt-1">{{ 'POLICE_CON.InMostJurisdictionsSpainItaly' | translate }}</p>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class PoliceConnectionComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_04',
        name: this.translate.instant('POLICONN.Title'),
        description: this.translate.instant('POLICONN.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

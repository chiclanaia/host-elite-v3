import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'leg-08-foreign-id',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'FOREIGN_ID.TravelerIdentityVault' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'FOREIGN_ID.SecurelyCollectAndTransmitMandatory' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Sync Active' : (isTier2() ? 'OCR Scanner On' : 'Manual Entry') }}
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
           <!-- Form / Scanner -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">{{ 'FOREIGN_ID.GuestRegistration' | translate }}</h3>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10">{{ 'FOREIGN_ID.Manual' | translate }}</button>
                        <button class="px-3 py-1 rounded bg-indigo-600 text-xs text-white font-bold shadow-lg" data-debug-id="fid-scan-mode-btn">{{ 'FOREIGN_ID.ScanId' | translate }}</button>
                    </div>
                </div>

                <!-- Simulation Scanner -->
                <div class="bg-black/50 rounded-lg border border-white/10 aspect-video relative overflow-hidden mb-6 flex items-center justify-center group cursor-pointer">
                    <div class="absolute inset-0 bg-[url('/assets/scan-grid.svg')] opacity-20"></div>
                    
                    @if(isTier2()) {
                        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500"></div>
                        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500"></div>
                        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500"></div>
                        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500"></div>
                        <div class="absolute inset-0 bg-indigo-500/10 animate-pulse hidden group-hover:block"></div>
                        
                        <div class="text-center z-10">
                            <span class="material-icons text-4xl text-indigo-400 mb-2">document_scanner</span>
                            <div class="text-sm font-bold text-indigo-200">{{ 'FOREIGN_ID.DropPassportHere' | translate }}</div>
                            <div class="text-xs text-indigo-400/60 mt-1">{{ 'FOREIGN_ID.OcrAnalysisReady' | translate }}</div>
                        </div>
                    } @else {
                        <div class="text-center z-10 opacity-50">
                            <span class="material-icons text-4xl text-slate-500 mb-2">lock</span>
                            <div class="text-sm font-bold text-slate-400">{{ 'FOREIGN_ID.ScannerLocked' | translate }}</div>
                            <div class="text-xs text-slate-600 mt-1">{{ 'FOREIGN_ID.UpgradeToSilverToAutofill' | translate }}</div>
                        </div>
                    }
                </div>
                
                <div class="space-y-4">
                     <div class="grid grid-cols-2 gap-4">
                         <div>
                             <label class="block text-slate-400 text-xs uppercase font-bold mb-1">{{ 'FOREIGN_ID.FirstName' | translate }}</label>
                             <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="{{ \'FOREIGN_ID.John\' | translate }}" data-debug-id="fid-fname">
                         </div>
                         <div>
                             <label class="block text-slate-400 text-xs uppercase font-bold mb-1">{{ 'FOREIGN_ID.LastName' | translate }}</label>
                             <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="{{ \'FOREIGN_ID.Doe\' | translate }}" data-debug-id="fid-lname">
                         </div>
                     </div>
                     <div>
                         <label class="block text-slate-400 text-xs uppercase font-bold mb-1">{{ 'FOREIGN_ID.PassportNumber' | translate }}</label>
                         <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="AB123456" data-debug-id="fid-passport">
                     </div>
                </div>
           </div>
           
           <!-- Sync Status & Coach -->
           <div class="flex flex-col gap-6">
               <div class="flex-1 bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                   
                   @if (isTier3()) {
                       <div class="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 relative">
                           <div class="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping"></div>
                           <span class="material-icons text-4xl text-emerald-400">cloud_sync</span>
                       </div>
                       <h3 class="text-white font-bold text-lg mb-2">{{ 'FOREIGN_ID.AutomatedPoliceFiling' | translate }}</h3>
                       <p class="text-slate-400 text-xs max-w-xs mb-6">connected to <span class="text-emerald-400 font-mono">POLICIA_V1_API</span></p>
                       
                       <div class="w-full max-w-xs bg-black/50 rounded-lg p-3 space-y-2">
                           <div class="flex justify-between text-[10px] text-slate-400">
                               <span>{{ 'FOREIGN_ID.LastSync' | translate }}</span>
                               <span class="text-slate-300">{{ 'FOREIGN_ID.Today0941Am' | translate }}</span>
                           </div>
                           <div class="flex justify-between text-[10px] text-slate-400">
                               <span>{{ 'FOREIGN_ID.FichesSent' | translate }}</span>
                               <span class="text-emerald-400">12 Pending</span>
                           </div>
                       </div>
                   } @else {
                       <div class="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 grayscale opacity-50">
                           <span class="material-icons text-4xl text-slate-500">cloud_off</span>
                       </div>
                       <h3 class="text-slate-300 font-bold text-lg mb-2">{{ 'FOREIGN_ID.ManualFilingRequired' | translate }}</h3>
                       <p class="text-slate-500 text-xs max-w-xs">{{ 'FOREIGN_ID.YouMustPhysicallyGoTo' | translate }}</p>
                       <button class="mt-6 px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">{{ 'FOREIGN_ID.EnableAutosync' | translate }}</button>
                   }
               </div>

                <!-- Coach -->
                <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">👮</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">{{ 'FOREIGN_ID.Strict24hDeadline' | translate }}</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">{{ 'FOREIGN_ID.InSpainItalyYouMust' | translate }}</p>
                        </div>
                    </div>
                </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ForeignIdComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'LEG_08',
        name: this.translate.instant('FOREID.Title'),
        description: this.translate.instant('FOREID.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

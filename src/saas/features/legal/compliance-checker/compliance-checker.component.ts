import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'leg-00-compliance-checker',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'COMPLY.ZoningRegulatorySentinel' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'COMPLY.DontBuyALiabilityCheck' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Regulation DB' : (isTier3() ? 'Real-Time Sentinel' : 'Zoning Detective') }}
        </div>
      </div>

      <!-- Tier 0: Static Database -->
      @if (isTier0()) {
         <div class="p-6 bg-slate-800 rounded-xl border border-white/10 flex-1 overflow-y-auto custom-scrollbar">
            <h3 class="text-xl font-bold text-white mb-4">{{ 'COMPLY.GlobalRegulationsDatabase' | translate }}</h3>
            <p class="text-slate-400 mb-4">{{ 'COMPLY.AccessOurCuratedDatabaseOf' | translate }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer group" data-debug-id="compliance-card-paris">
                  <h4 class="text-white font-bold group-hover:text-indigo-400 transition-colors">🇫🇷 Paris</h4>
                  <p class="text-xs text-slate-500 mt-1">120-day limit, Registration mandatory</p>
               </div>
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer group" data-debug-id="compliance-card-london">
                  <h4 class="text-white font-bold group-hover:text-indigo-400 transition-colors">🇬🇧 London</h4>
                  <p class="text-xs text-slate-500 mt-1">90-day cap per year</p>
               </div>
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer group" data-debug-id="compliance-card-barcelona">
                  <h4 class="text-white font-bold group-hover:text-indigo-400 transition-colors">🇪🇸 Barcelona</h4>
                  <p class="text-xs text-slate-500 mt-1">{{ 'COMPLY.StrictLicensingMoratorium' | translate }}</p>
               </div>
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer group" data-debug-id="compliance-card-nyc">
                  <h4 class="text-white font-bold group-hover:text-indigo-400 transition-colors">🇺🇸 New York</h4>
                  <p class="text-xs text-slate-500 mt-1">{{ 'COMPLY.DefactoBanClassBDwellings' | translate }}</p>
               </div>
            </div>
            
            <div class="mt-8 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-lg flex items-center gap-4">
                <span class="text-3xl">🕵️</span>
                <div>
                   <h4 class="font-bold text-white text-sm">{{ 'COMPLY.NeedAddresslevelChecks' | translate }}</h4>
                   <p class="text-xs text-indigo-200">{{ 'COMPLY.UpgradeToSilverToCheck' | translate }}</p>
                </div>
            </div>
         </div>
      }

      <!-- Tier 1/2/3: Advanced View -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
             <!-- COL 1: Zoning Detective -->
             <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                <h3 class="text-xl font-bold text-white mb-6">{{ 'COMPLY.ZoningDetective' | translate }}</h3>
                
                <div class="flex gap-2 mb-8">
                    <input type="text" placeholder="{{ \'COMPLY.EnterPropertyAddress\' | translate }}" class="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-600" data-debug-id="compliance-address-input">
                    <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm" data-debug-id="compliance-check-btn">{{ 'COMPLY.Scan' | translate }}</button>
                </div>
                
                <!-- VISUAL: Risk Gauge -->
                <div class="flex-1 flex flex-col items-center justify-center relative">
                    <div class="relative w-48 h-24 overflow-hidden mb-4">
                         <div class="absolute inset-0 bg-slate-800 rounded-t-full"></div>
                         <div class="absolute inset-4 bg-[#1e293b] rounded-t-full z-10"></div> <!-- Mask -->
                         <div class="absolute bottom-0 left-1/2 w-1 h-[90%] bg-emerald-500 origin-bottom transform -rotate-45 z-20 transition-transform duration-1000 shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div class="text-2xl font-black text-white mb-1">{{ 'CC.SafeZone' | translate }}</div>
                    <div class="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] border border-emerald-500/30 font-bold uppercase tracking-wider">{{ 'COMPLY.Permitted' | translate }}</div>
                    <p class="text-xs text-slate-400 mt-4 text-center max-w-xs">
                        This address appears to be in a "Green Zone" for short-term rentals. Registration is required but likely approved.
                    </p>
                </div>
             </div>

             <!-- COL 2: Sentinel & Coach -->
             <div class="flex flex-col gap-6">
                 <!-- Sentinel (Tier 3) -->
                 <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col">
                     <div class="flex justify-between items-center mb-4">
                         <h3 class="text-md font-bold text-white">{{ 'COMPLY.LegislativeSentinel' | translate }}</h3>
                         @if (isTier3()) {
                             <div class="flex items-center gap-2">
                                 <span class="relative flex h-2 w-2">
                                   <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                   <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                 </span>
                                 <span class="text-[10px] text-emerald-400 font-mono uppercase">{{ 'COMPLY.Live' | translate }}</span>
                             </div>
                         }
                     </div>

                     @if (isTier3()) {
                         <div class="space-y-3 overflow-y-auto custom-scrollbar pr-2 h-48">
                             <div class="p-3 bg-white/5 rounded-lg border-l-2 border-emerald-500">
                                 <div class="flex justify-between items-start mb-1">
                                     <span class="text-xs text-white font-bold">{{ 'COMPLY.NoActiveBans' | translate }}</span>
                                     <span class="text-[10px] text-slate-500">10m ago</span>
                                 </div>
                                 <p class="text-[10px] text-slate-400">{{ 'COMPLY.ScanningMunicipalGazettesClean' | translate }}</p>
                             </div>
                             <div class="p-3 bg-white/5 rounded-lg border-l-2 border-amber-500 opacity-60">
                                 <div class="flex justify-between items-start mb-1">
                                     <span class="text-xs text-white font-bold">{{ 'COMPLY.Proposal291Detected' | translate }}</span>
                                     <span class="text-[10px] text-slate-500">2d ago</span>
                                 </div>
                                 <p class="text-[10px] text-slate-400">"Discussion on limiting keys per building" - Low Risk.</p>
                             </div>
                         </div>
                     } @else {
                         <div class="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                             <span class="text-3xl mb-2">📡</span>
                             <h3 class="text-sm font-bold text-white mb-2">{{ 'COMPLY.MonitorTheLaw247' | translate }}</h3>
                             <p class="text-xs text-slate-400 mb-4 max-w-xs">{{ 'COMPLY.LawsChangeOvernightGetAlerts' | translate }}</p>
                             <div class="px-3 py-1 bg-amber-500/20 text-amber-300 rounded text-[10px] border border-amber-500/30">{{ 'COMPLY.GoldFeature' | translate }}</div>
                         </div>
                     }
                 </div>
                 
                 <!-- Coach -->
                 <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <div class="flex items-start gap-3">
                         <span class="text-xl">⚖️</span>
                         <div>
                             <h4 class="font-bold text-indigo-300 text-sm">{{ 'COMPLY.TheNonretroactiveRule' | translate }}</h4>
                             <p class="text-xs text-indigo-200/80 mt-1">{{ 'COMPLY.MostNewBansCannotApply' | translate }}</p>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ComplianceCheckerComponent {
    translate = inject(TranslationService);
    feature = computed(() => {
        return {
            id: 'LEG_00',
            name: this.translate.instant('COMPCHEC.Title'),
            description: this.translate.instant('COMPCHEC.Description'),
            behavior_matrix: 'TIER_0: Generic DB. TIER_3: Sentinel.'
        } as any;
    });

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

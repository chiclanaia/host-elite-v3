import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-01-house-manual',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'MANUAL.DigitalHouseManual' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'MANUAL.StopAnsweringHowDoI' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Augmented Guides' : (isTier2() ? 'PDF + Categories' : 'Basic Upload') }}
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
           <!-- Device List -->
           <div class="lg:col-span-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-y-auto">
               <div class="flex justify-between items-center mb-6">
                   <h3 class="text-xl font-bold text-white">{{ 'MANUAL.Appliances' | translate }}</h3>
                   <button class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20" data-debug-id="add-device-btn">
                       <span class="material-icons text-sm">add</span>
                   </button>
               </div>

               <div class="space-y-3">
                   @for (device of devices(); track device.name) {
                       <div class="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden">
                           @if(isTier3()) {
                               <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <span class="material-icons text-indigo-400 text-xs">qr_code_2</span>
                               </div>
                           }
                           <div class="flex items-center gap-4">
                               <div class="w-10 h-10 rounded bg-black/30 flex items-center justify-center text-slate-400 border border-white/5">
                                   <span class="material-icons">{{ device.icon }}</span>
                               </div>
                               <div>
                                   <div class="font-bold text-slate-200 text-sm">{{ device.name }}</div>
                                   <div class="text-[10px] text-slate-500">{{ device.brand }}</div>
                               </div>
                           </div>
                           
                           <!-- Tier 3: Quick Pulse -->
                           @if(isTier3()) {
                                <div class="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500/0 group-hover:bg-indigo-500/50 transition-colors"></div>
                           }
                       </div>
                   }
               </div>

               <!-- Coach -->
               <div class="mt-auto pt-6">
                   <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">💡</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">{{ 'MANUAL.QrCodesOnDevices' | translate }}</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">Stick a QR code directly on the washing machine. Guests scan it and instantly see your 30s "How-To" video. Zero confusion.</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           <!-- Detail View / Blueprint -->
           <div class="lg:col-span-2 bg-slate-900 rounded-xl border border-white/10 p-8 flex flex-col relative overflow-hidden">
               <!-- Background Grid -->
               <div class="absolute inset-0 bg-[url('/assets/blueprint-grid.svg')] opacity-5 pointer-events-none"></div>
               
               <div class="z-10 flex-1 flex flex-col items-center justify-center text-center">
                   <div class="w-24 h-24 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                       <span class="material-icons text-5xl text-indigo-400">coffee_maker</span>
                   </div>
                   <h2 class="text-3xl font-bold text-white mb-2">{{ 'MANUAL.NespressoMagimix' | translate }}</h2>
                   <p class="text-slate-400 mb-8 max-w-md">{{ 'MANUAL.ModelM190Serial8293a' | translate }}</p>

                   <div class="grid grid-cols-2 gap-4 w-full max-w-lg">
                        <!-- Manual Action -->
                       <button class="p-4 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl flex items-center gap-4 transition-all group text-left">
                           <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                               <span class="material-icons text-slate-300 group-hover:text-white">description</span>
                           </div>
                           <div>
                               <div class="font-bold text-slate-200 text-sm">{{ 'MANUAL.ViewManual' | translate }}</div>
                               <div class="text-[10px] text-slate-500">{{ 'HM.Pdf24Mb' | translate }}</div>
                           </div>
                       </button>

                       <!-- Video Action (Tier 3) -->
                       <button class="p-4 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl flex items-center gap-4 transition-all group text-left relative overflow-hidden"
                               [class.opacity-50]="!isTier3()"
                               [disabled]="!isTier3()">
                           @if(!isTier3()) {
                               <div class="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20 backdrop-blur-[1px]">
                                   <span class="material-icons text-xs text-slate-500 mr-1">lock</span>
                                   <span class="text-[10px] text-slate-400 font-bold uppercase">{{ 'MANUAL.Gold' | translate }}</span>
                               </div>
                           }
                           
                           <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors z-10">
                               <span class="material-icons text-slate-300 group-hover:text-white">play_arrow</span>
                           </div>
                           <div class="z-10">
                               <div class="font-bold text-slate-200 text-sm">{{ 'MANUAL.VideoGuide' | translate }}</div>
                               <div class="text-[10px] text-slate-500">00:45 • Tutorial</div>
                           </div>
                       </button>
                   </div>
                   
                   @if(isTier3()) {
                       <div class="mt-12 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg max-w-lg w-full">
                           <div class="flex justify-between items-center mb-4">
                               <h4 class="text-indigo-300 font-bold text-sm flex items-center gap-2">
                                   <span class="material-icons text-sm">qr_code</span>{{ 'MANUAL.GeneratedQrSticker' | translate }}</h4>
                               <button class="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded" data-debug-id="ops01-print-qr">{{ 'MANUAL.PrintSticker' | translate }}</button>
                           </div>
                           <div class="flex gap-4">
                               <div class="w-24 h-24 bg-white p-2 rounded">
                                   <div class="w-full h-full bg-black/10 flex items-center justify-center text-[10px] text-slate-500">
                                       [QR Code]
                                   </div>
                               </div>
                               <div class="flex-1 text-xs text-slate-400 text-left">
                                   <p class="mb-2">{{ 'MANUAL.ScanToOpen' | translate }}<span class="text-indigo-400">guide.hote.io/v/92KsL</span></p>
                                   <p>{{ 'MANUAL.PrintThisLabelAndAttach' | translate }}</p>
                               </div>
                           </div>
                       </div>
                   }
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class HouseManualComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_01',
        name: this.translate.instant('HOUSMANU.Title'),
        description: this.translate.instant('HOUSMANU.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    devices = signal([
        { name: 'Nespresso Magimix', brand: 'Krups', icon: 'coffee_maker' },
        { name: 'Smart TV 55"', brand: 'Samsung', icon: 'tv' },
        { name: 'Air Conditioner', brand: 'Daikin', icon: 'ac_unit' },
        { name: 'Washing Machine', brand: 'Bosch', icon: 'local_laundry_service' },
        { name: 'Wifi Router', brand: 'Linksys', icon: 'router' },
    ]);
}

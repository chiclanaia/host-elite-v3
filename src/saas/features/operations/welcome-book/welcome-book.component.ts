import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface WelcomeModule {
    id: string;
    type: 'wifi' | 'checkin' | 'guide' | 'house_rules' | 'checkout';
    title: string;
    content: string;
    icon: string;
}

@Component({
    selector: 'ops-04-welcome-book',
    standalone: true,
    imports: [CommonModule, FormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'WELCOME_BO.GuestWelcomePortal' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'WELCOME_BO.InteractiveDigitalConciergeThatReduces' | translate }}</p>
        </div>
        <div class="flex gap-2">
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>📖</span>{{ 'WELCOME_BO.WebApp' | translate }}</div>
             <div class="px-4 py-2 bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/30 text-xs font-mono flex items-center gap-2">
                <span>🤖</span>{{ 'WELCOME_BO.AiTranslate' | translate }}</div>
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
           <!-- Left: Content Builder -->
           <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
               <div class="flex justify-between items-center mb-6">
                   <h3 class="text-xl font-bold text-white">{{ 'WELCOME_BO.ContentModules' | translate }}</h3>
                   <div class="flex gap-2">
                       <button (click)="addModule('wifi')" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs rounded transition-colors flex items-center gap-1" data-debug-id="add-wifi-btn">
                           <span class="material-icons text-sm">wifi</span>{{ 'WELCOME_BO.Wifi' | translate }}</button>
                       <button (click)="addModule('guide')" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs rounded transition-colors flex items-center gap-1" data-debug-id="add-guide-btn">
                           <span class="material-icons text-sm">map</span>{{ 'WELCOME_BO.Guide' | translate }}</button>
                       <button (click)="addModule('house_rules')" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs rounded transition-colors flex items-center gap-1" data-debug-id="add-rules-btn">
                           <span class="material-icons text-sm">gavel</span>{{ 'WELCOME_BO.Rules' | translate }}</button>
                   </div>
               </div>

               <!-- Coach Tip -->
               <div class="mb-6 p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-purple-300 font-bold text-sm uppercase">{{ 'WELCOME_BO.CoachTip' | translate }}</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Video > Text. Guests don't read manuals. A 30s video showing how to unlock the door or use the weird coffee maker works wonders."
                   </p>
               </div>

               <div class="flex-1 space-y-3 overflow-y-auto pr-2">
                   @for (mod of modules(); track mod.id) {
                       <div class="p-4 bg-white/5 rounded-lg border border-white/5 group relative hover:border-indigo-500/30 transition-colors">
                           <div class="flex items-start gap-4">
                               <div class="w-10 h-10 rounded bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                                   <span class="material-icons">{{ mod.icon }}</span>
                               </div>
                               <div class="flex-1">
                                   <div class="flex justify-between items-start">
                                       <h4 class="text-white font-bold text-sm">{{ mod.title }}</h4>
                                       <button (click)="removeModule(mod.id)" class="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" [attr.data-debug-id]="'remove-' + mod.id">
                                           <span class="material-icons text-sm">close</span>
                                       </button>
                                   </div>
                                   <p class="text-slate-400 text-xs mt-1 line-clamp-2">{{ mod.content }}</p>
                                   
                                   @if (isTier2OrAbove()) {
                                       <div class="mt-3 flex gap-2">
                                           <button class="px-2 py-1 bg-black/20 text-slate-400 hover:text-white text-[10px] rounded border border-white/5 flex items-center gap-1" [attr.data-debug-id]="'edit-' + mod.id">
                                               <span class="material-icons text-[10px]">edit</span>{{ 'WELCOME_BO.Edit' | translate }}</button>
                                            <button class="px-2 py-1 bg-black/20 text-slate-400 hover:text-white text-[10px] rounded border border-white/5 flex items-center gap-1" title="{{ \'WELCOME_BO.AddVideoTier2\' | translate }}" [attr.data-debug-id]="'video-' + mod.id">
                                               <span class="material-icons text-[10px]">videocam</span>{{ 'WELCOME_BO.Video' | translate }}</button>
                                       </div>
                                   }
                               </div>
                           </div>
                       </div>
                   }
               </div>
               
               <!-- Tier 3 Features -->
                @if (isTier3()) {
                    <div class="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div class="p-3 bg-purple-500/10 rounded border border-purple-500/20 flex items-center justify-between">
                            <div>
                                <div class="text-purple-300 font-bold text-xs mb-0.5">{{ 'WELCOME_BO.AiAutotranslate' | translate }}</div>
                                <div class="text-purple-300/60 text-[10px]">{{ 'WB.EnFrEsDeIt' | translate }}</div>
                            </div>
                            <div class="h-4 w-8 bg-purple-500 rounded-full relative cursor-pointer" title="{{ \'WELCOME_BO.Active\' | translate }}">
                                <div class="absolute right-0.5 top-0.5 h-3 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                         <div class="p-3 bg-amber-500/10 rounded border border-amber-500/20 flex items-center justify-between">
                            <div>
                                <div class="text-amber-300 font-bold text-xs mb-0.5">{{ 'WELCOME_BO.UpsellStore' | translate }}</div>
                                <div class="text-amber-300/60 text-[10px]">{{ 'WELCOME_BO.LateCheckoutTours' | translate }}</div>
                            </div>
                             <div class="h-4 w-8 bg-amber-500 rounded-full relative cursor-pointer" title="{{ \'WELCOME_BO.Active\' | translate }}">
                                <div class="absolute right-0.5 top-0.5 h-3 w-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                }
           </div>

           <!-- Right: Mobile Preview -->
           <div class="lg:col-span-1 flex items-center justify-center p-4">
                <div class="bg-black rounded-[2.5rem] border-[8px] border-slate-900 p-2 shadow-2xl relative w-full max-w-[320px] aspect-[9/19] h-auto max-h-[650px] overflow-hidden flex flex-col">
                    <!-- Notch & Status Bar -->
                    <div class="absolute top-0 left-0 w-full h-[30px] z-20 flex justify-between px-6 item-center pt-2">
                        <span class="text-[10px] text-white font-bold">12:45</span>
                        <div class="flex gap-1">
                             <div class="w-3 h-3 text-white"><span class="material-icons text-[12px]">signal_cellular_alt</span></div>
                             <div class="w-3 h-3 text-white"><span class="material-icons text-[12px]">wifi</span></div>
                             <div class="w-3 h-3 text-white"><span class="material-icons text-[12px]">battery_full</span></div>
                        </div>
                    </div>
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>

                    <!-- App Content -->
                    <div class="bg-slate-50 flex-1 rounded-[1.8rem] overflow-hidden flex flex-col relative w-full h-full pt-8">
                         <!-- Cover -->
                         <div class="h-32 bg-indigo-600 relative shrink-0">
                             <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80')] bg-cover bg-center opacity-50"></div>
                             <div class="absolute bottom-3 left-4 text-white">
                                 <div class="text-[10px] opacity-80 uppercase tracking-widest">{{ 'WELCOME_BO.WelcomeTo' | translate }}</div>
                                 <div class="font-bold text-lg leading-tight">{{ 'WELCOME_BO.SunnyApartment' | translate }}</div>
                             </div>
                         </div>
                         
                         <!-- Grid Menu -->
                         <div class="p-4 grid grid-cols-2 gap-3 overflow-y-auto pb-20 no-scrollbar">
                             <div class="col-span-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform cursor-pointer" 
                                  (click)="triggerPreviewAction('wifi')"
                                  data-debug-id="preview-wifi-card">
                                 <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                     <span class="material-icons text-lg">wifi</span>
                                 </div>
                                 <div>
                                     <div class="text-sm font-bold text-slate-800">{{ 'WELCOME_BO.ConnectToWifi' | translate }}</div>
                                     <div class="text-[10px] text-slate-500">{{ 'WELCOME_BO.TapToCopyPassword' | translate }}</div>
                                 </div>
                             </div>

                             @for (mod of modules(); track mod.id) {
                                 @if (mod.type !== 'wifi') {
                                     <div class="aspect-square bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center active:scale-95 transition-transform cursor-pointer hover:border-indigo-200">
                                         <span class="material-icons text-slate-400 text-2xl">{{ mod.icon }}</span>
                                         <span class="text-xs font-bold text-slate-700 leading-tight">{{ mod.title }}</span>
                                     </div>
                                 }
                             }
                             
                             <!-- Upsell Preview -->
                             @if (isTier3()) {
                                 <div class="col-span-2 mt-2 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-100">
                                     <div class="flex justify-between items-center mb-2">
                                         <span class="text-amber-800 font-bold text-xs">{{ 'WELCOME_BO.ExtrasForYou' | translate }}</span>
                                         <span class="bg-white text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">NEW</span>
                                     </div>
                                     <div class="flex gap-2 overflow-x-auto pb-1">
                                         <div class="shrink-0 w-24 bg-white p-2 rounded border border-amber-100 shadow-sm">
                                             <div class="h-12 bg-slate-200 rounded mb-1"></div>
                                             <div class="text-[9px] font-bold text-slate-700">{{ 'WELCOME_BO.LateCheckout' | translate }}</div>
                                             <div class="text-[9px] text-slate-500">€25.00</div>
                                         </div>
                                         <div class="shrink-0 w-24 bg-white p-2 rounded border border-amber-100 shadow-sm">
                                             <div class="h-12 bg-slate-200 rounded mb-1"></div>
                                             <div class="text-[9px] font-bold text-slate-700">{{ 'WELCOME_BO.BikeRental' | translate }}</div>
                                             <div class="text-[9px] text-slate-500">€15/day</div>
                                         </div>
                                     </div>
                                 </div>
                             }
                         </div>
                         
                         <!-- Navigation -->
                         <div class="absolute bottom-0 left-0 w-full h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 text-slate-400 z-10">
                            <div class="flex flex-col items-center text-indigo-600"><span class="material-icons">home</span><span class="text-[9px]">{{ 'WELCOME_BO.Home' | translate }}</span></div>
                            <div class="flex flex-col items-center"><span class="material-icons">chat</span><span class="text-[9px]">{{ 'WELCOME_BO.Chat' | translate }}</span></div>
                            <div class="flex flex-col items-center"><span class="material-icons">person</span><span class="text-[9px]">{{ 'WELCOME_BO.Profile' | translate }}</span></div>
                         </div>
                    </div>
                </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class WelcomeBookComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_04',
        name: this.translate.instant('WELCBOOK.Title'),
        description: this.translate.instant('WELCBOOK.Description'),
    } as any));

    session = inject(SessionStore);

    tier = computed(() => {
        const plan = this.session.userProfile()?.plan || 'TIER_0';
        return plan === 'Freemium' ? 'TIER_0' : plan;
    });

    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'TIER_3');

    modules = signal<WelcomeModule[]>([
        { id: '1', type: 'wifi', title: 'Wifi Access', content: 'Network: Sunset_Guest', icon: 'wifi' },
        { id: '2', type: 'checkin', title: 'Check-in Guide', content: 'Code: 1234. Keybox on wall.', icon: 'vpn_key' },
        { id: '3', type: 'guide', title: 'Local Faves', content: 'Best coffee: Joe\'s Place.', icon: 'map' },
        { id: '4', type: 'house_rules', title: 'House Rules', content: 'No parties. Quiet hours 10pm.', icon: 'gavel' },
    ]);

    addModule(type: WelcomeModule['type']) {
        const newMod: WelcomeModule = {
            id: Date.now().toString(),
            type,
            title: type === 'wifi' ? 'New Wifi' : (type === 'guide' ? 'New Guide' : 'New Rule'),
            content: 'Draft content...',
            icon: type === 'wifi' ? 'wifi' : (type === 'guide' ? 'map' : 'description')
        };
        this.modules.update(m => [...m, newMod]);
    }

    removeModule(id: string) {
        this.modules.update(m => m.filter(x => x.id !== id));
    }

    triggerPreviewAction(type: string) {
        if (type === 'wifi') {
            // Mock Copy effect
            const btn = document.querySelector('[data-debug-id="preview-wifi-card"]');
            btn?.classList.add('scale-95', 'bg-indigo-100');
            setTimeout(() => btn?.classList.remove('scale-95', 'bg-indigo-100'), 200);
        }
    }
}

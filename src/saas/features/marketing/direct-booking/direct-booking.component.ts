import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'mkt-03-direct-booking',
    standalone: true,
    imports: [CommonModule, FormsModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'DIRECT.DirectBookingEngine' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'DIRECT.LaunchYourCommissionfreeWebsiteIn' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Stripe Payments Connected' : (isTier2() ? 'Site Builder' : 'Preview Only') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Builder Controls -->
           <div class="lg:col-span-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
               <h3 class="text-white font-bold text-lg">{{ 'DIRECT.SiteConfiguration' | translate }}</h3>
               
               <div class="space-y-4">
                   <!-- Logo Upload -->
                   <div class="flex items-center gap-4">
                        <div class="h-16 w-16 rounded-lg bg-black/30 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors" data-debug-id="direct-booking-upload-logo">
                            <span class="material-icons text-slate-500">add_photo_alternate</span>
                        </div>
                        <div>
                            <div class="text-xs text-slate-400 font-bold uppercase mb-1">{{ 'DIRECT.BrandLogo' | translate }}</div>
                            <p class="text-[10px] text-slate-500">{{ 'DIRECT.Recommended512x512pxTransparentPng' | translate }}</p>
                        </div>
                   </div>

                   <!-- Subdomain -->
                   <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">{{ 'DIRECT.WebAddress' | translate }}</label>
                        <div class="flex group">
                            <input [(ngModel)]="subdomain" type="text" class="bg-black/30 border border-white/10 rounded-l px-3 py-2 text-white w-full text-sm outline-none focus:border-indigo-500" data-debug-id="direct-booking-subdomain-input">
                            <span class="bg-white/5 border border-l-0 border-white/10 rounded-r px-3 py-2 text-slate-500 text-xs flex items-center group-focus-within:border-indigo-500 group-focus-within:text-indigo-400 transition-colors">.hote.io</span>
                        </div>
                   </div>

                   <!-- Color Scheme -->
                   <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">{{ 'DIRECT.Theme' | translate }}</label>
                        <div class="grid grid-cols-5 gap-2">
                             @for(c of colors; track c) {
                                 <button (click)="themeColor.set(c)" 
                                         class="h-8 w-8 rounded-full border-2 transition-all relative"
                                         [style.background-color]="c"
                                         [class.border-white]="themeColor() === c"
                                         [class.border-transparent]="themeColor() !== c"
                                         [class.scale-110]="themeColor() === c">
                                     @if(themeColor() === c) { <span class="material-icons text-white text-[10px] absolute inset-0 flex items-center justify-center">check</span> }
                                 </button>
                             }
                        </div>
                   </div>

                   <!-- Tier 3: Stripe -->
                   @if (isTier3()) {
                       <div class="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-lg">
                           <div class="flex justify-between items-center mb-3">
                               <label class="text-indigo-300 text-xs uppercase font-bold flex items-center gap-2">
                                   <span class="material-icons text-sm">payments</span>{{ 'DIRECT.PaymentGateway' | translate }}</label>
                               <span class="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Live
                               </span>
                           </div>
                           <div class="flex items-center gap-3 p-2 bg-white rounded-lg mb-2">
                               <span class="text-indigo-600 font-bold text-lg tracking-tighter">stripe</span>
                               <span class="text-[10px] text-slate-500 ml-auto">{{ 'DIRECT.ConnectedAcct142x' | translate }}</span>
                           </div>
                           <p class="text-[10px] text-slate-400">{{ 'DIRECT.FundsAreRoutedDirectlyTo' | translate }}</p>
                       </div>
                   }

                   <button class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2" data-debug-id="direct-booking-publish-btn">
                       <span class="material-icons text-sm">rocket_launch</span>{{ 'DIRECT.PublishWebsite' | translate }}</button>
               </div>
               
               <!-- Coach -->
               <div class="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-emerald-300 font-bold text-sm uppercase">{{ 'DIRECT.CoachTip' | translate }}</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Own Your Data. OTAs hide guest emails. Direct bookings let you build an email list for repeat marketing (4x cheaper than acquiring new guests)."
                   </p>
               </div>
           </div>

           <!-- Right: Device Preview -->
           <div class="lg:col-span-2 flex flex-col items-center justify-center relative bg-slate-900 rounded-xl border border-white/10 p-8 overflow-hidden">
               
               <!-- Background Pattern -->
               <div class="absolute inset-0 opacity-10" 
                    style="background-image: radial-gradient(#4f46e5 1px, transparent 1px); background-size: 20px 20px;"></div>

               <!-- Macbook Frame -->
               <div class="relative w-full max-w-2xl bg-slate-800 rounded-t-xl border-4 border-slate-700 border-b-0 shadow-2xl animate-fade-in-up" style="aspect-ratio: 16/10;">
                   <!-- Camera Dot -->
                   <div class="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black"></div>
                   
                   <!-- Screen Content -->
                   <div class="absolute inset-[4px] bottom-0 bg-white rounded-t mb-0.5 overflow-hidden flex flex-col">
                       <!-- Browser Bar -->
                       <div class="bg-slate-100 h-6 flex items-center px-2 border-b border-slate-200">
                           <div class="flex gap-1.5">
                               <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                               <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                               <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                           </div>
                           <div class="flex-1 mx-4 bg-white rounded h-4 text-[9px] text-slate-400 flex items-center justify-center shadow-sm">
                               https://{{ subdomain || 'my-villas' }}.hote.io
                           </div>
                       </div>

                       <!-- Website Body -->
                       <div class="flex-1 overflow-y-auto relative">
                           <!-- Hero -->
                           <div class="h-48 relative flex items-center justify-center" [style.background-color]="'black'">
                               <img src="https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=800&q=80" class="absolute inset-0 w-full h-full object-cover opacity-60">
                               <div class="relative z-10 text-center">
                                   <h2 class="text-3xl font-serif text-white font-bold drop-shadow-lg mb-2">{{ 'DIRECT.LuxuryEscape' | translate }}</h2>
                                   <button class="px-4 py-2 text-white rounded text-xs font-bold uppercase tracking-widest shadow-lg"
                                           [style.background-color]="themeColor()">{{ 'DIRECT.BookNow' | translate }}</button>
                               </div>
                           </div>

                           <!-- Content -->
                           <div class="bg-white p-6">
                               <div class="flex gap-4 mb-4 overflow-x-auto pb-2">
                                   <div class="w-32 flex-shrink-0 bg-white rounded border p-2 text-center text-[10px]">
                                       <span class="block text-lg mb-1">⭐ 4.9</span>{{ 'DIRECT.GuestFavorite' | translate }}</div>
                                   <div class="w-32 flex-shrink-0 bg-white rounded border p-2 text-center text-[10px]">
                                       <span class="block text-lg mb-1">📶 500mb</span>{{ 'DIRECT.SuperWifi' | translate }}</div>
                                   <div class="w-32 flex-shrink-0 bg-white rounded border p-2 text-center text-[10px]">
                                       <span class="block text-lg mb-1">🔑 Self</span>{{ 'DIRECT.KeylessEntry' | translate }}</div>
                               </div>

                               <h3 class="font-bold text-slate-800 text-sm mb-2">{{ 'DIRECT.AboutThisSpace' | translate }}</h3>
                               <p class="text-[10px] text-slate-500 mb-4 line-clamp-3">
                                   Escape to this stunning sanctuary. Perfectly situated for urban exploration yet designed for ultimate relaxation. Enjoy the chef's kitchen, high-speed fiber internet, and premium linens.
                               </p>
                           </div>
                       </div>

                       <!-- Tier 3: Analytics Overlay -->
                       @if(isTier3()) {
                           <div class="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white p-2 rounded-lg border border-white/10 shadow-xl w-32 animate-fade-in text-[10px]">
                               <div class="text-slate-400 mb-1 uppercase font-bold text-[8px]">{{ 'DIRECT.LiveAnalytics' | translate }}</div>
                               <div class="flex justify-between mb-0.5">
                                   <span>{{ 'DIRECT.Visitors' | translate }}</span>
                                   <span class="font-mono text-emerald-400">142</span>
                               </div>
                               <div class="flex justify-between">
                                   <span>{{ 'DIRECT.Conversion' | translate }}</span>
                                   <span class="font-mono text-emerald-400">3.2%</span>
                               </div>
                           </div>
                       }
                   </div>
               </div>
               
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class DirectBookingComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'MKT_03',
        name: this.translate.instant('DIREBOOK.Title'),
        description: this.translate.instant('DIREBOOK.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    subdomain = 'my-villas';
    themeColor = signal('#4f46e5'); // Indigo
    colors = ['#4f46e5', '#e11d48', '#059669', '#d97706', '#0891b2'];
}

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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'DBOOK.DirectBookingSuite' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'DBOOK.SaveCommissionFeesWithYour' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]': !isTier0()
             }">
             {{ isTier3() ? 'Custom Domain Active' : (isTier2() ? 'Stitch Subdomain' : 'Microsite Preview') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Config -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <!-- Subdomain -->
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <span class="material-icons text-indigo-400 text-sm">language</span>
                       {{ 'DBOOK.SiteIdentity' | translate }}
                   </h3>
                   <div class="space-y-4">
                       <div>
                           <label class="block text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">{{ 'DBOOK.Subdomain' | translate }}</label>
                           <div class="flex items-center bg-black/30 border border-white/10 rounded-xl px-4 py-3 group focus-within:border-indigo-500 transition-all">
                               <input type="text" [(ngModel)]="subdomain" 
                                      class="bg-transparent text-white text-sm focus:outline-none w-full"
                                      placeholder="my-villas">
                               <span class="text-slate-500 text-xs">.stitch.host</span>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Customization -->
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <span class="material-icons text-amber-400 text-sm">palette</span>
                       {{ 'DBOOK.Design' | translate }}
                   </h3>
                   <div class="space-y-6">
                       <div>
                           <label class="block text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">{{ 'DBOOK.BrandColor' | translate }}</label>
                           <div class="flex flex-wrap gap-3">
                               @for (color of colors; track color) {
                                   <button (click)="themeColor.set(color)"
                                           class="w-8 h-8 rounded-full border-2 transition-all p-0.5"
                                           [style.background-color]="color"
                                           [class.border-white]="themeColor() === color"
                                           [class.border-transparent]="themeColor() !== color"
                                           [class.scale-125]="themeColor() === color">
                                   </button>
                               }
                           </div>
                       </div>
                       
                       <div class="p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-indigo-500 transition-all group">
                           <div class="flex items-center gap-3">
                               <div class="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                   <span class="material-icons">upload_file</span>
                               </div>
                               <div>
                                   <span class="text-xs font-bold text-white block">{{ 'DBOOK.BrandLogo' | translate }}</span>
                                   <span class="text-[9px] text-slate-500 uppercase">SVG, PNG (Max 2MB)</span>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Payment (Tier 3) -->
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm relative overflow-hidden group" [class.opacity-50]="!isTier3()">
                    @if (!isTier3()) {
                        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                             <span class="material-icons text-white mb-2">lock</span>
                             <p class="text-white text-xs font-bold mb-3">{{ 'DBOOK.UnlockPaymentsWithGold' | translate }}</p>
                             <button class="bg-white text-black text-[10px] font-black px-4 py-2 rounded-lg">{{ 'DBOOK.UpgradeNow' | translate }}</button>
                        </div>
                    }
                     <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                        {{ 'DBOOK.PaymentGateway' | translate }}
                    </h3>
                    <div class="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center justify-between">
                         <div class="flex items-center gap-3">
                             <div class="h-8 w-12 bg-indigo-500 rounded flex items-center justify-center text-[10px] font-black italic text-white shadow-lg">Stripe</div>
                             <span class="text-xs text-slate-300">{{ 'DBOOK.ConnectYourStripeAccount' | translate }}</span>
                         </div>
                         <button class="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">{{ 'DBOOK.connect' | translate }}</button>
                    </div>
               </div>
           </div>

           <!-- Right: Live Preview -->
           <div class="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-white/10 p-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[500px]">
                
                <div class="bg-slate-800/50 border-b border-white/5 p-4 flex items-center gap-4">
                    <div class="flex gap-1.5 px-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <div class="bg-black/40 rounded-lg px-4 py-1.5 flex-1 flex items-center gap-2 text-[11px] text-slate-400 border border-white/5">
                        <span class="material-icons text-xs text-emerald-400">lock</span>
                        https://{{ subdomain || 'my-villas' }}.stitch.host
                    </div>
                </div>

                <!-- Web Preview Content -->
                <div class="flex-1 bg-white overflow-hidden relative">
                    <!-- Nav -->
                    <nav class="h-16 px-8 flex items-center justify-between border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                <span class="material-icons text-slate-400 text-sm">home</span>
                            </div>
                            <span class="text-sm font-black text-slate-800 tracking-tighter uppercase">{{ subdomain || 'PROPERTY' }}</span>
                        </div>
                        <div class="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span class="text-slate-800">Home</span>
                            <span>Amenities</span>
                            <span>Reviews</span>
                        </div>
                        <button [style.background-color]="themeColor()" class="text-white text-[10px] font-black px-6 py-2.5 rounded shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform">
                            BOOK NOW
                        </button>
                    </nav>

                    <!-- Hero -->
                    <div class="p-12 pb-20 bg-slate-50 relative overflow-hidden">
                        <div class="max-w-md relative z-10">
                            <div [style.color]="themeColor()" class="text-[10px] font-black tracking-[0.3em] uppercase mb-4">{{ 'DBOOK.LuxuryCoastalLiving' | translate }}</div>
                            <h2 class="text-5xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">Experience Excellence.</h2>
                            <p class="text-slate-500 text-sm leading-relaxed mb-8">Premium accommodations curated for the modern traveler. No platform fees, just pure luxury at the best rate possible.</p>
                            <div class="flex gap-4 p-2 bg-white rounded-xl shadow-xl shadow-slate-200 border border-slate-100">
                                <div class="flex-1 border-r border-slate-100 pr-4">
                                    <div class="text-[8px] text-slate-400 uppercase font-bold mb-1 ml-4">Dates</div>
                                    <div class="flex items-center gap-2 px-4 text-xs font-bold text-slate-800">
                                        <span class="material-icons text-sm">calendar_today</span>
                                        Oct 12 - Oct 18
                                    </div>
                                </div>
                                <div class="flex items-center px-4">
                                     <button [style.background-color]="themeColor()" class="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg">
                                         <span class="material-icons">arrow_forward</span>
                                     </button>
                                </div>
                            </div>
                        </div>
                        <!-- UI Elements Simulation -->
                        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-slate-200 rounded-3xl rotate-12 flex items-center justify-center border-4 border-white shadow-2xl">
                             <span class="material-icons text-slate-300 text-9xl">image</span>
                        </div>
                    </div>

                    @if (isTier3()) {
                        <!-- Analytics Overlay (Tier 3) -->
                        <div class="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-2xl max-w-[200px] animate-fade-in-up">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="material-icons text-emerald-500 text-sm">visibility</span>
                                <span class="text-[10px] font-black text-slate-800 uppercase tracking-widest">{{ 'DBOOK.LiveTraffic' | translate }}</span>
                            </div>
                            <div class="space-y-3">
                                <div class="flex items-end gap-1 h-8">
                                    @for (h of [3,7,4,9,5,8,6,10]; track $index) {
                                        <div class="flex-1 bg-indigo-200 rounded-t-sm" [style.height.%]="h * 10"></div>
                                    }
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[9px] text-slate-500">Visits today:</span>
                                    <span class="text-[9px] font-bold text-indigo-600">142</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                @if(!isTier3()) {
                    <div class="absolute inset-0 bg-transparent pointer-events-none border-[12px] border-slate-900/10"></div>
                }
            </div>
       </div>
    </div>
    `,
    styles: [`
        :host { display: block; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
    `]
})
export class DirectBookingComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'MKT_03',
        name: this.translate.instant('DIRBOO.Title'),
        description: this.translate.instant('DIRBOO.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    subdomain = 'ocean-residency';
    themeColor = signal('#4f46e5'); // Indigo
    colors = ['#4f46e5', '#e11d48', '#059669', '#d97706', '#0891b2', '#1e293b'];
}

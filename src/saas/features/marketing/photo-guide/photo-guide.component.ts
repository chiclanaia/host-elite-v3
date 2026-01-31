import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'mkt-01-photo-guide',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'PHOTO.SmartPhotoEnhancer' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'PHOTO.ProfessionalTouchForYour' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]': !isTier0()
             }">
             {{ isTier3() ? 'AI Weather Swap Active' : (isTier2() ? 'Smart Brightness' : 'Standard Edit') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Controls -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                       <span class="material-icons text-emerald-400 text-sm">auto_fix_high</span>
                       {{ 'PHOTO.Enhancements' | translate }}
                   </h3>
                   
                   <div class="space-y-8">
                       <!-- Brightness -->
                       <div>
                           <div class="flex justify-between text-[10px] text-slate-400 mb-3 uppercase font-black tracking-widest">
                               <span>{{ 'PHOTO.Brightness' | translate }}</span>
                               <span class="text-emerald-400">{{ brightness() }}%</span>
                           </div>
                           <input type="range" [(ngModel)]="brightness" min="0" max="200" 
                                  class="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                       </div>

                       <!-- Advanced AI (Tier 3) -->
                       <div class="space-y-4 pt-4 border-t border-white/5" [class.opacity-50]="!isTier3()">
                           <div class="flex items-center justify-between mb-2">
                               <h4 class="text-[10px] text-slate-500 uppercase font-black tracking-widest">{{ 'PHOTO.AIWeatherSwap' | translate }}</h4>
                               @if (!isTier3()) { <span class="material-icons text-slate-600 text-xs">lock</span> }
                           </div>
                           
                           <div class="grid grid-cols-2 gap-3">
                               <button (click)="isTier3() && weatherMode.set('sunny')"
                                       class="flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-bold transition-all"
                                       [class.bg-amber-500/20]="weatherMode() === 'sunny'"
                                       [class.border-amber-500/50]="weatherMode() === 'sunny'"
                                       [class.text-amber-400]="weatherMode() === 'sunny'"
                                       [class.border-white/5]="weatherMode() !== 'sunny'"
                                       [class.text-slate-500]="weatherMode() !== 'sunny'">
                                   <span class="material-icons text-sm">wb_sunny</span>
                                   {{ 'PHOTO.Sunny' | translate }}
                               </button>
                               <button (click)="isTier3() && weatherMode.set('sunset')"
                                       class="flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-bold transition-all"
                                       [class.bg-rose-500/20]="weatherMode() === 'sunset'"
                                       [class.border-rose-500/50]="weatherMode() === 'sunset'"
                                       [class.text-rose-400]="weatherMode() === 'sunset'"
                                       [class.border-white/5]="weatherMode() !== 'sunset'"
                                       [class.text-slate-500]="weatherMode() !== 'sunset'">
                                   <span class="material-icons text-sm">filter_hdr</span>
                                   {{ 'PHOTO.GoldenHour' | translate }}
                               </button>
                           </div>
                       </div>

                       <!-- Privacy Blur -->
                       <label class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 cursor-pointer hover:border-indigo-500/50 transition-all group"
                              [class.opacity-50]="!isTier3()">
                           <div class="flex items-center gap-4">
                               <div class="relative flex items-center">
                                   <input type="checkbox" [(ngModel)]="blurActive" [disabled]="!isTier3()"
                                          class="h-5 w-5 rounded border-slate-600 bg-transparent text-indigo-500 focus:ring-0">
                               </div>
                               <div>
                                   <div class="text-sm text-white font-bold group-hover:text-indigo-300 transition-colors">{{ 'PHOTO.PrivacyBlur' | translate }}</div>
                                   <div class="text-[10px] text-slate-400">{{ 'PHOTO.AutoBlurLicensePlates' | translate }}</div>
                               </div>
                           </div>
                       </label>
                   </div>
               </div>

               <!-- Coach -->
               <div class="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden mt-auto">
                    <div class="absolute -right-2 top-0 opacity-5 scale-150">
                        <span class="material-icons text-6xl text-emerald-400">burst_mode</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">{{ 'PHOTO.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-400 text-[11px] leading-relaxed italic">
                        "First impressions are 90% visual. A sunny weather swap can increase conversion rates by up to 30% during winter months."
                    </p>
               </div>
           </div>

           <!-- Right: Before/After Slider -->
           <div class="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-white/10 p-1 flex flex-col relative overflow-hidden shadow-2xl group/slider">
                
                <div class="absolute top-8 left-8 z-20 flex gap-4">
                     <span class="bg-black/60 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-full border border-white/10 uppercase">Simulation Preview</span>
                </div>

                <div class="flex-1 relative bg-slate-800 overflow-hidden">
                    <!-- Base Image (After) -->
                    <div class="absolute inset-0 bg-slate-900 flex items-center justify-center transition-all duration-700 overflow-hidden"
                         [style.background-image]="'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200)'"
                         [style.background-size]="'cover'"
                         [style.background-position]="'center'"
                         [style.filter]="'brightness(' + brightness() + '%) ' + (weatherMode() === 'sunset' ? 'sepia(30%) saturate(150%) hue-rotate(-20deg)' : 'none')">
                         
                         @if (weatherMode() === 'sunset') {
                             <div class="absolute inset-0 bg-orange-500/10 pointer-events-none"></div>
                         }
                         
                         @if (blurActive()) {
                             <div class="absolute w-24 h-12 bg-white/20 backdrop-blur-xl border border-white/20 bottom-[20%] right-[30%] rounded-md animate-pulse"></div>
                         }

                         <div class="animate-pulse flex flex-col items-center">
                            <span class="material-icons text-6xl text-white/20">wallpaper</span>
                            <span class="text-xs text-white/20 mt-2 uppercase font-mono tracking-widest">Enhanced View</span>
                         </div>
                    </div>

                    <!-- Comparison Image (Before) -->
                    <div class="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden grayscale contrast-125 transition-all duration-300 pointer-events-none"
                         [style.clip-path]="'inset(0 ' + (100 - sliderPos()) + '% 0 0)'">
                         <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url(https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200)"></div>
                         <div class="flex flex-col items-center">
                            <span class="material-icons text-6xl text-white/10">wallpaper</span>
                            <span class="text-xs text-white/10 mt-2 uppercase font-mono tracking-widest">Original RAW</span>
                         </div>
                    </div>

                    <!-- Slider Handle -->
                    <div class="absolute inset-y-0 z-30 group" [style.left.%]="sliderPos()">
                        <div class="absolute h-full w-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] -translate-x-1/2"></div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize group-active:scale-90 transition-transform">
                             <span class="material-icons text-slate-900">unfold_more</span>
                             <!-- Left/Right Icons -->
                             <span class="absolute -left-12 text-[10px] font-black text-white bg-black/40 px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">BEFORE</span>
                             <span class="absolute -right-12 text-[10px] font-black text-white bg-black/40 px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">AFTER</span>
                        </div>
                    </div>

                    <!-- Invisible Input Range for interaction -->
                    <input type="range" [(ngModel)]="sliderPos" min="0" max="100" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40">
                </div>

                <div class="p-6 flex justify-between items-center bg-slate-800/50 backdrop-blur-md">
                    <div class="flex gap-4">
                        <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2">
                            <span class="material-icons text-sm">file_download</span>
                            {{ 'PHOTO.DownloadHD' | translate }}
                        </button>
                    </div>
                </div>
            </div>
       </div>
    </div>
    `,
    styles: [`
        :host { display: block; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px; width: 16px; border-radius: 50%;
            background: #10b981; cursor: pointer;
            box-shadow: 0 0 10px rgba(16,185,129,0.3); border: 2px solid #0f172a;
        }
    `]
})
export class PhotoGuideComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'MKT_01',
        name: this.translate.instant('PHOTGUID.Title'),
        description: this.translate.instant('PHOTGUID.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    sliderPos = signal(50);
    brightness = signal(110);
    weatherMode = signal<'sunny' | 'sunset'>('sunny');
    blurActive = signal(false);
}

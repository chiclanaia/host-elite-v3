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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'PHOTO.AiPhotoStudio' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'PHOTO.TurnAmateurPhoneShotsInto' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-pink-500/20 text-pink-300 border-pink-500/30': !isTier0()
             }">
             {{ isTier3() ? 'AI Weather Swap' : (isTier2() ? 'Auto-Enhance' : 'Manual Guide') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Controls & Tips -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold mb-4">{{ 'PHOTO.EnhancementSuite' | translate }}</h3>
                   
                   <!-- Filters -->
                   <div class="space-y-4">
                       <div>
                           <div class="flex justify-between text-xs text-slate-400 mb-1">
                               <span>{{ 'PHOTO.Brightness' | translate }}</span>
                               <span>{{ brightness() }}%</span>
                           </div>
                           <input type="range" [(ngModel)]="brightness" min="80" max="150" class="w-full h-1 bg-slate-600 rounded appearance-none" [disabled]="isTier0()">
                       </div>
                       
                       @if(isTier3()) {
                           <div>
                               <div class="flex justify-between text-xs text-slate-400 mb-1">
                                   <span>{{ 'PHOTO.AiBlueSky' | translate }}</span>
                                   <span class="text-indigo-400 font-bold">{{ 'PG.Active' | translate }}</span>
                               </div>
                               <div class="flex gap-2">
                                   <button (click)="weatherMode.set('sunny')" 
                                           class="flex-1 py-1 rounded text-xs border border-white/10 hover:bg-white/10 transition-colors"
                                           [class.bg-sky-500]="weatherMode() === 'sunny'"
                                           [class.text-white]="weatherMode() === 'sunny'"
                                           [class.text-slate-400]="weatherMode() !== 'sunny'">
                                       ☀️ Sunny
                                   </button>
                                   <button (click)="weatherMode.set('sunset')" 
                                           class="flex-1 py-1 rounded text-xs border border-white/10 hover:bg-white/10 transition-colors"
                                           [class.bg-orange-500]="weatherMode() === 'sunset'"
                                           [class.text-white]="weatherMode() === 'sunset'"
                                           [class.text-slate-400]="weatherMode() !== 'sunset'">
                                       🌇 Sunset
                                   </button>
                               </div>
                           </div>
                           
                           <div>
                               <div class="flex justify-between text-xs text-slate-400 mb-2 mt-4">
                                   <span>{{ 'PHOTO.PrivacyBlurFaceslicensePlates' | translate }}</span>
                               </div>
                               <button (click)="toggleBlur()" class="w-full py-2 border border-dashed border-slate-500 rounded text-xs text-slate-400 hover:text-white hover:border-white transition-colors" [class.bg-emerald-500-20]="blurActive()" data-debug-id="photo-toggle-blur">
                                   {{ blurActive() ? '✅ Blur Active' : 'Apply AI Blur' }}
                               </button>
                           </div>
                       } @else {
                           <div class="p-3 bg-black/20 rounded border border-white/5 text-center mt-4">
                               <p class="text-[10px] text-slate-400 mb-2">{{ 'PHOTO.UpgradeToGoldForWeather' | translate }}</p>
                               <button class="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded hover:bg-indigo-500">{{ 'PHOTO.Upgrade' | translate }}</button>
                           </div>
                       }
                   </div>
               </div>

                <!-- Coach -->
                <div class="p-4 bg-pink-500/10 border-l-4 border-pink-500 rounded-r-lg mt-auto">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-pink-300 font-bold text-sm uppercase">{{ 'PHOTO.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Vertical is King. 70% of bookings happen on mobile. Ensure your 'Hero' shot (cover photo) is cropped to 4:5 ratio for maximum screen real estate."
                    </p>
                </div>
           </div>

           <!-- Right: Before/After Visual -->
           <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
               <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden select-none">
                   
                   <div class="flex justify-between items-center mb-4">
                       <h3 class="text-white font-bold text-lg">{{ 'PHOTO.LivePreview' | translate }}</h3>
                       <div class="flex gap-2">
                            <span class="text-[10px] uppercase font-bold text-slate-500 bg-black/30 px-2 py-1 rounded">{{ 'PHOTO.Before' | translate }}</span>
                            <span class="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded">{{ 'PHOTO.AfterAi' | translate }}</span>
                       </div>
                   </div>

                   <!-- Viewer Container -->
                   <div class="relative flex-1 rounded-lg overflow-hidden bg-black group" 
                        (mousemove)="updateSlider($event)" 
                        (touchmove)="updateSlider($event)">
                       
                       <!-- Background (Original) -->
                       <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center grayscale opacity-70"></div>
                       
                       <!-- Foreground (Enhanced) with Clip Path -->
                       <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transition-all duration-300"
                            [style.clip-path]="'inset(0px ' + (100 - sliderPos()) + '% 0px 0px)'"
                            [style.filter]="'brightness(' + brightness() + '%) contrast(1.1) saturate(1.2)'"
                            [class.sepia]="weatherMode() === 'sunset'">
                       </div>
                       
                       <!-- Weather Overlays (Tier 3) -->
                       @if(isTier3() && weatherMode() === 'sunny') {
                           <!-- Sun Flare Mock -->
                           <div class="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-3xl pointer-events-none mix-blend-screen" 
                                [style.clip-path]="'inset(0px ' + (100 - sliderPos()) + '% 0px 0px)'"></div>
                       }
                       
                       <!-- Slider Handle -->
                       <div class="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                            [style.left.%]="sliderPos()">
                           <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg text-indigo-600">
                               <span class="material-icons text-sm">compare_arrows</span>
                           </div>
                       </div>
                       
                       <!-- Labels -->
                       <div class="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur pointer-events-none">{{ 'PHOTO.Original' | translate }}</div>
                       <div class="absolute top-4 right-4 bg-indigo-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur pointer-events-none" 
                            [style.opacity]="sliderPos() > 10 ? 1 : 0">{{ 'PHOTO.Enhanced' | translate }}</div>
                            
                   </div>
                   
                   <p class="text-center text-slate-500 text-xs mt-4">{{ 'PHOTO.DragSliderToCompare' | translate }}</p>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
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

    toggleBlur() {
        this.blurActive.update(v => !v);
    }

    updateSlider(event: MouseEvent | TouchEvent) {
        if (!event.target) return;
        const container = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

        // Calculate percentage
        let percentage = ((clientX - container.left) / container.width) * 100;

        // Clamp
        percentage = Math.max(0, Math.min(100, percentage));

        this.sliderPos.set(percentage);
    }
}

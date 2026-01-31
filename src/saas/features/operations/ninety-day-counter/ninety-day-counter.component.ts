import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-05-counter',
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
        <div class="px-4 py-2 bg-rose-600/10 text-rose-300 rounded-lg border border-rose-600/30 text-xs font-mono">{{ 'NINETY_DAY.LondonOnly' | translate }}</div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                <!-- Circular Progress -->
                <div class="relative w-56 h-56 group-hover:scale-105 transition-transform duration-500">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="112" cy="112" r="100" stroke="rgba(255,255,255,0.05)" stroke-width="14" fill="none"></circle>
                        <circle cx="112" cy="112" r="100" 
                                [attr.stroke]="progressColor()" 
                                stroke-width="14" fill="none" 
                                [attr.stroke-dasharray]="628" 
                                [attr.stroke-dashoffset]="dashOffset()" 
                                stroke-linecap="round"
                                class="transition-all duration-1000 ease-out"></circle>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <div class="text-5xl font-mono font-bold text-white tracking-tighter">{{ daysUsed() }}</div>
                        <div class="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mt-1">{{ 'NINETY_DAY.DaysUsed' | translate }}</div>
                    </div>
                </div>

                <div class="mt-10 text-center w-full max-w-xs">
                    <div class="flex justify-between text-xs mb-3">
                        <span class="text-slate-400">{{ 'NINETY_DAY.Remaining' | translate }}</span>
                        <span class="text-white font-bold">{{ 90 - daysUsed() }} Days</span>
                    </div>
                    <div class="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <div class="h-full transition-all duration-1000"
                             [class.bg-emerald-500]="daysUsed() < 60"
                             [class.bg-amber-500]="daysUsed() >= 60 && daysUsed() < 80"
                             [class.bg-rose-500]="daysUsed() >= 80"
                             [style.width.%]="(daysUsed() / 90) * 100"></div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="bg-slate-800 rounded-2xl border border-white/10 p-6 shadow-xl">
                    <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                        <span class="material-icons text-indigo-400">insights</span>
                        {{ 'NINETY_DAY.PlanningStrategy' | translate }}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button (click)="strategy.set('mid-term')"
                                [class.ring-2]="strategy() === 'mid-term'"
                                [class.ring-indigo-500]="strategy() === 'mid-term'"
                                [class.bg-indigo-600/20]="strategy() === 'mid-term'"
                                [class.bg-slate-700/30]="strategy() !== 'mid-term'"
                                class="p-5 rounded-xl text-center transition-all hover:bg-indigo-600/10 group">
                            <span class="block material-icons mb-2 text-indigo-400 group-hover:scale-110 transition-transform">event_repeat</span>
                            <span class="text-xs font-bold block text-indigo-100">{{ 'NINETY_DAY.SwitchToMidterm30d' | translate }}</span>
                        </button>
                        
                        <button (click)="strategy.set('blocked')"
                                [class.ring-2]="strategy() === 'blocked'"
                                [class.ring-rose-500]="strategy() === 'blocked'"
                                [class.bg-rose-600/10]="strategy() === 'blocked'"
                                [class.bg-slate-700/30]="strategy() !== 'blocked'"
                                class="p-5 rounded-xl text-center transition-all hover:bg-rose-600/10 group">
                            <span class="block material-icons mb-2 text-rose-400 group-hover:scale-110 transition-transform">block</span>
                            <span class="text-xs font-bold block text-rose-100">{{ 'NINETY_DAY.BlockCalendar' | translate }}</span>
                        </button>
                    </div>
                    
                     <div class="mt-6 p-4 bg-black/20 rounded-xl border border-white/5">
                        <div class="flex items-center gap-3 text-xs text-slate-400">
                            <span class="material-icons text-sm">info</span>
                            @if (strategy() === 'mid-term') {
                                <span>Switching to mid-term will preserve <b>{{ 90 - daysUsed() }} days</b> for high-season.</span>
                            } @else if (strategy() === 'blocked') {
                                <span>Calendar will be closed for all new bookings.</span>
                            } @else {
                                <span>Continuing with short-term bookings only.</span>
                            }
                        </div>
                    </div>
                </div>
                
                 @if (tier() === 'TIER_3') {
                    <div class="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-2xl border border-indigo-500/30 p-6 shadow-xl relative overflow-hidden">
                        <div class="absolute -right-8 -bottom-8 opacity-10">
                            <span class="material-icons text-9xl">smart_toy</span>
                        </div>
                        <h3 class="text-indigo-300 font-bold mb-3 flex items-center gap-2">
                             <span class="material-icons text-xl">verified</span>
                             {{ 'NINETY_DAY.SmartCapActive' | translate }}
                        </h3>
                        <p class="text-xs text-slate-400 leading-relaxed max-w-md">
                             AI-driven monitoring is active. Your calendars on <b>Airbnb, Booking.com, and VRBO</b> will be automatically managed to ensure 100% compliance with local 90-day laws.
                        </p>
                    </div>
                 }
                 
                 <!-- Coach -->
                <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                    <div class="flex items-start gap-4">
                        <span class="text-2xl">💡</span>
                        <div>
                            <h4 class="font-bold text-amber-300 text-sm mb-1">{{ 'NINETY_DAY.MidtermStrategy' | translate }}</h4>
                            <p class="text-xs text-amber-200/70 leading-relaxed">{{ 'NINETY_DAY.RentalsLongerThan30Days' | translate }}</p>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`
        :host { display: block; height: 100%; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `]
})
export class NinetyDayCounterComponent {
    translate = inject(TranslationService);
    session = inject(SessionStore);

    feature = computed(() => ({
        id: 'OPS_05',
        name: this.translate.instant('NINEDAYCOU.Title'),
        description: this.translate.instant('NINEDAYCOU.Description'),
    } as any));

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    daysUsed = signal<number>(67);
    strategy = signal<'short-term' | 'mid-term' | 'blocked'>('short-term');

    dashOffset = computed(() => {
        const circum = 2 * Math.PI * 100;
        const progress = this.daysUsed() / 90;
        return circum * (1 - progress);
    });

    progressColor = computed(() => {
        const d = this.daysUsed();
        if (d < 60) return '#10b981'; // emerald
        if (d < 80) return '#f59e0b'; // amber
        return '#f43f5e'; // rose
    });

    recalculate() {
        // Simulation of fetching latest bookings
        const random = 60 + Math.floor(Math.random() * 25);
        this.daysUsed.set(random);
    }
}

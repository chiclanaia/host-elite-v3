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
        <div class="px-4 py-2 bg-red-500/10 text-red-300 rounded-lg border border-red-500/30 text-xs font-mono">{{ 'NINETY_DAY.LondonOnly' | translate }}</div>
      </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div class="bg-slate-800 rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <!-- Circular Progress -->
                <div class="relative w-48 h-48">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" stroke-width="12" fill="none"></circle>
                        <circle cx="96" cy="96" r="88" stroke="#f43f5e" stroke-width="12" fill="none" stroke-dasharray="552" stroke-dashoffset="138" stroke-linecap="round"></circle>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <div class="text-4xl font-mono font-bold text-white">67</div>
                        <div class="text-xs text-slate-500 uppercase font-bold">{{ 'NINETY_DAY.DaysUsed' | translate }}</div>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="text-slate-400 text-sm mb-2">{{ 'NINETY_DAY.Remaining' | translate }}<span class="text-white font-bold">23 Days</span></div>
                    <div class="h-2 w-64 bg-slate-700 rounded-full overflow-hidden mx-auto">
                        <div class="h-full bg-rose-500 w-[75%]"></div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                    <h3 class="text-white font-bold mb-4">{{ 'NINETY_DAY.PlanningStrategy' | translate }}</h3>
                    <div class="flex gap-4">
                        <button class="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 p-4 rounded-lg flex-1 text-center transition-all" data-debug-id="90day-switch-midterm-btn">
                            <span class="block material-icons mb-2">event_repeat</span>
                            <span class="text-xs font-bold block">{{ 'NINETY_DAY.SwitchToMidterm30d' | translate }}</span>
                        </button>
                         <button class="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex-1 text-center transition-all" data-debug-id="90day-block-calendar-btn">
                            <span class="block material-icons mb-2">block</span>
                            <span class="text-xs font-bold block">{{ 'NINETY_DAY.BlockCalendar' | translate }}</span>
                        </button>
                    </div>
                </div>
                
                 @if (tier() === 'TIER_3') {
                    <div class="bg-indigo-900/20 rounded-xl border border-indigo-500/30 p-6">
                        <h3 class="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                             <span class="material-icons text-sm">smart_toy</span>{{ 'NINETY_DAY.SmartCapActive' | translate }}</h3>
                        <p class="text-xs text-slate-400">
                             Calendar will automatically block "Short-term" bookings on Airbnb/Booking.com once limit hits 90 days.
                        </p>
                    </div>
                 }
            </div>
            
            <!-- Coach -->
            <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">📅</span>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm">{{ 'NINETY_DAY.MidtermStrategy' | translate }}</h4>
                        <p class="text-xs text-indigo-200/80 mt-1">{{ 'NINETY_DAY.RentalsLongerThan30Days' | translate }}</p>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class NinetyDayCounterComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_05',
        name: this.translate.instant('NINEDAYCOU.Title'),
        description: this.translate.instant('NINEDAYCOU.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-02-ical-sync',
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
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
           📅 Calendar Engine
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <!-- Calendar Status -->
          <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
              <h3 class="text-xl font-bold text-white mb-6">{{ 'ICAL.SynchronizationStatus' | translate }}</h3>

              <!-- TIER 0: Basic Export -->
              <div class="mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
                   <h4 class="text-white font-bold mb-2">{{ 'ICAL.ExportYourCalendar' | translate }}</h4>
                   <p class="text-xs text-slate-400 mb-3">{{ 'ICAL.ShareThisLinkWithOther' | translate }}</p>
                   <div class="flex gap-2">
                       <input type="text" readonly value="https://api.hote-exception.com/ical/prop_123.ics" class="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-slate-300 font-mono">
                       <button class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold">{{ 'ICAL.Copy' | translate }}</button>
                   </div>
              </div>

              <!-- TIER 1/2/3: Import Slots -->
              @if (tier() !== 'TIER_0' && tier() !== 'Freemium') {
                  <h4 class="text-white font-bold mb-4">{{ 'ICAL.ConnectedCalendarsImport' | translate }}</h4>
                  <div class="space-y-3">
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-rose-500">
                          <div class="flex items-center gap-3">
                              <span class="text-xl">🏠</span> <!-- Airbnb Icon Placeholder -->
                              <div>
                                  <p class="text-white text-sm font-bold">{{ 'ICAL.AirbnbMain' | translate }}</p>
                                  <p class="text-xs text-slate-500">{{ 'ICAL.LastSync2MinAgo' | translate }}</p>
                              </div>
                          </div>
                          <div class="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold">{{ 'ICAL.Active' | translate }}</div>
                      </div>
                      
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-blue-500">
                          <div class="flex items-center gap-3">
                              <span class="text-xl">🏨</span> <!-- Booking Icon Placeholder -->
                              <div>
                                  <p class="text-white text-sm font-bold">{{ 'ICAL.Bookingcom' | translate }}</p>
                                  <p class="text-xs text-slate-500">{{ 'ICAL.LastSync58MinAgo' | translate }}</p>
                              </div>
                          </div>
                           @if (tier() === 'TIER_3') {
                              <button class="text-xs text-indigo-400 hover:text-white underline">{{ 'ICAL.ForceSync' | translate }}</button>
                           } @else {
                              <span class="text-xs text-slate-500">{{ 'ICAL.SyncsHourly' | translate }}</span>
                           }
                      </div>
                  </div>
              }
          </div>

          <!-- Ops Log / Collision Detector -->
          <div class="bg-slate-900 rounded-xl border border-white/10 p-6 overflow-hidden relative">
               <h3 class="text-lg font-bold text-white mb-4">{{ 'ICAL.SyncLog' | translate }}</h3>
               
               <div class="space-y-4 font-mono text-xs">
                   <div class="flex gap-4 text-emerald-400/80">
                       <span class="text-slate-500">10:42 PM</span>
                       <span>{{ 'ICAL.Fetched3EventsFromAirbnb' | translate }}</span>
                   </div>
                   <div class="flex gap-4 text-emerald-400/80">
                       <span class="text-slate-500">09:42 PM</span>
                       <span>{{ 'ICAL.Fetched3EventsFromAirbnb' | translate }}</span>
                   </div>
                   
                   @if (tier() === 'TIER_3') {
                       <!-- Simulated Collision -->
                       <div class="p-3 bg-rose-500/10 border border-rose-500/20 rounded mt-4">
                           <div class="flex items-center gap-2 text-rose-400 font-bold mb-1">
                               <span class="material-icons text-sm">warning</span>{{ 'ICAL.DoubleBookingPrevented' | translate }}</div>
                           <p class="text-slate-400">{{ 'ICAL.BlockedBookingcomRequestForDec' | translate }}</p>
                       </div>
                   }
               </div>
           </div>
           
           <!-- Coach -->
           <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl lg:col-span-2">
                <div class="flex items-start gap-3">
                   <span class="text-xl">⚡</span>
                   <div>
                       <h4 class="font-bold text-indigo-300 text-sm">{{ 'ICAL.ApiVsIcal' | translate }}</h4>
                       <p class="text-xs text-indigo-200/80 mt-1">iCal is slow (up to an hour delay). Direct API connections (Tier 3) are real-time, preventing double-bookings instantly.</p>
                   </div>
               </div>
           </div>
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class IcalSyncComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_02',
        name: this.translate.instant('ICALSYNC.Title'),
        description: this.translate.instant('ICALSYNC.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

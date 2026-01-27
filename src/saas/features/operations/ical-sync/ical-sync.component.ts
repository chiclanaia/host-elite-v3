import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-02-ical-sync',
    standalone: true,
    imports: [CommonModule],
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
              <h3 class="text-xl font-bold text-white mb-6">Synchronization Status</h3>

              <!-- TIER 0: Basic Export -->
              <div class="mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
                   <h4 class="text-white font-bold mb-2">Export your Calendar</h4>
                   <p class="text-xs text-slate-400 mb-3">Share this link with other platforms to block dates when you are booked.</p>
                   <div class="flex gap-2">
                       <input type="text" readonly value="https://api.hote-exception.com/ical/prop_123.ics" class="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-slate-300 font-mono">
                       <button class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold">Copy</button>
                   </div>
              </div>

              <!-- TIER 1/2/3: Import Slots -->
              @if (tier() !== 'TIER_0' && tier() !== 'Freemium') {
                  <h4 class="text-white font-bold mb-4">Connected Calendars (Import)</h4>
                  <div class="space-y-3">
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-rose-500">
                          <div class="flex items-center gap-3">
                              <span class="text-xl">🏠</span> <!-- Airbnb Icon Placeholder -->
                              <div>
                                  <p class="text-white text-sm font-bold">Airbnb Main</p>
                                  <p class="text-xs text-slate-500">Last sync: 2 min ago</p>
                              </div>
                          </div>
                          <div class="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold">Active</div>
                      </div>
                      
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-blue-500">
                          <div class="flex items-center gap-3">
                              <span class="text-xl">🏨</span> <!-- Booking Icon Placeholder -->
                              <div>
                                  <p class="text-white text-sm font-bold">Booking.com</p>
                                  <p class="text-xs text-slate-500">Last sync: 58 min ago</p>
                              </div>
                          </div>
                           @if (tier() === 'TIER_3') {
                              <button class="text-xs text-indigo-400 hover:text-white underline">Force Sync</button>
                           } @else {
                              <span class="text-xs text-slate-500">Syncs hourly</span>
                           }
                      </div>
                  </div>
              }
          </div>

          <!-- Ops Log / Collision Detector -->
          <div class="bg-slate-900 rounded-xl border border-white/10 p-6 overflow-hidden relative">
               <h3 class="text-lg font-bold text-white mb-4">Sync Log</h3>
               
               <div class="space-y-4 font-mono text-xs">
                   <div class="flex gap-4 text-emerald-400/80">
                       <span class="text-slate-500">10:42 PM</span>
                       <span>Fetched 3 events from Airbnb. No conflicts.</span>
                   </div>
                   <div class="flex gap-4 text-emerald-400/80">
                       <span class="text-slate-500">09:42 PM</span>
                       <span>Fetched 3 events from Airbnb. No conflicts.</span>
                   </div>
                   
                   @if (tier() === 'TIER_3') {
                       <!-- Simulated Collision -->
                       <div class="p-3 bg-rose-500/10 border border-rose-500/20 rounded mt-4">
                           <div class="flex items-center gap-2 text-rose-400 font-bold mb-1">
                               <span class="material-icons text-sm">warning</span>
                               Double Booking Prevented
                           </div>
                           <p class="text-slate-400">Blocked Booking.com request for Dec 24-26 (Already booked on Airbnb).</p>
                       </div>
                   }
               </div>
           </div>
           
           <!-- Coach -->
           <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl lg:col-span-2">
                <div class="flex items-start gap-3">
                   <span class="text-xl">⚡</span>
                   <div>
                       <h4 class="font-bold text-indigo-300 text-sm">API vs iCal</h4>
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
    feature = computed(() => ({
        id: 'OPS_02',
        name: 'iCal Sync',
        description: 'Redundant Calendar Sync Engine',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

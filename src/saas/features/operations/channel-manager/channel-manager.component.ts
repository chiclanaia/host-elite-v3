import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-03-channel-manager',
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
           📡 Global Distribution
        </div>
      </div>

      <!-- TIER 0 Warning -->
      @if (tier() === 'TIER_0' || tier() === 'Freemium') {
         <div class="flex-1 flex items-center justify-center p-8">
             <div class="max-w-md text-center">
                 <div class="text-6xl mb-6 opacity-20">🔒</div>
                 <h2 class="text-2xl font-bold text-white mb-2">Upgrade to Multi-Channel</h2>
                 <p class="text-slate-400 mb-6">Free plans are limited to manual iCal sync. Upgrade to Tier 1+ to connect Airbnb and Booking.com via official APIs.</p>
                 <button class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all">
                     View Plans
                 </button>
             </div>
         </div>
      } @else {
          <!-- Connections Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Airbnb Card -->
              <div class="bg-slate-800 rounded-xl border border-white/10 p-6 relative overflow-hidden group">
                  <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span class="text-6xl font-black">Ab</span>
                  </div>
                  <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold text-white">Airbnb</h3>
                      <div class="h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  
                  <div class="space-y-2 mb-6 text-sm">
                      <div class="flex justify-between text-slate-400">
                          <span>Listing Status</span>
                          <span class="text-white">Live</span>
                      </div>
                      <div class="flex justify-between text-slate-400">
                          <span>Price Markup</span>
                          <span class="text-white">+15%</span>
                      </div>
                  </div>

                  @if (tier() === 'TIER_3') {
                      <div class="mb-4 p-2 bg-indigo-500/10 rounded border border-indigo-500/20 text-xs text-indigo-300">
                          🤖 Unified Inbox Active
                      </div>
                  }

                  <button class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold transition-colors">
                      Configure
                  </button>
              </div>

              <!-- Booking.com Card -->
              <div class="bg-slate-800 rounded-xl border border-white/10 p-6 relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-4 opacity-10">
                      <span class="text-6xl font-black">Bk</span>
                  </div>
                  <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold text-white">Booking.com</h3>
                      <div class="h-3 w-3 bg-slate-600 rounded-full"></div>
                  </div>
                  
                  <p class="text-slate-400 text-sm mb-6">Connect your Booking.com Extranet ID to start syncing prices and inventory.</p>

                  <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                      Connect XML
                  </button>
              </div>

              <!-- VRBO / Expedia -->
              <div class="bg-slate-800 rounded-xl border border-white/10 p-6 relative overflow-hidden opacity-75">
                   <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold text-white">Vrbo</h3>
                      <div class="px-2 py-0.5 border border-white/20 rounded text-[10px] text-slate-400 uppercase">Beta</div>
                  </div>
                  <p class="text-slate-400 text-sm mb-6">Reach families and long-stay guests.</p>
                  <button class="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm font-bold cursor-not-allowed">Coming Soon</button>
              </div>
          </div>
          
          <!-- Coach -->
          <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <div class="flex items-start gap-3">
                  <span class="text-xl">⚡</span>
                  <div>
                      <h4 class="font-bold text-indigo-300 text-sm">Why Upgrade to API?</h4>
                      <p class="text-xs text-indigo-200/80 mt-1">iCal links only sync availability. API connections sync rates, photos, and messages in real-time. It's the only way to scale safely.</p>
                  </div>
              </div>
          </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ChannelManagerComponent {
    feature = computed(() => ({
        id: 'OPS_03',
        name: 'Channel Manager',
        description: 'API-Direct Distribution Engine',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

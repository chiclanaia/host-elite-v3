import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'mkt-00-listing-optimization',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Listing Scorecard 360°</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">AI-driven audit to rank #1 on Airbnb, Booking.com, and VRBO.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/10 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Multi-Channel Sync' : (isTier2() ? 'AI Auditor' : 'Static Checklist') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Audit Input & Status -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
               <!-- Input Card -->
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
                   <h3 class="text-white font-bold mb-4">Analyze Property</h3>
                   <div class="relative mb-4">
                       <input [(ngModel)]="listingUrl" type="text" placeholder="Paste Airbnb URL..." 
                              class="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                              [disabled]="isTier0()"
                              data-debug-id="listing-audit-input-url">
                       <span class="material-icons absolute left-3 top-3.5 text-slate-500">link</span>
                   </div>
                   
                   @if (isTier0()) {
                       <div class="p-4 bg-slate-900 rounded border border-white/5 text-center">
                           <p class="text-slate-400 text-xs mb-2">Upgrade to Silver to unlock AI Analysis.</p>
                           <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs" data-debug-id="mkt-upgrade-btn">Unlock Audit</button>
                       </div>
                   } @else {
                       <button (click)="analyze()" 
                               class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2" 
                               [class.opacity-50]="analyzing()"
                               data-debug-id="listing-audit-analyze-btn">
                           @if(analyzing()) {
                               <span class="material-icons animate-spin text-sm">autorenew</span> Scanning...
                           } @else {
                               <span class="material-icons text-sm">search</span> Run Audit
                           }
                       </button>
                   }
               </div>
               
               <!-- Tier 3: Sync Status -->
               @if (isTier3()) {
                   <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                       <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                           <span class="material-icons text-indigo-400">sync_alt</span> Channel Sync
                       </h3>
                       <div class="space-y-3">
                           <div class="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                               <div class="flex items-center gap-3">
                                   <div class="w-8 h-8 rounded-full bg-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center font-bold text-xs">Ab</div>
                                   <div class="text-xs text-white">Airbnb</div>
                               </div>
                               <span class="text-[10px] text-emerald-400 font-mono">Live</span>
                           </div>
                           <div class="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                               <div class="flex items-center gap-3">
                                   <div class="w-8 h-8 rounded-full bg-[#003580]/20 text-[#003580] flex items-center justify-center font-bold text-xs">Bk</div>
                                   <div class="text-xs text-white">Booking</div>
                               </div>
                               <button class="text-[10px] text-indigo-400 hover:text-white border border-indigo-500/30 px-2 py-1 rounded" data-debug-id="sync-booking-btn">Connect</button>
                           </div>
                           <div class="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                               <div class="flex items-center gap-3">
                                   <div class="w-8 h-8 rounded-full bg-[#3b5998]/20 text-[#3b5998] flex items-center justify-center font-bold text-xs">Vb</div>
                                   <div class="text-xs text-white">Vrbo</div>
                               </div>
                               <button class="text-[10px] text-indigo-400 hover:text-white border border-indigo-500/30 px-2 py-1 rounded" data-debug-id="sync-vrbo-btn">Connect</button>
                           </div>
                       </div>
                   </div>
               }

               <!-- Coach -->
               <div class="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "The 'Workstation' Hack: Simply adding 'Dedicated Workspace' to your amenities list increases booking visibility by 14% for mid-week stays."
                   </p>
               </div>
           </div>

           <!-- Right: Results & Gauge -->
           <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
               <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                   
                   @if(!analyzed()) {
                       <!-- Empty State -->
                       <div class="text-center opacity-50">
                           <span class="material-icons text-6xl text-slate-600 mb-4">query_stats</span>
                           <h3 class="text-xl font-bold text-white mb-2">Ready to Optimize?</h3>
                           <p class="text-slate-400 max-w-md">Paste your URL to see how you rank against the top 10% of properties in your area.</p>
                       </div>
                   } @else {
                       <!-- Gauge & Score -->
                       <div class="flex flex-col md:flex-row gap-12 items-center w-full max-w-4xl animate-fade-in">
                           
                           <!-- Radial Gauge -->
                           <div class="relative w-48 h-48 flex items-center justify-center">
                               <!-- Background Track -->
                               <div class="absolute inset-0 rounded-full border-[12px] border-slate-700"></div>
                               <!-- Active Track (Conic Gradient) -->
                               <div class="absolute inset-0 rounded-full border-[12px] border-transparent"
                                    style="background: conic-gradient(from 0deg, #10b981 0%, #10b981 72%, transparent 72%); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 12px), #fff calc(100% - 12px)); mask: radial-gradient(farthest-side, transparent calc(100% - 12px), #fff calc(100% - 12px));"></div>
                               
                               <div class="text-center z-10">
                                   <div class="text-5xl font-extrabold text-white">72</div>
                                   <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">/ 100</div>
                               </div>
                           </div>

                           <!-- Insights List -->
                           <div class="flex-1 space-y-4 w-full">
                               <div class="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                   <div class="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                                       <span class="material-icons">priority_high</span>
                                   </div>
                                   <div>
                                       <h4 class="text-red-300 font-bold text-sm">Missing 'Workspace' Keyword</h4>
                                       <p class="text-slate-400 text-xs mt-1">Huge demand in your area. Add a photo of a desk/table and check the amenity box.</p>
                                   </div>
                                   <button *ngIf="isTier3()" class="ml-auto text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded" data-debug-id="fix-keyword-btn">Auto-Fix</button>
                               </div>

                               <div class="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                   <div class="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center text-amber-500">
                                       <span class="material-icons">photo_camera</span>
                                   </div>
                                   <div>
                                       <h4 class="text-amber-300 font-bold text-sm">Cover Photo is Dark</h4>
                                       <p class="text-slate-400 text-xs mt-1">Your main photo is 20% darker than competitors. Brighten it to increase CTR by 5%.</p>
                                   </div>
                               </div>

                               <div class="flex items-start gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                   <div class="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                       <span class="material-icons">check</span>
                                   </div>
                                   <div>
                                       <h4 class="text-emerald-300 font-bold text-sm">Response Time Perfect</h4>
                                       <p class="text-slate-400 text-xs mt-1">You reply faster than 92% of local hosts. Keep it up!</p>
                                   </div>
                               </div>
                           </div>
                       </div>
                   }
                   
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ListingOptimizationComponent {
    feature = computed(() => ({
        id: 'MKT_00',
        name: 'Listing Optimization',
        description: 'AI-Driven Conversion Auditor',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    listingUrl = '';
    analyzing = signal(false);
    analyzed = signal(false);

    analyze() {
        if (!this.listingUrl) return;
        this.analyzing.set(true);
        setTimeout(() => {
            this.analyzing.set(false);
            this.analyzed.set(true);
        }, 1500);
    }
}

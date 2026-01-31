import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface Competitor {
    id: string;
    name: string;
    price: number;
    occupancy: number;
    rating: number;
    type: 'Luxury' | 'Budget' | 'Boutique' | 'Similar';
    lastUpdated: string;
}

@Component({
    selector: 'pri-03-market-alerts',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'MALERT.MarketIntelligenceRadar' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'MALERT.SpyOnYourNeighborsLegally' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all duration-500"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]': !isTier0()
             }">
             {{ isTier3() ? 'Real-Time Scraper' : (isTier2() ? 'Daily Alerts' : 'Manual Alerts') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Alerts Config -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                       <span class="material-icons text-rose-400 text-sm">notifications_active</span>
                       {{ 'MALERT.WatchlistTriggers' | translate }}
                   </h3>
                   
                   <div class="space-y-4">
                       <!-- Price Spike -->
                       <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5 group hover:border-indigo-500/50 transition-all cursor-pointer" (click)="toggleAlert('price')">
                           <div class="flex justify-between items-start mb-3">
                               <div class="flex items-center gap-3">
                                   <div class="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                                       <span class="material-icons">trending_up</span>
                                   </div>
                                   <div>
                                       <span class="text-sm font-bold text-white block">{{ 'MALERT.PriceSurge' | translate }}</span>
                                       <span class="text-[9px] text-slate-500 uppercase font-bold">SMART TRIGGER</span>
                                   </div>
                               </div>
                               <div class="w-10 h-5 rounded-full relative transition-colors duration-300"
                                    [class.bg-emerald-500]="alerts().price" [class.bg-slate-700]="!alerts().price">
                                   <div class="absolute top-1 h-3 w-3 rounded-full bg-white transition-all duration-300 shadow-sm"
                                        [style.left]="alerts().price ? '24px' : '4px'"></div>
                               </div>
                           </div>
                           <p class="text-[10px] text-slate-400 leading-relaxed">Alert me if 3+ neighbors raise rates by > 15%</p>
                       </div>

                       <!-- Undercut Alert -->
                       <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5 group hover:border-rose-500/50 transition-all cursor-pointer" (click)="toggleAlert('undercut')">
                           <div class="flex justify-between items-start mb-3">
                               <div class="flex items-center gap-3">
                                   <div class="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center transition-transform group-hover:scale-110">
                                       <span class="material-icons">trending_down</span>
                                   </div>
                                   <div>
                                       <span class="text-sm font-bold text-white block">{{ 'MALERT.UndercutWarning' | translate }}</span>
                                       <span class="text-[9px] text-slate-500 uppercase font-bold">COMPETITION</span>
                                   </div>
                               </div>
                               <div class="w-10 h-5 rounded-full relative transition-colors duration-300"
                                    [class.bg-emerald-500]="alerts().undercut" [class.bg-slate-700]="!alerts().undercut">
                                   <div class="absolute top-1 h-3 w-3 rounded-full bg-white transition-all duration-300 shadow-sm"
                                        [style.left]="alerts().undercut ? '24px' : '4px'"></div>
                               </div>
                           </div>
                           <p class="text-[10px] text-slate-400 leading-relaxed">{{ 'MALERT.AlertMeIfSimilarListings' | translate }}</p>
                       </div>

                       <!-- Event Watch (Tier 3) -->
                       <div class="p-4 bg-slate-900 rounded-xl border border-white/5 group relative overflow-hidden" [class.opacity-50]="!isTier3()">
                           <div class="flex justify-between items-start mb-3">
                               <div class="flex items-center gap-3">
                                   <div class="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                                       <span class="material-icons">event</span>
                                   </div>
                                   <div>
                                       <span class="text-sm font-bold text-white block">{{ 'MALERT.EventDetection' | translate }}</span>
                                       <span class="text-[9px] text-slate-500 uppercase font-bold">BIG DATA</span>
                                   </div>
                               </div>
                               @if(isTier3()) {
                                   <div class="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer" (click)="toggleAlert('event')">
                                       <div class="absolute top-1 h-3 w-3 rounded-full bg-white transition-all duration-300"
                                            [style.left]="alerts().event ? '24px' : '4px'"></div>
                                   </div>
                               } @else {
                                   <span class="material-icons text-slate-600 text-xs">lock</span>
                               }
                           </div>
                           <p class="text-[10px] text-slate-500">{{ 'MALERT.ScanTicketmastereventbriteFor50kAttendees' | translate }}</p>
                       </div>
                   </div>
               </div>

               <!-- Coach -->
               <div class="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl relative overflow-hidden mt-auto">
                    <div class="absolute -right-2 top-0 opacity-5 scale-150">
                        <span class="material-icons text-6xl text-rose-400">track_changes</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-rose-400 font-bold text-[10px] uppercase tracking-widest">{{ 'MALERT.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-400 text-[11px] leading-relaxed italic">
                        "Don't Blink. During the Taylor Swift tour, hosts who updated rates 6 months out made 300% more. Tier 3 'Event Detection' catches these spikes early."
                    </p>
               </div>
           </div>

           <!-- Right: Competitor Radar -->
           <div class="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-white/10 p-10 flex flex-col relative overflow-hidden shadow-2xl">
                
                <div class="flex justify-between items-center mb-8 relative z-20">
                    <div>
                        <h3 class="text-white font-bold text-xl tracking-tight">{{ 'MALERT.CompetitorPulse' | translate }}</h3>
                        <p class="text-xs text-slate-500 mt-1">Real-time local market radar</p>
                    </div>
                    @if(isTier3()) {
                        <div class="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span class="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">LIVE SCRAPER</span>
                        </div>
                    }
                </div>

                <!-- Radar Chart Simulation -->
                <div class="flex-1 relative flex items-center justify-center group/radar py-10">
                    <!-- Scan Pulse -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="w-[500px] h-[500px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent rounded-full animate-[scan-spin_4s_linear_infinite] z-0"></div>
                    </div>

                    <!-- Rings -->
                    <div class="absolute w-[400px] h-[400px] rounded-full border border-white/5 animate-pulse"></div>
                    <div class="absolute w-[280px] h-[280px] rounded-full border border-white/10"></div>
                    <div class="absolute w-[160px] h-[160px] rounded-full border border-white/20"></div>
                    
                    <!-- Axes -->
                    <div class="absolute w-[440px] h-[1px] bg-white/5 rotate-0"></div>
                    <div class="absolute w-[440px] h-[1px] bg-white/5 rotate-90"></div>
                    <div class="absolute w-[440px] h-[1px] bg-white/5 rotate-45"></div>
                    <div class="absolute w-[440px] h-[1px] bg-white/5 -rotate-45"></div>

                    <!-- Labels on Axes -->
                    <span class="absolute top-[5%] left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-bold">PRICE +</span>
                    <span class="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-bold">PRICE -</span>
                    <span class="absolute left-[5%] top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold">OCC -</span>
                    <span class="absolute right-[5%] top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold">OCC +</span>

                    <!-- You (Center) -->
                    <div class="absolute w-6 h-6 bg-indigo-500 rounded-full border-4 border-slate-900 shadow-[0_0_30px_rgba(99,102,241,0.6)] z-20 group-hover:scale-125 transition-transform duration-500">
                        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-400 tracking-[0.2em]">STITCH</div>
                    </div>

                    <!-- Competitors -->
                    @for(comp of competitors(); track comp.id) {
                        <div class="absolute w-4 h-4 rounded-full border-2 border-slate-900 shadow-xl transition-all duration-700 cursor-pointer group/node"
                             [style.background-color]="comp.type === 'Luxury' ? '#f59e0b' : comp.type === 'Budget' ? '#ef4444' : '#6366f1'"
                             [style.transform]="'translate(' + getPosition(comp).x + 'px, ' + getPosition(comp).y + 'px)'"
                             [class.hover:scale-150]="true"
                             (click)="scannedComp.set(comp)">
                            
                            <!-- Connecting Line -->
                            <div class="absolute bottom-1/2 right-1/2 w-[100px] h-[1px] bg-gradient-to-r from-transparent to-white/10 origin-right -z-10"
                                 [style.width.px]="getDistance(comp)"
                                 [style.transform]="'rotate(' + getAngle(comp) + 'deg)'"></div>

                            <!-- Floating Label -->
                            <div class="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover/node:scale-100 transition-transform bg-black/90 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap z-50">
                                {{ comp.name }}
                            </div>
                        </div>
                    }
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 p-6 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div class="text-center md:text-left">
                         <div class="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{{ 'MALERT.MarketAvgPrice' | translate }}</div>
                         <div class="text-xl font-mono text-white font-bold">€{{ marketAvgPrice() }}</div>
                    </div>
                    <div class="text-center md:text-left">
                         <div class="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">{{ 'MALERT.MarketOccupancy' | translate }}</div>
                         <div class="text-xl font-mono text-white font-bold">{{ marketAvgOcc() }}%</div>
                    </div>
                    <div class="text-center md:text-left">
                         <div class="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Local Saturation</div>
                         <div class="text-xl font-mono text-rose-400 font-bold">High</div>
                    </div>
                    <div class="flex items-center justify-center">
                        <button (click)="refreshRadar()" class="w-full h-10 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-95">
                            SCAN MARKET
                        </button>
                    </div>
                </div>

                <!-- Last Scanned Info (Tier 3) -->
                @if(scannedComp()) {
                    <div class="absolute bottom-10 left-10 p-4 bg-slate-800 rounded-xl border border-white/10 animate-fade-in-up shadow-2xl z-30 max-w-[200px]">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="text-white font-bold text-xs">{{ scannedComp()?.name }}</h4>
                            <button (click)="scannedComp.set(null)" class="text-slate-500 hover:text-white"><span class="material-icons text-sm">close</span></button>
                        </div>
                        <div class="space-y-1 text-[10px]">
                            <div class="flex justify-between"><span class="text-slate-500">Price:</span> <span class="text-white">€{{ scannedComp()?.price }}</span></div>
                            <div class="flex justify-between"><span class="text-slate-500">Occ:</span> <span class="text-white">{{ scannedComp()?.occupancy }}%</span></div>
                            <div class="flex justify-between"><span class="text-slate-500">Rating:</span> <span class="text-amber-400">★ {{ scannedComp()?.rating }}</span></div>
                        </div>
                    </div>
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
        @keyframes scan-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `]
})
export class MarketAlertsComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'PRI_03',
        name: this.translate.instant('MARKALER.Title'),
        description: this.translate.instant('MARKALER.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    alerts = signal({
        price: true,
        undercut: false,
        event: true
    });

    competitors = signal<Competitor[]>([
        { id: '1', name: 'Seaside Loft', price: 125, occupancy: 75, rating: 4.8, type: 'Luxury', lastUpdated: '2h ago' },
        { id: '2', name: 'Cozy Studio', price: 95, occupancy: 60, rating: 4.5, type: 'Budget', lastUpdated: '1h ago' },
        { id: '3', name: 'Luxury Villa', price: 280, occupancy: 40, rating: 4.9, type: 'Luxury', lastUpdated: '5m ago' },
        { id: '4', name: 'City Central', price: 110, occupancy: 85, rating: 4.7, type: 'Similar', lastUpdated: '10m ago' },
        { id: '5', name: 'Old Town Apt', price: 105, occupancy: 70, rating: 4.3, type: 'Similar', lastUpdated: '3h ago' },
        { id: '6', name: 'Modern Studio', price: 140, occupancy: 50, rating: 4.6, type: 'Boutique', lastUpdated: '1d ago' }
    ]);

    scannedComp = signal<Competitor | null>(null);

    marketAvgPrice = computed(() =>
        Math.round(this.competitors().reduce((acc, c) => acc + c.price, 0) / this.competitors().length)
    );

    marketAvgOcc = computed(() =>
        Math.round(this.competitors().reduce((acc, c) => acc + c.occupancy, 0) / this.competitors().length)
    );

    toggleAlert(key: 'price' | 'undercut' | 'event') {
        if (!this.isTier2() && (key === 'price' || key === 'undercut')) return;
        if (!this.isTier3() && key === 'event') return;

        this.alerts.update(prev => ({ ...prev, [key]: !prev[key] }));
    }

    refreshRadar() {
        this.competitors.update(prev => prev.map(c => ({
            ...c,
            price: Math.max(80, c.price + (Math.random() * 20 - 10)),
            occupancy: Math.min(100, Math.max(30, c.occupancy + (Math.random() * 10 - 5)))
        })));
    }

    // Helper for radar positioning (Cartesian from polar)
    getPosition(comp: Competitor) {
        // Higher price = Higher Y, Higher Occ = Higher X
        const x = (comp.occupancy - 65) * 5;
        const y = -(comp.price - 140) * 1.5;
        return { x, y };
    }

    getDistance(comp: Competitor) {
        const pos = this.getPosition(comp);
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    }

    getAngle(comp: Competitor) {
        const pos = this.getPosition(comp);
        return (Math.atan2(pos.y, pos.x) * 180) / Math.PI;
    }
}

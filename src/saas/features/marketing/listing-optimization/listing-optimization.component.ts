import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../../services/gemini.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'mkt-00-listing-audit',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'LAUDIT.ListingAuditEngine' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'LAUDIT.PasteYourListingUrlToGet' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Fix Enabled' : (isTier2() ? 'Smart Audit' : 'Basic Audit') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Input & Status -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                   <h3 class="text-white font-bold mb-4 flex items-center gap-2">
                       <span class="material-icons text-indigo-400 text-sm">link</span>
                       {{ 'LAUDIT.listingUrl' | translate }}
                   </h3>
                   <div class="space-y-4">
                       <input type="text" [(ngModel)]="listingUrl" 
                              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                              placeholder="https://airbnb.com/rooms/123...">
                       
                       <button (click)="analyze()" [disabled]="analyzing() || !listingUrl"
                               class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                           @if (analyzing()) {
                               <span class="animate-spin material-icons">sync</span>
                               {{ 'LAUDIT.analyzing' | translate }}
                           } @else {
                               <span class="material-icons">query_stats</span>
                               {{ 'LAUDIT.RunAudit' | translate }}
                           }
                       </button>
                   </div>
               </div>

               <!-- Channel Sync (Tier 3) -->
                <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm" [class.opacity-50]="!isTier3()">
                    <h3 class="text-white font-bold mb-4 flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-icons text-emerald-400 text-sm">sync_alt</span>
                            {{ 'LAUDIT.ChannelSync' | translate }}
                        </span>
                        @if (!isTier3()) { <span class="material-icons text-slate-600 text-xs">lock</span> }
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span class="text-xs text-slate-300">Airbnb</span>
                            <span class="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">CONNECTED</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg opacity-40">
                             <span class="text-xs text-slate-300">Booking.com</span>
                             <button class="text-[10px] text-white bg-indigo-600 px-3 py-1 rounded-md">{{ 'LAUDIT.connect' | translate }}</button>
                        </div>
                    </div>
                </div>

               <!-- Coach -->
               <div class="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden mt-auto">
                    <div class="absolute -right-2 top-0 opacity-5 scale-150">
                        <span class="material-icons text-6xl text-indigo-400">psychology</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">{{ 'LAUDIT.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-400 text-[11px] leading-relaxed italic">
                        "Algorithm Hack: Using 'keywords' isn't just for SEO. Platforms like Airbnb prioritize listings with detailed descriptions of accessibility and local amenities."
                    </p>
               </div>
           </div>

           <!-- Right: Audit Results -->
           <div class="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-white/10 p-10 flex flex-col relative overflow-hidden shadow-2xl">
                
                @if (analyzed()) {
                    <div class="h-full flex flex-col animate-fade-in">
                        <div class="flex justify-between items-start mb-10">
                            <div>
                                <h3 class="text-white font-bold text-xl tracking-tight">Audit Report for Listing</h3>
                                <p class="text-xs text-slate-500 mt-1 uppercase tracking-widest">{{ listingUrl }}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="text-5xl font-black text-indigo-400 tracking-tighter">{{ score() }}</div>
                                <div class="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">{{ 'LAUDIT.AIScore' | translate }}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <!-- Critical Fixes -->
                            <div class="bg-rose-500/5 rounded-2xl p-6 border border-rose-500/20">
                                <h4 class="text-rose-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span class="material-icons text-sm">warning</span>
                                    {{ 'LAUDIT.CriticalFixes' | translate }}
                                </h4>
                                <ul class="space-y-3">
                                    @for(fix of criticalFixes(); track fix) {
                                        <li class="flex gap-3 items-start">
                                            <span class="text-rose-500 text-[10px] mt-1">●</span>
                                            <span class="text-xs text-slate-300 leading-relaxed">{{ fix }}</span>
                                        </li>
                                    }
                                </ul>
                            </div>

                            <!-- Optimization Tips -->
                            <div class="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20">
                                <h4 class="text-amber-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span class="material-icons text-sm">lightbulb</span>
                                    {{ 'LAUDIT.AIRecommendation' | translate }}
                                </h4>
                                <div class="text-xs text-slate-400 leading-relaxed italic">
                                    "{{ aiTip() }}"
                                </div>
                            </div>
                        </div>

                        <!-- Growth potential -->
                        <div class="flex-1 bg-black/20 rounded-2xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-center">
                            <div class="absolute top-0 right-0 p-4 opacity-5">
                                <span class="material-icons text-7xl text-indigo-400">trending_up</span>
                            </div>
                            <h4 class="text-white font-bold text-lg mb-6">{{ 'LAUDIT.GrowthPotential' | translate }}</h4>
                            <div class="space-y-6 max-w-lg">
                                <div>
                                    <div class="flex justify-between text-[10px] text-slate-500 mb-2 uppercase font-bold">
                                        <span>SEARCH VISIBILITY</span>
                                        <span class="text-emerald-400">+45%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div class="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full transition-all duration-1000" [style.width.%]="score()"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-[10px] text-slate-500 mb-2 uppercase font-bold">
                                         <span>BOOKING CTR</span>
                                         <span class="text-emerald-400">+22%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                         <div class="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full transition-all duration-1000 delay-300" [style.width.%]="score() - 15"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        @if (isTier3()) {
                            <button class="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-4">
                                <span class="material-icons">auto_fix_high</span>
                                {{ 'LAUDIT.AutoFixApplyAllChangesToAirbnb' | translate }}
                            </button>
                        } @else {
                           <button class="mt-8 bg-slate-800 text-slate-400 font-bold py-4 rounded-xl border border-white/10 flex items-center justify-center gap-4 group hover:text-white transition-colors">
                                <span class="material-icons group-hover:scale-110 transition-transform">lock_person</span>
                                {{ 'LAUDIT.UnlockAutofixWithGold' | translate }}
                            </button>
                        }
                    </div>
                } @else if (analyzing()) {
                    <div class="h-full flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
                        <div class="relative">
                            <div class="w-32 h-32 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                            <span class="absolute inset-0 flex items-center justify-center material-icons text-4xl text-indigo-400">search</span>
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-2xl mb-2">{{ 'LAUDIT.analyzing' | translate }}</h3>
                            <p class="text-slate-500 text-sm">Deep-scanning property meta-data, photos and competitor pricing...</p>
                        </div>
                    </div>
                } @else {
                    <div class="h-full flex flex-col items-center justify-center text-center space-y-10 group">
                        <div class="w-24 h-24 bg-indigo-500/5 rounded-3xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors duration-500 overflow-hidden relative">
                             <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <span class="material-icons text-5xl text-slate-700 group-hover:text-indigo-400 transition-colors duration-500">travel_explore</span>
                        </div>
                        <div class="max-w-sm">
                            <h3 class="text-white font-bold text-2xl mb-3">{{ 'LAUDIT.ReadyForAudit' | translate }}</h3>
                            <p class="text-slate-500 text-sm leading-relaxed">{{ 'LAUDIT.EnterAListingUrlOnTheLeft' | translate }}</p>
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
    `]
})
export class ListingOptimizationComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'MKT_00',
        name: this.translate.instant('LISTOPTI.Title'),
        description: this.translate.instant('LISTOPTI.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    gemini = inject(GeminiService);

    listingUrl = '';
    analyzing = signal(false);
    analyzed = signal(false);

    score = signal(78);
    criticalFixes = signal<string[]>([
        'Main photo brightness is 15% below market lead.',
        "Missing 'Self Check-in' tag which is used by 90% of guests.",
        'Title is too short (22 chars). Recommended: 45-50 chars.'
    ]);
    aiTip = signal('Your listing lacks specific "Remote Work" amenities. Adding keywords like "high-speed wifi" and "dedicated workspace" could increase mid-week bookings by 12%.');

    async analyze() {
        if (!this.listingUrl) return;

        this.analyzing.set(true);
        this.analyzed.set(false);

        // Simulation delay
        await new Promise(r => setTimeout(r, 2000));

        try {
            const prompt = `Act as an Airbnb SEO Expert. Audit this listing URL: ${this.listingUrl}. 
            Provide 3 bullet points of critical fixes and one strategic growth tip. 
            Keep it professional and concise.`;

            const response = await this.gemini.generateText(prompt);

            // Simulation of parsed response
            this.score.set(65 + Math.floor(Math.random() * 25));
            this.aiTip.set(response.slice(0, 200) + '...');

            this.analyzed.set(true);
        } catch (e) {
            console.error(e);
            this.analyzed.set(true); // Fallback to dummy data if gemini fails
        } finally {
            this.analyzing.set(false);
        }
    }
}

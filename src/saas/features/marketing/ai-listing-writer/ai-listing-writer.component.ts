import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../../services/gemini.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'mkt-02-listing-writer',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'ALISTW.AiListingWriter' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'ALISTW.HighConversionDescriptionsInSeconds' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Keywords Engine Active' : (isTier2() ? 'Smart Tone' : 'Basic Writer') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Config -->
           <div class="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
               <div class="bg-slate-800/50 rounded-2xl border border-white/10 p-8 backdrop-blur-sm space-y-8">
                   
                   <!-- Highlights -->
                   <div>
                       <label class="block text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">{{ 'ALISTW.KeyHighlights' | translate }}</label>
                       <textarea [(ngModel)]="highlights" 
                                 rows="4"
                                 class="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
                                 placeholder="e.g. 5 min from beach, rooftop pool, fiber optic wifi..."></textarea>
                   </div>

                   <div class="grid grid-cols-2 gap-8">
                        <div>
                            <label class="block text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">{{ 'ALISTW.Tone' | translate }}</label>
                            <select [(ngModel)]="tone" 
                                    class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none transition-all">
                                <option value="luxury">{{ 'ALISTW.tone_luxury' | translate }}</option>
                                <option value="minimalist">{{ 'ALISTW.tone_minimalist' | translate }}</option>
                                <option value="playful">{{ 'ALISTW.tone_playful' | translate }}</option>
                                <option value="storytelling">{{ 'ALISTW.tone_storytelling' | translate }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">{{ 'ALISTW.Platform' | translate }}</label>
                            <div class="flex gap-2">
                                <button class="flex-1 p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white transition-all">
                                    <span class="material-icons text-sm">home</span>
                                </button>
                                <button class="flex-1 p-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white transition-all">
                                    <span class="material-icons text-sm">language</span>
                                </button>
                            </div>
                        </div>
                   </div>

                   <!-- AI Keywords (Tier 3) -->
                   @if (isTier3()) {
                       <div class="pt-6 border-t border-white/5 space-y-4">
                           <div class="flex justify-between items-center">
                               <label class="text-[10px] text-indigo-400 uppercase font-black tracking-widest">AI Keyword Injection</label>
                               <span class="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">SMART</span>
                           </div>
                           <div class="flex flex-wrap gap-2">
                               @for (kw of ['Near Metro', 'Fast WiFi', 'Quiet Area', 'Family Friendly']; track kw) {
                                   <button (click)="addKeyword(kw)" class="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">+ {{ kw }}</button>
                               }
                           </div>
                       </div>
                   }

                   <button (click)="generate()" [disabled]="generating() || !highlights"
                           class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                        @if (generating()) {
                            <span class="material-icons animate-spin">sync</span>
                            {{ 'ALISTW.generating' | translate }}
                        } @else {
                            <span class="material-icons">auto_awesome</span>
                            {{ 'ALISTW.GenerateDescription' | translate }}
                        }
                   </button>
               </div>
           </div>

           <!-- Right: Output -->
           <div class="bg-indigo-900/10 rounded-3xl border border-indigo-500/20 flex flex-col relative overflow-hidden shadow-2xl min-h-[500px]">
                
                @if (output()) {
                    <div class="flex-1 flex flex-col p-10 animate-fade-in custom-scrollbar overflow-y-auto">
                        <div class="flex justify-between items-center mb-8 pb-6 border-b border-indigo-500/10">
                            <span class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{{ 'ALISTW.AiDraft' | translate }}</span>
                            <div class="flex gap-4">
                                @if (isTier3()) {
                                    <div class="flex items-center gap-3 pr-4 border-r border-indigo-500/10">
                                        <div class="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{{ 'ALISTW.SEOScore' | translate }}</div>
                                        <div class="text-xl font-black text-emerald-400">92</div>
                                    </div>
                                }
                                <button class="text-slate-400 hover:text-white transition-colors"><span class="material-icons text-sm">content_copy</span></button>
                            </div>
                        </div>
                        <div class="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-serif text-lg tracking-wide" [innerHTML]="output()"></div>
                    </div>
                } @else if (generating()) {
                    <div class="flex-1 flex flex-col items-center justify-center space-y-10">
                         <div class="relative">
                            <div class="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                         </div>
                         <div class="space-y-2 text-center">
                            <div class="text-indigo-400 font-black text-sm uppercase tracking-[0.4em] animate-pulse">{{ 'ALISTW.Brainstorming' | translate }}</div>
                            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Architecting your semantic strategy</p>
                         </div>
                    </div>
                } @else {
                    <div class="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-10 group">
                        <div class="w-20 h-20 bg-indigo-500/5 rounded-[2rem] flex items-center justify-center group-hover:bg-indigo-500/10 transition-all duration-500 group-hover:rotate-6">
                            <span class="material-icons text-4xl text-slate-700 group-hover:text-indigo-400">rate_review</span>
                        </div>
                        <div class="max-w-xs">
                            <h3 class="text-white font-black text-xl mb-4 tracking-tight">{{ 'ALISTW.WritingDesk' | translate }}</h3>
                            <p class="text-slate-500 text-sm leading-relaxed">{{ 'ALISTW.GeneratedOutputWillAppear' | translate }}</p>
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
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-position: right 1rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
    `]
})
export class AiListingWriterComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'MKT_02',
        name: this.translate.instant('AILISWRIT.Title'),
        description: this.translate.instant('AILISWRIT.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    gemini = inject(GeminiService);
    sanitizer = inject(DomSanitizer);

    highlights = 'Luxury 3-bedroom penthouse with private rooftop pool, 2 mins from Metro Station, ultra-fast 1Gbps WiFi, baby gear available.';
    tone = 'luxury';
    generating = signal(false);
    output = signal<SafeHtml>('');

    async generate() {
        if (!this.highlights) return;

        this.generating.set(true);
        this.output.set('');

        try {
            const prompt = `Generate a high-conversion property listing description based on: ${this.highlights}. 
            Tone: ${this.tone}. 
            Format: Use HTML for bold titles and bullet points. 
            Goal: Maximize reservations and highlight key USPs. 
            SEO: Include keywords for travelers looking for ${this.tone} experiences.`;

            const response = await this.gemini.generateText(prompt);
            this.output.set(this.sanitizer.bypassSecurityTrustHtml(response));
        } catch (e) {
            console.error(e);
            this.output.set(this.sanitizer.bypassSecurityTrustHtml('<h3>Luxury Coastal Escape</h3><p>Experience the ultimate in relaxation...</p><ul><li>Breathtaking Views</li><li>Modern Amenities</li></ul>'));
        } finally {
            this.generating.set(false);
        }
    }

    addKeyword(kw: string) {
        if (!this.highlights.includes(kw)) {
            this.highlights += `, ${kw}`;
        }
    }
}

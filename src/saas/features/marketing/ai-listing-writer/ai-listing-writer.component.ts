import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { GeminiService } from '../../../../services/gemini.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
    selector: 'mkt-02-ai-listing-writer',
    standalone: true,
    imports: [CommonModule, FormsModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'AILISTING.AiCopywriterSeo' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'AILISTING.DescriptionGeneratorTrainedOn1m' | translate }}</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Neuro-Semantic SEO' : (isTier2() ? 'AI Writer' : 'Manual Input') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Left: Input Configuration -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
               <h3 class="text-white font-bold text-lg">{{ 'AILISTING.ListingParameters' | translate }}</h3>
               
               <div class="space-y-4">
                   <div>
                       <label class="block text-slate-400 text-xs uppercase font-bold mb-2">{{ 'AILISTING.KeyUsps' | translate }}</label>
                       <textarea [(ngModel)]="highlights" rows="3" class="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none placeholder:text-slate-600" placeholder="{{ \'AILISTING.EgOceanView500mbpsWifi\' | translate }}" data-debug-id="ai-writer-highlights-input"></textarea>
                   </div>
                   
                   @if (isTier2()) {
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-400 text-xs uppercase font-bold mb-2">{{ 'AILISTING.VibeTone' | translate }}</label>
                            <select [(ngModel)]="tone" class="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white text-sm outline-none">
                                <option value="luxury">💎 Luxury & Elegant</option>
                                <option value="cozy">🧸 Cozy & Family</option>
                                <option value="modern">🚀 Modern & Tech</option>
                                <option value="minimal">🍃 Minimalist</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-slate-400 text-xs uppercase font-bold mb-2">{{ 'AILISTING.Length' | translate }}</label>
                            <select class="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white text-sm outline-none">
                                <option>{{ 'AILISTING.Compact200Words' | translate }}</option>
                                <option>{{ 'AILISTING.Standard400Words' | translate }}</option>
                                <option>{{ 'AILISTING.Storytelling800Words' | translate }}</option>
                            </select>
                        </div>
                    </div>
                   }

                   @if (isTier3()) {
                       <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                           <div class="flex justify-between items-center mb-3">
                               <label class="text-emerald-300 text-xs uppercase font-bold flex items-center gap-2">
                                   <span class="material-icons text-sm">vpn_key</span>{{ 'AILISTING.SeoInjection' | translate }}</label>
                               <span class="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">{{ 'ALW.Active' | translate }}</span>
                           </div>
                           <div class="flex flex-wrap gap-2">
                               <span class="px-2 py-1 bg-black/30 rounded border border-white/10 text-[10px] text-slate-300">"Near convention center"</span>
                               <span class="px-2 py-1 bg-black/30 rounded border border-white/10 text-[10px] text-slate-300">"Family friendly"</span>
                               <span class="px-2 py-1 bg-black/30 rounded border border-white/10 text-[10px] text-slate-300">"Self check-in"</span>
                           </div>
                       </div>
                   }
                   
                   <button (click)="generate()" 
                           class="relative w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 background-animate text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 overflow-hidden group"
                           [disabled]="generating()"
                           data-debug-id="ai-writer-generate-btn">
                       
                       <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                       
                       @if(generating()) {
                           <div class="flex items-center justify-center gap-2">
                               <span class="material-icons animate-spin">auto_awesome</span>{{ 'AILISTING.Writing' | translate }}</div>
                       } @else {
                           <span class="flex items-center justify-center gap-2 text-lg">
                               <span class="material-icons">auto_fix_high</span>{{ 'AILISTING.GenerateMagic' | translate }}</span>
                       }
                   </button>
               </div>
               
               <!-- Coach -->
               <div class="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg mt-auto">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-indigo-300 font-bold text-sm uppercase">{{ 'AILISTING.CoachTip' | translate }}</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Micro-Struggle: Guests skim. Use bullet points for amenities. Our AI automatically structures your description with emojis for 50% better readability."
                   </p>
               </div>
           </div>

           <!-- Right: Output Editor -->
           <div class="bg-slate-900 rounded-xl border border-white/10 flex flex-col relative overflow-hidden group">
               <!-- Magical Overlay while generating -->
               <div *ngIf="generating()" class="absolute inset-0 bg-black/80 z-20 flex items-center justify-center backdrop-blur-sm">
                   <div class="text-center">
                       <div class="text-6xl mb-4 animate-bounce">🧙‍♂️</div>
                       <div class="text-indigo-400 font-bold animate-pulse">{{ 'AILISTING.CraftingYourStory' | translate }}</div>
                   </div>
               </div>

               <!-- Toolbar -->
               <div class="h-12 border-b border-white/10 bg-slate-800 flex items-center px-4 gap-3">
                   <div class="flex gap-1">
                       <div class="w-3 h-3 rounded-full bg-red-500"></div>
                       <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                       <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                   </div>
                   <div class="h-4 w-[1px] bg-white/10 mx-2"></div>
                   <span class="text-xs text-slate-400">{{ 'AILISTING.GeneratedContent' | translate }}</span>
                   <div class="ml-auto flex gap-2">
                       <button *ngIf="output()" class="text-xs text-indigo-400 hover:text-white flex items-center gap-1" data-debug-id="ai-writer-copy-btn">
                           <span class="material-icons text-xs">content_copy</span>{{ 'AILISTING.Copy' | translate }}</button>
                   </div>
               </div>
               
               <!-- Editor -->
               <div class="flex-1 p-6 overflow-y-auto relative">
                   @if(!output()) {
                       <div class="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                           <span class="material-icons text-6xl mb-4">edit_note</span>
                           <p>{{ 'AILISTING.FillTheDetailsAndClick' | translate }}</p>
                       </div>
                   } @else {
                        <div class="prose prose-invert prose-sm max-w-none animate-fade-in shadow-inner">
                            <div [innerHTML]="output()"></div>
                        </div>
                   }
               </div>

               @if(isTier3() && output()) {
                   <div class="p-3 bg-emerald-900/30 border-t border-white/10 flex justify-between items-center px-6">
                       <span class="text-xs text-emerald-400 font-bold flex items-center gap-2">
                           <span class="material-icons text-sm">check_circle</span> SEO Score: 98/100
                       </span>
                       <span class="text-[10px] text-slate-400">{{ 'AILISTING.KeywordsInjected12' | translate }}</span>
                   </div>
               }
           </div>
       </div>
    </div>
    `,
    styles: [`
        :host { display: block; height: 100%; }
        .background-animate {
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
        }
    `]
})
export class AiListingWriterComponent {
    translate = inject(TranslationService);
    gemini = inject(GeminiService);
    sanitizer = inject(DomSanitizer);

    feature = computed(() => ({
        id: 'MKT_02',
        name: this.translate.instant('AILISTWRIT.Title'),
        description: this.translate.instant('AILISTWRIT.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    highlights = '';
    tone = 'luxury';
    generating = signal(false);
    output = signal<SafeHtml>('');

    async generate() {
        if (!this.highlights.trim()) return;

        this.generating.set(true);
        this.output.set('');

        try {
            const prompt = `Tone: ${this.tone}. Highlights: ${this.highlights}. Generate a professional Airbnb description with emojis. Use Markdown.`;
            const text = await this.gemini.generateMarketingDescription(prompt);

            // Parse markdown and sanitize
            const html = await marked.parse(text);
            this.output.set(this.sanitizer.bypassSecurityTrustHtml(html));
        } catch (error) {
            console.error('AI Generation failed', error);
            this.output.set(this.sanitizer.bypassSecurityTrustHtml('<p class="text-rose-400 font-bold">Error generating content. Please check your AI configuration.</p>'));
        } finally {
            this.generating.set(false);
        }
    }
}

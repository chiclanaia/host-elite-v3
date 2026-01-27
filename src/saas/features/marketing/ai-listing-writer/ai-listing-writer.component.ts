import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'mkt-02-ai-listing-writer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
            ✍️ Copywriting
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <!-- Inputs -->
          <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
              <h3 class="text-xl font-bold text-white mb-6">Describe your place</h3>
              
              <div class="space-y-4">
                  <div>
                      <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Key Highlights</label>
                      <textarea rows="4" class="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Sea view, 5 min to metro, Quiet street..." data-debug-id="ai-writer-highlights-input"></textarea>
                  </div>

                  @if (tier() === 'TIER_3') {
                      <div>
                          <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Target Audience (Persona)</label>
                          <select class="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none" data-debug-id="ai-writer-audience-select">
                              <option>👨‍👩‍👧 Family with Kids</option>
                              <option>💻 Digital Nomads</option>
                              <option>💑 Romantic Couple</option>
                          </select>
                      </div>
                  }
                  
                  <button class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20" data-debug-id="ai-writer-generate-btn">
                      Generate Description ✨
                  </button>

                  <!-- Coach Tip -->
                  <div class="mt-4 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                      </div>
                      <p class="text-slate-300 text-xs italic">
                          "Sell the Dream, not just the features. Don't just list 'coffee machine', mention 'enjoying a morning brew on the balcony'."
                      </p>
                  </div>
              </div>
          </div>

          <!-- Output -->
          <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden">
               <div class="absolute top-0 right-0 p-2 opacity-5">
                   <span class="text-9xl font-serif">"</span>
               </div>
               
               <div class="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                   Result will appear here...
               </div>
          </div>
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class AiListingWriterComponent {
    feature = computed(() => ({
        id: 'MKT_02',
        name: 'AI Listing Writer',
        description: 'Semantic SEO Content Generator',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

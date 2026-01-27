import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'mkt-01-photo-guide',
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
            📸 Visuals
        </div>
      </div>

      <!-- Gallery Builder -->
      <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
          <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-white">Your Showcase</h3>
              <button class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm flex items-center gap-2" data-debug-id="photo-guide-upload-btn">
                  <span class="material-icons text-sm">add_a_photo</span> Upload
              </button>
          </div>

          <!-- Coach Tip -->
          <div class="mb-6 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
              <div class="flex items-center gap-2 mb-1">
                 <span class="text-lg">💡</span>
                 <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
              </div>
              <p class="text-slate-300 text-xs italic">
                  "Vertical photos for mobile! 70% of bookings happen on phones. Ensure your hero shot looks great in portrait mode."
              </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- Mock Image Slots -->
              <div class="aspect-video bg-black/40 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 cursor-pointer transition-all" data-debug-id="photo-guide-slot-living">
                  <div class="text-center">
                      <div class="text-2xl mb-1">🛋️</div>
                      <span class="text-xs">Living Room</span>
                  </div>
              </div>
              <div class="aspect-video bg-black/40 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10 text-slate-500">
                  <div class="text-center">
                      <div class="text-2xl mb-1">🍳</div>
                      <span class="text-xs">Kitchen</span>
                  </div>
              </div>
          </div>

          @if (tier() === 'TIER_3') {
              <div class="mt-8 p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                  <h4 class="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                       ✨ AI Enhancer Active
                  </h4>
                  <p class="text-sm text-slate-400 mb-4">
                      Our AI will automatically brighten dark photos and straighten horizons upon upload.
                  </p>
                  <div class="flex gap-4 text-xs text-slate-500">
                      <span class="px-2 py-1 bg-black/20 rounded">HDR Fusion</span>
                      <span class="px-2 py-1 bg-black/20 rounded">Lens Correction</span>
                      <span class="px-2 py-1 bg-black/20 rounded">Privacy Blur</span>
                  </div>
              </div>
          }
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class PhotoGuideComponent {
    feature = computed(() => ({
        id: 'MKT_01',
        name: 'Photo Guide',
        description: 'AI Image Enhancement & Staging Suite',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

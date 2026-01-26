import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'saas-upgrade-teaser',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm group">
      <!-- Blurred Content Container (Projected Content) -->
      <div class="absolute inset-0 filter blur-sm opacity-50 pointer-events-none select-none">
        <ng-content></ng-content>
      </div>

      <!-- Overlay & CTA -->
      <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
        
        <div class="bg-white/10 p-4 rounded-full mb-4 border border-white/20 shadow-xl backdrop-blur-md animate-bounce-slow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
        </div>

        <h3 class="text-xl font-bold text-white mb-2 drop-shadow-md">
           {{ 'COMMON.FeatureLocked' | translate }}
        </h3>
        
        <p class="text-sm text-slate-300 mb-6 max-w-xs drop-shadow-md">
          {{ message() || ('COMMON.UpgradeTeaserDefault' | translate) }}
        </p>

        <button (click)="onUpgrade.emit()" 
          class="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-white font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all text-sm border border-white/20">
          {{ 'COMMON.UpgradeTo' | translate }} {{ tierName() }}
        </button>

      </div>
    </div>
  `,
  styles: [`
    .animate-bounce-slow {
      animation: bounce 3s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
      50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
  `]
})
export class UpgradeTeaserComponent {
  tierName = input.required<string>();
  message = input<string>();
  onUpgrade = output<void>();
}

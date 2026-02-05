import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStore } from '../../state/session.store';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'saas-feature-gating',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative group/gating h-full w-full" [class.cursor-not-allowed]="!hasAccess()">
      <!-- Content Container -->
      <div [class.grayscale]="!hasAccess()" 
           [class.opacity-40]="!hasAccess()" 
           [class.blur-[2px]]="!hasAccess()"
           [class.pointer-events-none]="!hasAccess()"
           class="transition-all duration-700 h-full w-full">
        <ng-content></ng-content>
      </div>

      <!-- Discrete Upgrade Badge -->
      @if (!hasAccess()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center group cursor-pointer" (click)="onUpgrade($event)">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-full border border-white/10 shadow-lg transform group-hover:scale-105 transition-all">
              <span class="text-sm">🔒</span>
              <span class="text-white text-[10px] font-medium uppercase tracking-wide">{{ 'COMMON.UpgradeToUnlock' | translate }}</span>
          </div>
        </div>
      }
    </div>
  `
})
export class FeatureGatingComponent {
  private store = inject(SessionStore);

  featureId = input.required<string>();

  hasAccess = computed(() => {
    return this.store.hasFeature(this.featureId());
  });

  onUpgrade(event: MouseEvent) {
    event.stopPropagation();
    console.log('Upgrade requested for feature:', this.featureId());
    // In the future, this could trigger a global 'open-pricing' event
    // window.dispatchEvent(new CustomEvent('open-pricing'));
  }
}

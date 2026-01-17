import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
    selector: 'app-debug-tooltip',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (isVisible() && debugKey()) {
      <div class="fixed z-[9999] pointer-events-none px-2 py-1 bg-slate-900 border border-slate-700 text-white text-xs rounded shadow-lg font-mono backdrop-blur-md bg-opacity-90 transition-all duration-75"
           [style.left.px]="x()"
           [style.top.px]="y()">
         <span class="text-yellow-400 font-bold mr-1">KEY:</span>
         {{ debugKey() }}
         <div class="text-[9px] text-slate-400 mt-0.5 border-t border-slate-700 pt-0.5">
            Right-click to copy
         </div>
      </div>
    }
    
    <!-- Success Toast -->
    @if (showCopied()) {
        <div class="fixed bottom-4 right-4 z-[9999] px-4 py-2 bg-green-600 text-white rounded shadow-lg animate-fade-in-up">
            Key copied to clipboard!
        </div>
    }
  `,
    styles: [`
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.3s ease-out;
    }
  `]
})
export class DebugTooltipComponent {
    ts = inject(TranslationService);

    isVisible = signal(false);
    debugKey = signal<string | null>(null);
    x = signal(0);
    y = signal(0);
    showCopied = signal(false);

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        if (!this.ts.debugMode()) {
            this.isVisible.set(false);
            return;
        }

        const target = e.target as HTMLElement;
        if (!target) return;

        // Ignore if hovering the tooltip self
        if (target.closest('app-debug-tooltip')) return;

        // Get simple text content
        const text = target.textContent;
        if (!text || text.trim().length === 0) {
            this.isVisible.set(false);
            return;
        }

        // We only want to match "leaf" nodes effectively, or nodes that have specific translation content
        const keys = this.ts.getKeysForValue(text);
        if (keys.length > 0) {
            this.debugKey.set(keys[0]);
            // Position tooltip near cursor but slightly offset to not block clicks
            this.x.set(e.clientX + 16);
            this.y.set(e.clientY + 16);
            this.isVisible.set(true);
        } else {
            this.isVisible.set(false);
        }
    }

    @HostListener('document:contextmenu', ['$event'])
    onRightClick(e: MouseEvent) {
        if (this.isVisible() && this.debugKey()) {
            e.preventDefault();
            const key = this.debugKey()!;
            navigator.clipboard.writeText(key).then(() => {
                this.showCopied.set(true);
                setTimeout(() => this.showCopied.set(false), 2000);
            }).catch(err => console.error('Failed to copy', err));
        }
    }
}

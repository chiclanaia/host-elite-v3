import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

@Component({
    selector: 'app-debug-tooltip',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (isVisible() && (debugKey() || debugId())) {
      <div class="fixed z-[9999] pointer-events-none px-2 py-1 bg-slate-900 border border-slate-700 text-white text-xs rounded shadow-lg font-mono backdrop-blur-md bg-opacity-90 transition-all duration-75"
           [style.left.px]="x()"
           [style.top.px]="y()">
         
         @if(debugId()) {
            <span class="text-rose-400 font-bold mr-1">ID:</span>
            {{ debugId() }}
         } @else if(debugKey()) {
            <span class="text-yellow-400 font-bold mr-1">KEY:</span>
            {{ debugKey() }}
         }

         <div class="text-[9px] text-slate-400 mt-0.5 border-t border-slate-700 pt-0.5">
            Right-click to copy
         </div>
      </div>
    }
    
    <!-- Success Toast -->
    @if (showCopied()) {
        <div class="fixed bottom-4 right-4 z-[9999] px-4 py-2 bg-green-600 text-white rounded shadow-lg animate-fade-in-up">
            {{ copiedType() }} copied to clipboard!
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
    debugId = signal<string | null>(null);
    x = signal(0);
    y = signal(0);
    showCopied = signal(false);
    copiedType = signal<'Key' | 'ID'>('Key');

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

        // 1. Check for data-debug-id (recursive up to a limit or generic closest)
        const debugElement = target.closest('[data-debug-id]');
        if (debugElement) {
            const id = debugElement.getAttribute('data-debug-id');
            if (id) {
                this.debugId.set(id);
                this.debugKey.set(null);
                this.updatePosition(e);
                this.isVisible.set(true);
                return;
            }
        }

        // 2. Fallback to Translation Keys
        const text = target.textContent;
        if (!text || text.trim().length === 0) {
            this.isVisible.set(false);
            return;
        }

        // We only want to match "leaf" nodes effectively, or nodes that have specific translation content
        // Also avoid matching huge blocks of text
        if (text.length > 50) {
            this.isVisible.set(false);
            return;
        }

        const keys = this.ts.getKeysForValue(text);
        if (keys.length > 0) {
            this.debugKey.set(keys[0]);
            this.debugId.set(null);
            this.updatePosition(e);
            this.isVisible.set(true);
        } else {
            this.isVisible.set(false);
        }
    }

    private updatePosition(e: MouseEvent) {
        this.x.set(e.clientX + 16);
        this.y.set(e.clientY + 16);
    }

    @HostListener('document:contextmenu', ['$event'])
    onRightClick(e: MouseEvent) {
        if (this.isVisible()) {
            const id = this.debugId();
            const key = this.debugKey();

            if (id || key) {
                e.preventDefault();
                const textToCopy = id || key!;
                this.copiedType.set(id ? 'ID' : 'Key');

                navigator.clipboard.writeText(textToCopy).then(() => {
                    this.showCopied.set(true);
                    setTimeout(() => this.showCopied.set(false), 2000);
                }).catch(err => console.error('Failed to copy', err));
            }
        }
    }
}

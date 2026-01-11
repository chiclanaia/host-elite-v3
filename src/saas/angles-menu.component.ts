
import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { View } from '../types';
import { SessionStore } from '../state/session.store';

@Component({
  selector: 'saas-angles-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Glass Panel Container (Soft Rounded Rectangle) -->
    <nav class="inline-flex items-center p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ring-1 ring-black/5">
      @for (view of angleViews; track view.id) {
        <a (click)="isLocked(view) ? null : changeView(view)"
           class="group relative flex flex-col items-center justify-center px-5 py-2 rounded-xl cursor-pointer transition-all duration-300 min-w-[90px]"
           [class]="activeView().id === view.id 
             ? 'bg-white text-slate-900 shadow-md transform scale-105' 
             : 'text-slate-300 hover:bg-white/10 hover:text-white'"
           [class.opacity-50]="isLocked(view)"
           [class.cursor-not-allowed]="isLocked(view)">
           
           <!-- Icon -->
           <span class="w-5 h-5 mb-1 transition-transform duration-300" 
                 [class.group-hover:-translate-y-0.5]="activeView().id !== view.id"
                 [innerHTML]="getIcon(view.icon)">
           </span>
           
           <!-- Title -->
           <span class="text-[10px] font-bold uppercase tracking-wider leading-none">
             {{ view.title }}
           </span>
           
           <!-- Badge (Positioned absolute top right of the item) -->
           @if (view.featureId) {
              @let badge = getBadge(view.featureId);
              @if (badge) {
                  <span class="absolute top-1 right-2 w-2 h-2 rounded-full border border-white/20" 
                        [class]="badge.colorClass.includes('amber') ? 'bg-amber-400' : (badge.colorClass.includes('slate') ? 'bg-slate-400' : 'bg-yellow-400')">
                  </span>
              }
           }

           <!-- Lock Icon Overlay -->
           @if (isLocked(view)) {
              <div class="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl backdrop-blur-[1px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white drop-shadow-md"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" /></svg>
              </div>
           }
        </a>
      }
    </nav>
  `
})
export class AnglesMenuComponent {
  activeView = input.required<View>();
  viewChange = output<View>();
  
  private store = inject(SessionStore);
  private sanitizer = inject(DomSanitizer);

  // Define SVGs for icons
  private readonly icons: Record<string, string> = {
      marketing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"/></svg>`, // Sun/Burst for Visibility
      experience: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" /></svg>`, // Star
      operations: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.995 6.995 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.995 6.995 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.953 6.953 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd" /></svg>`, // Gear
      pricing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v12.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 1 1 1.1-1.02l1.95 2.1V2.75A.75.75 0 0 1 10 2Z" clip-rule="evenodd" /></svg>`, // Arrow Down/Trend (Simplified) or Tag. Using simple arrow for "Optimization"
      accomodation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 10.414V18a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.586a1 1 0 0 1 .293-.707l7-7Z" clip-rule="evenodd" /></svg>`, // House
      legal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clip-rule="evenodd" /></svg>`, // Bookmark/Law
      mindset: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6c0 1.887.454 3.665 1.257 5.234a.75.75 0 0 1 .044.65 2.625 2.625 0 0 0 .39 2.545.75.75 0 0 0 1.048.132C8.67 15.377 10.235 14.5 12 14.5s3.33.877 5.26 2.061a.75.75 0 0 0 1.049-.132 2.625 2.625 0 0 0 .39-2.545.75.75 0 0 1 .044-.65C19.546 11.665 20 9.887 20 8a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>` // Lightbulb / Brain approx
  };

  angleViews: View[] = [
    { id: 'marketing', title: 'Marketing', icon: 'marketing', featureId: 'microsite' }, 
    { id: 'experience', title: 'Expérience', icon: 'experience', featureId: 'booklet' },
    { id: 'operations', title: 'Opérations', icon: 'operations', featureId: 'checklists' },
    { id: 'pricing', title: 'Pricing', icon: 'pricing', featureId: 'ical-sync' },
    { id: 'accomodation', title: 'Logement', icon: 'accomodation', featureId: 'ai-prompts' },
    { id: 'legal', title: 'Légal & Finance', icon: 'legal', featureId: 'analytics' },
    { id: 'mindset', title: 'Mindset', icon: 'mindset', featureId: 'coaching' },
  ];

  changeView(view: View): void {
    this.viewChange.emit(view);
  }

  getBadge(featureId: string) {
      return this.store.getFeatureBadge(featureId);
  }

  isLocked(view: View): boolean {
      if (view.featureId) {
          return !this.store.hasFeature(view.featureId);
      }
      return false;
  }

  getIcon(iconName: string): SafeHtml {
      const svg = this.icons[iconName] || this.icons['marketing']; // Fallback
      return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

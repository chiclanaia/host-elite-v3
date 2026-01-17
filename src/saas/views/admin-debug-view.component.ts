import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStore } from '../../state/session.store';
import { TranslationService } from '../../services/translation.service';
import { HostRepository } from '../../services/host-repository.service';
import { AppPlan } from '../../types';

@Component({
    selector: 'app-admin-debug-view',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col pt-6 px-6">
      <header class="flex justify-between items-center mb-8 flex-shrink-0">
          <div>
              <h1 class="text-3xl font-bold text-white mb-2">Debug Console</h1>
              <p class="text-slate-400">Outils de développement et de test.</p>
          </div>
      </header>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-8">
        
        <!-- SECTION 1: Plan Simulation -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 font-mono">01</span>
                Simulate Plan
            </h2>
            <div class="p-4 bg-slate-900/50 rounded-lg">
                <p class="text-sm text-slate-400 mb-4">Force the application to behave as if the user has a specific plan.</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button *ngFor="let plan of plans" 
                            (click)="setPlan(plan)"
                            class="px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                            [class]="currentPlan() === plan 
                                ? getPlanClasses(plan, true)
                                : getPlanClasses(plan, false)">
                        <span class="font-bold uppercase">{{ plan }}</span>
                        <div class="w-2 h-2 rounded-full" [class.bg-white]="currentPlan() === plan" [class.bg-slate-700]="currentPlan() !== plan"></div>
                    </button>
                </div>
            </div>
        </section>

        <!-- SECTION 2: Debug Tools -->
        <section class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mr-3 font-mono">02</span>
                Display Tools
            </h2>
            
            <!-- Toggle Display Tag -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div>
                    <h3 class="font-bold text-white">Display Types</h3>
                    <p class="text-xs text-slate-400 mt-1">Show translation keys on hover in a tooltip.</p>
                </div>
                <button (click)="toggleDebugTags()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-green-500]="isDebugTags()"
                        [class.bg-slate-700]="!isDebugTags()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="isDebugTags()"
                         [class.translate-x-0]="!isDebugTags()"></div>
                </button>
            </div>

            <!-- Toggle Plan Badges (Was in Users View) -->
            <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors mt-4">
                <div>
                    <h3 class="font-bold text-white">Afficher les pastilles</h3>
                    <p class="text-xs text-slate-400 mt-1">Show feature badges in sidebar based on plan.</p>
                </div>
                <button (click)="toggleBadges()" 
                        class="w-14 h-7 rounded-full p-1 transition-colors duration-200 relative focus:outline-none"
                        [class.bg-green-500]="store.showPlanBadges()"
                        [class.bg-slate-700]="!store.showPlanBadges()">
                    <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                         [class.translate-x-7]="store.showPlanBadges()"
                         [class.translate-x-0]="!store.showPlanBadges()"></div>
                </button>
            </div>
            
        </section>

      </div>
    </div>
  `
})
export class AdminDebugViewComponent {
    store = inject(SessionStore);
    ts = inject(TranslationService);
    repository = inject(HostRepository); // Added repository

    plans: AppPlan[] = ['Freemium', 'Bronze', 'Silver', 'Gold'];

    currentPlan = this.store.userProfile()?.plan ? () => this.store.userProfile()!.plan : () => 'Freemium';

    setPlan(plan: AppPlan) {
        this.store.setPlan(plan);
    }

    getPlanClasses(plan: string, active: boolean): string {
        const base = "border-2 ";
        if (active) {
            switch (plan) {
                case 'Bronze': return base + "bg-amber-900/30 border-amber-500 text-amber-500";
                case 'Silver': return base + "bg-slate-700 border-slate-300 text-slate-300";
                case 'Gold': return base + "bg-yellow-900/30 border-yellow-500 text-yellow-500";
                default: return base + "bg-slate-700 border-white text-white";
            }
        } else {
            return "bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700 hover:text-slate-300";
        }
    }

    // Toggle Tag Mode
    isDebugTags = this.ts.debugMode;

    toggleDebugTags() {
        this.ts.debugMode.update(v => !v);
    }

    async toggleBadges() {
        const isChecked = !this.store.showPlanBadges();

        // 1. Update Global Store (Instant feedback for Sidebar)
        this.store.showPlanBadges.set(isChecked);

        // 2. Persist to DB
        try {
            await this.repository.updateGlobalSettings({ show_plan_badges: isChecked });
        } catch (e) {
            console.error(e);
            // Revert on error
            this.store.showPlanBadges.set(!isChecked);
            alert("Error saving setting to DB.");
        }
    }
}

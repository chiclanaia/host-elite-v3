import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'saas-global-dashboard-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Tableau de Bord Global</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Une vue d'ensemble de vos réservations et tâches à venir.</p>
      </div>
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200">Bientôt disponible</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Ici, vous verrez bientôt vos réservations à venir et votre gestionnaire de projets (RPM).</p>
      </div>
    </div>
  `
})
export class GlobalDashboardViewComponent {}

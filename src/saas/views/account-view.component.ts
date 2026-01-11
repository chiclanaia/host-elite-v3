import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'saas-account-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">Mon Compte</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Gérez votre profil et votre abonnement.</p>
      </div>
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200">Bientôt Disponible !</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Gérez les informations de votre profil, consultez vos factures et ajustez votre plan d'abonnement en toute simplicité.</p>
      </div>
    </div>
  `
})
export class AccountViewComponent {}

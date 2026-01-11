import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'saas-host-info-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Informations de l'Hôte</h1>
        <p class="mt-2 text-slate-500">Gérez vos informations personnelles et de facturation.</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-lg">
        <form [formGroup]="infoForm" (ngSubmit)="save()">
          <div class="p-6 space-y-6">
            <!-- Photo Section -->
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-3xl flex-shrink-0">
                H
              </div>
              <div>
                <button type="button" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                  Changer la photo
                </button>
                <p class="mt-2 text-xs text-slate-500">JPG, GIF ou PNG. 1MB max.</p>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700">Nom Complet</label>
                <input type="text" id="name" formControlName="name" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700">Adresse Email</label>
                <input type="email" id="email" formControlName="email" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div class="md:col-span-2">
                <label for="stripeId" class="block text-sm font-medium text-slate-700">Infos de facturation (Stripe ID)</label>
                <input type="text" id="stripeId" formControlName="stripeId" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="cus_...">
                 <p class="mt-2 text-xs text-slate-500">Votre identifiant client Stripe pour la gestion des abonnements.</p>
              </div>
            </div>
          </div>
          
          <!-- Save button -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
              <button type="submit" [disabled]="infoForm.invalid" class="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                  Enregistrer
              </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class HostInfoViewComponent {
  infoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.infoForm = this.fb.group({
      name: ['Hôte'],
      email: ['hote@exception.com'],
      stripeId: ['']
    });
  }

  save(): void {
    if (this.infoForm.valid) {
      console.log('Sauvegarde des informations...', this.infoForm.value);
      // Logic to save data would go here
    }
  }
}
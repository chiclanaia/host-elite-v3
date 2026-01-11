import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'saas-property-dashboard-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left column: Progress -->
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-xl font-bold text-slate-800">Complétude des Données</h2>
        
        <div class="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
            <!-- Marketing Progress -->
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-base font-medium text-slate-700">Marketing</span>
                    <span class="text-sm font-medium text-blue-700">{{ progress.marketing }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="progress.marketing"></div>
                </div>
            </div>
            <!-- Operational Progress -->
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-base font-medium text-slate-700">Opérationnel</span>
                    <span class="text-sm font-medium text-green-700">{{ progress.operational }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2.5">
                    <div class="bg-green-600 h-2.5 rounded-full" [style.width.%]="progress.operational"></div>
                </div>
            </div>
            <!-- Experience Progress -->
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-base font-medium text-slate-700">Expérience Client</span>
                    <span class="text-sm font-medium text-yellow-600">{{ progress.experience }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2.5">
                    <div class="bg-yellow-500 h-2.5 rounded-full" [style.width.%]="progress.experience"></div>
                </div>
            </div>
            <!-- Equipments Progress -->
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-base font-medium text-slate-700">Équipements</span>
                    <span class="text-sm font-medium text-orange-700">{{ progress.equipments }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2.5">
                    <div class="bg-orange-500 h-2.5 rounded-full" [style.width.%]="progress.equipments"></div>
                </div>
            </div>
        </div>
      </div>

      <!-- Right column: KPIs -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-slate-800">Indicateurs de Performance (KPIs)</h2>
        <div class="bg-white border border-slate-200 rounded-lg">
            <form [formGroup]="kpiForm" (ngSubmit)="saveKpis()">
                <div class="p-6 space-y-4">
                    <div>
                        <label for="revenue" class="block text-sm font-medium text-slate-700">Revenus (ce mois-ci)</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="text-slate-500 sm:text-sm">€</span>
                            </div>
                            <input type="number" id="revenue" formControlName="revenue" class="block w-full rounded-md border-slate-300 bg-white pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="0.00">
                        </div>
                    </div>
                     <div>
                        <label for="occupancy" class="block text-sm font-medium text-slate-700">Taux d'occupation (ce mois-ci)</label>
                         <div class="mt-1 relative rounded-md shadow-sm">
                            <input type="number" id="occupancy" formControlName="occupancy" class="block w-full rounded-md border-slate-300 bg-white pr-7 pl-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="0">
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span class="text-slate-500 sm:text-sm">%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
                    <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        Mettre à jour
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  `
})
export class PropertyDashboardViewComponent {
    kpiForm: FormGroup;
    
    // Mock data for progress bars, could be calculated from a service later
    progress = {
        marketing: 75,
        operational: 50,
        experience: 90,
        equipments: 30
    };

    constructor(private fb: FormBuilder) {
        this.kpiForm = this.fb.group({
            revenue: [1250, Validators.required],
            occupancy: [85, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    saveKpis(): void {
        if (this.kpiForm.valid) {
            console.log('Saving KPIs:', this.kpiForm.value);
            // In a real app, this would call a service to save the data
        }
    }
}
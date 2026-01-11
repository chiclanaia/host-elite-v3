
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { View } from '../../types';
import { PropertyDashboardViewComponent } from './property-dashboard-view.component';

@Component({
  selector: 'saas-property-view',
  standalone: true,
  imports: [CommonModule, PropertyDashboardViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Gestion : {{ view().title }}</h1>
        <p class="mt-2 text-slate-500">Suivez les performances et indicateurs clés de votre propriété.</p>
      </div>

      <!-- Content -->
      <div class="pt-2">
        <saas-property-dashboard-view></saas-property-dashboard-view>
      </div>
    </div>
  `
})
export class PropertyViewComponent {
  view = input.required<View>();
}
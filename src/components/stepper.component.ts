
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  index: number;
  title: string;
}

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-3xl mx-auto">
      <div class="flex items-center">
        @for (step of steps; track step.index; let i = $index) {
          <div class="flex items-center">
            <!-- Circle and Number -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
              [class]="getStepClass(step.index, 'circle')">
              {{ step.index }}
            </div>
            <!-- Title -->
            <span 
              class="ml-3 text-sm font-medium transition-colors duration-300 hidden sm:inline-block"
              [class]="getStepClass(step.index, 'text')">
              {{ step.title }}
            </span>
          </div>
          
          <!-- Connector Line -->
          @if (i < steps.length - 1) {
            <div 
              class="flex-1 h-0.5 mx-4 transition-colors duration-300"
              [class]="getStepClass(step.index, 'line')">
            </div>
          }
        }
      </div>
    </div>
  `
})
export class StepperComponent {
  currentStepIndex = input.required<number>();

  steps: Step[] = [
    { index: 1, title: "Votre Situation" },
    { index: 2, title: "Votre Potentiel" },
    { index: 3, title: "Votre Bilan" },
    { index: 4, title: "Plan d'Action" },
  ];

  getStepClass(stepIndex: number, part: 'circle' | 'text' | 'line'): string {
    const current = this.currentStepIndex();
    if (stepIndex < current) { // Completed
      switch (part) {
        case 'circle': return 'bg-slate-900 text-white';
        case 'text': return 'text-slate-800';
        case 'line': return 'bg-slate-900';
      }
    } else if (stepIndex === current) { // Active
      switch (part) {
        case 'circle': return 'bg-slate-900 text-white';
        case 'text': return 'text-slate-900 font-bold';
        case 'line': return 'bg-slate-200';
      }
    } else { // Upcoming
      switch (part) {
        case 'circle': return 'bg-slate-200 text-slate-500';
        case 'text': return 'text-slate-500';
        case 'line': return 'bg-slate-200';
      }
    }
  }
}
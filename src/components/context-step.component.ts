import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContextData } from '../types';

@Component({
  selector: 'app-context-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-center text-slate-700 dark:text-slate-200">Étape 1: Dites-nous qui vous êtes</h2>
      <p class="text-center text-slate-500 dark:text-slate-400">Ces informations nous aideront à personnaliser votre analyse.</p>
      
      <form [formGroup]="contextForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <div>
            <label class="block text-lg font-semibold text-slate-800 dark:text-slate-100">Quelle est votre situation actuelle ?</label>
            <div class="mt-4 grid sm:grid-cols-3 gap-4">
                @for(situation of situations; track situation.id) {
                    <div 
                        (click)="selectSituation(situation.id)"
                        class="p-6 rounded-lg border-2 text-center cursor-pointer transition-all duration-200"
                        [class]="contextForm.get('situation')?.value === situation.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-700/50 border-slate-600 hover:border-indigo-500 text-slate-200'">
                        <div class="text-3xl" role="img" [attr.aria-label]="situation.title">{{ situation.icon }}</div>
                        <h4 class="mt-3 font-bold text-lg">{{ situation.title }}</h4>
                        <p class="text-sm mt-1" [class]="contextForm.get('situation')?.value === situation.id ? 'text-indigo-200' : 'text-slate-400'">{{ situation.description }}</p>
                    </div>
                }
            </div>
        </div>

        <div>
            <label for="challenge" class="block text-lg font-semibold text-slate-800 dark:text-slate-100">Quel est votre plus grand défi ou votre principal objectif avec Airbnb aujourd'hui ?</label>
            <textarea id="challenge" formControlName="challenge" rows="3" class="mt-3 block w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-200 placeholder:text-slate-400"></textarea>
            <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">Soyez précis, cela rendra l'analyse plus pertinente. (min. 10 caractères)</p>
        </div>

        <div class="pt-2">
            <button type="submit" [disabled]="contextForm.invalid" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                Continuer vers l'Étape 2
            </button>
        </div>
      </form>
    </div>
  `
})
export class ContextStepComponent {
  submitContext = output<ContextData>();

  contextForm: FormGroup;
  situations = [
    { id: 'Je me lance', icon: '🚀', title: 'Je me lance', description: 'Je n\'ai pas encore de location ou je viens de commencer.' },
    { id: 'J\'ai déjà un bien', icon: '📈', title: 'J\'ai déjà un bien', description: 'Je cherche à améliorer mes revenus et à gagner du temps.' },
    { id: 'Je vise l\'excellence', icon: '🏆', title: 'Je vise l\'excellence', description: 'Je veux devenir Superhost, automatiser et scaler mon activité.' },
  ];

  constructor(private fb: FormBuilder) {
    this.contextForm = this.fb.group({
      situation: ['J\'ai déjà un bien', Validators.required],
      challenge: ['Manque de temps', [Validators.required, Validators.minLength(10)]],
    });
  }

  selectSituation(situationId: string): void {
    this.contextForm.get('situation')?.setValue(situationId);
  }
  
  onSubmit(): void {
    if (this.contextForm.valid) {
      this.submitContext.emit(this.contextForm.value);
    }
  }
}
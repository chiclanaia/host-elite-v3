
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scores } from '../types';

interface Angle {
  id: keyof Scores;
  label: string;
  icon: string;
  checklist: string[];
}

@Component({
  selector: 'app-evaluation-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    /* Styles natifs pour assurer la visibilité des sliders sans dépendances externes */
    input[type=range] {
      -webkit-appearance: none; 
      background: transparent;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: #0f172a;
      cursor: pointer;
      margin-top: -10px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
      background: #cbd5e1;
      border-radius: 3px;
    }
    input[type=range]:focus {
      outline: none;
    }
  `],
  template: `
    <div class="space-y-10 pb-8">
       <!-- Header -->
       <div class="text-center">
         <h2 class="text-3xl font-bold text-slate-900">Étape 2: Votre Potentiel</h2>
         <p class="mt-3 text-lg text-slate-600">Évaluez votre niveau de maîtrise (1 = Débutant, 10 = Expert).</p>
       </div>

       <!-- Form Area -->
       <div class="space-y-8">
         @for (angle of angles; track angle.id) {
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
               <!-- Header Line -->
               <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center space-x-4">
                     <span class="text-3xl" role="img" [attr.aria-label]="angle.label">{{ angle.icon }}</span>
                     <span class="text-xl font-bold text-slate-800">{{ angle.label }}</span>
                  </div>
                  <div class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-xl shadow-md">
                     {{ scores()[angle.id] }}
                  </div>
               </div>
               
               <!-- Range Input -->
               <div class="px-2 py-4">
                 <input 
                   [id]="angle.id"
                   type="range" 
                   min="1" max="10" step="1"
                   [value]="scores()[angle.id]"
                   (input)="updateScore(angle.id, $event)"
                   class="w-full block"
                   aria-label="Score"
                 >
                 <div class="flex justify-between text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">
                   <span>Débutant</span>
                   <span>Expert</span>
                 </div>
               </div>

               <!-- Checklist Context -->
               <div class="mt-6 pt-4 border-t border-slate-200">
                 <p class="text-xs font-bold text-slate-500 uppercase mb-3">Critères d'excellence :</p>
                 <ul class="space-y-2">
                   @for (item of angle.checklist; track item) {
                     <li class="flex items-start text-sm text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>{{ item }}</span>
                     </li>
                   }
                 </ul>
               </div>
            </div>
         }
       </div>
       
       <!-- Error Message -->
       @if (error()) {
         <div class="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
           <p class="font-bold">Une erreur est survenue</p>
           <p>{{ error() }}</p>
         </div>
       }

       <!-- Action Button -->
       <div class="pt-4 sticky bottom-4">
         <button 
            (click)="onSubmit()" 
            class="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            Générer mon Plan d'Action IA
         </button>
       </div>
    </div>
  `
})
export class EvaluationStepComponent {
  next = output<Scores>();
  error = input<string | null>();

  // Initialisation robuste avec Signals : impossible de désynchroniser la vue
  scores = signal<Scores>({
    marketing: 5,
    experience: 5,
    operations: 5,
    pricing: 5,
    accomodation: 5,
    legal: 5,
    mindset: 5
  });
  
  readonly angles: Angle[] = [
    { 
      id: 'marketing', 
      label: 'Marketing & Visibilité', 
      icon: '📢',
      checklist: [
        'Photos pro & description optimisée (SEO)',
        'Réponses aux avis & gestion e-réputation',
        'Stratégie de différenciation claire'
      ]
    },
    { 
      id: 'experience', 
      label: 'Expérience Client', 
      icon: '⭐',
      checklist: [
        'Communication rapide (<1h) & proactive',
        'Arrivée autonome & Livret d\'accueil',
        'Petites attentions (panier de bienvenue)'
      ]
    },
    { 
      id: 'operations', 
      label: 'Gestion Opérationnelle', 
      icon: '⚙️',
      checklist: [
        'Processus de ménage standardisé',
        'Maintenance préventive & Stocks gérés',
        'Automatisation des tâches répétitives'
      ]
    },
    { 
      id: 'pricing', 
      label: 'Stratégie Tarifaire', 
      icon: '💰',
      checklist: [
        'Tarification dynamique (saison/events)',
        'Optimisation du taux d\'occupation',
        'Analyse de la concurrence'
      ]
    },
    { 
      id: 'accomodation', 
      label: 'Optimisation Logement', 
      icon: '🏠',
      checklist: [
        'Décoration & Confort (Literie/Wifi)',
        'Équipements complets & Sécurité',
        'Effet "Whaou" ou atout unique'
      ]
    },
    { 
      id: 'legal', 
      label: 'Légal & Finance', 
      icon: '⚖️',
      checklist: [
        'Conformité légale & Assurances',
        'Suivi précis des revenus/dépenses',
        'Optimisation fiscale'
      ]
    },
    { 
      id: 'mindset', 
      label: 'Mindset & Développement', 
      icon: '🧠',
      checklist: [
        'Professionnalisme & Résilience',
        'Vision long terme & Formation continue',
        'Équilibre vie pro/perso'
      ]
    },
  ];

  updateScore(angleId: keyof Scores, event: Event): void {
    // Lecture directe de la valeur DOM : infaillible
    const inputElement = event.target as HTMLInputElement;
    const val = parseInt(inputElement.value, 10);
    this.scores.update(current => ({ ...current, [angleId]: val }));
  }

  onSubmit(): void {
    this.next.emit(this.scores());
  }
}
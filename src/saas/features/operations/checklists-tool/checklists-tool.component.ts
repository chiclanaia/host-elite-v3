import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface ChecklistItem {
    id: string;
    textKey?: string;
    text?: string;
    completed: boolean;
    category: string;
}

@Component({
    selector: 'ops-11-checklists',
    standalone: true,
    imports: [CommonModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-slate-600/10 text-slate-300 rounded-lg border border-slate-600/30 text-xs font-mono">
           ✓ SOPs
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-hidden">
            <div class="flex gap-4 mb-6 overflow-x-auto pb-2 shrink-0">
                @for (cat of categories; track cat) {
                    <button (click)="selectedCategory.set(cat)"
                            [class.bg-indigo-600]="selectedCategory() === cat"
                            [class.text-white]="selectedCategory() === cat"
                            [class.bg-slate-700]="selectedCategory() !== cat"
                            [class.text-slate-300]="selectedCategory() !== cat"
                            class="px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all whitespace-nowrap">
                        {{ 'CHECKLISTS.' + cat | translate }}
                    </button>
                }
            </div>
            
            <div class="flex-1 overflow-y-auto space-y-3 max-w-2xl pr-2 custom-scrollbar">
                @for (item of filteredItems(); track item.id) {
                    <div class="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5 group hover:border-indigo-500/50 transition-all cursor-pointer">
                        <div (click)="toggleItem(item.id); $event.stopPropagation()"
                             class="h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all"
                             [class.border-indigo-500]="item.completed"
                             [class.bg-indigo-500]="item.completed"
                             [class.border-slate-500]="!item.completed">
                            @if (item.completed) {
                                <span class="material-icons text-white text-sm">check</span>
                            }
                        </div>
                        <span class="flex-1 text-sm transition-all"
                              [class.text-slate-500]="item.completed"
                              [class.line-through]="item.completed"
                              [class.text-slate-200]="!item.completed">
                            {{ item.textKey ? (item.textKey | translate) : item.text }}
                        </span>
                        <button (click)="removeItem(item.id); $event.stopPropagation()" 
                                class="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all">
                            <span class="material-icons text-lg">delete_outline</span>
                        </button>
                    </div>
                }

                @if (filteredItems().length === 0) {
                    <div class="py-12 text-center">
                        <div class="text-4xl mb-4 opacity-20">📋</div>
                        <p class="text-slate-500 text-sm">No items in this category yet.</p>
                    </div>
                }
            </div>

            <div class="mt-6 pt-6 border-t border-white/10 shrink-0">
                <div class="flex gap-4 max-w-2xl">
                    <input #newItemInput type="text" 
                           [placeholder]="'CHECKLISTS.AddNewStep' | translate"
                           (keyup.enter)="addItem(newItemInput)"
                           class="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none transition-all">
                    <button (click)="addItem(newItemInput)"
                            class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                        {{ 'COMMON.Add' | translate }}
                    </button>
                </div>

                @if (tier() === 'TIER_3') {
                    <div class="mt-6 flex items-center justify-between bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10">
                        <div>
                            <h3 class="text-indigo-400 font-bold text-sm">{{ 'CHECKLISTS.DigitizeYourSops' | translate }}</h3>
                            <p class="text-[10px] text-slate-500 mt-1">{{ 'CHECKLISTS.TurnPaperChecklistsIntoTracked' | translate }}</p>
                        </div>
                        <button class="flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                            <span class="material-icons text-sm">upload</span>{{ 'CHECKLISTS.ImportCsv' | translate }}
                        </button>
                    </div>
                }
            </div>
       </div>
    </div>
  `,
    styles: [`
        :host { display: block; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
    `]
})
export class ChecklistsToolComponent {
    translate = inject(TranslationService);
    session = inject(SessionStore);

    feature = computed(() => ({
        id: 'OPS_11',
        name: this.translate.instant('CHECTOOL.Title'),
        description: this.translate.instant('CHECTOOL.Description'),
    } as any));

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    categories = ['Cleaning', 'Maintenance', 'Onboarding'];
    selectedCategory = signal<string>('Cleaning');

    items = signal<ChecklistItem[]>([
        { id: '1', textKey: 'CHECKLISTS.CheckUnderTheBed', completed: false, category: 'Cleaning' },
        { id: '2', textKey: 'CHECKLISTS.RefillShampooBottles', completed: true, category: 'Cleaning' },
        { id: '3', textKey: 'CHECKLISTS.EmptyTrashBins', completed: false, category: 'Cleaning' },
        { id: '4', text: 'Test boiler pressure', completed: false, category: 'Maintenance' },
        { id: '5', text: 'Welcome gift arrangement', completed: false, category: 'Onboarding' }
    ]);

    filteredItems = computed(() =>
        this.items().filter(item => item.category === this.selectedCategory())
    );

    addItem(input: HTMLInputElement) {
        const text = input.value.trim();
        if (!text) return;

        const newItem: ChecklistItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: text,
            completed: false,
            category: this.selectedCategory()
        };

        this.items.update(prev => [...prev, newItem]);
        input.value = '';
    }

    toggleItem(id: string) {
        this.items.update(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    }

    removeItem(id: string) {
        this.items.update(prev => prev.filter(item => item.id !== id));
    }
}

import { Component, computed, inject, signal, input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../services/translation.service';
import { HostRepository } from '../../../../services/host-repository.service';
import { ConstructionTask } from '../../../../types';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ops-01-construction',
    standalone: true,
    imports: [CommonModule,
        TranslatePipe,
        FormsModule
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="flex items-center gap-4">
             <div class="text-white font-bold text-sm px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                🏠 {{ propertyDetails()?.name }}
             </div>
            <div class="px-4 py-2 bg-orange-500/10 text-orange-300 rounded-lg border border-orange-500/30 text-xs font-mono">
               🏗️ Project Mgmt
            </div>
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
            <h3 class="text-white font-bold mb-4">{{ 'CONSTRUCTI.CriticalPathGantt' | translate }}</h3>
            
            <div class="flex-1 space-y-4 overflow-y-auto">
                 @for (task of tasks(); track task.id) {
                     <div class="flex items-center gap-4 group">
                         <div class="w-32 text-xs text-white font-bold truncate">{{ task.title }}</div>
                         <div class="flex-1 bg-black/30 h-8 rounded relative border border-white/5 overflow-hidden">
                             <!-- Simple Gantt Visualization -->
                             <div class="absolute h-full flex items-center px-2 text-[10px] text-black font-bold transition-all"
                                  [style.left.%]="calculateTaskPosition(task)"
                                  [style.width.%]="calculateTaskWidth(task)"
                                  [style.backgroundColor]="getTaskColor(task)">
                                 {{ task.status }}
                             </div>
                         </div>
                     </div>
                 } @empty {
                     <div class="flex flex-col items-center justify-center h-40 text-slate-500 gap-2 border-2 border-dashed border-white/5 rounded-xl">
                         <span class="material-icons text-4xl opacity-20">event_busy</span>
                         <p class="text-sm italic">{{ 'CONSTRUCTI.NoTasksFound' | translate }}</p>
                         <button (click)="addTask()" class="mt-2 text-xs bg-orange-500/20 text-orange-300 px-4 py-1 rounded-full border border-orange-500/30 hover:bg-orange-500/40 transition-all font-bold">+ Plan Your First Task</button>
                     </div>
                 }
            </div>

            @if (tier() === 'TIER_3') {
                <div class="mt-6 p-4 bg-slate-900 rounded border border-orange-500/30 flex items-center gap-4">
                    <div class="h-10 w-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <span class="material-icons">notifications_active</span>
                    </div>
                    <div>
                        <div class="text-orange-400 font-bold text-sm">{{ 'CONSTRUCTI.DelayDetected' | translate }}</div>
                         <p class="text-xs text-slate-500">{{ 'CONSTRUCTI.PlumbingIs2DaysLate' | translate }}</p>
                    </div>
                </div>
            }
            
            <!-- Coach -->
            <div class="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">🛑</span>
                <div>
                        <h4 class="font-bold text-orange-300 text-sm">{{ 'CONSTRUCTI.TheSlackFactor' | translate }}</h4>
                        <p class="text-xs text-orange-200/80 mt-1">{{ 'CONSTRUCTI.SlackTimeTip' | translate }}</p>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ConstructionScheduleComponent implements OnInit, OnChanges {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_01',
        name: this.translate.instant('CONSTRUCTI.ConstructionSchedule'),
        description: this.translate.instant('CONSTRUCTI.CriticalPathOperationsEngine'),
    } as any));

    session = inject(SessionStore);
    repository = inject(HostRepository);

    propertyDetails = input<any>();
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    properties = signal<any[]>([]);
    selectedPropertyId = signal<string | null>(null);
    tasks = signal<ConstructionTask[]>([]);

    constructor() {
        // Initial load happens via input effect or ngOnInit
    }

    ngOnInit() {
        this.updateFromProperty();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['propertyDetails'] && !changes['propertyDetails'].firstChange) {
            this.updateFromProperty();
        }
    }

    private updateFromProperty() {
        const prop = this.propertyDetails();
        if (prop?.id) {
            this.selectedPropertyId.set(prop.id);
            this.loadTasks(prop.id);
        }
    }

    async loadTasks(propertyId: string) {
        const data = await this.repository.getConstructionTasks(propertyId);
        this.tasks.set(data);
    }

    // Gantt calculation logic
    calculateTaskPosition(task: ConstructionTask): number {
        // Simple relative position over a 30-day window for demo
        const start = new Date(task.start_date).getTime();
        const base = new Date().getTime();
        const offset = (start - base) / (1000 * 60 * 60 * 24);
        return Math.max(0, Math.min(90, offset * 3)); // Normalized
    }

    calculateTaskWidth(task: ConstructionTask): number {
        const start = new Date(task.start_date).getTime();
        const end = new Date(task.end_date).getTime();
        const duration = (end - start) / (1000 * 60 * 60 * 24);
        return Math.max(5, Math.min(100, duration * 3));
    }

    getTaskColor(task: ConstructionTask): string {
        switch (task.status) {
            case 'Completed': return '#10b981'; // emerald
            case 'In Progress': return '#f59e0b'; // amber
            default: return '#64748b'; // slate
        }
    }

    async addTask() {
        const propId = this.selectedPropertyId();
        if (!propId) return;

        const newTask: Partial<ConstructionTask> = {
            property_id: propId,
            title: 'New Task',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Pending'
        };

        await this.repository.upsertConstructionTask(newTask);
        this.loadTasks(propId);
    }
}

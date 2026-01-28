import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

interface CleaningTask {
    id: string;
    text: string;
    completed: boolean;
    room: 'kitchen' | 'bathroom' | 'bedroom' | 'general';
    requiresPhoto?: boolean;
}

@Component({
    selector: 'ops-03-cleaning',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Turnover Master</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Standardize your cleaning process and guarantee 5-star reviews.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'AI Photo Verification' : (isTier2() ? 'Room Workflows' : 'Basic List') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden min-h-0">
           
           <!-- Workflow Selector -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
                <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                    <h3 class="text-white font-bold mb-4">Cleaning Zones</h3>
                    <div class="space-y-2">
                        @for (zone of zones; track zone.id) {
                            <button class="w-full p-4 rounded-lg border flex items-center justify-between group transition-all"
                                    [class.bg-indigo-600]="activeZone() === zone.id"
                                    [class.border-indigo-500]="activeZone() === zone.id"
                                    [class.bg-white/5]="activeZone() !== zone.id"
                                    [class.border-white/5]="activeZone() !== zone.id"
                                    (click)="activeZone.set(zone.id)">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded flex items-center justify-center bg-black/20 text-lg">
                                        {{ zone.icon }}
                                    </div>
                                    <div class="text-left">
                                        <div class="font-bold text-sm" [class.text-white]="activeZone() === zone.id" [class.text-slate-300]="activeZone() !== zone.id">{{ zone.name }}</div>
                                        <div class="text-[10px] opacity-60" [class.text-indigo-200]="activeZone() === zone.id" [class.text-slate-400]="activeZone() !== zone.id">
                                            {{ getCompletedCount(zone.id) }}/{{ getTotalCount(zone.id) }} Tasks
                                        </div>
                                    </div>
                                </div>
                                <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center"
                                     [class.border-white]="activeZone() === zone.id"
                                     [class.border-slate-600]="activeZone() !== zone.id"
                                     [class.bg-white]="isZoneComplete(zone.id) && activeZone() === zone.id">
                                     @if(isZoneComplete(zone.id)) {
                                         <span class="material-icons text-xs font-bold" [class.text-indigo-600]="activeZone() === zone.id" [class.text-slate-500]="activeZone() !== zone.id">check</span>
                                     }
                                </div>
                            </button>
                        }
                    </div>
                </div>

                <!-- Coach -->
                <div class="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg mt-auto">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "The Hair Rule: One loose hair on the bed pillows equals a 3-star review on cleanliness. Always use a lint roller as the final step before leaving."
                    </p>
                </div>
           </div>

           <!-- Task List & Validation -->
           <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
               
               <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-hidden relative">
                   <!-- Sparkle Effect Overlay -->
                   @if (isAllComplete()) {
                       <div class="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden animate-fade-in">
                           <div class="absolute inset-0 bg-indigo-900/20 backdrop-blur-[1px]"></div>
                           <div class="bg-white/10 p-8 rounded-full border border-white/20 shadow-2xl backdrop-blur-md animate-bounce">
                               <div class="text-6xl">✨</div>
                           </div>
                       </div>
                   }

                   <div class="flex justify-between items-center mb-6">
                       <h3 class="text-white font-bold text-lg flex items-center gap-2">
                           <span class="text-2xl">{{ getZoneIcon(activeZone()) }}</span>
                           {{ getZoneName(activeZone()) }} Checklist
                       </h3>
                       <div class="text-xs text-slate-400 font-mono">
                           {{ getCompletedCount(activeZone()) }} of {{ getTotalCount(activeZone()) }}
                       </div>
                   </div>

                   <div class="flex-1 overflow-y-auto space-y-3 pr-2">
                       @for (task of getTasksForZone(activeZone()); track task.id) {
                           <div class="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all group">
                               <label class="flex items-start gap-4 cursor-pointer">
                                   <div class="relative pt-1">
                                       <input type="checkbox" class="peer sr-only" [checked]="task.completed" (change)="toggleTask(task.id)">
                                       <div class="w-6 h-6 border-2 border-slate-500 rounded peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
                                           <span class="material-icons text-white text-sm opacity-0 peer-checked:opacity-100">check</span>
                                       </div>
                                   </div>
                                   <div class="flex-1">
                                        <div class="text-slate-200 text-sm font-medium group-hover:text-white transition-colors" [class.line-through]="task.completed" [class.opacity-50]="task.completed">
                                            {{ task.text }}
                                        </div>
                                        
                                        @if (isTier3() && task.requiresPhoto) {
                                            <div class="mt-3 flex items-center gap-4">
                                                <button class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-white transition-colors border border-white/10"
                                                        (click)="$event.preventDefault(); uploadPhoto(task.id)">
                                                    <span class="material-icons text-xs">camera_alt</span>
                                                    {{ task.completed ? 'Retake Photo' : 'Required Photo Evidence' }}
                                                </button>
                                                @if(task.completed) {
                                                    <span class="text-[10px] text-emerald-400 flex items-center gap-1">
                                                        <span class="material-icons text-[10px]">verified</span> Verified by AI
                                                    </span>
                                                }
                                            </div>
                                        }
                                   </div>
                               </label>
                           </div>
                       }
                   </div>
                   
                   <!-- Progress Bar -->
                   <div class="mt-6">
                       <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                           <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" 
                                [style.width.%]="(getCompletedCount(activeZone()) / getTotalCount(activeZone())) * 100"></div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class CleaningChecklistComponent {
    feature = computed(() => ({
        id: 'OPS_03',
        name: 'Cleaning Checklist',
        description: 'Professional Turnover Standards',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    activeZone = signal<'kitchen' | 'bathroom' | 'bedroom' | 'general'>('kitchen');

    zones = [
        { id: 'kitchen', name: 'Kitchen', icon: 'kitchen' },
        { id: 'bathroom', name: 'Bathroom', icon: 'bathtub' },
        { id: 'bedroom', name: 'Bedroom', icon: 'bed' },
        { id: 'general', name: 'General', icon: 'cleaning_services' },
    ];

    tasks = signal<CleaningTask[]>([
        { id: '1', text: 'Empty fridge and wipe shelves', room: 'kitchen', completed: false },
        { id: '2', text: 'Clean coffee machine filters', room: 'kitchen', completed: false, requiresPhoto: true },
        { id: '3', text: 'Sanitize toilet seat and handle', room: 'bathroom', completed: false },
        { id: '4', text: 'Scrub shower grout', room: 'bathroom', completed: false, requiresPhoto: true },
        { id: '5', text: 'Change bed linens (hospital corners)', room: 'bedroom', completed: false },
        { id: '6', text: 'Check for hair on pillows', room: 'bedroom', completed: false, requiresPhoto: true }, // Hair Rule
        { id: '7', text: 'Vacuum under sofa', room: 'general', completed: false },
    ]);

    getTasksForZone(zone: string) {
        return this.tasks().filter(t => t.room === zone);
    }

    getCompletedCount(zone: string) {
        return this.getTasksForZone(zone).filter(t => t.completed).length;
    }

    getTotalCount(zone: string) {
        return this.getTasksForZone(zone).length;
    }

    isZoneComplete(zone: string) {
        return this.getCompletedCount(zone) === this.getTotalCount(zone) && this.getTotalCount(zone) > 0;
    }

    isAllComplete() {
        return this.tasks().every(t => t.completed);
    }

    getZoneName(id: string) {
        return this.zones.find(z => z.id === id)?.name || id;
    }

    getZoneIcon(id: string) {
        return this.zones.find(z => z.id === id)?.icon || 'circle';
    }

    toggleTask(id: string) {
        this.tasks.update(tasks => tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }

    uploadPhoto(id: string) {
        if (!this.isTier3()) return;
        // Mock Photo Upload
        alert("Photo Uploaded. AI Analyzing for cleanliness... Verified!");
        this.tasks.update(tasks => tasks.map(t => t.id === id ? { ...t, completed: true } : t));
    }
}

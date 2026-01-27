import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-01-construction',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-orange-500/10 text-orange-300 rounded-lg border border-orange-500/30 text-xs font-mono">
           🏗️ Project Mgmt
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
            <h3 class="text-white font-bold mb-4">Critical Path Gantt</h3>
            
            <div class="flex-1 space-y-2 overflow-y-auto">
                 <!-- Task 1 -->
                 <div class="flex items-center gap-4">
                     <div class="w-32 text-xs text-white font-bold truncate">Demolition</div>
                     <div class="flex-1 bg-black/30 h-8 rounded relative">
                         <div class="absolute left-0 w-[20%] h-full bg-emerald-500 rounded flex items-center px-2 text-[10px] text-black font-bold">Done</div>
                     </div>
                 </div>

                  <!-- Task 2 -->
                 <div class="flex items-center gap-4">
                     <div class="w-32 text-xs text-white font-bold truncate">Plumbing</div>
                     <div class="flex-1 bg-black/30 h-8 rounded relative">
                         <div class="absolute left-[20%] w-[15%] h-full bg-amber-500 rounded flex items-center px-2 text-[10px] text-black font-bold">In Progress</div>
                     </div>
                 </div>
                 
                 <!-- Task 3 -->
                  <div class="flex items-center gap-4">
                     <div class="w-32 text-xs text-slate-500 truncate">Painting</div>
                     <div class="flex-1 bg-black/30 h-8 rounded relative">
                         <div class="absolute left-[35%] w-[30%] h-full bg-slate-600 rounded border border-white/10 flex items-center px-2 text-[10px] text-slate-300">Scheduled</div>
                         
                          @if (tier() === 'TIER_3') {
                              <!-- Dependency Link -->
                              <div class="absolute left-[35%] -top-4 w-px h-4 bg-slate-500 z-0"></div>
                          }
                     </div>
                 </div>
            </div>

            @if (tier() === 'TIER_3') {
                <div class="mt-6 p-4 bg-slate-900 rounded border border-orange-500/30 flex items-center gap-4">
                    <div class="h-10 w-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <span class="material-icons">notifications_active</span>
                    </div>
                    <div>
                        <div class="text-orange-400 font-bold text-sm">Delay Detected</div>
                         <p class="text-xs text-slate-500">Plumbing is 2 days late. Auto-rescheduled Painting to Oct 24th.</p>
                    </div>
                </div>
            }
            
            <!-- Coach -->
            <div class="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">🛑</span>
                    <div>
                        <h4 class="font-bold text-orange-300 text-sm">The Slack Factor</h4>
                        <p class="text-xs text-orange-200/80 mt-1">Construction always runs late. Always build 20% "Slack Time" into your critical path to avoid cancelling guest bookings.</p>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ConstructionScheduleComponent {
    feature = computed(() => ({
        id: 'OPS_01',
        name: 'Construction Schedule',
        description: 'Critical Path Operations Engine',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

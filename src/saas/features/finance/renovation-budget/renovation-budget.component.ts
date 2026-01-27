import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'fin-02-renovation-budget',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2">{{ feature().description }}</p>
        </div>
        
        <!-- Tier Badge -->
         <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier0() ? 'Checklist Mode' : (isTier3() ? 'AI Auditor Mode' : 'Interactive Mode') }}
         </div>
      </div>

      <!-- TIER 0: Static Checklist -->
      @if (isTier0()) {
          <div class="flex-1 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <span class="text-6xl mb-6">📋</span>
              <h3 class="text-2xl font-bold text-white mb-2">Renovation Checklist</h3>
              <p class="text-slate-400 max-w-md mb-8">Access our professional room-by-room renovation checklist. Upgrade to unlock the interactive budget calculator and AI Quote Auditor.</p>
              
              <button class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                  <span class="material-icons">download</span> Download PDF Guide
              </button>
          </div>
      } 
      
      <!-- TIER 1/2/3: Interactive Budget -->
      @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
              
              <!-- Input Area -->
              <div class="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-hidden">
                  <div class="flex justify-between items-center mb-6">
                      <h3 class="text-xl font-bold text-white">Room Budget Planner</h3>
                      <button (click)="addRoom()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                          <span class="material-icons text-xs">add</span> Add Room
                      </button>
                  </div>

                  <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      @for (room of rooms; track $index) {
                          <div class="bg-black/20 rounded-xl p-4 border border-white/5 relative group">
                              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                  <div class="md:col-span-1">
                                      <label class="block text-xs text-slate-400 mb-1">Room Type</label>
                                      <select [value]="room.type" (change)="updateRoom($index, 'type', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                          <option value="Living Room">Living Room</option>
                                          <option value="Kitchen">Kitchen</option>
                                          <option value="Bathroom">Bathroom</option>
                                          <option value="Bedroom">Bedroom</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label class="block text-xs text-slate-400 mb-1">Area (m²)</label>
                                      <input type="number" [value]="room.area" (input)="updateRoom($index, 'area', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                  </div>
                                   <div>
                                      <label class="block text-xs text-slate-400 mb-1">Finish Level</label>
                                      <select [value]="room.finish" (change)="updateRoom($index, 'finish', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                          <option value="Standard">Standard (€400/m²)</option>
                                          <option value="Premium">Premium (€800/m²)</option>
                                          <option value="Luxury">Luxury (€1200/m²)</option>
                                      </select>
                                  </div>
                                  <div class="text-right">
                                      <div class="text-xs text-slate-500">Est. Cost</div>
                                      <div class="font-bold text-emerald-400">{{ calculateRoomCost(room) | currency:'EUR':'symbol':'1.0-0' }}</div>
                                  </div>
                              </div>
                              <button (click)="removeRoom($index)" class="absolute top-2 right-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span class="material-icons text-sm">close</span>
                              </button>
                          </div>
                      }
                  </div>

                  <!-- Contingency -->
                  <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                      <div class="text-slate-400 flex items-center gap-2">
                          <span>Risk Buffer (10%)</span>
                          <span class="text-xs bg-slate-700 px-1.5 rounded text-slate-300">Auto-calculated</span>
                      </div>
                      <div class="text-amber-400 font-bold">+ {{ totalCost() * 0.1 | currency:'EUR':'symbol':'1.0-0' }}</div>
                  </div>
              </div>

              <!-- Sidebar: Stats & Coach -->
              <div class="flex flex-col gap-6">
                  <!-- Total Summary -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Total Capex</h3>
                      <div class="text-4xl font-black text-white mb-2">
                          {{ totalCost() * 1.1 | currency:'EUR':'symbol':'1.0-0' }}
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                           <div class="bg-indigo-500 h-full transition-all duration-500" [style.width.%]="(totalCost() / 50000) * 100"></div>
                      </div>
                      <p class="text-xs text-slate-500">Includes 10% safety margin</p>
                   </div>

                   <!-- AI Quote Auditor (Tier 3) -->
                   <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
                       <h3 class="text-white font-bold flex items-center gap-2 mb-4">
                           <span class="material-icons text-indigo-400">psychology</span> AI Quote Auditor
                       </h3>
                       
                       @if (isTier3()) {
                           <div class="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer" (click)="triggerAudit()">
                               <span class="material-icons text-slate-500 text-3xl mb-2">upload_file</span>
                               <p class="text-xs text-slate-400">Drop contractor PDF here to compare against market prices.</p>
                           </div>
                           
                           @if (auditResult()) {
                               <div class="mt-4 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg animate-fade-in">
                                   <div class="flex items-start gap-2">
                                       <span class="text-rose-400">⚠️</span>
                                       <div>
                                           <h5 class="text-xs font-bold text-rose-200">Negotiation Alert</h5>
                                           <p class="text-[10px] text-rose-200/70">"Plumbing Labor" is 25% above regional average.</p>
                                       </div>
                                   </div>
                               </div>
                           }
                       } @else {
                           <div class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center p-4 text-center backdrop-blur-[1px]">
                               <div>
                                   <span class="text-2xl mb-2 block">🔒</span>
                                   <p class="text-xs text-indigo-200 mb-2 font-bold">Expert Feature</p>
                                   <p class="text-[10px] text-slate-400">Benchmark quotes against official government indices.</p>
                               </div>
                           </div>
                       }
                   </div>

                   <!-- Pedagogical Coach -->
                   <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                        <div class="flex items-start gap-3">
                           <span class="text-xl">🏆</span>
                           <div>
                               <h4 class="font-bold text-indigo-300 text-sm">Pro Tip</h4>
                               <p class="text-xs text-indigo-200/80 mt-1">Focus your budget on 'Hero Amenities' (Kitchen/Bath). These maximize ADR impact while bedroom upgrades have diminishing returns.</p>
                           </div>
                       </div>
                   </div>
              </div>
          </div>
      }
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class RenovationBudgetComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);

    // Computed
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    // State
    auditResult = signal<boolean>(false);

    // Interactive Room List (Mocked for simplicity w/o FormArray overhead for this demo)
    rooms = [
        { type: 'Living Room', area: 25, finish: 'Standard' },
        { type: 'Kitchen', area: 12, finish: 'Premium' }
    ];

    totalCost = computed(() => {
        return this.rooms.reduce((acc, room) => acc + this.calculateRoomCost(room), 0);
    });

    addRoom() {
        this.rooms.push({ type: 'Bedroom', area: 15, finish: 'Standard' });
    }

    removeRoom(index: number) {
        this.rooms.splice(index, 1);
    }

    updateRoom(index: number, field: string, event: any) {
        const val = event.target.value;
        const room = this.rooms[index];
        if (field === 'area') room.area = parseFloat(val);
        if (field === 'type') room.type = val;
        if (field === 'finish') room.finish = val;

        // Force trigger change detection if needed (using mutable array in simple demo)
        // In more complex app, use Signals array or Immutable
        this.rooms = [...this.rooms];
    }

    calculateRoomCost(room: any): number {
        let rate = 400;
        if (room.finish === 'Premium') rate = 800;
        if (room.finish === 'Luxury') rate = 1200;
        return room.area * rate;
    }

    triggerAudit() {
        // Mock AI Analysis
        setTimeout(() => {
            this.auditResult.set(true);
        }, 1500);
    }
}

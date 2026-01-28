import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

interface Amenity {
    id: string;
    name: string;
    category: 'Kitchen' | 'Bathroom' | 'Living' | 'Outdoor';
    cost: number;
    yield_uplift: number; // Potential annual revenue increase
    roi_months: number;
    must_have: boolean;
    acquired: boolean;
    public_price?: number;
}

@Component({
    selector: 'exp-01-essentials-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Amenity & Yield Biasing</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Strategic asset procurement linked to rental premiums.</p>
        </div>
        <div class="flex gap-2">
             <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
                <span>💰</span> Yield Optimizer
            </div>
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>🛒</span> Procurement
            </div>
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-hidden">
           <!-- Filters & Toggles -->
           <div class="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
               <div class="flex gap-2">
                    <button 
                        *ngFor="let cat of categories"
                        (click)="activeCategory.set(cat)"
                        [class.bg-white_10]="activeCategory() === cat"
                        [class.bg-transparent]="activeCategory() !== cat"
                        class="px-4 py-2 rounded-full border border-white/10 text-sm hover:bg-white/10 transition-colors"
                        [class.text-white]="activeCategory() === cat"
                        [class.text-slate-400]="activeCategory() !== cat"
                        [attr.data-debug-id]="'filter-' + cat.toLowerCase()">
                        {{ cat }}
                    </button>
               </div>
               
               <div *ngIf="isTier2OrAbove()" class="text-xs text-slate-400 italic">
                   <span class="text-emerald-400 font-bold">Silver Tier Active:</span> ROI Multipliers Visible
               </div>
           </div>

           <!-- Coach Tip -->
           <div class="mb-6 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">💡</span>
                    <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip: The Pool Premium</span>
                </div>
                <p class="text-slate-300 text-xs italic">
                    "Every Euro spent should increase Price or Occupancy. Installing a Hot Tub (€6k) typically yields a +15% ADR uplift, paying for itself in 9 months."
                </p>
           </div>
           
           <!-- Grid -->
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
               @for (item of filteredAmenities(); track item.id) {
                   <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 transition-all group flex flex-col justify-between h-full">
                       
                       <!-- Header -->
                       <div>
                           <div class="flex justify-between items-start mb-2">
                               <h4 class="text-white font-bold truncate" [title]="item.name">{{ item.name }}</h4>
                               @if (item.must_have) {
                                   <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider">Essential</span>
                               }
                           </div>
                           <p class="text-xs text-slate-500 mb-4">Item #{{ item.id }}</p>
                       </div>

                       <!-- Tier 2+: ROI Data -->
                       @if (isTier2OrAbove()) {
                           <div class="mb-4 space-y-2">
                               <!-- Visual Requirement: ROI Bar Chart -->
                               <div class="flex items-end gap-2 h-16 border-b border-white/10 pb-1 px-1">
                                    <!-- Cost Bar (Red) -->
                                    <div class="w-1/2 bg-rose-500/20 rounded-t relative group/bar h-full">
                                        <div class="absolute bottom-0 left-0 w-full bg-rose-500 rounded-t transition-all" [style.height.%]="getCostHeight(item)"></div>
                                        <span class="absolute -top-4 left-0 w-full text-center text-[10px] text-rose-400 opacity-0 group-hover/bar:opacity-100">-€{{ item.cost }}</span>
                                    </div>
                                    <!-- Revenue Bar (Green) -->
                                    <div class="w-1/2 bg-emerald-500/20 rounded-t relative group/bar h-full">
                                        <div class="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t transition-all" [style.height.%]="getRevenueHeight(item)"></div>
                                        <span class="absolute -top-4 left-0 w-full text-center text-[10px] text-emerald-400 opacity-0 group-hover/bar:opacity-100">+€{{ item.yield_uplift }}/yr</span>
                                    </div>
                               </div>
                               <div class="flex justify-between text-[10px] uppercase font-mono text-slate-500">
                                   <span>Cost</span>
                                   <span>1Y Uplift</span>
                               </div>
                               <div class="text-center mt-1">
                                    <span class="text-indigo-400 text-xs font-bold">Payback: {{ item.roi_months }}mo</span>
                               </div>
                           </div>
                       }

                       <!-- Actions based on Tier -->
                       @if (isTier3()) {
                           <!-- Tier 3: Live Procurement -->
                           <div class="pt-3 border-t border-white/5 flex items-center justify-between">
                               <div>
                                   <span class="text-[10px] text-slate-500 block">Best Public Price</span>
                                   <span class="text-emerald-400 font-mono font-bold">€{{ item.public_price }}</span>
                               </div>
                               <button class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-bold transition-colors" [attr.data-debug-id]="'buy-' + item.id">
                                   Auto-Buy
                               </button>
                           </div>
                       } @else {
                           <!-- Tier 0/1: Checklist -->
                            <div class="pt-3 border-t border-white/5">
                                <label class="flex items-center gap-2 cursor-pointer group/check">
                                    <div class="relative">
                                        <input type="checkbox" [(ngModel)]="item.acquired" class="peer sr-only" [attr.data-debug-id]="'check-' + item.id">
                                        <div class="w-4 h-4 border-2 border-slate-600 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                                        <svg class="absolute w-3 h-3 text-white top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span class="text-xs text-slate-400 group-hover/check:text-white transition-colors">Mark as Acquired</span>
                                </label>
                            </div>
                       }
                   </div>
               }
           </div>

           <!-- Upgrade Prompt -->
           @if (!isTier2OrAbove()) {
               <div class="mt-4 p-4 border border-indigo-500/30 rounded-lg bg-gradient-to-r from-indigo-900/50 to-indigo-800/20 flex justify-between items-center">
                   <div>
                       <h4 class="text-white font-bold text-sm">Unlock ROI Analysis</h4>
                       <p class="text-indigo-200 text-xs">Upgrade to Silver to see "Yield Multipliers" and calculated Payback Periods for every amenity.</p>
                   </div>
                   <button class="px-4 py-2 bg-white text-indigo-900 font-bold text-xs rounded hover:bg-indigo-50 transition-colors" data-debug-id="upgrade-trigger">Unlock Silver</button>
               </div>
           }
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class EssentialsListComponent {
    session = inject(SessionStore);

    // Tiers Logic
    tier = computed(() => {
        const plan = this.session.userProfile()?.plan || 'TIER_0';
        return plan === 'Freemium' ? 'TIER_0' : plan; // Standardize
    });

    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'TIER_3');

    // Data
    categories = ['Kitchen', 'Bathroom', 'Living', 'Outdoor'];
    activeCategory = signal<string>('Kitchen');

    amenities = signal<Amenity[]>([
        { id: '1', name: 'Nespresso Machine', category: 'Kitchen', cost: 120, yield_uplift: 300, roi_months: 4.8, must_have: true, acquired: false, public_price: 99 },
        { id: '2', name: '4-Slice Toaster', category: 'Kitchen', cost: 40, yield_uplift: 50, roi_months: 9.6, must_have: true, acquired: true, public_price: 34.99 },
        { id: '3', name: 'Hot Tub (Inflatable)', category: 'Outdoor', cost: 600, yield_uplift: 1500, roi_months: 4.8, must_have: false, acquired: false, public_price: 549 },
        { id: '4', name: 'BBQ Grill', category: 'Outdoor', cost: 250, yield_uplift: 400, roi_months: 7.5, must_have: false, acquired: false, public_price: 229 },
        { id: '5', name: 'Rain Shower Head', category: 'Bathroom', cost: 80, yield_uplift: 120, roi_months: 8, must_have: false, acquired: false, public_price: 65 },
        { id: '6', name: 'Hotel Quality Towels (Set)', category: 'Bathroom', cost: 150, yield_uplift: 200, roi_months: 9, must_have: true, acquired: true, public_price: 139 },
        { id: '7', name: '55" Smart TV (4K)', category: 'Living', cost: 450, yield_uplift: 600, roi_months: 9, must_have: true, acquired: false, public_price: 399 },
        { id: '8', name: 'Work Desk & Chair', category: 'Living', cost: 200, yield_uplift: 500, roi_months: 4.8, must_have: false, acquired: false, public_price: 189 },
    ]);

    filteredAmenities = computed(() =>
        this.amenities().filter(a => a.category === this.activeCategory())
    );

    // Helpers for Charts
    getCostHeight(item: Amenity): number {
        const max = Math.max(item.cost, item.yield_uplift);
        return (item.cost / max) * 100;
    }

    getRevenueHeight(item: Amenity): number {
        const max = Math.max(item.cost, item.yield_uplift);
        return (item.yield_uplift / max) * 100;
    }
}

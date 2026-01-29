import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface Asset {
    id: string;
    name: string;
    room: string;
    value: number;
    purchaseDate?: string;
    warrantyExp?: string;
    imageUrl?: string;
    aiConfidence?: number;
}

@Component({
    selector: 'exp-02-inventory',
    standalone: true,
    imports: [CommonModule,
    TranslatePipe
  ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'INVENTORY_.AiVisionAssetRegister' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'INVENTORY_.ComputervisionDrivenAssetDocumentationAnd' | translate }}</p>
        </div>
        <div class="flex gap-2">
            <div class="px-4 py-2 bg-pink-600/10 text-pink-400 rounded-lg border border-pink-600/30 text-xs font-mono flex items-center gap-2">
                <span>👁️</span>{{ 'INVENTORY_.AiVision' | translate }}</div>
             <div class="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-lg border border-blue-500/30 text-xs font-mono flex items-center gap-2">
                <span>🛡️</span>{{ 'INVENTORY_.Protection' | translate }}</div>
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
           
           <!-- Left: Actions & AI Control -->
           <div class="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
                <!-- AI Scan Card (Tier 3) -->
                <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]">
                    <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
                    
                    <div class="relative z-10 w-full">
                        <div class="h-16 w-16 border-2 border-white/50 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform bg-white/10 backdrop-blur"
                             (click)="runAiScan()"
                             [class.opacity-50]="!isTier3()"
                             data-debug-id="inventory-ai-scan-btn">
                            <span class="text-2xl text-white">📸</span>
                        </div>
                        <h3 class="text-white font-bold mb-1">360° AI Scan</h3>
                        <p class="text-slate-400 text-xs mb-4">{{ 'INVENTORY_.DetectValuableAssetsAutomatically' | translate }}</p>
                        
                        @if (!isTier3()) {
                            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                🔒 Gold Tier Only
                            </div>
                        } @else {
                             <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                ✅ Active (YOLOv8)
                            </div>
                        }
                    </div>
                </div>

                <!-- Warranty Stats (Tier 2) -->
                <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                    <h3 class="text-white font-bold text-sm mb-4">🛡️ Warranty Monitor</h3>
                    @if (isTier2OrAbove()) {
                         <div class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">{{ 'INVENTORY_.TotalCoveredValue' | translate }}</span>
                                <span class="text-emerald-400 font-mono">€4,250</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">{{ 'INVENTORY_.Expiring' | translate }}< 30 days</span>
                                <span class="text-amber-400 font-bold">2 items</span>
                            </div>
                            <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                                <div class="bg-emerald-500 w-[75%] h-full"></div>
                            </div>
                            <div class="text-[10px] text-right text-slate-500">75% Assets under warranty</div>
                         </div>
                    } @else {
                        <div class="text-center py-4">
                            <p class="text-slate-500 text-xs italic mb-2">{{ 'INVENTORY_.TrackExpirationDatesReceipts' | translate }}</p>
                            <button class="px-3 py-1 bg-white/10 text-white text-[10px] rounded hover:bg-white/20">{{ 'INVENTORY_.UpgradeToSilver' | translate }}</button>
                        </div>
                    }
                </div>

                <!-- Coach Tip -->
                <div class="p-4 bg-pink-900/20 border-l-4 border-pink-500 rounded-r-lg">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-pink-300 font-bold text-sm uppercase">{{ 'INVENTORY_.CoachTip' | translate }}</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Evidence-based hospitality. You cannot claim what you haven't proved. Video evidence of proper condition *before* check-in is your only real defense."
                    </p>
                </div>
           </div>

           <!-- Right: Visual Inventory & Tree Map -->
           <div class="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
               
               <!-- Value Tree Map (Visual Requirement) -->
               <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                   <h3 class="text-white font-bold text-sm mb-4">{{ 'INVENTORY_.ValueDistributionTreemap' | translate }}</h3>
                   <div class="flex h-32 w-full gap-1">
                       <!-- Living Room (Large) -->
                       <div class="h-full bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30 transition-colors relative group" style="width: 45%" title="{{ \'INVENTORY_.LivingRoom2200\' | translate }}">
                           <span class="absolute top-2 left-2 text-[10px] text-indigo-300 font-bold">{{ 'IG.LivingRoom' | translate }}</span>
                           <span class="absolute bottom-2 right-2 text-xs text-white font-mono">€2.2k</span>
                       </div>
                       <div class="flex flex-col h-full gap-1" style="width: 30%">
                           <!-- Kitchen -->
                           <div class="h-[60%] bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors relative" title="{{ \'INVENTORY_.Kitchen1500\' | translate }}">
                                <span class="absolute top-2 left-2 text-[10px] text-emerald-300 font-bold">{{ 'IG.Kitchen' | translate }}</span>
                           </div>
                           <!-- Bedroom -->
                           <div class="h-[40%] bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 transition-colors relative" title="{{ \'INVENTORY_.Bedroom900\' | translate }}">
                                <span class="absolute top-2 left-2 text-[10px] text-amber-300 font-bold">{{ 'IG.Bedroom' | translate }}</span>
                           </div>
                       </div>
                       <!-- Others -->
                       <div class="h-full bg-slate-700/30 border border-slate-600/50 flex items-center justify-center text-slate-500 text-[10px]" style="width: 25%">{{ 'INVENTORY_.Others' | translate }}</div>
                   </div>
               </div>

               <!-- Visual Inventory Grid -->
               <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-hidden">
                   <h3 class="text-white font-bold text-sm mb-4">{{ 'INVENTORY_.AssetGallery' | translate }}</h3>
                   <div class="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2">
                       @for (asset of assets(); track asset.id) {
                           <div class="bg-black/40 rounded-lg border border-white/5 overflow-hidden group relative">
                               <!-- Image Placeholder -->
                               <div class="h-32 w-full bg-slate-700 flex items-center justify-center text-4xl select-none">
                                    {{ getIconForAsset(asset) }}
                               </div>
                               
                               <!-- AI Tags Overlay -->
                               @if (isTier3() && asset.aiConfidence) {
                                   <div class="absolute top-2 right-2 bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                       {{ asset.aiConfidence }}% Match
                                   </div>
                               }

                               <div class="p-3">
                                   <div class="flex justify-between items-start">
                                       <div>
                                           <div class="text-white text-xs font-bold">{{ asset.name }}</div>
                                           <div class="text-slate-500 text-[10px] uppercase">{{ asset.room }}</div>
                                       </div>
                                       <div class="text-emerald-400 font-mono text-xs">€{{ asset.value }}</div>
                                   </div>
                                   
                                   @if (isTier2OrAbove() && asset.warrantyExp) {
                                       <div class="mt-2 pt-2 border-t border-white/5 flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="isWarrantyValid(asset.warrantyExp)" [class.bg-red-500]="!isWarrantyValid(asset.warrantyExp)"></span>
                                            <span class="text-[10px] text-slate-400">War: {{ asset.warrantyExp }}</span>
                                       </div>
                                   }
                               </div>
                           </div>
                       }
                       <!-- Add New (Empty) -->
                       <div class="h-full min-h-[150px] border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-white/30 cursor-pointer transition-colors" data-debug-id="add-asset-btn">
                           <span class="text-2xl mb-2">+</span>
                           <span class="text-xs">{{ 'INVENTORY_.AddItem' | translate }}</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class InventoryGeneratorComponent {
    translate = inject(TranslationService);
    session = inject(SessionStore);

    tier = computed(() => {
        const plan = this.session.userProfile()?.plan || 'TIER_0';
        return plan === 'Freemium' ? 'TIER_0' : plan;
    });

    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'TIER_3');

    assets = signal<Asset[]>([
        { id: '1', name: this.translate.instant('INVEGENE.Title'), room: 'LIVING ROOM', value: 450, warrantyExp: '2026-12-01', aiConfidence: 98 },
        { id: '2', name: 'Samsung 55" 4K', room: 'LIVING ROOM', value: 600, warrantyExp: '2025-06-15', aiConfidence: 99 },
        { id: '3', name: 'Nespresso Inissia', room: 'KITCHEN', value: 99, warrantyExp: '2024-01-20', aiConfidence: 95 },
        { id: '4', name: 'Oak Bed Frame', room: 'BEDROOM', value: 300, aiConfidence: 85 },
        { id: '5', name: 'Memory Foam Mattress', room: 'BEDROOM', value: 450, warrantyExp: '2030-01-01', aiConfidence: 92 },
    ]);

    runAiScan() {
        if (!this.isTier3()) return;
        // Mock Scan Effect
        alert("AI Scan Simulation: Analyzing room topology... Detected assets added.");
    }

    getIconForAsset(asset: Asset): string {
        if (asset.name.includes('Sofa')) return '🛋️';
        if (asset.name.includes('TV')) return '📺';
        if (asset.name.includes('Machine')) return '☕';
        if (asset.name.includes('Bed') || asset.name.includes('Mattress')) return '🛏️';
        return '📦';
    }

    isWarrantyValid(dateStr?: string): boolean {
        if (!dateStr) return false;
        return new Date(dateStr) > new Date();
    }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'exp-02-inventory',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-pink-600/10 text-pink-400 rounded-lg border border-pink-600/30 text-xs font-mono">
           👁️ Vision AI
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
               <h3 class="text-white font-bold mb-6">Room Inventory</h3>
               
               <div class="space-y-2">
                   <div class="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
                       <div class="text-sm text-white">Sofa (IKEA Friheten)</div>
                       <div class="text-xs text-emerald-400 font-mono">€450</div>
                   </div>
                   <div class="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
                       <div class="text-sm text-white">TV Samsung 554k</div>
                       <div class="text-xs text-emerald-400 font-mono">€600</div>
                   </div>
                    <div class="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
                       <div class="text-sm text-white">Nespresso Machine</div>
                       <div class="text-xs text-emerald-400 font-mono">€99</div>
                   </div>
               </div>

               <div class="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
                   <span class="text-slate-400 text-sm">Total Valuation</span>
                   <span class="text-2xl font-mono text-white">€1,149</span>
               </div>
           </div>

           <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <!-- Mock Camera UI -->
                <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                <div class="absolute inset-0 bg-slate-900/80"></div>
                
                <div class="relative z-10">
                    <div class="h-20 w-20 border-2 border-white rounded-full flex items-center justify-center mb-6 mx-auto cursor-pointer hover:scale-110 transition-transform bg-white/10 backdrop-blur"
                         data-debug-id="inventory-ai-scan-btn">
                        <span class="material-icons text-4xl text-white">camera</span>
                    </div>
                    <h3 class="text-white font-bold mb-2">AI Scan</h3>
                    <p class="text-slate-400 text-sm max-w-xs mb-4">Take a 360° photo of the room. AI will detect items and estimate their value.</p>
                    
                    @if (tier() !== 'TIER_3') {
                        <div class="inline-block bg-black/50 px-3 py-1 rounded-full border border-white/20 text-[10px] text-white backdrop-blur"
                             data-debug-id="inventory-tier3-upgrade-cta">
                            <span class="text-yellow-400">★</span> Upgrade to Tier 3
                        </div>
                    } @else {
                        <div class="flex gap-2 justify-center">
                            <span class="px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white">YOLOv8 Active</span>
                        </div>
                    }

                    <!-- Coach Tip -->
                    <div class="mt-4 max-w-xs mx-auto text-left p-3 bg-pink-900/40 border-l-2 border-pink-500 rounded-r">
                        <div class="text-pink-300 font-bold text-[10px] uppercase mb-1">💡 Coach Tip</div>
                        <p class="text-slate-300 text-[10px] italic leading-tight">
                            "Trust but Verify. Video evidence of the property condition *before* check-in is your only real defense against false damage claims."
                        </p>
                    </div>
                </div>
                
                <!-- Bounding Box Animation -->
                @if (tier() === 'TIER_3') {
                     <div class="absolute top-[20%] left-[20%] w-[20%] h-[30%] border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div class="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] font-bold px-1">Sofa 99%</div>
                     </div>
                }
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class InventoryGeneratorComponent {
    feature = computed(() => ({
        id: 'EXP_02',
        name: 'Inventory Generator',
        description: 'Computer Vision Inventory Agent',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-02-zweckentfremdung',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">German Housing Ban Analyzer</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Zweckentfremdungsverbot Compliance. Avoid fines up to €500,000.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-rose-500/20 text-rose-300 border-rose-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Permit Wizard' : (isTier2() ? 'Risk Calculator' : 'Ban Info') }}
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
           <!-- Form & Analyzer -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
                <h3 class="text-xl font-bold text-white mb-6">Misuse Ban Analyzer (Berlin/Munich)</h3>
                <div class="space-y-4 flex-1">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">City</label>
                         <select class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white" data-debug-id="zweck-city-select">
                             <option>Berlin</option>
                             <option>Munich</option>
                             <option>Hamburg</option>
                             <option>Frankfurt</option>
                         </select>
                    </div>
                     <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Usage Type</label>
                         <div class="flex flex-col gap-2">
                             <label class="flex items-center gap-3 bg-white/5 p-3 rounded cursor-pointer border border-white/5 hover:border-indigo-500 transition-colors">
                                 <input type="radio" name="usage" class="bg-slate-700 border-none text-indigo-500 focus:ring-0" data-debug-id="zweck-usage-primary">
                                 <div>
                                     <div class="text-white font-bold text-sm">Primary Residence (< 50%)</div>
                                     <div class="text-xs text-slate-500">I live here most of the year</div>
                                 </div>
                             </label>
                             <label class="flex items-center gap-3 bg-white/5 p-3 rounded cursor-pointer border border-white/5 hover:border-indigo-500 transition-colors">
                                 <input type="radio" name="usage" class="bg-slate-700 border-none text-indigo-500 focus:ring-0" data-debug-id="zweck-usage-commercial">
                                 <div>
                                     <div class="text-white font-bold text-sm">Commercial / Second Home</div>
                                     <div class="text-xs text-slate-500">Pure investment property</div>
                                 </div>
                             </label>
                         </div>
                    </div>
                    
                    @if (!isTier3()) {
                         <button class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 mt-4" data-debug-id="zweck-check-btn">
                             Calculate Fine Probability
                         </button>
                    }
                </div>
                
                @if (isTier3()) {
                    <div class="mt-6 pt-6 border-t border-white/10">
                        <h4 class="text-white font-bold mb-2 flex items-center gap-2">
                            <span class="material-icons text-amber-500">warning</span> 
                            License Application Wizard
                        </h4>
                        <p class="text-xs text-slate-400 mb-4">We will generate the "Antrag auf Genehmigung" for your local Bezirksamt.</p>
                        
                        <div class="space-y-2">
                             <div class="flex items-center gap-2 text-xs text-slate-300">
                                 <span class="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">1</span>
                                 Property Deeds Uploaded
                             </div>
                             <div class="flex items-center gap-2 text-xs text-slate-300">
                                 <span class="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">2</span>
                                 Self-Declaration Form
                             </div>
                             <div class="flex items-center gap-2 text-xs text-slate-500">
                                 <span class="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px]">3</span>
                                 Submit to Administration
                             </div>
                        </div>

                        <button class="w-full mt-4 py-2 bg-[#D4AF37] hover:bg-amber-500 text-black text-xs font-bold rounded flex items-center justify-center gap-2 shadow-lg transition-all" data-debug-id="zweck-generate-permit-btn">
                             <span>📄</span> Generate Official Permit PDF
                        </button>
                    </div>
                }
           </div>

           <!-- Map / Result / Thermometer -->
           <div class="flex flex-col gap-6">
               <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden flex-1">
                    <!-- Mock Map Background -->
                    <div class="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg')] bg-cover bg-center grayscale"></div>
                    
                    <div class="relative z-10 w-full max-w-sm">
                        <!-- VISUAL: Fine Thermometer -->
                        <div class="bg-slate-800/90 backdrop-blur p-6 rounded-xl border border-rose-500/30">
                            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Fine Risk Exposure</h3>
                            
                            <div class="relative h-4 bg-slate-700 rounded-full mb-2 overflow-hidden">
                                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-600 w-full"></div>
                                <!-- Marker -->
                                <div class="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transform translate-x-32 transition-transform duration-1000" 
                                     [style.left.%]="isTier2() ? 85 : 5"></div>
                            </div>
                            
                            <div class="flex justify-between text-[10px] text-slate-500 font-mono mb-6">
                                <span>€0</span>
                                <span>€50,000</span>
                                <span>€500,000</span>
                            </div>

                            @if (isTier2()) {
                                <div class="text-3xl font-black text-white mb-1">€50,000</div>
                                <div class="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded border border-rose-500/30 inline-block font-bold">HIGH RISK</div>
                                <p class="text-xs text-slate-400 mt-4 text-left">
                                    Your profile matches "Commercial Misuse". Without a permit number, fines in Berlin start at €50k per unit.
                                </p>
                            } @else {
                                <div class="text-3xl font-black text-slate-600 blur-sm select-none">€??,???</div>
                                <p class="text-xs text-slate-400 mt-4">
                                    Don't guess. Calculate your exact fine exposure based on sq/m and city precinct.
                                </p>
                                <button class="mt-2 text-indigo-400 text-xs font-bold hover:underline" data-debug-id="zweck-upgrade-link">Unlock Calculator</button>
                            }
                        </div>
                    </div>
               </div>
               
               <!-- Coach -->
               <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                   <div class="flex items-start gap-3">
                      <span class="text-xl">⚖️</span>
                      <div>
                          <h4 class="font-bold text-indigo-300 text-sm">Amnesty Periods</h4>
                          <p class="text-xs text-indigo-200/80 mt-1">Some cities offer a grace period to declare existing rentals without penalty. Use our Wizard to check if you qualify for amnesty.</p>
                      </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ZweckentfremdungComponent {
    feature = computed(() => ({
        id: 'LEG_02',
        name: 'Zweckentfremdungsverbot',
        description: 'German Anti-Misuse Ban Analyzer',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

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
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-rose-500/10 text-rose-300 rounded-lg border border-rose-500/30 text-xs font-mono">
           🇩🇪 German Compliance
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
           <!-- Form -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                <h3 class="text-xl font-bold text-white mb-6">Misuse Ban Analyzer (Berlin/Munich)</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">City</label>
                         <select class="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white">
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
                                 <input type="radio" name="usage" class="bg-slate-700 border-none text-indigo-500 focus:ring-0">
                                 <div>
                                     <div class="text-white font-bold text-sm">Primary Residence (< 50%)</div>
                                     <div class="text-xs text-slate-500">I live here most of the year</div>
                                 </div>
                             </label>
                             <label class="flex items-center gap-3 bg-white/5 p-3 rounded cursor-pointer border border-white/5 hover:border-indigo-500 transition-colors">
                                 <input type="radio" name="usage" class="bg-slate-700 border-none text-indigo-500 focus:ring-0">
                                 <div>
                                     <div class="text-white font-bold text-sm">Commercial / Second Home</div>
                                     <div class="text-xs text-slate-500">Pure investment property</div>
                                 </div>
                             </label>
                         </div>
                    </div>
                    
                    <button class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20">
                        Check Permissions
                    </button>
                    
                    @if (tier() === 'TIER_3') {
                        <div class="pt-4 border-t border-white/10 mt-4">
                            <h4 class="text-indigo-400 text-xs font-bold uppercase mb-2">AI Drafting Assistant</h4>
                            <p class="text-xs text-slate-400 mb-3">Generate a compliant "Antrag auf Genehmigung" (Permit Application).</p>
                             <button class="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded flex items-center justify-center gap-2">
                                 <span class="material-icons text-sm">description</span> Draft Permit (PDF)
                             </button>
                        </div>
                    }
                </div>
           </div>

           <!-- Map / Result -->
           <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <!-- Mock Map Background -->
                <div class="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg')] bg-cover bg-center grayscale"></div>
                
                <div class="relative z-10 bg-slate-800/90 backdrop-blur p-6 rounded-xl border border-rose-500/30 max-w-sm">
                    <div class="h-12 w-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
                        <span class="material-icons">gavel</span>
                    </div>
                    <h3 class="text-white font-bold text-lg mb-2">Restricted Zone Detected</h3>
                    <p class="text-slate-400 text-sm mb-4">"Mitte" has a strict ban on commercial short-term rentals without a permit number.</p>
                    <div class="bg-rose-900/30 border border-rose-500/20 p-3 rounded text-rose-300 text-xs font-mono">
                        Registration Number Required: Yes<br>
                        Max Days/Year: 90
                    </div>
                </div>
           </div>
       </div>
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
           <div class="flex items-start gap-3">
              <span class="text-xl">⚖️</span>
              <div>
                  <h4 class="font-bold text-indigo-300 text-sm">Amnesty Periods</h4>
                  <p class="text-xs text-indigo-200/80 mt-1">Some cities offer a grace period to declare existing rentals without penalty. Use this tool to check if you qualify for amnesty.</p>
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
}

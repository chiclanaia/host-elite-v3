import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-00-compliance-checker',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
            🛡️ Legal Sentinel
        </div>
      </div>

      <!-- Tier 0: Static Database -->
      @if (tier() === 'TIER_0' || tier() === 'Freemium') {
         <div class="p-6 bg-slate-800 rounded-xl border border-white/10">
            <h3 class="text-xl font-bold text-white mb-4">Global Regulations Database</h3>
            <p class="text-slate-400 mb-4">Access our curated database of short-term rental laws.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer" data-debug-id="compliance-card-paris">
                  <h4 class="text-white font-bold">🇫🇷 Paris</h4>
                  <p class="text-xs text-slate-500 mt-1">120-day limit, Registration mandatory</p>
               </div>
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer" data-debug-id="compliance-card-london">
                  <h4 class="text-white font-bold">🇬🇧 London</h4>
                  <p class="text-xs text-slate-500 mt-1">90-day cap per year</p>
               </div>
               <div class="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/50 cursor-pointer" data-debug-id="compliance-card-barcelona">
                  <h4 class="text-white font-bold">🇪🇸 Barcelona</h4>
                  <p class="text-xs text-slate-500 mt-1">Strict licensing moratorium</p>
               </div>
            </div>
            <div class="mt-6 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-lg">
                <p class="text-indigo-200 text-sm">💡 <strong>Moratoriums:</strong> Many cities now have "freezes" on new licenses. Check if your zone is affected before buying.</p>
            </div>
         </div>
      }

      <!-- Tier 1/2: Manual Address Audit -->
      @if (tier() === 'TIER_1' || tier() === 'TIER_2') {
         <div class="p-6 bg-slate-800 rounded-xl border border-white/10">
            <h3 class="text-xl font-bold text-white mb-4">Address Compliance Audit</h3>
            <div class="flex gap-4 mb-6">
                <input type="text" placeholder="Enter Property Address..." class="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" data-debug-id="compliance-address-input">
                <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors" data-debug-id="compliance-check-btn">Check Legality</button>
            </div>
            
            <!-- Mock Result -->
            <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-4">
                <div class="text-2xl">✅</div>
                <div>
                    <h4 class="text-emerald-400 font-bold">Zone Approved for Short-Term Rental</h4>
                    <p class="text-slate-400 text-sm mt-1">Based on local zoning laws. Registration number required.</p>
                </div>
            </div>
         </div>
      }

      <!-- Tier 3: Sentinel -->
      @if (tier() === 'TIER_3') {
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
             <div class="p-6 bg-slate-800/50 rounded-xl border border-white/10 relative overflow-hidden">
                 <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl">📡</div>
                 <h3 class="text-xl font-bold text-white mb-2">Legislative Watch</h3>
                 <p class="text-sm text-slate-400 mb-6">Real-time monitoring of municipal gazettes.</p>
                 
                 <div class="space-y-4">
                     <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-emerald-500">
                         <div>
                             <p class="text-white text-sm font-bold">No New Decrees</p>
                             <p class="text-xs text-slate-500">Last scan: 10 mins ago</p>
                         </div>
                         <div class="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                     </div>
                 </div>
             </div>
             
             <div class="p-6 bg-slate-800/50 rounded-xl border border-white/10">
                 <h3 class="text-xl font-bold text-white mb-2">Moratorium Radar</h3>
                 <p class="text-sm text-slate-400 mb-4">Risk assessment for future restrictions.</p>
                 <div class="w-full h-32 bg-indigo-900/20 rounded-lg flex items-center justify-center border border-white/5">
                     <span class="text-slate-500 text-xs">[Geo-Spatial Risk Map Placeholder]</span>
                 </div>
             </div>
         </div>
      }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ComplianceCheckerComponent {
    feature = computed(() => {
        // Mock feature data if input not provided yet (for standalone dev)
        return {
            id: 'LEG_00',
            name: 'Compliance Checker',
            description: 'Zoning & Regulatory Sentinel',
            behavior_matrix: 'TIER_0: Generic DB. TIER_3: Sentinel.'
        } as any;
    }); // input.required<Feature>(); // Relaxed for scaffold

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

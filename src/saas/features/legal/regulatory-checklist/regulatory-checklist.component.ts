import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-01-regulatory-checklist',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Feature Header -->
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3">
              <h1 class="text-3xl font-extrabold text-white tracking-tight">Regulatory Compliance Vault</h1>
              @if (isTier3()) {
                  <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20">
                      Audit Proof
                  </span>
              }
          </div>
          <p class="text-slate-400 mt-2 max-w-2xl">Never fail an inspection. Store, track, and auto-renew all mandatory permits.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'AI Document Vault' : (isTier2() ? 'Regional Rules Engine' : 'Manual Checklist') }}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         <!-- Document List -->
         <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6 overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-white">Mandatory Documents</h3>
                @if (isTier3()) {
                    <button class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-indigo-500/25" data-debug-id="regulatory-bulk-scan-btn">
                        <span class="material-icons text-sm">filter_center_focus</span>
                        AI Bulk Scan
                    </button>
                }
            </div>
            
            <div class="space-y-4">
                @for (doc of documents(); track doc.id) {
                    <div class="p-4 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group" 
                         [class.border-l-4]="isTier3()"
                         [class.border-l-[#D4AF37]]="isTier3() && doc.status === 'valid'"
                         [class.border-l-rose-500]="isTier3() && doc.status === 'missing'"
                         [attr.data-debug-id]="'regulatory-doc-item-' + doc.id">
                         
                        <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-full flex items-center justify-center transition-all" 
                                [class.bg-emerald-500_20]="doc.status === 'valid'"
                                [class.text-emerald-400]="doc.status === 'valid'"
                                [class.bg-rose-500_20]="doc.status === 'missing'"
                                [class.text-rose-400]="doc.status === 'missing'"
                                [class.group-hover:scale-110]="isTier3()">
                                <span class="material-icons text-xl">{{ doc.status === 'valid' ? 'check_circle' : 'error_outline' }}</span>
                             </div>
                             <div>
                                 <h4 class="text-white font-bold flex items-center gap-2">
                                     {{ doc.name }}
                                     @if(isTier3() && doc.aiVerified) {
                                         <span class="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Verified by AI">AI VALIDATED</span>
                                     }
                                 </h4>
                                 <p class="text-xs text-slate-400">{{ doc.description }}</p>
                             </div>
                        </div>
                        
                        @if (isTier3()) {
                            <div class="flex flex-col items-end gap-2">
                                @if(doc.expiry) {
                                    <div class="text-xs font-mono text-slate-500 flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                                        <span>Expires: {{ doc.expiry }}</span>
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    </div>
                                    <label class="flex items-center gap-2 cursor-pointer group/toggle">
                                        <span class="text-[10px] uppercase font-bold text-slate-500 group-hover/toggle:text-slate-300 transition-colors">Auto-Renew</span>
                                        <div class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked class="sr-only peer">
                                            <div class="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                        </div>
                                    </label>
                                } @else {
                                    <button class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1" [attr.data-debug-id]="'regulatory-upload-' + doc.id">
                                        <span class="text-xs">📤</span> Upload
                                    </button>
                                }
                            </div>
                        } @else {
                             @if (isTier2()) {
                                 <div class="text-[10px] text-slate-400 font-mono px-2 py-1 bg-white/5 rounded">Mandatory in {{ region() }}</div>
                             }
                             <div class="flex items-center">
                                <span class="mr-3 text-xs text-slate-500 font-mono hidden md:block">Manual Check</span>
                                <input type="checkbox" [checked]="doc.status === 'valid'" class="h-5 w-5 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-0 cursor-pointer">
                             </div>
                        }
                    </div>
                }
            </div>
         </div>

         <!-- Sidebar / Tips -->
         <div class="space-y-6">
            <!-- VISUAL: Compliance Shield Score -->
            <div class="p-6 bg-slate-800/80 rounded-xl border border-white/10 relative overflow-hidden flex flex-col items-center">
                <div class="relative w-32 h-32 mb-4 flex items-center justify-center">
                     <!-- Outer Ring -->
                     <svg class="w-full h-full transform -rotate-90">
                         <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="transparent" class="text-slate-700" />
                         <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="transparent" 
                                 [class]="isTier3() ? 'text-[#D4AF37]' : (isTier2() ? 'text-indigo-500' : 'text-slate-500')"
                                 stroke-dasharray="351.8" 
                                 [attr.stroke-dashoffset]="isTier3() ? '10' : '200'"
                                 stroke-linecap="round" />
                     </svg>
                     <!-- Shield Icon -->
                     <div class="absolute inset-0 flex items-center justify-center">
                         <span class="text-4xl">🛡️</span>
                     </div>
                </div>
                
                <h3 class="text-2xl font-black text-white mb-1">{{ isTier3() ? '98%' : '33%' }}</h3>
                <p class="text-xs text-slate-400 uppercase tracking-widest font-bold">Audit Ready</p>

                @if(!isTier3()) {
                    <div class="mt-4 w-full p-3 bg-amber-500/10 border border-amber-500/30 rounded text-center">
                        <p class="text-[10px] text-amber-200">⚠️ Risk of fine: High</p>
                    </div>
                }
            </div>

            @if (!isTier3()) {
                <div class="p-4 bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-white/10 rounded-lg">
                    <h4 class="text-white font-bold text-sm mb-2">Unlock Smart Rules</h4>
                    <p class="text-slate-400 text-xs mb-3">Don't rely on generic lists. Get rules specific to your city (Paris, London, NYC).</p>
                    <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg transition-all" data-debug-id="regulatory-upgrade-link">
                        Upgrade to Silver
                    </button>
                </div>
            } @else {
                 <!-- Gold Only Widget -->
                 <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <h4 class="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                        <span class="animate-pulse">●</span> Active Monitoring
                    </h4>
                    <ul class="space-y-2">
                        <li class="flex items-center justify-between text-xs text-slate-300">
                            <span>Jurisdiction Rules</span>
                            <span class="text-emerald-400 font-bold">Paris (Updated)</span>
                        </li>
                        <li class="flex items-center justify-between text-xs text-slate-300">
                            <span>Next Audit</span>
                            <span class="text-white">3 Days</span>
                        </li>
                    </ul>
                 </div>
            }
            
            <!-- Coach -->
            <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-6">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">📊</span>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm">The 4% Rule</h4>
                        <p class="text-xs text-indigo-200/80 mt-1">In regulated zones (Paris, NYC), audits happen to ~4% of listings annually. If your "Audit Ready" score is below 100%, you are gambling with your license.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class RegulatoryChecklistComponent {
    feature = computed(() => ({
        id: 'LEG_01',
        name: 'Regulatory Checklist',
        description: 'Adaptive Compliance Workflow',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    region = signal('Paris'); // Mock region for Tier 2

    documents = signal<{ id: number, name: string, description: string, status: string, expiry?: string | null, aiVerified?: boolean }[]>([
        { id: 1, name: 'ID Card / Passport', description: 'Proof of identity for host registration.', status: 'valid', expiry: '2028-01-01', aiVerified: true },
        { id: 2, name: 'Property Insurance', description: 'PNO (Propriétaire Non Occupant) coverage.', status: 'missing', expiry: null },
        { id: 3, name: 'Safety Certificate', description: 'Gas/Elec safety inspection report.', status: 'missing', expiry: null }
    ]);
}

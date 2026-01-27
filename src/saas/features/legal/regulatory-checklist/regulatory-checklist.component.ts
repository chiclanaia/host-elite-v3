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
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
            📋 Audit Ready
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         <!-- Document List -->
         <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6 overflow-y-auto">
            <h3 class="text-xl font-bold text-white mb-6">Mandatory Documents</h3>
            
            <div class="space-y-4">
                @for (doc of documents(); track doc.id) {
                    <div class="p-4 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors" [attr.data-debug-id]="'regulatory-doc-item-' + doc.id">
                        <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                                [class.bg-emerald-500_20]="doc.status === 'valid'"
                                [class.text-emerald-400]="doc.status === 'valid'"
                                [class.bg-rose-500_20]="doc.status === 'missing'"
                                [class.text-rose-400]="doc.status === 'missing'">
                                <span class="material-icons text-xl">{{ doc.status === 'valid' ? 'check' : 'warning' }}</span>
                             </div>
                             <div>
                                 <h4 class="text-white font-bold">{{ doc.name }}</h4>
                                 <p class="text-xs text-slate-400">{{ doc.description }}</p>
                             </div>
                        </div>
                        
                        @if (tier() === 'TIER_3') {
                            <div class="flex flex-col items-end">
                                <span class="text-xs font-mono text-slate-500">Expires: {{ doc.expiry || 'N/A' }}</span>
                                <span class="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 mt-1 cursor-pointer hover:bg-indigo-600" [attr.data-debug-id]="'regulatory-doc-update-' + doc.id">Update</span>
                            </div>
                        } @else {
                             <div class="flex items-center">
                                <input type="checkbox" [checked]="doc.status === 'valid'" class="h-5 w-5 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-0">
                             </div>
                        }
                    </div>
                }
            </div>
         </div>

         <!-- Sidebar / Tips -->
         <div class="space-y-6">
            <div class="p-6 bg-slate-800/80 rounded-xl border border-white/10">
                <h3 class="text-lg font-bold text-white mb-4">Compliance Score</h3>
                <div class="relative pt-1">
                  <div class="flex mb-2 items-center justify-between">
                    <div>
                      <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-200 bg-indigo-600/30">
                        In Progress
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs font-semibold inline-block text-indigo-200">
                        33%
                      </span>
                    </div>
                  </div>
                  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200/20">
                    <div style="width:33%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                  </div>
                </div>
            </div>

            @if (tier() === 'TIER_0') {
                <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p class="text-amber-200 text-sm">Download the static PDF checklist to track this manually.</p>
                    <button class="mt-3 w-full py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-100 text-xs font-bold rounded border border-amber-500/50" data-debug-id="regulatory-download-pdf-btn">Download PDF</button>
                </div>
            }
            
            <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-6">
                 <div class="flex items-start gap-3">
                    <span class="text-xl">🛡️</span>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm">Public Liability Insurance</h4>
                        <p class="text-xs text-indigo-200/80 mt-1">Standard home insurance does NOT cover paying guests. Ensure you have 'Public Liability' (Responsabilité Civile Pro) to protect against accidents.</p>
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

  documents = signal([
    { id: 1, name: 'ID Card / Passport', description: 'Proof of identity for host registration.', status: 'valid', expiry: '2028-01-01' },
    { id: 2, name: 'Property Insurance', description: 'PNO (Propriétaire Non Occupant) coverage.', status: 'missing', expiry: null },
    { id: 3, name: 'Safety Certificate', description: 'Gas/Elec safety inspection report.', status: 'missing', expiry: null }
  ]);
}

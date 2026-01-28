import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'leg-08-foreign-id',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Traveler Identity Vault</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">Securely collect and transmit mandatory guest data to authorities.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'Auto-Sync Active' : (isTier2() ? 'OCR Scanner On' : 'Manual Entry') }}
        </div>
      </div>

       <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
           <!-- Form / Scanner -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">Guest Registration</h3>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10">Manual</button>
                        <button class="px-3 py-1 rounded bg-indigo-600 text-xs text-white font-bold shadow-lg" data-debug-id="fid-scan-mode-btn">Scan ID</button>
                    </div>
                </div>

                <!-- Simulation Scanner -->
                <div class="bg-black/50 rounded-lg border border-white/10 aspect-video relative overflow-hidden mb-6 flex items-center justify-center group cursor-pointer">
                    <div class="absolute inset-0 bg-[url('/assets/scan-grid.svg')] opacity-20"></div>
                    
                    @if(isTier2()) {
                        <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500"></div>
                        <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500"></div>
                        <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500"></div>
                        <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500"></div>
                        <div class="absolute inset-0 bg-indigo-500/10 animate-pulse hidden group-hover:block"></div>
                        
                        <div class="text-center z-10">
                            <span class="material-icons text-4xl text-indigo-400 mb-2">document_scanner</span>
                            <div class="text-sm font-bold text-indigo-200">Drop Passport Here</div>
                            <div class="text-xs text-indigo-400/60 mt-1">OCR Analysis Ready</div>
                        </div>
                    } @else {
                        <div class="text-center z-10 opacity-50">
                            <span class="material-icons text-4xl text-slate-500 mb-2">lock</span>
                            <div class="text-sm font-bold text-slate-400">Scanner Locked</div>
                            <div class="text-xs text-slate-600 mt-1">Upgrade to Silver to auto-fill</div>
                        </div>
                    }
                </div>
                
                <div class="space-y-4">
                     <div class="grid grid-cols-2 gap-4">
                         <div>
                             <label class="block text-slate-400 text-xs uppercase font-bold mb-1">First Name</label>
                             <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="John" data-debug-id="fid-fname">
                         </div>
                         <div>
                             <label class="block text-slate-400 text-xs uppercase font-bold mb-1">Last Name</label>
                             <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="Doe" data-debug-id="fid-lname">
                         </div>
                     </div>
                     <div>
                         <label class="block text-slate-400 text-xs uppercase font-bold mb-1">Passport Number</label>
                         <input type="text" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="AB123456" data-debug-id="fid-passport">
                     </div>
                </div>
           </div>
           
           <!-- Sync Status & Coach -->
           <div class="flex flex-col gap-6">
               <div class="flex-1 bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                   
                   @if (isTier3()) {
                       <div class="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 relative">
                           <div class="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping"></div>
                           <span class="material-icons text-4xl text-emerald-400">cloud_sync</span>
                       </div>
                       <h3 class="text-white font-bold text-lg mb-2">Automated Police Filing</h3>
                       <p class="text-slate-400 text-xs max-w-xs mb-6">connected to <span class="text-emerald-400 font-mono">POLICIA_V1_API</span></p>
                       
                       <div class="w-full max-w-xs bg-black/50 rounded-lg p-3 space-y-2">
                           <div class="flex justify-between text-[10px] text-slate-400">
                               <span>Last Sync</span>
                               <span class="text-slate-300">Today, 09:41 AM</span>
                           </div>
                           <div class="flex justify-between text-[10px] text-slate-400">
                               <span>Fiches Sent</span>
                               <span class="text-emerald-400">12 Pending</span>
                           </div>
                       </div>
                   } @else {
                       <div class="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 grayscale opacity-50">
                           <span class="material-icons text-4xl text-slate-500">cloud_off</span>
                       </div>
                       <h3 class="text-slate-300 font-bold text-lg mb-2">Manual Filing Required</h3>
                       <p class="text-slate-500 text-xs max-w-xs">You must physically go to the police station or use their clunky website within 24h.</p>
                       <button class="mt-6 px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                           Enable Auto-Sync
                       </button>
                   }
               </div>

                <!-- Coach -->
                <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                     <div class="flex items-start gap-3">
                        <span class="text-xl">👮</span>
                        <div>
                            <h4 class="font-bold text-indigo-300 text-sm">Strict 24h Deadline</h4>
                            <p class="text-xs text-indigo-200/80 mt-1">In Spain & Italy, you MUST send guest data to the police within 24 hours of arrival. Heavy fines apply for delays.</p>
                        </div>
                    </div>
                </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ForeignIdComponent {
    feature = computed(() => ({
        id: 'LEG_08',
        name: 'Foreign ID Assistant',
        description: 'International Admin Onboarding Agent',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2 = computed(() => this.tier() === 'Silver' || this.tier() === 'TIER_2' || this.tier() === 'Gold' || this.tier() === 'TIER_3');
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');
}

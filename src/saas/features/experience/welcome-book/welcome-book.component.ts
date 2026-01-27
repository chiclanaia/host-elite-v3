import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'exp-03-welcome-book',
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
           📖 Guest Portal
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
           <!-- Editor / Config -->
           <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
               <div class="flex justify-between items-center mb-6">
                   <h3 class="text-xl font-bold text-white">Content Builder</h3>
                   <div class="flex gap-2">
                       <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded" data-debug-id="welcome-btn-wifi">Wifi</button>
                       <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded" data-debug-id="welcome-btn-checkin">Check-in</button>
                       <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded" data-debug-id="welcome-btn-tips">Local Tips</button>
                   </div>
               </div>

               <!-- Coach Tip -->
               <div class="mb-4 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="text-lg">💡</span>
                       <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                   </div>
                   <p class="text-slate-300 text-xs italic">
                       "Video > Text. Guests don't read manuals. A 30s video showing how to unlock the door or use the weird coffee maker works wonders."
                   </p>
               </div>

               <div class="flex-1 space-y-4 overflow-y-auto">
                   <!-- Wifi Card -->
                   <div class="p-4 bg-white/5 rounded-lg border border-white/5 group relative">
                       <div class="flex items-start gap-4">
                           <div class="w-12 h-12 rounded bg-indigo-600 text-white flex items-center justify-center">
                               <span class="material-icons">wifi</span>
                           </div>
                           <div class="flex-1">
                               <h4 class="text-white font-bold text-lg">Wifi Access</h4>
                               <p class="text-slate-400 mt-1">Network: <span class="bg-black/30 px-2 rounded text-indigo-300 font-mono">Sunset_Guest</span></p>
                               <p class="text-slate-400">Password: <span class="bg-black/30 px-2 rounded text-indigo-300 font-mono">Welcome2026!</span></p>
                           </div>
                           <button class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white" data-debug-id="welcome-wifi-edit-btn">
                               <span class="material-icons">edit</span>
                           </button>
                       </div>
                   </div>

                   <!-- TIER 3: Upsell -->
                   @if (tier() === 'TIER_3') {
                       <div class="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 border-dashed relative">
                           <div class="absolute top-0 right-0 p-2 text-amber-500/50 text-[10px] font-bold uppercase">Upsell</div>
                           <div class="flex items-center justify-between">
                               <div>
                                   <h4 class="text-amber-200 font-bold">Late Checkout Option</h4>
                                   <p class="text-amber-200/60 text-xs">Guest can buy +2 hours for €25</p>
                               </div>
                               <div class="h-6 w-10 rounded-full bg-emerald-500 cursor-pointer relative" data-debug-id="welcome-upsell-toggle">
                                   <div class="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                               </div>
                           </div>
                       </div>
                   }
               </div>
           </div>

           <!-- Preview -->
           <div class="bg-black rounded-[2rem] border-4 border-slate-800 p-2 shadow-2xl relative flex flex-col max-h-[600px] lg:mt-12">
               <div class="bg-slate-900 flex-1 rounded-[1.5rem] overflow-hidden flex flex-col relative w-full h-full">
                   <!-- Mobile Header -->
                   <div class="h-12 bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                       Sunny Apartment
                   </div>
                   
                   <!-- Mobile Content -->
                   <div class="p-4 space-y-4 overflow-y-auto bg-white flex-1">
                       <div class="p-4 bg-slate-100 rounded-lg">
                           <div class="text-indigo-600 font-bold mb-2">Welcome!</div>
                           <p class="text-xs text-slate-600">We are thrilled to host you. Here is everything you need to know.</p>
                       </div>
                       <button class="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-lg" data-debug-id="welcome-preview-get-wifi">
                           Get Wifi
                       </button>
                       <div class="grid grid-cols-2 gap-2">
                           <div class="aspect-square bg-slate-100 rounded-lg flex items-center justify-center flex-col gap-2 text-slate-500">
                               <span class="material-icons">local_dining</span>
                               <span class="text-[10px]">Eat</span>
                           </div>
                           <div class="aspect-square bg-slate-100 rounded-lg flex items-center justify-center flex-col gap-2 text-slate-500">
                               <span class="material-icons">map</span>
                               <span class="text-[10px]">Map</span>
                           </div>
                       </div>
                   </div>
                   
                   <!-- Overlay -->
                   <div class="absolute inset-0 bg-black/50 hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                       <span class="px-4 py-2 bg-black/80 text-white rounded-full text-xs font-bold backdrop-blur-sm">Mobile Preview</span>
                   </div>
               </div>
               <!-- Notch -->
               <div class="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-xl"></div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class WelcomeBookComponent {
    feature = computed(() => ({
        id: 'EXP_03',
        name: 'Web Welcome Book',
        description: 'Interactive Guest Experience Portal',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

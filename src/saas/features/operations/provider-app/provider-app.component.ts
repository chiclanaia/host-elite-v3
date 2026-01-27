import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'ops-09-provider',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-cyan-600/10 text-cyan-400 rounded-lg border border-cyan-600/30 text-xs font-mono">
           Mobile Terminal
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
           <!-- Mobile Preview -->
           <div class="relative mx-auto border-8 border-slate-900 bg-slate-800 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl overflow-hidden flex flex-col">
               <div class="bg-indigo-600 p-4 text-white text-center font-bold">HouseKeeper App</div>
               
               <div class="flex-1 overflow-y-auto p-4 space-y-4">
                   <!-- Task Card -->
                   <div class="bg-white rounded-lg p-4 shadow-sm">
                       <div class="flex justify-between items-start mb-2">
                           <div class="font-bold text-slate-900">Cleaning</div>
                           <span class="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Urgent</span>
                       </div>
                       <p class="text-slate-500 text-xs mb-3">Apt 4B - Guests arriving 3pm</p>
                       
                       <div class="space-y-2 border-t pt-2">
                           <label class="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" class="rounded border-slate-300 text-indigo-600">
                               <span class="text-xs text-slate-700">Change Linens</span>
                           </label>
                           <label class="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" class="rounded border-slate-300 text-indigo-600">
                               <span class="text-xs text-slate-700">Restock Coffee</span>
                           </label>
                       </div>
                       
                        @if (tier() === 'TIER_3') {
                           <div class="mt-3">
                               <button class="w-full bg-slate-100 text-slate-600 py-2 rounded text-xs font-bold flex items-center justify-center gap-2">
                                   <span class="material-icons text-sm">camera_alt</span> Upload Proof
                               </button>
                           </div>
                       }
                   </div>
               </div>

                <div class="bg-slate-900 p-4 flex justify-around text-slate-500">
                   <span class="material-icons text-indigo-500">list</span>
                   <span class="material-icons">history</span>
                   <span class="material-icons">person</span>
               </div>
           </div>

           <!-- Control Panel -->
           <div class="bg-slate-800 rounded-xl border border-white/10 p-6">
                <h3 class="text-white font-bold mb-6">Provider Management</h3>
                
                <div class="bg-slate-900 rounded p-4 mb-4">
                    <div class="flex justify-between items-center text-sm text-white mb-2">
                        <span>Alice (Cleaner)</span>
                        <span class="text-emerald-400">Online</span>
                    </div>
                    <div class="h-1 bg-slate-700 rounded-full"><div class="w-3/4 bg-emerald-500 h-full rounded-full"></div></div>
                    <p class="text-[10px] text-slate-500 mt-1">Completion Rate: 98%</p>
                </div>

                <div class="p-4 rounded border border-dashed border-slate-600 text-center">
                    <p class="text-slate-400 text-sm mb-2">Send App Invitation</p>
                    <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">Invite via Email</button>
                </div>
           </div>
       </div>
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6 lg:col-span-2">
            <div class="flex items-start gap-3">
               <span class="text-xl">📸</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">Evidence Based Reporting</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">Always require 'After' photos from your team. If a guest claims "it was dirty", you win the dispute instantly with time-stamped proof.</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ProviderAppComponent {
    feature = computed(() => ({
        id: 'OPS_09',
        name: 'Provider App',
        description: 'Field Operations Terminal',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

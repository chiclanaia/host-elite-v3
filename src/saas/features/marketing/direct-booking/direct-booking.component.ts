import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'mkt-03-direct-booking',
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
           🌐 0% Commission
        </div>
      </div>

       <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Config -->
           <div class="lg:col-span-1 bg-slate-800 rounded-xl border border-white/10 p-6">
                @if (tier() === 'TIER_0' || tier() === 'Freemium') {
                    <div class="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mb-6">
                        <p class="text-amber-200 text-sm font-bold">Upgrade to Premium to launch your own booking site.</p>
                    </div>
                }

                <div class="mb-8 text-center">
                    <div class="h-24 w-24 rounded-full bg-white/5 mx-auto flex items-center justify-center border-2 border-dashed border-white/10 cursor-pointer hover:border-indigo-500 transition-colors" data-debug-id="direct-booking-upload-logo">
                        <span class="text-xs text-slate-400">Upload Logo</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Subdomain</label>
                        <div class="flex">
                            <input type="text" placeholder="my-villas" class="bg-black/30 border border-white/10 rounded-l px-3 py-2 text-white w-full" data-debug-id="direct-booking-subdomain-input">
                            <span class="bg-white/5 border border-l-0 border-white/10 rounded-r px-3 py-2 text-slate-500 flex items-center">.hote.io</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-400 text-xs uppercase font-bold mb-2">Brand Color</label>
                        <div class="flex gap-2">
                             <div class="h-8 w-8 rounded-full bg-indigo-600 cursor-pointer ring-2 ring-white" data-debug-id="direct-booking-color-indigo"></div>
                             <div class="h-8 w-8 rounded-full bg-rose-600 cursor-pointer" data-debug-id="direct-booking-color-rose"></div>
                             <div class="h-8 w-8 rounded-full bg-emerald-600 cursor-pointer" data-debug-id="direct-booking-color-emerald"></div>
                        </div>
                    </div>
                    
                    <button class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20" data-debug-id="direct-booking-publish-btn">
                        Publish Site 🚀
                    </button>

                    <!-- Coach Tip -->
                    <div class="mt-6 p-4 bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-lg">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-lg">💡</span>
                            <span class="text-emerald-300 font-bold text-sm uppercase">Coach Tip</span>
                        </div>
                        <p class="text-slate-300 text-xs italic">
                            "Own Your Audience. Create a 'Google My Business' profile for your rental to show up on Maps and drive 0% commission traffic."
                        </p>
                    </div>
                    
                    @if (tier() === 'TIER_3') {
                        <div class="pt-4 border-t border-white/10">
                            <label class="flex items-center gap-2">
                                <span class="material-icons text-brand-secondary text-sm">loyalty</span>
                                <span class="text-white text-sm">Loyalty Program Active</span>
                            </label>
                            <p class="text-xs text-slate-500 mt-1">Returning guests get 5% off automatically.</p>
                        </div>
                    }
                </div>
           </div>

           <!-- Preview -->
           <div class="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
               <!-- Mock Browser Bar -->
               <div class="bg-slate-100 p-2 flex items-center gap-2 border-b border-slate-200">
                   <div class="flex gap-1">
                       <div class="h-3 w-3 rounded-full bg-red-400"></div>
                       <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
                       <div class="h-3 w-3 rounded-full bg-green-400"></div>
                   </div>
                   <div class="flex-1 bg-white rounded-full h-6 flex items-center px-3 text-[10px] text-slate-400 shadow-sm">
                       https://my-villas.hote.io
                   </div>
               </div>

               <!-- Site Preview -->
               <div class="flex-1 relative overflow-y-auto">
                    <!-- Hero -->
                    <div class="h-64 bg-slate-900 relative flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=800&q=80" class="absolute inset-0 w-full h-full object-cover opacity-60">
                        <div class="relative text-center text-white px-8">
                             <h2 class="text-4xl font-playfair font-bold mb-4">Luxury Stays in Paris</h2>
                             <button class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg text-sm font-bold uppercase tracking-widest">Check Availability</button>
                        </div>
                    </div>
                    
                    <!-- Search Bar -->
                    <div class="max-w-3xl mx-auto -mt-8 relative bg-white rounded-lg shadow-xl p-4 flex gap-4 items-center">
                        <div class="flex-1">
                             <label class="text-[10px] text-slate-400 font-bold uppercase">Check-in</label>
                             <div class="text-slate-800 font-bold">Oct 14</div>
                        </div>
                        <div class="w-px h-8 bg-slate-200"></div>
                        <div class="flex-1">
                             <label class="text-[10px] text-slate-400 font-bold uppercase">Check-out</label>
                             <div class="text-slate-800 font-bold">Oct 21</div>
                        </div>
                        <div class="w-px h-8 bg-slate-200"></div>
                         <div class="flex-1">
                             <label class="text-[10px] text-slate-400 font-bold uppercase">Guests</label>
                             <div class="text-slate-800 font-bold">2 Guests</div>
                        </div>
                        <button class="bg-indigo-600 text-white p-3 rounded-lg"><span class="material-icons text-sm">search</span></button>
                    </div>
                    
                    <!-- Results -->
                    <div class="p-8 grid grid-cols-2 gap-4">
                        <div class="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
                             <div class="h-32 bg-slate-200"></div>
                             <div class="p-3">
                                 <h4 class="font-bold text-slate-800">Loft Marais</h4>
                                 <div class="flex justify-between items-end mt-2">
                                     <div class="text-xs text-slate-500">2 beds • Wifi</div>
                                     <div class="text-indigo-600 font-bold">€120<span class="text-xs font-normal text-slate-400">/night</span></div>
                                 </div>
                             </div>
                        </div>
                        <div class="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
                             <div class="h-32 bg-slate-200"></div>
                             <div class="p-3">
                                 <h4 class="font-bold text-slate-800">Studio Bastille</h4>
                                 <div class="flex justify-between items-end mt-2">
                                     <div class="text-xs text-slate-500">1 bed • Balcony</div>
                                     <div class="text-indigo-600 font-bold">€95<span class="text-xs font-normal text-slate-400">/night</span></div>
                                 </div>
                             </div>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class DirectBookingComponent {
    feature = computed(() => ({
        id: 'MKT_03',
        name: 'Direct Booking Site',
        description: 'Commission-Optimized Direct Booking Engine',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

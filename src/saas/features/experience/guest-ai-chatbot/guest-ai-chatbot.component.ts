import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';

@Component({
    selector: 'exp-04-chatbot',
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
           🤖 RAG Bot
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 overflow-hidden flex flex-col lg:flex-row">
            <!-- Chat Area -->
            <div class="flex-1 flex flex-col border-r border-white/10">
                <div class="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-900/50">
                    <!-- Msg 1 User -->
                    <div class="flex justify-end">
                        <div class="bg-indigo-600 text-white p-3 rounded-l-xl rounded-tr-xl max-w-[80%] text-sm shadow-md">
                            What is the WiFi password?
                        </div>
                    </div>
                    
                    <!-- Msg 2 Bot -->
                    <div class="flex justify-start items-end gap-2">
                        <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
                        <div class="bg-slate-700 text-white p-3 rounded-r-xl rounded-tl-xl max-w-[80%] text-sm shadow-md">
                            The WiFi network is "Sunset_Guest" and the password is "Welcome2024!". You can find the QR code on the fridge.
                        </div>
                    </div>
                </div>
                
                <div class="p-4 border-t border-white/10 bg-slate-800">
                    <div class="relative">
                        <input type="text" placeholder="Train AI with new question..." class="w-full bg-black/30 border border-white/10 rounded-full px-6 py-3 text-white focus:ring-2 focus:ring-indigo-500" data-debug-id="chatbot-train-input">
                        <button class="absolute right-2 top-1.5 h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500" data-debug-id="chatbot-train-btn">
                            <span class="material-icons text-sm">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Knowledge Base -->
            <div class="w-full lg:w-80 bg-slate-800 p-6">
                <h3 class="text-white font-bold mb-4">Knowledge Base</h3>

                <!-- Coach Tip -->
                <div class="mb-6 p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Speed Wins. Replying under 5 mins increases booking conversion by 400%. If you sleep, the bot handles it."
                    </p>
                </div>
                
                <div class="space-y-3">
                    <div class="p-3 bg-black/20 rounded border border-white/5 flex items-center gap-3">
                        <span class="material-icons text-slate-500">description</span>
                        <div class="flex-1">
                            <div class="text-white text-xs font-bold">House Manual.pdf</div>
                            <div class="text-[10px] text-emerald-400">Indexed</div>
                        </div>
                    </div>
                    <div class="p-3 bg-black/20 rounded border border-white/5 flex items-center gap-3">
                        <span class="material-icons text-slate-500">wifi</span>
                        <div class="flex-1">
                            <div class="text-white text-xs font-bold">Wifi & Access</div>
                            <div class="text-[10px] text-emerald-400">Indexed</div>
                        </div>
                    </div>
                    
                    @if (tier() === 'TIER_3') {
                        <button class="w-full mt-4 border border-dashed border-slate-600 p-2 rounded text-xs text-slate-400 hover:text-white hover:border-white transition-colors" data-debug-id="chatbot-upload-doc-btn">
                            + Upload Document
                        </button>
                    }
                </div>
                
                <div class="mt-8">
                    <div class="text-[10px] uppercase font-bold text-slate-500 mb-2">Confidence Threshold</div>
                    <input type="range" class="w-full h-1 bg-slate-600 rounded appearance-none" value="80" data-debug-id="chatbot-confidence-slider">
                    <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Lax</span>
                        <span>Strict (80%)</span>
                    </div>
                </div>
            </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class GuestAiChatbotComponent {
    feature = computed(() => ({
        id: 'EXP_04',
        name: 'Guest AI Chatbot',
        description: 'Contextual AI Guest Assistant',
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

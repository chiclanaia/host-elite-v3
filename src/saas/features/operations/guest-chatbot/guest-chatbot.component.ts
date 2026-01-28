import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    isSms?: boolean; // Tier 1
}

@Component({
    selector: 'ops-06-guest-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Contextual Hospitality Agent</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">RAG-driven AI guest assistant for technical support and inquiries.</p>
        </div>
        <div class="px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider"
             [ngClass]="{
                'bg-slate-800 text-slate-400 border-slate-700': isTier0(),
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30': !isTier0()
             }">
             {{ isTier3() ? 'RAG AI Engine' : (isTier2() ? 'Auto-Responses' : 'Manual SMS') }}
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 overflow-hidden flex flex-col lg:flex-row min-h-0">
            <!-- Left: Chat Interface -->
            <div class="flex-1 flex flex-col border-r border-white/10 relative">
                <!-- Tier 1 Indicator -->
                <div *ngIf="!isTier2OrAbove()" class="absolute top-0 left-0 w-full bg-amber-500/10 border-b border-amber-500/20 p-2 text-center text-[10px] text-amber-300 font-bold z-10">
                    SMS MODE (Tier 1) - Manual Replies Only
                </div>

                <div class="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-900/50 pt-10">
                    @for (msg of messages(); track msg.id) {
                        <div class="flex" [class.justify-end]="msg.sender === 'user'" [class.justify-start]="msg.sender === 'bot'">
                            @if (msg.sender === 'bot') {
                                <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto">AI</div>
                            }
                            <div class="max-w-[80%] p-3 text-sm shadow-md"
                                 [class.bg-indigo-600]="msg.sender === 'user' && !msg.isSms"
                                 [class.bg-slate-700]="msg.sender === 'bot' && !msg.isSms"
                                 [class.bg-emerald-600]="msg.sender === 'user' && msg.isSms"
                                 [class.bg-slate-600]="msg.sender === 'bot' && msg.isSms"
                                 [class.rounded-l-xl]="msg.sender === 'user'"
                                 [class.rounded-tr-xl]="msg.sender === 'user'"
                                 [class.rounded-r-xl]="msg.sender === 'bot'"
                                 [class.rounded-tl-xl]="msg.sender === 'bot'"
                                 [class.text-white]="true">
                                {{ msg.text }}
                                <div class="text-[9px] opacity-50 mt-1 text-right">{{ msg.timestamp | date:'shortTime' }}</div>
                            </div>
                             @if (msg.sender === 'user') {
                                <div class="h-8 w-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold ml-2 mt-auto">G</div>
                            }
                        </div>
                    }
                </div>
                
                <div class="p-4 border-t border-white/10 bg-slate-800">
                    <div class="relative">
                        <input [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" type="text" 
                               [placeholder]="isTier3() ? 'Ask AI or Train...' : 'Type SMS reply...'" 
                               class="w-full bg-black/30 border border-white/10 rounded-full px-6 py-3 text-white focus:ring-2 focus:ring-indigo-500" 
                               data-debug-id="chatbot-train-input">
                        <button (click)="sendMessage()" class="absolute right-2 top-1.5 h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500" data-debug-id="chatbot-train-btn">
                            <span class="material-icons text-sm">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right: Knowledge & Insights -->
            <div class="w-full lg:w-80 bg-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                <h3 class="text-white font-bold">Knowledge Base</h3>

                <!-- Coach Tip -->
                <div class="p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">💡</span>
                        <span class="text-indigo-300 font-bold text-sm uppercase">Coach Tip</span>
                    </div>
                    <p class="text-slate-300 text-xs italic">
                        "Speed Wins. Replying under 5 mins increases booking conversion by 400%. If you sleep, the bot handles it."
                    </p>
                </div>
                
                <!-- Topic Frequency Word Cloud (Requirement) -->
                @if (isTier3()) {
                    <div class="bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 class="text-xs text-slate-400 font-bold uppercase mb-3 text-center">Topic Frequency (WordCloud)</h4>
                        <div class="flex flex-wrap gap-2 justify-center items-center h-48 relative overflow-hidden">
                             <!-- Simple CSS Word Cloud Simulation -->
                            <span class="text-emerald-400 text-2xl font-bold animate-pulse">WiFi</span>
                            <span class="text-slate-300 text-xs absolute top-2 right-4">Parking</span>
                            <span class="text-indigo-400 text-lg font-bold absolute bottom-4 left-4">Heating</span>
                            <span class="text-slate-400 text-[10px] absolute top-8 left-2">Keys</span>
                            <span class="text-pink-400 text-xl font-bold">Checkout</span>
                            <span class="text-slate-300 text-xs absolute bottom-10 right-2">Pool</span>
                            <span class="text-amber-400 text-sm absolute top-4 left-1/2">Late</span>
                            <span class="text-slate-500 text-[10px] absolute bottom-2 right-1/2">Noise</span>
                        </div>
                    </div>
                }

                <!-- RAG Sources -->
                <div class="space-y-3">
                    <div class="p-3 bg-black/20 rounded border border-white/5 flex items-center gap-3">
                        <span class="material-icons text-slate-500">description</span>
                        <div class="flex-1">
                            <div class="text-white text-xs font-bold">House Manual.pdf</div>
                            <div class="text-[10px] text-emerald-400">Indexed (RAG)</div>
                        </div>
                    </div>
                    @if (isTier2OrAbove()) {
                         <div class="p-3 bg-black/20 rounded border border-white/5 flex items-center gap-3">
                            <span class="material-icons text-slate-500">wifi</span>
                            <div class="flex-1">
                                <div class="text-white text-xs font-bold">Wifi & Access</div>
                                <div class="text-[10px] text-emerald-400">Fixed Reply</div>
                            </div>
                        </div>
                    }
                    
                    @if (isTier3()) {
                        <button class="w-full mt-4 border border-dashed border-slate-600 p-2 rounded text-xs text-slate-400 hover:text-white hover:border-white transition-colors" data-debug-id="chatbot-upload-doc-btn">
                            + Upload Knowledge Source
                        </button>
                    }
                </div>
                
                @if (isTier3()) {
                    <div class="mt-auto">
                        <div class="text-[10px] uppercase font-bold text-slate-500 mb-2">Confidence Threshold</div>
                        <input type="range" class="w-full h-1 bg-slate-600 rounded appearance-none" value="80" data-debug-id="chatbot-confidence-slider">
                        <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Lax</span>
                            <span>Strict (80%)</span>
                        </div>
                    </div>
                }
            </div>
       </div>
    </div>
    `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class GuestChatbotComponent {
    feature = computed(() => ({
        id: 'OPS_06',
        name: 'Guest AI Chatbot',
        description: 'Auto-Responder & Concierge',
    } as any));

    session = inject(SessionStore);

    tier = computed(() => {
        const plan = this.session.userProfile()?.plan || 'TIER_0';
        return plan === 'Freemium' ? 'TIER_0' : plan;
    });

    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'TIER_3');

    newMessage = '';
    messages = signal<ChatMessage[]>([
        { id: '1', sender: 'user', text: 'What is the WiFi password?', timestamp: new Date(Date.now() - 3600000), isSms: false },
        { id: '2', sender: 'bot', text: 'The WiFi network is "Sunset_Guest" and the password is "Welcome2024!".', timestamp: new Date(Date.now() - 3590000), isSms: false },
    ]);

    sendMessage() {
        if (!this.newMessage.trim()) return;

        const isSms = !this.isTier2OrAbove();

        // Add User Message
        this.messages.update(msgs => [...msgs, {
            id: Date.now().toString(),
            sender: 'user',
            text: this.newMessage,
            timestamp: new Date(),
            isSms
        }]);

        const userTxt = this.newMessage;
        this.newMessage = '';

        // Simulate Bot Reply
        setTimeout(() => {
            let reply = "I don't know that yet.";
            if (this.isTier3()) {
                reply = `(RAG AI): Based on the manual, here is the answer to "${userTxt}"...`;
            } else if (this.isTier2OrAbove()) {
                reply = "(Auto-Reply): This is a preset response.";
            } else {
                return; // Manual only
            }

            this.messages.update(msgs => [...msgs, {
                id: Date.now().toString(),
                sender: 'bot',
                text: reply,
                timestamp: new Date(),
                isSms
            }]);
        }, 1000);
    }
}

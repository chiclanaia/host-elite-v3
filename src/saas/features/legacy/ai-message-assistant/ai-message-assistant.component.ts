import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../../services/gemini.service';
import { HostRepository } from '../../../../services/host-repository.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../services/translation.service';

interface FaqItem {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-ai-message-assistant',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full flex flex-col bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <div>
                <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                    <span class="text-3xl" aria-hidden="true">🤖</span> {{ 'TOOL.ai_msg_name' | translate }}
                </h2>
                <p class="text-slate-400 text-sm mt-1">{{ 'TOOL.ai_msg_desc' | translate }}</p>
            </div>
            <button (click)="close.emit()" data-debug-id="tool-back-btn" [title]="'COMMON.Close' | translate" class="text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="flex-1 p-6 overflow-y-auto space-y-6">
            
            <!-- Context Loaded Indicator -->
            @if (isLoadingData()) {
                <div class="flex items-center space-x-2 text-blue-400 animate-pulse">
                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>{{ 'ASSISTANT.Analyzing' | translate }}</span>
                </div>
            } @else {
                <div class="bg-blue-500/10 border border-blue-500/20 text-blue-200 px-4 py-2 rounded-lg text-xs flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                         <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-2" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                            </svg>
                            {{ 'ASSISTANT.ContextLoaded' | translate }} {{ contextSummary() | translate }}
                        </span>
                        <span class="text-[10px] text-blue-300 pl-6 opacity-75 flex items-center gap-2">
                            {{ 'ASSISTANT.AddressUsed' | translate }}
                            <input [(ngModel)]="propertyAddress" [title]="'ASSISTANT.AddressTitle' | translate" class="bg-black/20 border border-white/10 rounded px-2 py-0.5 text-white text-xs w-64 focus:outline-none focus:border-blue-400 dashed-border">
                        </span>
                    </div>
                    <button class="text-blue-400 hover:text-white underline ml-4 whitespace-nowrap" [title]="'ASSISTANT.Reset' | translate" (click)="loadPropertyData()">{{ 'ASSISTANT.Reset' | translate }}</button>
                </div>
            }
 
            <!-- Action Button -->
            @if (generatedFaqs().length === 0) {
                <div class="text-center py-12">
                    <div class="bg-white/5 inline-flex p-4 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-blue-400" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">{{ 'ASSISTANT.NoFaqGenerated' | translate }}</h3>
                    <p class="text-slate-400 max-w-sm mx-auto mb-6">{{ 'ASSISTANT.NoFaqDesc' | translate }}</p>
                    
                    <button 
                        (click)="generateFaqs()" 
                        [disabled]="isGenerating() || isLoadingData()"
                        [title]="'ASSISTANT.GenerateBtn' | translate"
                        class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                    >
                        @if (isGenerating()) {
                            <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {{ 'ASSISTANT.Generating' | translate }}
                        } @else {
                            <span>{{ 'ASSISTANT.GenerateBtn' | translate }}</span>
                        }
                    </button>
                </div>
            } @else {
                <!-- Results List -->
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-slate-300 font-bold uppercase tracking-wide text-sm">{{ 'ASSISTANT.GeneratedCount' | translate:{count: generatedFaqs().length} }}</h3>
                    <button (click)="generateFaqs()" class="text-xs text-blue-400 hover:text-white flex items-center gap-1 transition-colors" 
                        [title]="'ASSISTANT.Regenerate' | translate"
                        [disabled]="isGenerating()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        {{ 'ASSISTANT.Regenerate' | translate }}
                    </button>
                </div>
 
                <div class="space-y-4">
                    @for (item of generatedFaqs(); track $index) {
                        <div class="bg-black/30 border border-white/10 rounded-xl p-4 animate-fade-in-up" [style.animation-delay]="$index * 100 + 'ms'">
                            <div class="mb-3">
                                <label class="block text-xs font-bold text-blue-400 mb-1">{{ 'ASSISTANT.QuestionLabel' | translate }}</label>
                                <input [(ngModel)]="item.question" [title]="'ASSISTANT.QuestionEdit' | translate" class="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white font-semibold py-1 focus:outline-none transition-colors">
                            </div>
                            <div class="mb-3">
                                <label class="block text-xs font-bold text-emerald-400 mb-1">{{ 'ASSISTANT.AnswerLabel' | translate }}</label>
                                <textarea [(ngModel)]="item.answer" rows="3" [title]="'ASSISTANT.AnswerEdit' | translate" class="w-full bg-white/5 rounded-lg p-2 text-sm text-slate-200 focus:bg-white/10 focus:outline-none transition-colors resize-none"></textarea>
                            </div>
                            <div class="flex justify-end gap-3 pt-2 border-t border-white/5">
                                <button (click)="deleteItem($index)" [title]="'ASSISTANT.Delete' | translate" class="text-xs text-red-400 hover:text-red-300">{{ 'ASSISTANT.Delete' | translate }}</button>
                                <button (click)="copyItem(item)" [title]="'ASSISTANT.Copy' | translate" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                    </svg>
                                    {{ 'ASSISTANT.Copy' | translate }}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    </div>
    `,
    styles: [`
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    `]
})
export class AiMessageAssistantComponent implements OnInit {
    propertyName = input.required<string>();
    close = output<void>();

    private geminiService = inject(GeminiService);
    private repository = inject(HostRepository);

    generatedFaqs = signal<FaqItem[]>([]);
    isGenerating = signal(false);
    isLoadingData = signal(true);

    // Property context data
    propertyContext = '';
    propertyAddress = '';
    contextSummary = signal('');

    ngOnInit() {
        this.loadPropertyData();
    }

    async loadPropertyData() {
        this.isLoadingData.set(true);
        try {
            const prop = await this.repository.getPropertyByName(this.propertyName());
            const booklet = await this.repository.getBooklet(this.propertyName());

            if (prop) {
                // Priority: Booklet Address > Property Address
                this.propertyAddress = (booklet && booklet.address) ? booklet.address : (prop.address || '');

                this.propertyContext = `
                Nom Propriété: ${prop.name}
                Adresse Complète: ${this.propertyAddress}
                Wifi: ${prop.wifi_code || 'Non spécifié'}
                Heure check-in: ${prop.check_in_time || '15h'}
                Heure check-out: ${prop.check_out_time || '11h'}
                Règles: ${prop.house_rules_text || 'Standard'}
                Parking: ${prop.parking_info || 'Non spécifié'}
                Transports: ${prop.transport_info || 'Non spécifié'}
            `;
                this.contextSummary.set(`${prop.name} (${this.propertyAddress})`);
            } else {
                this.propertyContext = "";
                this.contextSummary.set("ASSISTANT.ErrorNotFound");
            }
        } catch (e) {
            console.error("Error loading context", e);
            this.contextSummary.set("ASSISTANT.ErrorLoading");
        } finally {
            this.isLoadingData.set(false);
        }
    }

    async generateFaqs() {
        console.log('[AiMessageAssistant] generateFaqs clicked');
        console.log('[AiMessageAssistant] Context present?', !!this.propertyContext);

        if (!this.propertyContext) {
            console.warn('[AiMessageAssistant] No context loaded.');
            return;
        }

        this.isGenerating.set(true);
        this.generatedFaqs.set([]);

        try {
            const faqs = await this.geminiService.generateFaqList(
                this.propertyName(),
                this.propertyContext,
                this.propertyAddress
            );
            console.log('[AiMessageAssistant] Received FAQs:', faqs);
            if (!faqs || faqs.length === 0) {
                console.warn('[AiMessageAssistant] Received empty FAQ list from service.');
            }
            this.generatedFaqs.set(faqs);
        } catch (e) {
            console.error("[AiMessageAssistant] FAQ Gen Error", e);
            // Fallback or empty
        } finally {
            this.isGenerating.set(false);
        }
    }

    deleteItem(index: number) {
        this.generatedFaqs.update(list => list.filter((_, i) => i !== index));
    }

    copyItem(item: FaqItem) {
        const text = `Q: ${item.question}\nR: ${item.answer}`;
        navigator.clipboard.writeText(text);
    }
}

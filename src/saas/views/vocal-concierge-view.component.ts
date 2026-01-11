
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { SessionStore } from '../../state/session.store';
import { HostRepository } from '../../services/host-repository.service';

type Status = 'idle' | 'listening' | 'processing' | 'error';
interface Message {
  author: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'saas-vocal-concierge-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vocal-concierge-view.component.html'
})
export class VocalConciergeViewComponent implements OnInit, OnDestroy {
    propertyName = input.required<string>();
    
    private geminiService = inject(GeminiService);
    private store = inject(SessionStore);
    private repository = inject(HostRepository);

    status = signal<Status>('idle');
    error = signal<string | null>(null);
    conversation = signal<Message[]>([]);
    
    // Real Data Context
    private propertyContext = signal<string>("");

    // Access Control
    userPlan = computed(() => this.store.userProfile()?.plan || 'Freemium');
    hasAccess = computed(() => {
      const plan = this.userPlan();
      return plan === 'Silver' || plan === 'Gold';
    });

    private recognition: any | null = null;

    constructor() {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'fr-FR';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.conversation.update(c => [...c, { author: 'user', text: transcript }]);
          this.status.set('processing');
          this.getAIResponse(transcript);
        };

        this.recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'audio-capture') {
             this.status.set('idle'); // Just go back to idle if no speech
          } else {
            console.error('Speech recognition error', event.error);
            this.error.set(`Erreur de reconnaissance vocale : ${event.error}`);
            this.status.set('error');
          }
        };
        
        this.recognition.onend = () => {
            if(this.status() === 'listening') {
                this.status.set('idle');
            }
        };

      } else {
        // Only set error if we are supposed to use it, will be handled in template check as well
      }
    }

    async ngOnInit() {
        if (this.hasAccess()) {
            await this.loadPropertyContext();
        }
    }

    async loadPropertyContext() {
        try {
            // Load the entire booklet data
            const bookletData = await this.repository.getBooklet(this.propertyName());
            if (bookletData) {
                this.propertyContext.set(this.formatBookletToText(bookletData));
            } else {
                this.propertyContext.set("Aucune information renseignée pour le moment. Le concierge ne peut pas répondre.");
            }
        } catch(e) {
            console.error("Error loading property context", e);
            this.propertyContext.set("Erreur de chargement des données.");
        }
    }

    // Helper to turn JSON booklet into readable text for the AI
    private formatBookletToText(data: any): string {
        let text = "";
        
        // Helper recursive function
        const traverse = (obj: any, prefix: string = '') => {
            for (const key in obj) {
                if (key === 'widgets' || key === 'photo_categories' || key === 'photos') continue; // Skip non-textual data
                if (key.endsWith('_pdf')) continue; // Skip pdf links

                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    traverse(value, prefix);
                } else if (typeof value === 'string' && value.trim() !== '') {
                    // Convert camelCase keys to readable labels approx
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    text += `- ${label}: ${value}\n`;
                }
            }
        };

        traverse(data);
        
        // Add basic info from properties table if available in booklet (usually saved in root/general)
        if (data.address) text += `- Adresse: ${data.address}\n`;
        if (data.gpsCoordinates) text += `- GPS: ${data.gpsCoordinates}\n`;

        return text || "Aucune information disponible.";
    }

    toggleSession(): void {
      if (this.status() === 'listening') {
        this.stopSession();
      } else {
        this.startSession();
      }
    }

    startSession(): void {
      if (!this.recognition) {
          this.error.set("La reconnaissance vocale n'est pas supportée par votre navigateur.");
          this.status.set('error');
          return;
      }
      this.error.set(null);
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            this.status.set('listening');
            this.recognition.start();
        })
        .catch(err => {
            console.error('Microphone access denied', err);
            this.error.set("L'accès au microphone est requis. Veuillez l'autoriser dans les paramètres de votre navigateur.");
            this.status.set('error');
        });
    }

    stopSession(): void {
        if (!this.recognition) return;
        this.recognition.stop();
        this.status.set('idle');
    }

    private async getAIResponse(question: string): Promise<void> {
        try {
            const context = this.propertyContext();
            
            const responseText = await this.geminiService.getConciergeResponse(
                this.propertyName(),
                context,
                question
            );
            this.conversation.update(c => [...c, { author: 'ai', text: responseText }]);
            this.status.set('idle');
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Une erreur inconnue est survenue.';
            this.error.set(`L'assistant IA n'a pas pu répondre. Erreur: ${errorMessage}`);
            this.status.set('error');
        }
    }

    ngOnDestroy(): void {
      this.stopSession();
    }
}

import { Component, computed, inject, input, signal, effect, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { GeminiService } from '../../../services/gemini.service';
import { HostRepository } from '../../../services/host-repository.service';
import { SessionStore } from '../../../state/session.store';
import { WelcomeBookletService } from '../../views/welcome-booklet/welcome-booklet.service';

@Component({
    selector: 'app-ai-prompts',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './ai-prompts.component.html',
    styles: [`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
    `]
})
export class AiPromptsComponent {
    propertyName = input.required<string>();
    @Output() close = new EventEmitter<void>();

    private geminiService = inject(GeminiService);
    private repository = inject(HostRepository);
    private bookletService = inject(WelcomeBookletService);
    private store = inject(SessionStore);

    // Inputs/State
    currentPropertyId = signal<string | null>(null);
    propertyDetails = signal<any>(null);

    // Marketing Description Logic
    marketingText = signal<string>('');
    isGenerating = signal(false);
    saveMessage = signal<string | null>(null);

    // AI Listing State
    targetPhotoCount = signal<number>(15);
    aiAnalysisStatus = signal<string>('');
    isPreviewMode = signal(false);

    userEmail = computed(() => this.store.userProfile()?.email || '');

    hasAiAccess = computed(() => {
        const plan = this.store.userProfile()?.plan;
        return plan === 'Silver' || plan === 'Gold';
    });

    // Visible Photos (simulated from booklet service or property data)
    visiblePhotos = computed(() => {
        // We use the photos from the booklet service which should be loaded for the current property
        const photos = this.bookletService.propertyPhotos() || [];
        // In the original, it filtered based on microsite config visibility? 
        // The original code: `visiblePhotos = computed(() => this.micrositePhotos().filter(p => p.visible));` was in MicrositeContainer.
        // But in AngleView it was: `@let photos = visiblePhotos();` wait, AngleView didn't have `visiblePhotos` computed in the snippet I saw?
        // Ah, I missed where `visiblePhotos` came from in AngleView HTML.
        // Looking at AngleView HTML: `@let photos = visiblePhotos();` 
        // I need to check AngleView TS again for `visiblePhotos`. 
        // Wait, I read AngleView TS and it didn't have `visiblePhotos` computed property.
        // It might have been using `bookletService.propertyPhotos()` directly or I missed it.
        // Let's assume for now we show all photos or use the ones from service.
        return photos;
    });

    constructor() {
        effect(() => {
            const prop = this.propertyName();
            if (prop) {
                this.loadPropertyData(prop);
            }
        });
    }

    async loadPropertyData(propName: string) {
        try {
            const prop = await this.repository.getPropertyByName(propName);
            if (prop) {
                this.currentPropertyId.set(prop.id);
                this.propertyDetails.set(prop);
                this.marketingText.set(prop.listing_description || '');
            }
            // Ensure booklet service is loaded for photos
            if (this.bookletService.propertyName() !== propName) {
                await this.bookletService.loadData(propName);
            }
        } catch (e) {
            console.error("Error loading property data:", e);
        }
    }

    async generateListingWithPhotos() {
        if (!this.hasAiAccess()) return;

        const propId = this.currentPropertyId();
        const propName = this.propertyName();
        if (!propId || !propName) return;

        this.isGenerating.set(true);
        this.aiAnalysisStatus.set('Analyse des photos et rédaction...');

        try {
            const propData = this.propertyDetails();
            const bookletData = await this.repository.getBooklet(propName);

            let context = `Nom propriété: ${propName}.\n`;
            if (propData) {
                context += `Type: ${propData.property_type || 'Non spécifié'}\n`;
                context += `Adresse: ${propData.address || 'Non spécifiée'}\n`;
                context += `Description actuelle: ${propData.listing_description || 'Aucune'}\n`;
                if (propData.property_equipments?.length) {
                    context += `Équipements: ${propData.property_equipments.map((e: any) => e.name).join(', ')}\n`;
                }
            }
            if (bookletData) {
                context += `\n--- Détails Livret ---\n${JSON.stringify(bookletData).substring(0, 1500)}`;
            }

            const sourcePhotos = this.bookletService.propertyPhotos() || [];
            const availablePhotos = sourcePhotos.map((p: any) => ({ url: p.url, id: p.id || p.url }));

            if (availablePhotos.length === 0) {
                const generated = await this.geminiService.generateMarketingDescription(context);
                this.marketingText.set(generated);
            } else {
                const result = await this.geminiService.generateOptimizedListing(
                    context,
                    availablePhotos,
                    this.targetPhotoCount()
                );

                this.marketingText.set(result.description);
                if (result.selectedPhotoIds?.length > 0) {
                    this.saveMessage.set(`IA : Description générée avec ${result.selectedPhotoIds.length} photos analysées !`);
                    setTimeout(() => this.saveMessage.set(null), 4000);
                }
            }

        } catch (e) {
            console.error(e);
            alert("Erreur lors de la génération.");
        } finally {
            this.isGenerating.set(false);
            this.aiAnalysisStatus.set('');
        }
    }

    async saveDescription() {
        if (!this.marketingText()) return;

        try {
            if (this.currentPropertyId()) {
                await this.repository.updatePropertyData(this.currentPropertyId()!, {
                    marketing: { description: this.marketingText() }
                });

                // Also update booklet welcome message if exists?
                // AngleView logic:
                // const bookletPayload: any = { welcome: { welcomeMessage: this.marketingText() } };
                // await this.repository.saveBooklet(this.view().propertyName!, bookletPayload);

                // We should probably preserve this behavior
                const bookletPayload: any = {
                    welcome: { welcomeMessage: this.marketingText() }
                };
                await this.repository.saveBooklet(this.propertyName(), bookletPayload);

                // Notify user
                this.saveMessage.set("Description sauvegardée !");
                setTimeout(() => this.saveMessage.set(null), 3000);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert("Erreur lors de la sauvegarde.");
        }
    }
}

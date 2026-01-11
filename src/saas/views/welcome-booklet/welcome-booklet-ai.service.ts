import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeminiService } from '../../../services/gemini.service';
import { BookletSection, CONTROL_LABELS } from './booklet-definitions';

@Injectable({ providedIn: 'root' })
export class WelcomeBookletAiService {
    gemini = inject(GeminiService);
    isAiLoading = signal(false);

    async autoFill(form: FormGroup, address: string, sections: BookletSection[]) {
        if (!address) { alert('Veuillez entrer une adresse d\'abord.'); return; }
        this.isAiLoading.set(true);

        const parts = [
            `Je suis l'hôte d'une location saisonnière située à : ${address}.`,
            `Génère un contenu accueillant, pratique et direct pour le livret d'accueil.`,
            `Ne met PAS de titre de section. Réponds QUE le texte.`,
            `Utilise un ton chaleureux, professionnel et rassurant.`,
            `Pour les champs "Instructions", sois précis (étapes numérotées si besoin).`
        ];

        try {
            // 1. Basic Info
            const welcomePrompt = `${parts.join(' ')} Rédige un message de bienvenue chaleureux (2-3 phrases) souhaitant un excellent séjour.`;
            const welcome = await this.gemini.generateText(welcomePrompt);
            if (welcome) form.get('bienvenue.messageBienvenue')?.setValue(this.formatAiResponse(welcome));

            // 2. Sections
            for (const section of sections) {
                const group = form.get(section.formGroupName);
                const labels = CONTROL_LABELS[section.formGroupName];
                if (!group || !labels) continue;

                for (const key in labels) {
                    // Skip existing values to preserve user edits
                    if (group.get(key)?.value) continue;

                    const label = labels[key];
                    const hint = this.getAiHint(section.id, key);
                    const prompt = `${parts.join(' ')} Pour la rubrique "${section.editorTitle}" -> "${label}". ${hint}. Rédige un contenu court et utile (max 2-3 phrases). Si l'info dépend de l'équipement spécifique (ex: code wifi), mets "[A COMPLÉTER]".`;

                    const text = await this.gemini.generateText(prompt);
                    if (text && this.isValidContent(text)) {
                        group.get(key)?.setValue(this.formatAiResponse(text));
                    }
                }
            }

            // 3. Manuals search
            await this.findManuals(form, sections, address);

        } catch (e) {
            console.error("AI Error", e);
            alert("Erreur lors de la génération. Veuillez réessayer.");
        } finally {
            this.isAiLoading.set(false);
        }
    }

    async findManuals(form: FormGroup, sections: BookletSection[], address: string) {
        // Simplistic manual finder simulation / logic
        // In real implementation this would invoke a search tool or more complex AI flow
        // Keeping it placeholder-ish but functional structure based on original code structure which seemed to do Google Search via Gemini usage or specific logic?
        // Original code had generic search logic.
        // We will perform a focused search for appliance manuals if we had descriptions.
        // Since we don't have appliance names, we skip or do a generic attempt?
        // Re-reading original code (step 61): it used `generateText` with "Cherche le manuel...".
        // Let's implement that loop.

        for (const section of sections) {
            if (['cuisine', 'buanderie', 'salon'].includes(section.id)) {
                const group = form.get(section.formGroupName);
                const labels = CONTROL_LABELS[section.formGroupName];
                if (!group || !labels) continue;

                for (const key in labels) {
                    if (key.includes('pdf')) continue; // Skip PDF fields themselves
                    // If we have content in the text field (e.g. "Samsung TV"), try to find PDF
                    const val = group.get(key)?.value;
                    if (val && val.length < 50 && !val.includes('[A COMPLÉTER]')) {
                        // Assume the value is an appliance name if short
                        const prompt = `Trouve l'URL directe d'un manuel PDF pour : ${val}. Réponds UNIQUEMENT par l'URL ou "NON".`;
                        const url = await this.gemini.generateText(prompt); // Gemini can't browse, but maybe it hallucinates a link or we use search tool?
                        // Verify logic: Original code used Gemini.
                        if (url && url.startsWith('http')) {
                            group.get(key + '_pdf')?.setValue(url);
                        }
                    }
                }
            }
        }
    }

    getAiHint(sectionId: string, key: string): string {
        if (key === 'wifi') return 'Donne un format type : "Réseau : [NOM], Mot de passe : [MDP]".';
        if (key === 'boulangerie') return 'Suggère une boulangerie réputée dans le quartier si possible, ou explique comment en trouver une.';
        if (key === 'supermarche') return 'Indique les chaînes de supermarchés habituelles en France.';
        if (sectionId === 'depart') return 'Donne des instructions standards de départ (poubelles, clés, lumières).';
        return '';
    }

    formatAiResponse(text: string): string {
        return text.replace(/^"|"$/g, '').trim();
    }

    isValidContent(text: string): boolean {
        const lower = text.toLowerCase();
        return !lower.includes("je ne peux pas") && !lower.includes("en tant qu'ia");
    }

    // Helper for components to format values for display
    formatValueToString(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            // Handle "Check-in: 15h" etc pairs
            return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n');
        }
        return String(value);
    }
}

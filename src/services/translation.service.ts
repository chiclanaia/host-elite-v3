import { Injectable, signal } from '@angular/core';
import { fr } from './translations/fr';
import { en } from './translations/en';
import { es } from './translations/es';

export type Language = 'en' | 'fr' | 'es';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    currentLang = signal<Language>('fr'); // Default to French as per legacy

    private dictionaries: Record<Language, Record<string, string>> = {
        'fr': fr,
        'en': en,
        'es': es
    };

    setLanguage(lang: Language) {
        this.currentLang.set(lang);
    }

    translate(key: string): string {
        const lang = this.currentLang();
        const dict = this.dictionaries[lang] || this.dictionaries['en'];
        return dict[key] || key;
    }

    // Debug Support
    debugMode = signal(false);

    getKeysForValue(text: string): string[] {
        if (!text) return [];
        const lang = this.currentLang();
        const dict = this.dictionaries[lang] || this.dictionaries['en'];

        // Normalize text (trim, remove extra spaces) to improve matching
        const normalizedText = text.trim();

        // Reverse lookup
        return Object.entries(dict)
            .filter(([_, value]) => value === normalizedText) // Exact match for now
            .map(([key]) => key);
    }
}

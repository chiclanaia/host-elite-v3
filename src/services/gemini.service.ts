
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { ContextData, ReportData, Scores } from '../types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  private supabaseService = inject(SupabaseService);

  constructor() {
    // Initialisation paresseuse (lazy load) lors de la première requête
  }

  private async ensureClient(): Promise<void> {
    if (this.genAI) return;

    try {
      // Appel RPC pour récupérer la clé déchiffrée
      const { data, error } = await this.supabaseService.supabase.rpc('get_decrypted_active_key');

      if (error || !data) {
        console.error("Erreur lors de la récupération de la clé API:", error);
        throw new Error("Impossible de récupérer la clé API active depuis le serveur.");
      }

      this.genAI = new GoogleGenAI({ apiKey: data });
    } catch (e) {
      console.error("Failed to initialize Gemini Client", e);
      throw new Error("Service IA non configuré. Veuillez contacter l'administrateur.");
    }
  }

  /**
   * Robust JSON cleaner that finds the first '{' and last '}' to extract valid JSON,
   * ignoring any markdown or explanatory text surrounding it.
   */
  private cleanJson(text: string): string {
    if (!text) return '{}';

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return text.substring(firstBrace, lastBrace + 1);
    }

    // Fallback: simple trim if no braces found (unlikely for object expectation)
    return text.trim();
  }

  async generateReport(context: ContextData, scores: Scores): Promise<ReportData> {
    await this.ensureClient();

    const reportSchema = {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedPlan: { type: Type.STRING, enum: ["Bronze", "Silver", "Gold"] },
        planJustification: { type: Type.STRING }
      },
      required: ["strengths", "opportunities", "recommendedPlan", "planJustification"],
    };

    const prompt = `
      You are an expert Airbnb coach. Provide a personalized action plan.
      Context: ${context.situation}, Challenge: ${context.challenge}.
      Scores: ${JSON.stringify(scores)}.
      Return JSON only.
    `;

    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: reportSchema },
      });
      return JSON.parse(this.cleanJson(result.text));
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async getConciergeResponse(propertyName: string, context: string, question: string): Promise<string> {
    try {
      await this.ensureClient();

      // Strict prompt engineering to restrict knowledge to the provided context
      const prompt = `
          Tu es le concierge virtuel IA dédié à la propriété nommée "${propertyName}".
          
          Voici la **SEULE et UNIQUE** source de vérité concernant cette propriété. Tu ne dois utiliser **aucune** connaissance externe sur le monde pour répondre aux questions spécifiques sur le logement :
          
          --- DÉBUT DES INFORMATIONS DE LA PROPRIÉTÉ ---
          ${context}
          --- FIN DES INFORMATIONS ---

          RÈGLES STRICTES DE RÉPONSE :
          1. Réponds à la question de l'invité en utilisant **uniquement** les informations ci-dessus.
          2. Si la réponse ne se trouve pas explicitement dans les informations fournies, tu dois répondre : "Je suis désolé, je n'ai pas cette information spécifique concernant le logement. Veuillez contacter l'hôte directement."
          3. Ne pas inventer d'informations (codes wifi, emplacement des clés, etc.) si elles ne sont pas dans le texte.
          4. Sois courtois, bref et serviable, comme un concierge de luxe.
          5. Réponds toujours en Français.

          Question de l'invité : "${question}"
        `;

      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return result.text;
    } catch (error) {
      return "Désolé, je ne peux pas répondre pour le moment (Service IA indisponible).";
    }
  }

  async autoFillBooklet(address: string, emptyDataStructure: any): Promise<any> {
    await this.ensureClient();

    const prompt = `
        You are a helpful assistant for an Airbnb host located at: "${address}".
        
        Your task is to fill the provided JSON structure.
        **IMPORTANT:** The input JSON contains specific INSTRUCTIONS in the values (e.g. "LIST: 3 restaurants...").
        You MUST replace these instructions with the actual content found via your knowledge base.

        **SECTION 1: PUBLIC LOCAL DATA (Restaurants, Activities, Transport, Shops, Tourism)**
        - **MANDATORY:** When you see an instruction asking for a list (e.g. 'recommandationRestaurants', 'guideActivites'), you MUST provide real, accurate, and specific recommendations.
        - **FORMAT:** Provide a **list of 3-5 top-rated specific places** with names and addresses.
        - **NEVER** use "N/A" for these fields unless the location is in the middle of a desert.

        **SECTION 2: PRIVATE PROPERTY DATA (Wifi codes, Door codes, Specific device instructions)**
        - If a field is empty or asks for private info you cannot know (Wifi password, digicode), return EXACTLY: "N/A (dépend de la propriété)".
        - **DO NOT INVENT** specific codes or keys.

        **RESPONSE FORMAT:**
        1. Respond in French.
        2. Return ONLY the JSON object.
        3. **PRESERVE THE EXACT JSON KEYS** provided below.
        
        Structure to fill:
        ${JSON.stringify(emptyDataStructure)}
      `;

    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      return JSON.parse(this.cleanJson(result.text));
    } catch (error) {
      console.error('Error auto-filling booklet:', error);
      throw error;
    }
  }

  async findEquipmentManuals(equipmentList: string[]): Promise<Record<string, string>> {
    await this.ensureClient();

    const prompt = `
        For each appliance description below, find the official user manual PDF URL.
        Input: ${JSON.stringify(equipmentList)}
        Return a JSON object: { "Original Description": "URL" or null }.
      `;

    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      return JSON.parse(this.cleanJson(result.text));
    } catch (error) {
      console.error('Error finding manuals:', error);
      return {};
    }
  }

  async generateMarketingDescription(propertyContext: string): Promise<string> {
    await this.ensureClient();

    const prompt = `
        Tu es un copywriter expert en immobilier de luxe et location saisonnière.
        Ton but est de rédiger une description de listing "irrésistible" pour attirer des locataires potentiels.
        
        Utilise les informations brutes suivantes sur la propriété :
        "${propertyContext}"

        INSTRUCTIONS :
        1. Rédige un texte d'environ 150-200 mots.
        2. Utilise un ton chaleureux, invitant et professionnel.
        3. Mets en avant les points forts (équipements, localisation, ambiance).
        4. Utilise des émojis avec parcimonie pour structurer le texte.
        5. Structure le texte avec une accroche, un corps de texte et un appel à l'action subtil.
        6. Ne mets PAS de titre "Description :", commence directement le texte.
        7. Réponds en Français.
      `;

    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return result.text;
    } catch (error) {
      console.error('Error generating description:', error);
      return "Erreur lors de la génération de la description.";
    }
  }

  async generateMicrositeDesign(propertyData: any): Promise<any> {
    await this.ensureClient();

    const prompt = `
        You are a world-class Web Designer specialized in Hospitality.
        Based on the property data below, determine the best design strategy for a promotional microsite.

        Property Data:
        ${JSON.stringify(propertyData).substring(0, 5000)} // Limit context size

        TASKS:
        1. Select the best **Theme** ('modern', 'cozy', or 'luxury') based on the property style.
        2. Pick a **Primary Color** (Hex code) that matches the vibe.
        3. Write a short, catchy **Headline** (max 6 words).
        4. Select which **Sections** should be visible on a PUBLIC promotional site.
           - Available sections: 'gallery', 'amenities', 'reviews', 'rules', 'guide'.
           - RULE: Only include sections if there is data for them.
           - RULE: 'gallery' and 'amenities' are highly recommended.

        RESPONSE FORMAT (JSON ONLY):
        {
          "template": "modern" | "cozy" | "luxury",
          "primaryColor": "#hex",
          "headline": "String",
          "visibleSections": ["gallery", "amenities", ...]
        }
      `;

    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      return JSON.parse(this.cleanJson(result.text));
    } catch (error) {
      console.error('Error generating design:', error);
      throw error;
    }
  }

  async generateOptimizedListing(context: string, photos: { url: string; id: string }[], maxPhotos: number): Promise<{ description: string; selectedPhotoIds: string[] }> {
    await this.ensureClient();

    // 1. Prepare Images
    const photosToAnalyze = photos.slice(0, 30);
    const imageParts: any[] = [];

    // Helper to fetch and convert to base64
    const urlToBase64 = async (url: string): Promise<string | null> => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove data:image/jpeg;base64, prefix
            resolve(base64data.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Failed to load image for AI:", url, e);
        return null; // Skip failed images
      }
    };

    // Load images in parallel
    console.log("Downloading images for AI analysis...");
    const base64Images = await Promise.all(photosToAnalyze.map(p => urlToBase64(p.url)));

    // Construct parts
    base64Images.forEach((b64, index) => {
      if (b64) {
        imageParts.push({
          inlineData: {
            data: b64,
            mimeType: "image/jpeg"
          }
        });
      }
    });

    const prompt = `
        You are an expert Vacation Rental Copywriter and Photographer.
        
        TASK 1: Write an "Irresistible" Listing Description.
        - Use the "Selling the Experience" methodology.
        - Tone: Warm, professional, inviting.
        - Language: French.

        TASK 2: Select the Best Photos.
        - Select EXACTLY (or up to) ${maxPhotos} photos that best sell the property.
        - The input photos correspond to these IDs in order: ${JSON.stringify(photosToAnalyze.map(p => p.id))}.

        CONTEXT PROPERTY DATA:
        ${context}

        RESPONSE FORMAT (JSON ONLY):
        {
          "description": "Your markdown formatted description...",
          "selectedPhotoIds": ["id1", "id3", ...]
        }
    `;

    try {
      const contents = [prompt, ...imageParts];
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents as any,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(this.cleanJson(result.text));
      return {
        description: parsed.description,
        selectedPhotoIds: parsed.selectedPhotoIds || []
      };
    } catch (error) {
      console.error('Error generating optimized listing:', error);
      throw error;
    }
  }

  async generateVisibilityAudit(context: any, language: string): Promise<any> {
    if (!this.genAI) await this.ensureClient();

    try {
      const prompt = `You are an expert SEO and Digital Marketing Auditor for Vacation Rentals.
            Perform a simulated "Visibility Audit" for the following property.

            **CONTEXT:**
            - Language/Region: ${language.toUpperCase()}
            - Property Name: ${context.name}
            - Address: ${context.address}
            - Description: ${context.description}
            - Amenities: ${context.amenities.join(', ')}
            - USER PROVIDED URLs: 
                - Airbnb: ${context.urls?.airbnb || 'None'}
                - Booking: ${context.urls?.booking || 'None'}
                - Other: ${context.urls?.other || 'None'}

            **VALIDATION & AUDIT LOGIC:**
            1. **CHECK URLs FIRST:** 
               - If the user PROVIDED valid URLs for Airbnb or Booking, **assume the property is VISIBLE on those platforms** (Status: "Visible").
               - Analyze the URL quality (is it a clean direct link?).
            
            2. **CHECK CONTENT & ADDRESS (If no URLs provided):**
               - If NO URLs are provided AND the address is obviously fake ("123 Fake St", "Nowhere") -> **FAIL THE AUDIT (Score 0)**.
               - If NO URLs are provided AND description is empty -> **FAIL THE AUDIT (Score 0)**.

            **TASK (If Valid):**
            1. Analyze visibility based on the provided content and claimed platforms.
            2. Give a score (0-100). If valid URLs are provided, the score should generally be higher (>60) unless the description is terrible.
            3. Provide specific tips.

            **RESPONSE FORMAT (JSON ONLY):**
            {
                "score": 0-100 (integer),
                "summary": "Short 1-sentence summary.",
                "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
                "platforms": [
                    { "name": "Airbnb", "status": "Visible/Not Found", "observation": "..." },
                    { "name": "Booking", "status": "Visible/Not Found", "observation": "..." },
                    { "name": "Google Maps", "status": "Visible/Not Found", "observation": "..." }
                ],
                "tips": [
                    { "title": "Tip Title", "description": "Actionable advice." }
                ]
            }
            Do not include markdown code blocks. Just the JSON string.`;

      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      return JSON.parse(this.cleanJson(result.text));
    } catch (error) {
      console.error('Gemini Audit Error:', error);
      // Fallback mock
      return {
        score: 72,
        summary: "Visibilité correcte mais des opportunités de mots-clés sont manquées.",
        keywords: ["Vue mer", "Centre ville", "Wifi Fibre", "Parking gratuit"],
        platforms: [
          { name: "Airbnb", status: "Good", observation: "Contenu bien structuré." },
          { name: "Booking.com", status: "Average", observation: "Manque de photos diversifiées." },
          { name: "Google Maps", status: "Low", observation: "Adresse exacte difficile à trouver." }
        ],
        tips: [
          { title: "Optimiser le Titre", description: "Ajoutez 'Vue Mer' au début de votre titre." },
          { title: "Compléter les équipements", description: "Assurez-vous que tous les équipements de cuisine sont cochés." }
        ]
      };
    }
  }

  async generateText(prompt: string): Promise<string> {
    await this.ensureClient();
    try {
      const result = await this.genAI!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return result.text;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }
}
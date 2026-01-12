
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { View } from '../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HostRepository } from '../../services/host-repository.service';
import { GeminiService } from '../../services/gemini.service';
import { SessionStore } from '../../state/session.store';
import { MicrositeConfig, BuilderPhoto, SectionDef, resolveMicrositeConfig } from './welcome-booklet/booklet-definitions';
import { MicrositeRendererComponent } from '../components/microsite-renderer/microsite-renderer.component';
import { WelcomeBookletService } from './welcome-booklet/welcome-booklet.service';

type Plan = 'Freemium' | 'Bronze' | 'Silver' | 'Gold';

interface Tool {
    id: string; // Added ID for easier selection
    name: string;
    description: string;
    requiredPlan: Plan;
}

interface AngleDetails {
    title: string;
    description: string;
    tools: Tool[];
}

type QuestionLevel = 'Bronze' | 'Silver' | 'Gold';

interface OnboardingQuestion {
    id: string;
    text: string;
    level: QuestionLevel;
    subQuestion?: {
        id: string;
        label: string;
        type: 'text' | 'url' | 'number';
        placeholder?: string;
    }
}

// Microsite Types imported from booklet-definitions.ts

const ONBOARDING_DATA: Record<string, OnboardingQuestion[]> = {
    marketing: [
        { id: 'm_q1', text: 'Votre annonce est-elle publiée sur au moins une plateforme (ex: Airbnb, Booking) ?', level: 'Bronze', subQuestion: { id: 'm_q1_url', label: 'URL de votre annonce principale', type: 'url', placeholder: 'https://airbnb.com/h/mon-logement' } },
        { id: 'm_q2', text: 'Vos photos de propriété sont-elles lumineuses, bien cadrées et réalisées par un professionnel (ou de qualité professionnelle) ?', level: 'Silver' },
        { id: 'm_q3', text: 'Votre titre d\'annonce est-il accrocheur et met-il en avant votre atout principal (ex: "Vue Mer", "Plein Centre") ?', level: 'Silver', subQuestion: { id: 'm_q3_title', label: 'Quel est votre titre d\'annonce actuel ?', type: 'text', placeholder: 'Ex: Studio cosy vue Tour Eiffel' } },
        { id: 'm_q4', text: 'Votre description textuelle est-elle complète, engageante et raconte-t-elle une "histoire" qui donne envie de réserver ?', level: 'Silver' },
        { id: 'm_q5', text: 'Avez-vous clairement identifié votre "clientèle cible" (ex: familles, couples, digital nomads) pour ce bien ?', level: 'Gold', subQuestion: { id: 'm_q5_target', label: 'Décrivez votre clientèle cible', type: 'text', placeholder: 'Ex: Familles avec jeunes enfants' } },
        { id: 'm_q6', text: 'Demandez-vous activement des avis et avez-vous maintenu une note supérieure à 4.8 étoiles sur 5 ?', level: 'Gold', subQuestion: { id: 'm_q6_rating', label: 'Quelle est votre note moyenne actuelle ?', type: 'number', placeholder: 'Ex: 4.92' } },
        { id: 'm_q7', text: 'Utilisez-vous les réseaux sociaux (ex: Instagram, Pinterest) pour promouvoir spécifiquement ce logement ?', level: 'Gold', subQuestion: { id: 'm_q7_social', label: 'Lien vers votre page (ex: Instagram)', type: 'url', placeholder: 'https://instagram.com/monlogement' } },
        { id: 'm_q8', text: 'Proposez-vous une "visite virtuelle" 3D ou une vidéo professionnelle de votre logement ?', level: 'Gold', subQuestion: { id: 'm_q8_tour', label: 'Lien vers la visite virtuelle ou vidéo', type: 'url', placeholder: 'https://...' } },
        { id: 'm_q9', text: 'Avez-vous un site web personnel pour générer des réservations directes (hors plateforme) pour ce bien ?', level: 'Gold', subQuestion: { id: 'm_q9_url', label: 'URL de votre site de réservation directe', type: 'url', placeholder: 'https://mon-site.com' } },
        { id: 'm_q10', text: 'Collectez-vous (légalement) les e-mails de vos Invités pour des actions de fidélisation (ex: promo -10% pour un futur séjour) ?', level: 'Gold' },
    ],
    experience: [
        { id: 'e_q1', text: 'Le logement est-il impeccablement propre (qualité hôtelière) avant chaque arrivée ?', level: 'Bronze' },
        { id: 'e_q2', text: 'Le processus d\'arrivée (check-in) est-il simple, clair, et 100% fiable (ex: boîte à clés fonctionnelle, serrure connectée) ?', level: 'Silver', subQuestion: { id: 'e_q2_method', label: 'Quelle est votre méthode de check-in ?', type: 'text', placeholder: 'Ex: Boîte à clés, accueil en personne...' } },
        { id: 'e_q3', text: 'Fournissez-vous un livret d\'accueil (numérique ou physique) avec au moins les informations vitales (Wi-Fi, règles, contacts) ?', level: 'Silver', subQuestion: { id: 'e_q3_link', label: 'Lien vers votre livret d\'accueil numérique (si applicable)', type: 'url', placeholder: 'https://example.com/livret' } },
        { id: 'e_q4', text: 'Répondez-vous aux messages des Invités en moins d\'une heure (pendant les heures de journée) ?', level: 'Silver' },
        { id: 'e_q5', text: 'Votre livret d\'accueil est-il complet (guides d\'appareils, urgences, recommandations locales) au-delà des bases ?', level: 'Gold' },
        { id: 'e_q6', text: 'Fournissez-vous un "panier de bienvenue" attentionné (ex: café, thé, snacks, une bouteille d\'eau ou de vin) ?', level: 'Gold', subQuestion: { id: 'e_q6_basket', label: 'Que contient votre panier de bienvenue ?', type: 'text', placeholder: 'Ex: Café, thé, gâteaux locaux' } },
        { id: 'e_q7', text: 'Utilisez-vous des messages automatisés (confirmation, J-1, mi-séjour, départ) pour une communication fluide ?', level: 'Gold', subQuestion: { id: 'e_q7_tool', label: 'Quel outil de messagerie automatisée utilisez-vous ?', type: 'text', placeholder: 'Ex: Airbnb, Smoobu, etc.' } },
        { id: 'e_q8', text: 'Personnalisez-vous l\'accueil (ex: un mot de bienvenue nominatif, une attention pour un anniversaire) ?', level: 'Gold' },
        { id: 'e_q9', text: 'Avez-vous mis en place des partenariats (chef à domicile, VTC, baby-sitting) que vous proposez activement à vos Invités ?', level: 'Gold', subQuestion: { id: 'e_q9_partner', label: 'Exemple de partenaire', type: 'text', placeholder: 'Ex: Chef "Le Bon Goût"' } },
        { id: 'e_q10', text: 'Anticipez-vous les besoins "non-dits" (ex: parapluie à disposition, chargeurs universels, jeux de société) ?', level: 'Gold' },
    ],
    operations: [
        { id: 'o_q1', text: 'Avez-vous une solution de nettoyage (vous-même ou une équipe) qui est 100% fiable ?', level: 'Bronze', subQuestion: { id: 'o_q1_cleaner', label: 'Nom de votre prestataire de nettoyage (si externe)', type: 'text', placeholder: 'Ex: NettoyagePro' } },
        { id: 'o_q2', text: 'Disposez-vous d\'au moins deux (idéalement trois) jeux complets de linge de lit et de serviettes par lit/personne ?', level: 'Silver', subQuestion: { id: 'o_q2_sets', label: 'Combien de jeux de linge complets possédez-vous ?', type: 'number', placeholder: '3' } },
        { id: 'o_q3', text: 'Avez-vous une checklist de nettoyage détaillée (écrite ou visuelle) que votre équipe (ou vous) suit à la lettre ?', level: 'Silver' },
        { id: 'o_q4', text: 'Gérez-vous activement le stock des consommables (savon, papier toilette, café, éponges...) pour ne jamais être en rupture ?', level: 'Silver' },
        { id: 'o_q5', text: 'Avez-vous un prestataire de maintenance (plombier, électricien) joignable en cas d\'urgence le week-end ?', level: 'Gold', subQuestion: { id: 'o_q5_maintenance', label: 'Nom de votre prestataire de maintenance', type: 'text', placeholder: 'Ex: Plomberie Express' } },
        { id: 'o_q6', text: 'Avez-vous une solution professionnelle pour la buanderie (service externe ou machine/sèche-linge sur place efficace) ?', level: 'Gold' },
        { id: 'o_q7', text: 'Utilisez-vous un logiciel (Channel Manager ou PMS) pour synchroniser vos calendriers si vous êtes sur plusieurs plateformes ?', level: 'Gold', subQuestion: { id: 'o_q7_software', label: 'Quel logiciel utilisez-vous ?', type: 'text', placeholder: 'Ex: Smoobu, Hostaway...' } },
        { id: 'o_q8', text: 'Avez-vous un système de "contrôle qualité" (ex: l\'équipe de nettoyage vous envoie des photos) après chaque nettoyage ?', level: 'Gold' },
        { id: 'o_q9', text: 'Avez-vous des procédures écrites (SOPs) pour les tâches courantes (check-in, check-out, gestion d\'une panne) ?', level: 'Gold' },
        { id: 'o_q10', text: 'Estimez-vous que votre gestion (ménage, communication, maintenance) est automatisée ou déléguée à plus de 80% ?', level: 'Gold' },
    ],
    pricing: [
        { id: 'p_q1', text: 'Avez-vous défini un prix de base "plancher" pour votre nuitée (basé sur vos coûts) ?', level: 'Bronze', subQuestion: { id: 'p_q1_price', label: 'Quel est votre prix plancher par nuit (€) ?', type: 'number', placeholder: 'Ex: 50' } },
        { id: 'p_q2', text: 'Avez-vous défini des frais de ménage séparés qui couvrent exactement le coût réel du nettoyage ?', level: 'Silver', subQuestion: { id: 'p_q2_fee', label: 'Quel est le montant de vos frais de ménage (€) ?', type: 'number', placeholder: 'Ex: 25' } },
        { id: 'p_q3', text: 'Différenciez-vous activement vos prix entre la haute saison et la basse saison ?', level: 'Silver' },
        { id: 'p_q4', text: 'Avez-vous des prix différents pour les jours de semaine (lun-jeu) et les week-ends (ven-dim) ?', level: 'Silver' },
        { id: 'p_q5', text: 'Analysez-vous (au moins 1x/mois) les prix de vos 5 concurrents directs ?', level: 'Gold' },
        { id: 'p_q6', text: 'Ajustez-vous manuellement vos prix à la hausse pour les événements locaux (concerts, salons, vacances scolaires) ?', level: 'Gold' },
        { id: 'p_q7', text: 'Avez-vous défini des règles de séjour minimum dynamiques (ex: 2 nuits le WE, 7 nuits en été) pour optimiser votre calendrier ?', level: 'Gold' },
        { id: 'p_q8', text: 'Utilisez-vous un outil de tarification dynamique externe (ex: PriceLabs, Wheelhouse) pour automatiser vos prix ?', level: 'Gold', subQuestion: { id: 'p_q8_tool', label: 'Quel outil de tarification utilisez-vous ?', type: 'text', placeholder: 'Ex: PriceLabs, Wheelhouse...' } },
        { id: 'p_q9', text: 'Proposez-vous des tarifs dégressifs (ex: -10% semaine, -25% mois) pour attirer les séjours longs ?', level: 'Gold' },
        { id: 'p_q10', text: 'Connaissez-vous et suivez-vous votre "RevPAR" (Revenu Par Chambre Disponible) ?', level: 'Gold', subQuestion: { id: 'p_q10_revpar', label: 'Quel est votre RevPAR moyen (€) ?', type: 'number', placeholder: 'Ex: 85' } },
    ],
    accomodation: [
        { id: 'a_q1', text: 'Le logement est-il 100% conforme aux normes de sécurité (détecteurs de fumée, CO, extincteur) ?', level: 'Bronze' },
        { id: 'a_q2', text: 'Le Wi-Fi est-il rapide (fibre/haut débit), fiable et couvre-t-il 100% du logement (pas de "zone morte") ?', level: 'Silver', subQuestion: { id: 'a_q2_speed', label: 'Quel est le débit descendant (en Mbit/s) ?', type: 'number', placeholder: 'Ex: 100' } },
        { id: 'a_q3', text: 'La cuisine est-elle équipée de tous les ustensiles essentiels et de qualité pour qu\'un Invité puisse vraiment cuisiner ?', level: 'Silver' },
        { id: 'a_q4', text: 'La literie (matelas, oreillers, couette) est-elle de qualité hôtelière et confortable (et non "premier prix") ?', level: 'Silver' },
        { id: 'a_q5', text: 'La décoration est-elle soignée, moderne (ou thématique) et "dépersonnalisée" (pas de photos de famille) ?', level: 'Gold' },
        { id: 'a_q6', text: 'Fournissez-vous des équipements "expérientiels" (ex: Netflix, enceinte Bluetooth, machine Nespresso avec capsules) ?', level: 'Gold', subQuestion: { id: 'a_q6_example', label: 'Exemple d\'équipement expérientiel fourni', type: 'text', placeholder: 'Ex: Abonnement Netflix, enceinte Bose' } },
        { id: 'a_q7', text: 'Avez-vous un espace de travail dédié (vrai bureau, bonne chaise, bonne lumière) pour les télétravailleurs ?', level: 'Gold' },
        { id: 'a_q8', text: 'Votre logement est-il optimisé pour votre clientèle cible (ex: lit bébé et chaise haute si vous visez les familles) ?', level: 'Gold' },
        { id: 'a_q9', text: 'Avez-vous investi dans un atout "Whaou" ou "Instagrammable" (ex: Jacuzzi, vue exceptionnelle, balançoire, mur végétal) ?', level: 'Gold', subQuestion: { id: 'a_q9_asset', label: 'Décrivez votre atout "Whaou"', type: 'text', placeholder: 'Ex: Jacuzzi sur la terrasse' } },
        { id: 'a_q10', text: 'Planifiez-vous un budget annuel de "rafraîchissement" (peinture, remplacement du linge usé, coussins) ?', level: 'Gold' },
    ],
    legal: [
        { id: 'l_q1', text: 'Avez-vous vérifié que votre règlement de copropriété (si applicable) autorise explicitement la location courte durée ?', level: 'Silver' },
        { id: 'l_q2', text: 'Avez-vous déclaré votre activité en mairie et obtenu un numéro d\'enregistrement (si requis dans votre ville) ?', level: 'Silver', subQuestion: { id: 'l_q2_number', label: 'Quel est votre numéro d\'enregistrement ?', type: 'text', placeholder: 'Ex: 7510101234567' } },
        { id: 'l_q3', text: 'Collectez-vous et reversez-vous la taxe de séjour (si elle n\'est pas gérée automatiquement par la plateforme) ?', level: 'Silver' },
        { id: 'l_q4', text: 'Déclarez-vous 100% de vos revenus de location aux impôts ?', level: 'Silver' },
        { id: 'l_q5', text: 'Avez-vous souscrit une assurance spécifique (Responsabilité Civile Pro / PNO) en plus de la garantie Airbnb/Booking ?', level: 'Gold', subQuestion: { id: 'l_q5_insurance', label: 'Nom de votre compagnie d\'assurance', type: 'text', placeholder: 'Ex: AXA, Allianz...' } },
        { id: 'l_q6', text: 'Avez-vous un règlement intérieur clair et affiché, que les Invités acceptent légalement lors de la réservation ?', level: 'Gold' },
        { id: 'l_q7', text: 'Avez-vous choisi un statut fiscal optimisé (ex: LMNP au réel) pour votre activité ?', level: 'Gold', subQuestion: { id: 'l_q7_status', label: 'Quel est votre statut fiscal ?', type: 'text', placeholder: 'Ex: LMNP au réel' } },
        { id: 'l_q8', text: 'Tenez-vous une comptabilité analytique (un "P&L") qui suit précisément tous vos coûts (ménage, produits, électricité, commissions...) ?', level: 'Gold' },
        { id: 'l_q9', text: 'Travaillez-vous avec un expert-comptable spécialisé dans l\'immobilier ou la location meublée ?', level: 'Gold', subQuestion: { id: 'l_q9_firm', label: 'Nom de l\'expert-comptable ou du cabinet', type: 'text', placeholder: 'Ex: Cabinet Dupont' } },
        { id: 'l_q10', text: 'Calculez-vous (au moins 1x/trimestre) votre rentabilité nette (Bénéfice Net) et votre ROI (Retour sur Investissement) ?', level: 'Gold' },
    ]
};


@Component({
    selector: 'saas-angle-view',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MicrositeRendererComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './angle-view.component.html',
})
export class AngleViewComponent implements OnInit {
    view = input.required<View>();
    // Note: userPlan input might be string, force casting or handling in logic
    userPlan = input.required<string>();

    private repository = inject(HostRepository);
    private geminiService = inject(GeminiService);
    private store = inject(SessionStore);
    private bookletService = inject(WelcomeBookletService);
    private fb: FormBuilder = inject(FormBuilder);

    isModalOpen = signal(false);
    onboardingForm = signal<FormGroup | null>(null);

    // Tools Logic
    activeToolId = signal<string | null>(null);

    // Marketing Description Logic
    marketingText = signal<string>('');
    isGenerating = signal(false);
    isAiDesigning = signal(false);
    saveMessage = signal<string | null>(null);
    currentPropertyId = signal<string | null>(null);

    // Dynamic Content Signals
    propertyDetails = signal<any>(null);
    bookletContent = signal<any>(null);

    // Guide Modal State
    // Guide Modal State - Handled by renderer now


    // User contact info
    userEmail = computed(() => this.store.userProfile()?.email || '');

    // Microsite Builder Logic
    micrositeConfig = signal<MicrositeConfig>({
        template: 'modern',
        primaryColor: '#3b82f6',
        showDescription: true,
        showContact: true,
        visibleSections: ['gallery', 'amenities', 'guide'],
        hiddenPhotoUrls: [],
        headerPhotoUrl: null,
        heroLayout: 'full',
        headline: 'Bienvenue chez vous'
    });
    micrositePhotos = signal<BuilderPhoto[]>([]);

    // Computed signal for visible photos to avoid arrow function in template
    visiblePhotos = computed(() => this.micrositePhotos().filter(p => p.visible));

    // Available sections definition - Moved UP to ensure availability
    readonly availableSections: SectionDef[] = [
        { id: 'gallery', label: 'Galerie Photos' },
        { id: 'amenities', label: 'Équipements' },
        { id: 'reviews', label: 'Avis' },
        { id: 'rules', label: 'Règles' },
        { id: 'guide', label: 'Guide Local' },
    ];

    // Computed for Ordered Sections
    orderedSections = computed(() => {
        const order = this.micrositeConfig().visibleSections;
        if (!order) return [];
        return order
            .map(id => this.availableSections.find(s => s.id === id))
            .filter((s): s is SectionDef => !!s); // Filter out undefined
    });

    readonly themeOptions = [
        { id: 'modern', label: 'Moderne (Épuré & Blanc)' },
        { id: 'cozy', label: 'Cosy (Chaleureux & Beige)' },
        { id: 'luxury', label: 'Luxe (Sombre & Doré)' },
    ];

    // AI Access Check
    hasAiAccess = computed(() => {
        const plan = this.userPlan();
        return plan === 'Silver' || plan === 'Gold';
    });

    private planLevels: Record<string, number> = {
        'Freemium': 0,
        'Bronze': 1,
        'Silver': 2,
        'Gold': 3
    };

    private allAngleData: Record<string, AngleDetails> = {
        'marketing': {
            title: 'Marketing & Visibilité',
            description: 'Attirez plus de voyageurs et maximisez votre visibilité en ligne.',
            tools: [
                { id: 'microsite', name: 'Configuration de Microsite', description: 'Créez et personnalisez un site vitrine pour la réservation directe (WYSIWYG).', requiredPlan: 'Bronze' },
                { id: 'ai-prompts', name: 'Prompts IA pour Annonces', description: 'Générez des descriptions de listing percutantes.', requiredPlan: 'Silver' },
                { id: 'visibility-audit', name: 'Audit IA de Visibilité', description: 'Analysez et améliorez votre positionnement sur les plateformes.', requiredPlan: 'Gold' },
            ]
        },
        'experience': {
            title: 'Expérience Client',
            description: 'Offrez une expérience 5 étoiles inoubliable à vos voyageurs.',
            tools: [
                { id: 'booklet', name: 'Template Livret d\'Accueil', description: 'Un guide digital complet pour vos invités.', requiredPlan: 'Bronze' },
                { id: 'ai-assistant', name: 'Assistant IA Messages (N1)', description: 'Automatisez les réponses aux questions fréquentes.', requiredPlan: 'Silver' },
                { id: 'guest-screening', name: 'Guest Screening IA', description: 'Analysez le profil des voyageurs pour plus de sérénité.', requiredPlan: 'Gold' },
            ]
        },
        'operations': {
            title: 'Gestion Opérationnelle',
            description: 'Simplifiez et automatisez la gestion quotidienne de votre location.',
            tools: [
                { id: 'checklists', name: 'Checklists Interactives', description: 'Ne rien oublier pour le ménage et la maintenance.', requiredPlan: 'Bronze' },
                { id: 'ical-sync', name: 'Synchronisation iCal', description: 'Centralisez vos calendriers depuis toutes les plateformes.', requiredPlan: 'Silver' },
                { id: 'delegation-sim', name: 'Simulateur IA de Délégation', description: 'Estimez les coûts et l\'impact de l\'externalisation.', requiredPlan: 'Gold' },
            ]
        },
        'pricing': {
            title: 'Stratégie Tarifaire',
            description: 'Optimisez vos prix pour maximiser vos revenus toute l\'année.',
            tools: [
                { id: 'profitability', name: 'Templates de Calcul de Rentabilité', description: 'Calculez vos marges et fixez vos prix de base.', requiredPlan: 'Bronze' },
                { id: 'market-alerts', name: 'Alertes de Marché', description: 'Soyez notifié des événements locaux pour ajuster vos prix.', requiredPlan: 'Silver' },
                { id: 'pricing-tools', name: 'Intégration Outils Pricing', description: 'Connectez votre compte à des outils de tarification dynamique.', requiredPlan: 'Gold' },
            ]
        },
        'accomodation': {
            title: 'Optimisation Logement',
            description: 'Mettez en valeur votre bien et assurez sa conformité.',
            tools: [
                { id: 'airbnb-ready', name: 'Quiz "Airbnb-Ready"', description: 'Vérifiez si votre logement respecte les standards.', requiredPlan: 'Bronze' },
                { id: 'security-check', name: 'Checklist Équipements & Sécurité', description: 'Assurez-vous que rien ne manque pour le confort et la sécurité de vos voyageurs.', requiredPlan: 'Bronze' },
                { id: 'manual-gen', name: 'Générateur de Modes d\'Emploi', description: 'Créez des guides illustrés pour vos équipements.', requiredPlan: 'Silver' },
                { id: 'unique-gen', name: 'Générateur "Plus Unique" (IA)', description: 'Trouvez des idées pour rendre votre logement unique.', requiredPlan: 'Gold' },
            ]
        },
        'legal': {
            title: 'Légal & Finance',
            description: 'Naviguez la complexité administrative et financière en toute sérénité.',
            tools: [
                { id: 'reminders', name: 'Rappels Administratifs', description: 'Des notifications pour les échéances fiscales et légales.', requiredPlan: 'Bronze' },
                { id: 'kpis-simple', name: 'Dashboard KPIs Simplifié', description: 'Suivez vos revenus, dépenses et taux d\'occupation.', requiredPlan: 'Silver' },
                { id: 'kpis-advanced', name: 'Dashboard KPIs Avancé', description: 'Analysez vos performances en profondeur (RevPAR, etc.).', requiredPlan: 'Gold' },
            ]
        },
        'mindset': {
            title: 'Mindset & Développement',
            description: 'Développez vos compétences pour devenir un entrepreneur de l\'hospitalité.',
            tools: [
                { id: 'elearning', name: 'Bibliothèque E-learning', description: 'Accédez à nos cours vidéo sur les fondamentaux.', requiredPlan: 'Bronze' },
                { id: 'community', name: 'Communauté Privée', description: 'Échangez avec d\'autres hôtes et nos experts.', requiredPlan: 'Silver' },
                { id: 'coaching', name: 'Coaching 1:1 & Groupe', description: 'Des sessions de coaching pour surmonter vos blocages.', requiredPlan: 'Gold' },
            ]
        },
    };

    constructor() {
        effect(() => {
            // Reload data when the view changes (e.g., switching property)
            this.activeToolId.set(null); // Reset active tool on view change
            this.loadPropertyData();
        });
    }

    ngOnInit() {
        this.loadPropertyData();
    }

    async loadPropertyData() {
        const v = this.view();
        if (v.propertyName) {
            try {
                const prop = await this.repository.getPropertyByName(v.propertyName);
                if (prop) {
                    this.currentPropertyId.set(prop.id);
                    this.propertyDetails.set(prop);
                    this.marketingText.set(prop.listing_description || '');
                }

                // Check if WelcomeBookletService has hot data for this property
                console.log(`[DEBUG] AngleView Load: ViewProp=${v.propertyName}, ServiceProp=${this.bookletService.propertyName()}, ServiceLoading=${this.bookletService.isLoading()}`);

                if (this.bookletService.propertyName() === v.propertyName && !this.bookletService.isLoading()) {
                    console.log('[DEBUG] AngleView: Using hot data from WelcomeBookletService');
                    const rawContent = this.bookletService.editorForm.getRawValue();
                    console.log('[DEBUG] Raw Content Keys:', Object.keys(rawContent));
                    console.log('[DEBUG] Guide Content:', rawContent?.guideGastro, rawContent?.guideActivites);

                    this.bookletContent.set(rawContent);

                    // Sync Marketing Text (Welcome Message)
                    if (rawContent.bienvenue?.messageBienvenue) {
                        this.marketingText.set(rawContent.bienvenue.messageBienvenue);
                    }

                    // Re-evaluate Smart Defaults
                    let currentConfig = { ...this.bookletService.micrositeConfig() };
                    console.log('[DEBUG] Service Config Visible Sections (Before):', currentConfig.visibleSections);

                    const smartSections = new Set(currentConfig.visibleSections);

                    // Force enable Guide if content exists
                    if (rawContent?.guideGastro?.recommandationRestaurants || rawContent?.guideActivites?.guideActivites) {
                        console.log('[DEBUG] Force enabling Guide');
                        smartSections.add('guide');
                    }
                    if (rawContent?.regles?.politiqueFetes || rawContent?.regles?.politiqueNonFumeur ||
                        rawContent?.regles?.heuresSilence || rawContent?.depart?.heureLimiteCheckout) {
                        console.log('[DEBUG] Force enabling Rules');
                        smartSections.add('rules');
                    }

                    currentConfig.visibleSections = Array.from(smartSections);
                    console.log('[DEBUG] Final Config Visible Sections:', currentConfig.visibleSections);

                    this.micrositeConfig.set(currentConfig);
                    const smartConfig = currentConfig;

                    // Sync Photos from service
                    const servicePhotos = this.bookletService.propertyPhotos();
                    console.log('[DEBUG] Service Photos Count:', servicePhotos?.length);

                    if (servicePhotos) {
                        const photosWithVisibility = servicePhotos.map((p: any) => ({
                            ...p,
                            visible: !smartConfig.hiddenPhotoUrls.includes(p.url)
                        }));
                        this.micrositePhotos.set(photosWithVisibility);
                    }
                    return; // EXIT EARLY - Data Loaded
                } else {
                    console.log('[DEBUG] Hot sync skipped. Fallback to DB.');
                }

                // Load saved configuration for microsite (Fallback to DB)
                const bookletData = await this.repository.getBooklet(v.propertyName);
                console.log('[DEBUG] DB Booklet Data:', bookletData ? 'Found' : 'Null');
                let savedConfig: Partial<MicrositeConfig> | null = null;

                // Ensure basic structure exists for booklet content even if DB is partial
                const defaultContent = {
                    guideGastro: { recommandationRestaurants: '' },
                    guideActivites: { guideActivites: '' },
                    transports: { taxisLocaux: '' },
                    depart: { heureLimiteCheckout: '11:00' },
                    regles: { politiqueFetes: '', politiqueNonFumeur: '', heuresSilence: '' }
                };

                const mergedBooklet = { ...defaultContent, ...bookletData };
                // Ensure sub-objects exist
                if (!mergedBooklet.guideGastro) mergedBooklet.guideGastro = {};
                if (!mergedBooklet.guideActivites) mergedBooklet.guideActivites = {};
                if (!mergedBooklet.transports) mergedBooklet.transports = {};
                if (!mergedBooklet.depart) mergedBooklet.depart = {};
                if (!mergedBooklet.regles) mergedBooklet.regles = {};

                this.bookletContent.set(mergedBooklet);

                if (bookletData && bookletData.microsite_config) {
                    try {
                        savedConfig = typeof bookletData.microsite_config === 'string'
                            ? JSON.parse(bookletData.microsite_config)
                            : bookletData.microsite_config;
                    } catch (e) { console.error("Error parsing microsite config", e); }
                }

                if (prop) {
                    // Use shared helper to resolve config (Smart Defaults or Saved)
                    const resolved = resolveMicrositeConfig(mergedBooklet, savedConfig as any);

                    // Override defaults with property-specific data if needed (e.g. valid backup photo)
                    if (!resolved.headerPhotoUrl && prop.property_photos?.[0]) {
                        resolved.headerPhotoUrl = prop.property_photos[0].url;
                    }

                    // Force Re-evaluate Smart Defaults (Ensure visibility if content exists)
                    // This fixes the issue where DB config might hide sections that now have content
                    const smartSections = new Set(resolved.visibleSections);
                    if (mergedBooklet?.guideGastro?.recommandationRestaurants || mergedBooklet?.guideActivites?.guideActivites) {
                        smartSections.add('guide');
                    }
                    if (mergedBooklet?.regles?.politiqueFetes || mergedBooklet?.regles?.politiqueNonFumeur ||
                        mergedBooklet?.regles?.heuresSilence || mergedBooklet?.depart?.heureLimiteCheckout) {
                        smartSections.add('rules');
                    }
                    resolved.visibleSections = Array.from(smartSections);

                    this.micrositeConfig.set(resolved);

                    // Init Photos with visibility state based on saved config
                    if (prop.property_photos) {
                        const photosWithVisibility = prop.property_photos.map((p: any) => ({
                            ...p,
                            visible: !this.micrositeConfig().hiddenPhotoUrls.includes(p.url)
                        }));
                        this.micrositePhotos.set(photosWithVisibility);

                        // Set default header if not set
                        if (!this.micrositeConfig().headerPhotoUrl && photosWithVisibility.length > 0) {
                            this.updateConfig('headerPhotoUrl', photosWithVisibility[0].url);
                        }
                    }
                }
            } catch (e) {
                console.error("Error loading property data:", e);
            }
        }
    }

    // --- Tool Management ---
    openTool(toolId: string) {
        this.activeToolId.set(toolId);
    }

    closeTool() {
        this.activeToolId.set(null);
    }

    // --- Microsite Builder Logic ---
    updateConfig(key: keyof MicrositeConfig, value: any) {
        this.micrositeConfig.update(c => ({ ...c, [key]: value }));
    }

    // Direct content editing method
    updateBookletText(section: string, field: string, value: any) {
        this.bookletContent.update(current => {
            const updated = { ...current };
            if (!updated[section]) updated[section] = {};
            updated[section][field] = value;
            return updated;
        });
    }

    toggleContactForm(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.micrositeConfig.update(c => ({ ...c, showContact: isChecked }));
    }

    // Add/Remove section from visible list
    toggleSectionVisibility(sectionId: string, event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.micrositeConfig.update(c => {
            const currentSections = c.visibleSections || [];
            if (isChecked) {
                // Add to end if not present
                if (!currentSections.includes(sectionId)) {
                    return { ...c, visibleSections: [...currentSections, sectionId] };
                }
            } else {
                // Remove
                return { ...c, visibleSections: currentSections.filter(id => id !== sectionId) };
            }
            return c;
        });
    }

    // Reorder sections
    moveSection(index: number, direction: 'up' | 'down') {
        this.micrositeConfig.update(c => {
            const sections = [...c.visibleSections];
            if (direction === 'up' && index > 0) {
                [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
            } else if (direction === 'down' && index < sections.length - 1) {
                [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
            }
            return { ...c, visibleSections: sections };
        });
    }

    toggleDescriptionVisibility(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.micrositeConfig.update(c => ({ ...c, showDescription: isChecked }));
    }

    togglePhotoVisibility(index: number) {
        this.micrositePhotos.update(photos => {
            const newPhotos = [...photos];
            newPhotos[index] = { ...newPhotos[index], visible: !newPhotos[index].visible };
            return newPhotos;
        });

        // Sync to config for saving later
        const hidden = this.micrositePhotos().filter(p => !p.visible).map(p => p.url);
        this.micrositeConfig.update(c => ({ ...c, hiddenPhotoUrls: hidden }));
    }

    setCoverPhoto(url: string) {
        this.updateConfig('headerPhotoUrl', url);
    }

    movePhoto(index: number, direction: 'up' | 'down') {
        const photos = [...this.micrositePhotos()];
        if (direction === 'up' && index > 0) {
            [photos[index], photos[index - 1]] = [photos[index - 1], photos[index]];
        } else if (direction === 'down' && index < photos.length - 1) {
            [photos[index], photos[index + 1]] = [photos[index + 1], photos[index]];
        }
        this.micrositePhotos.set(photos);
    }

    async generateMicrositeWithAI() {
        if (!this.hasAiAccess()) return;
        if (!this.view().propertyName) return;

        this.isAiDesigning.set(true);
        try {
            // Fetch property context
            const propName = this.view().propertyName!;
            const bookletData = await this.repository.getBooklet(propName);
            const propData = await this.repository.getPropertyByName(propName);

            // Construct context object
            const context = {
                name: propName,
                description: propData.listing_description,
                address: propData.address,
                type: 'Vacation Rental',
                amenities: propData.property_equipments ? propData.property_equipments.map((e: any) => e.name) : [],
                bookletSummary: bookletData ? JSON.stringify(bookletData).substring(0, 1000) : ''
            };

            const aiConfig = await this.geminiService.generateMicrositeDesign(context);

            if (aiConfig) {
                this.micrositeConfig.update(c => ({
                    ...c,
                    ...aiConfig,
                    visibleSections: (aiConfig.visibleSections || []).filter((s: string) =>
                        this.availableSections.some(avail => avail.id === s)
                    )
                }));
                this.saveMessage.set("Design généré par l'IA !");
                setTimeout(() => this.saveMessage.set(null), 3000);
            }
        } catch (e) {
            console.error("AI Design Error:", e);
            alert("Erreur lors de la génération du design.");
        } finally {
            this.isAiDesigning.set(false);
        }
    }

    async saveMicrosite() {
        if (!this.view().propertyName) return;

        try {
            this.saveMessage.set(null);

            // Sync hidden photos before saving config
            const hidden = this.micrositePhotos().filter(p => !p.visible).map(p => p.url);
            const configToSave = { ...this.micrositeConfig(), hiddenPhotoUrls: hidden };

            // 1. Save Config to Booklet Table
            await this.repository.saveBooklet(this.view().propertyName!, {
                microsite_config: JSON.stringify(configToSave)
            });

            // 2. Save Photo Order
            if (this.currentPropertyId()) {
                await this.repository.savePropertyPhotos(this.currentPropertyId()!, this.micrositePhotos());
            }

            // 3. Save Description & Content Updates (Booklet Text)
            if (this.currentPropertyId()) {
                // Update listing description in properties table
                await this.repository.updatePropertyData(this.currentPropertyId()!, {
                    marketing: { description: this.marketingText() }
                });

                // Sync to booklet data for consistency + Save all edited booklet fields
                // We construct a payload matching the structure expected by saveBooklet
                const bookletPayload: any = {
                    bienvenue: { messageBienvenue: this.marketingText() },
                    // Save Guide fields
                    guideGastro: { recommandationRestaurants: this.bookletContent()?.guideGastro?.recommandationRestaurants },
                    guideActivites: { guideActivites: this.bookletContent()?.guideActivites?.guideActivites },
                    transports: { taxisLocaux: this.bookletContent()?.transports?.taxisLocaux },
                    // Save Rules fields
                    depart: { heureLimiteCheckout: this.bookletContent()?.depart?.heureLimiteCheckout },
                    regles: {
                        politiqueFetes: this.bookletContent()?.regles?.politiqueFetes,
                        politiqueNonFumeur: this.bookletContent()?.regles?.politiqueNonFumeur,
                        heuresSilence: this.bookletContent()?.regles?.heuresSilence
                    }
                };

                await this.repository.saveBooklet(this.view().propertyName!, bookletPayload);
            }

            this.saveMessage.set("Microsite publié et contenu sauvegardé !");
            setTimeout(() => this.saveMessage.set(null), 3000);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la publication.");
        }
    }



    // --- Marketing AI Logic ---
    async generateDescription() {
        if (!this.hasAiAccess()) return; // Security check

        const propId = this.currentPropertyId();
        const propName = this.view().propertyName;
        if (!propId || !propName) return;

        this.isGenerating.set(true);
        try {
            // Get full booklet data as context
            const bookletData = await this.repository.getBooklet(propName);
            let context = `Nom propriété: ${propName}. `;
            if (bookletData) {
                // Convert JSON booklet to string context
                context += JSON.stringify(bookletData);
            }

            const generated = await this.geminiService.generateMarketingDescription(context);
            this.marketingText.set(generated);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la génération.");
        } finally {
            this.isGenerating.set(false);
        }
    }

    async saveDescription() {
        // Reuse main save function logic for consistency
        await this.saveMicrosite();
    }

    angleDetails = computed<AngleDetails | null>(() => {
        const viewId = this.view().id;
        return this.allAngleData[viewId] || null;
    });

    isToolLocked(requiredPlan: Plan): boolean {
        // Default to Freemium (0) if plan is not found in map
        const userLevel = this.planLevels[this.userPlan()] ?? 0;
        const requiredLevel = this.planLevels[requiredPlan] ?? 0;
        return userLevel < requiredLevel;
    }

    currentQuestions = computed<OnboardingQuestion[] | undefined>(() => {
        return ONBOARDING_DATA[this.view().id];
    });

    questionsByLevel = computed(() => {
        const questions = this.currentQuestions();
        if (!questions) return null;

        const grouped = questions.reduce((acc, q) => {
            (acc[q.level] = acc[q.level] || []).push(q);
            return acc;
        }, {} as Record<QuestionLevel, OnboardingQuestion[]>);

        return {
            Bronze: grouped.Bronze || [],
            Silver: grouped.Silver || [],
            Gold: grouped.Gold || [],
        };
    });

    openOnboarding(): void {
        const questions = this.currentQuestions();
        if (!questions || questions.length === 0) return;

        const formControls = questions.reduce((acc, q) => {
            acc[q.id] = [false]; // checkbox
            if (q.subQuestion) {
                acc[q.subQuestion.id] = ['']; // sub-question input
            }
            return acc;
        }, {} as Record<string, any>);


        this.onboardingForm.set(this.fb.group(formControls));
        this.isModalOpen.set(true);
    }

    closeOnboarding(): void {
        this.isModalOpen.set(false);
        this.onboardingForm.set(null);
    }

    saveOnboarding(): void {
        if (this.onboardingForm()?.valid) {
            console.log('Saving Onboarding data...', this.onboardingForm()?.value);
            // In a real app, this data would be saved to a service
            this.closeOnboarding();
        }
    }
}
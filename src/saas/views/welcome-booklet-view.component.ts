
import { ChangeDetectionStrategy, Component, computed, input, signal, inject, effect, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HostRepository } from '../../services/host-repository.service';
import { GeminiService } from '../../services/gemini.service';
import { WidgetService } from '../../services/widget.service';
import { SessionStore } from '../../state/session.store';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface BookletSection {
    id: string;
    formGroupName: string;
    editorTitle: string;
    previewTitle: string;
    icon: SafeHtml;
}

@Component({
    selector: 'saas-welcome-booklet-view',
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './welcome-booklet-view.component.html',
})
export class WelcomeBookletViewComponent implements OnInit, OnDestroy {
    propertyName = input.required<string>();

    private repository = inject(HostRepository);
    private geminiService = inject(GeminiService);
    private widgetService = inject(WidgetService);
    private store = inject(SessionStore);
    private fb: FormBuilder = inject(FormBuilder);
    private sanitizer: DomSanitizer = inject(DomSanitizer);
    private cdr = inject(ChangeDetectorRef);

    editorForm: FormGroup;
    openChapter = signal<string>('');
    activeTab = signal<'edit' | 'listing' | 'microsite' | 'booklet'>('edit');

    saveMessage = signal<string | null>(null);
    isLoading = signal(false);
    isAiLoading = signal(false);

    isCoverOpen = signal(false);
    isPhotosOpen = signal(false);
    isLocationOpen = signal(false);

    propertyId = signal<string | null>(null);
    propertyPhotos = signal<{ url: string, category: string, visible: boolean }[]>([]);

    // Microsite Config for accurate preview
    micrositeConfig = signal<any>({
        template: 'modern',
        primaryColor: '#3b82f6',
        headline: 'Bienvenue chez vous',
        visibleSections: ['gallery', 'amenities', 'guide'],
        showDescription: true,
        showContact: true,
        headerPhotoUrl: null,
        hiddenPhotoUrls: []
    });

    // Dynamic Content for Preview
    bookletContent = signal<any>(null);
    propertyDetails = signal<any>(null);
    marketingText = signal<string>('');

    // Guide Modal State
    guideModalState = signal<{ isOpen: boolean, title: string, content: string, icon: string }>({
        isOpen: false, title: '', content: '', icon: ''
    });

    showCategoryManager = signal(false);
    newCategoryName = signal('');

    readonly defaultCategories = ['Salon', 'Cuisine', 'Chambre 1', 'Chambre 2', 'Salle de bain', 'Extérieur', 'Piscine', 'Autre'];
    availableCategories = signal<string[]>([...this.defaultCategories]);

    // Computed Access Rights
    userPlan = computed(() => this.store.userProfile()?.plan || 'Freemium');
    userEmail = computed(() => this.store.userProfile()?.email || '');
    hasAiAccess = computed(() => this.store.hasFeature('ai-prompts'));
    isAiDesigning = signal(false);

    // Theme Options
    readonly themeOptions = [
        { id: 'modern', label: 'Moderne (Épuré & Blanc)' },
        { id: 'cozy', label: 'Cosy (Chaleureux & Beige)' },
        { id: 'luxury', label: 'Luxe (Sombre & Doré)' },
    ];

    // Available Sections for Microsite
    readonly availableSections = [
        { id: 'gallery', label: 'Galerie Photos' },
        { id: 'amenities', label: 'Équipements' },
        { id: 'reviews', label: 'Avis' },
        { id: 'rules', label: 'Règles' },
        { id: 'guide', label: 'Guide Local' },
    ];

    // Computed for Ordered Sections
    orderedSections = computed(() => {
        const order = this.micrositeConfig().visibleSections || [];
        return order
            .map((id: string) => this.availableSections.find(s => s.id === id))
            .filter((s: any): s is { id: string, label: string } => !!s);
    });

    // Computed for Visible Photos (gallery)
    visiblePhotos = computed(() => this.micrositePhotos().filter(p => p.visible));
    micrositePhotos = computed(() => this.propertyPhotos()); // Alias for template compatibility

    sections: BookletSection[] = [];

    private refreshInterval: any;
    private addressSub: Subscription | undefined;

    private readonly controlLabels: Record<string, Record<string, string>> = {
        'bienvenue': {
            messageBienvenue: 'Message de bienvenue / Description',
            coordonneesHote: 'Coordonnées de l\'hôte ou du gestionnaire',
            numeroUrgenceHote: 'Numéro d\'urgence absolue (24/7) de l\'hôte',
            numeroUrgenceLocal: 'Numéro d\'urgence local (Police, Pompiers, Ambulance)',
            medecins: 'Coordonnées d\'un médecin local',
            dentiste: 'Coordonnées d\'un dentiste d\'urgence',
            veterinaire: 'Coordonnées d\'un vétérinaire d\'urgence',
            centreAntipoison: 'Numéro du centre antipoison',
        },
        'accessibilite': {
            instructionsPMR: 'Instructions d\'accessibilité (PMR)',
            equipementsBebe: 'Équipements pour bébé',
            locationMaterielMedical: 'Options de location de matériel médical',
        },
        'systemes': {
            wifi: 'Code d\'accès Wi-Fi et nom du réseau',
            chauffage: 'Instructions pour le chauffage central / la chaudière',
            climatisation: 'Instructions pour la climatisation (par zone)',
            ventilation: 'Instructions pour le système de ventilation (VMC)',
            disjoncteur: 'Emplacement du disjoncteur électrique principal',
            vanneEau: 'Emplacement de la vanne d\'arrêt d\'eau',
            cheminee: 'Instructions pour la cheminée ou le poêle à bois',
            voletsStores: 'Utilisation des volets roulants ou stores',
            coffreFort: 'Emplacement et code du coffre-fort',
        },
        'securite': {
            alarme: 'Instructions pour le système d\'alarme',
            extincteur: 'Emplacement de l\'extincteur',
            premiersSecours: 'Emplacement de la trousse de premiers secours',
            detecteurs: 'Fonctionnement des détecteurs de fumée et de monoxyde de carbone',
            evacuation: 'Procédure d\'évacuation en cas d\'incendie',
        },
        'cuisine': {
            refrigerateur: 'Réfrigérateur',
            congelateur: 'Congélateur',
            fourTraditionnel: 'Four traditionnel',
            fourMicroOndes: 'Four à micro-ondes',
            plaquesCuisson: 'Plaques de cuisson',
            hotte: 'Hotte aspirante',
            laveVaisselle: 'Lave-vaisselle',
            cafetiereFiltre: 'Cafetière à filtre',
            machineExpresso: 'Machine à expresso',
            bouilloire: 'Bouilloire électrique',
            grillePain: 'Grille-pain',
            mixeur: 'Mixeur / Blender',
            robotCuisine: 'Robot de cuisine / Batteur',
            presseAgrumes: 'Presse-agrumes',
            caveVin: 'Cave à vin',
            machineGlace: 'Machine à glace',
            appareilRaclette: 'Appareil à raclette / fondue / plancha',
            fournituresBase: 'Inventaire des fournitures de base',
            extras: 'Inventaire des "extras"',
        },
        'salon': {
            television: 'Télévision',
            systemeAudio: 'Système audio',
            consoleJeux: 'Console de jeux vidéo',
            lecteurDVD: 'Lecteur DVD/Blu-ray',
            bibliotheque: 'Bibliothèque',
            jeuxSociete: 'Jeux de société',
        },
        'chambres': {
            literieOreillers: 'Type de literie et d\'oreillers',
            lingeSupplementaire: 'Emplacement du linge de lit supplémentaire',
            procedureChangementLinge: 'Procédure de changement de linge',
            peignoirsChaussons: 'Peignoirs et chaussons',
            secheCheveux: 'Sèche-cheveux',
            kitCouture: 'Kit de couture d\'urgence',
            prisesAntiMoustiques: 'Prises anti-moustiques',
        },
        'buanderie': {
            laveLinge: 'Lave-linge',
            secheLinge: 'Sèche-linge',
            etendoir: 'Étendoir à linge',
            ferRepasser: 'Fer à repasser',
            plancheRepasser: 'Planche à repasser',
            aspirateur: 'Aspirateur',
            necessaireNettoyage: 'Nécessaire de nettoyage',
        },
        'bienEtreExterieurs': {
            piscine: 'Instructions d\'utilisation de la piscine',
            jacuzzi: 'Instructions d\'utilisation du jacuzzi',
            saunaHammam: 'Instructions d\'utilisation du sauna ou hammam',
            barbecue: 'Instructions pour le barbecue',
            mobilierJardin: 'Mobilier de jardin',
            eclairageExterieur: 'Éclairage extérieur',
            materielPlage: 'Matériel de plage à disposition',
            materielSport: 'Matériel de sport à disposition',
            doucheExterieure: 'Douche extérieure',
        },
        'parking': {
            reglesStationnement: 'Règles de stationnement',
            ouvertureGarage: 'Instructions pour l\'ouverture du garage',
        },
        'regles': {
            heuresSilence: 'Heures de silence / Respect du voisinage',
            politiqueFetes: 'Politique concernant les fêtes ou les invités',
            politiqueNonFumeur: 'Politique non-fumeur',
            gestionCles: 'Gestion des clés',
        },
        'animaux': {
            reglesSpecifiques: 'Règles spécifiques',
            fournitureAnimaux: 'Fourniture de bols, panier ou couverture',
            sacsDejections: 'Emplacement des sacs à déjections',
            plagesParcsChiens: 'Plages ou parcs locaux acceptant les chiens',
            contactPetsitter: 'Contact d\'un petsitter local',
        },
        'dechets': {
            poubellesInterieures: 'Emplacement des poubelles intérieures',
            triSelectif: 'Instructions de tri sélectif',
            poubellesExterieures: 'Emplacement des poubelles extérieures',
            joursRamassage: 'Jours de ramassage des ordures',
        },
        'guideGastro': {
            boulangerie: 'Boulangerie (la plus proche)',
            supermarche: 'Supermarché / Épicerie fine',
            marcheLocal: 'Marché local',
            recommandationRestaurants: 'Recommandation de restaurants',
            restaurantsVegetariens: 'Restaurants avec options végétariennes / véganes',
            restaurantsAllergies: 'Restaurants gérant les allergies',
            restaurantsChiensAcceptes: 'Restaurants acceptant les chiens',
            recommandationBarsCafes: 'Recommandation de bars ou cafés',
            servicesLivraisonRepas: 'Services de livraison de repas',
            chefADomicile: 'Services de "chef à domicile" ou traiteur',
            degustationsLocales: 'Dégustations locales (vignobles)',
        },
        'guideActivites': {
            randonnee: 'Sentiers de randonnée pédestre',
            vtt: 'Itinéraires de VTT ou pistes cyclables',
            locationVelos: 'Location de vélos',
            sportsNautiques: 'Sports nautiques',
            plages: 'Plages',
            centreEquestre: 'Centre équestre',
            golf: 'Parcours de golf',
            tennisPadel: 'Terrains de tennis ou de padel',
            escaladeAccrobranche: 'Site d\'escalade ou d\'accrobranche',
            salleSport: 'Salle de sport / centre de fitness',
            museesGaleries: 'Musées et galeries d\'art',
            monumentsChateaux: 'Monuments historiques et châteaux',
            parcsNationaux: 'Parcs d\'attractions ou parcs à thème',
            activitesEnfants: 'Activités pour enfants',
            spasThermes: 'Spas, thermes ou bains',
            cinemas: 'Cinémas',
            theatres: 'Théâtres ou salles de spectacle',
        },
        'infosLocales': {
            coutumesLocales: 'Coutumes locales',
            horairesOuverture: 'Horaires d\'ouverture typiques',
            joursFeriesLocaux: 'Jours fériés locaux',
            calendrierFetes: 'Calendrier des fêtes locales',
            officeTourisme: 'Coordonnées de l\'Office de Tourisme',
        },
        'transports': {
            taxisLocaux: 'Numéros de taxis locaux',
            vtc: 'Applications VTC disponibles',
            arretsBusTram: 'Arrêts de bus ou de tramway',
            gareFerroviaire: 'Gare ferroviaire la plus proche',
            aeroport: 'Aéroport le plus proche',
            locationVoitures: 'Services de location de voitures',
        },
        'servicesCrises': {
            policeNonUrgences: 'Coordonnées du poste de police (non-urgences)',
            perteDocuments: 'Procédure en cas de perte de documents',
            ambassadesConsulats: 'Coordonnées des principales ambassades ou consulats',
            servicesTraduction: 'Services de traduction (contact)',
            bureauPoste: 'Bureau de poste le plus proche',
        },
        'servicesAdditionnels': {
            menageEnCoursSejour: 'Options de ménage en cours de séjour',
            blanchisseriePressing: 'Service de blanchisserie / pressing',
            coursesAvantArrivee: 'Service de courses avant l\'arrivée',
        },
        'depart': {
            heureLimiteCheckout: 'Heure limite de check-out',
            lateCheckout: 'Option de "late check-out"',
            instructionsNettoyage: 'Instructions pour le nettoyage avant le départ',
            gestionLinge: 'Gestion du linge de lit et des serviettes usagés',
            remiseCles: 'Procédure de remise des clés',
            fermeture: 'Fermeture des fenêtres, extinction des lumières...',
            demandeAvis: 'Demande de laisser un avis',
            suggestionsAmelioration: 'Espace pour les suggestions d\'amélioration',
        },
    };

    get photosArray() {
        return this.editorForm.get('photos') as FormArray;
    }

    constructor() {
        effect(() => {
            this.loadBookletData();
        });
    }

    ngOnInit(): void {
        this.sections = [
            { id: 'bienvenue', formGroupName: 'bienvenue', editorTitle: `Bienvenue et Urgences`, previewTitle: 'BIENVENUE', icon: this.sanitizer.bypassSecurityTrustHtml(`<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"/>`) },
            { id: 'accessibilite', formGroupName: 'accessibilite', editorTitle: `Accessibilité et Besoins Spécifiques`, previewTitle: 'ACCÈS', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M11.53 2.3A1.85 1.85 0 0 0 10 3.85V11h3.85a1.85 1.85 0 1 0 0-3.7H12V5.7A1.85 1.85 0 0 0 11.53 2.3ZM12 12.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /><path d="M4.53 11.2A3.3 3.3 0 0 0 2 14.5v.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-.5a3.3 3.3 0 0 0-2.97-3.3Zm13 0A3.3 3.3 0 0 0 14.56 14v1.5a1 1 0 0 0 1 1H17a1 1 0 0 0 1-1v-1.5a3.3 3.3 0 0 0-3.47-3.3Z" /><path fill-rule="evenodd" d="M12 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" clip-rule="evenodd" />`) },
            { id: 'systemes', formGroupName: 'systemes', editorTitle: `Systèmes de la Maison et Confort`, previewTitle: 'CONFORT', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 0 1-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />`) },
            { id: 'securite', formGroupName: 'securite', editorTitle: `Sécurité`, previewTitle: 'SÉCURITÉ', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M10 1.5a1.5 1.5 0 0 0-1.5 1.5v2.333a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V3A1.5 1.5 0 0 0 10 1.5ZM8.5 6A.5.5 0 0 0 8 6.5v1.833a3.25 3.25 0 0 0 2.51 3.149A3.25 3.25 0 0 0 13.25 8.5A.75.75 0 0 0 12.5 8V6.5a.5.5 0 0 0-.5-.5h-3.5Z" /><path d="M4.18 9.32a.75.75 0 0 0-1.03.22l-1.34 2.233a.75.75 0 0 0 .65 1.133H4.25a.75.75 0 0 0 .75-.75V12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v3.19l-1.32.88a.75.75 0 0 1-1.1-.1l-1.57-2.2a.75.75 0 0 0-1.28.51v.19l.5 2.5a.75.75 0 0 0 .73.63H8a.75.75 0 0 0 .75-.75v-1a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 0 .75.75h1.73a.75.75 0 0 0 .73-.63l.5-2.5v-.19a.75.75 0 0 0-1.28-.5l-1.57 2.2a.75.75 0 0 1-1.1.1l-1.32-.88V12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.083a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .65-1.133l-1.34-2.233a.75.75 0 0 0-1.03-.22A3.24 3.24 0 0 0 12 8.333V6.5a2 2 0 0 0-2-2h-1.5a2 2 0 0 0-2 2v1.833c0 .463.118.904.339 1.289l.01.018a3.24 3.24 0 0 0 1.33 1.18Z" />`) },
            { id: 'cuisine', formGroupName: 'cuisine', editorTitle: `Cuisine`, previewTitle: 'CUISINE', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M12.5 4.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v3.342c0 .32.16.613.424.786l2.5 1.667a.5.5 0 0 0 .552 0l2.5-1.667a.998.998 0 0 0 .424-.786V4.5ZM9.5 3a1 1 0 0 0-1 1v.5h5V4a1 1 0 0 0-1-1h-3Z" /><path d="M8.5 10.43a1.5 1.5 0 0 0-1.06.44l-2 2a1.5 1.5 0 0 0 2.12 2.12l2-2a1.5 1.5 0 0 0-1.06-2.56Zm-1.5 3.07a.5.5 0 0 1 0-.7.5.5 0 0 1 .7 0l1.23 1.22a.5.5 0 0 1 0 .7l-1.22 1.23a.5.5 0 0 1-.7 0l-.01-.01v-.01a.5.5 0 0 1 0-.7l.01-.01.52-.52-.52-.52-.01-.01Zm4.94-3.51a1.5 1.5 0 0 0-2.12 0l-2 2a1.5 1.5 0 0 0 2.12 2.12l2-2a1.5 1.5 0 0 0 0-2.12Zm-.5 1.62a.5.5 0 0 1 .7 0l.01.01a.5.5 0 0 1 0 .7l-1.22 1.23-.01.01a.5.5 0 0 1-.7 0l-1.23-1.22a.5.5 0 0 1 0-.7l1.22-1.23a.5.5 0 0 1 .7 0Z" />`) },
            { id: 'salon', formGroupName: 'salon', editorTitle: `Salon et Multimédia`, previewTitle: 'SALON', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M3.75 5.25a1.5 1.5 0 0 0-1.5 1.5v8.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-8.5a1.5 1.5 0 0 0-1.5-1.5H3.75Z" />`) },
            { id: 'chambres', formGroupName: 'chambres', editorTitle: `Chambres et Linge`, previewTitle: 'CHAMBRES', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M3.75 3.75A1.75 1.75 0 0 0 2 5.5v10A1.75 1.75 0 0 0 3.75 17h12.5A1.75 1.75 0 0 0 18 15.5v-10A1.75 1.75 0 0 0 16.25 3.75H3.75Z" /><path d="M4 7.5h12v1.5H4v-1.5Z" />`) },
            { id: 'buanderie', formGroupName: 'buanderie', editorTitle: `Buanderie et Entretien`, previewTitle: 'BUANDERIE', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M12.5 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M5 5.75A.75.75 0 0 1 5.75 5h1.5a.75.75 0 0 1 0 1.5H5.75A.75.75 0 0 1 5 5.75Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M7.75 7.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M14.25 7.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path d="M4 11.75A2.75 2.75 0 0 1 6.75 9h6.5A2.75 2.75 0 0 1 16 11.75v.5A2.75 2.75 0 0 1 13.25 15h-6.5A2.75 2.75 0 0 1 4 12.25v-.5Z" /><path d="M4.75 18a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Z" />`) },
            { id: 'bienEtreExterieurs', formGroupName: 'bienEtreExterieurs', editorTitle: `Équipements de Bien-être et Extérieurs`, previewTitle: 'EXTÉRIEUR', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Z" /><path d="M14.25 5a.75.75 0 0 0-.53 1.28l1.06 1.06a.75.75 0 0 0 1.06-1.06l-1.06-1.06A.75.75 0 0 0 14.25 5Z" /><path d="M5.75 5a.75.75 0 0 0-1.28.53l1.06 1.06a.75.75 0 0 0 1.06-1.06l-1.06-1.06A.75.75 0 0 0 5.75 5Z" /><path d="M18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10Z" /><path d="M4.75 10.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5Z" /><path fill-rule="evenodd" d="M10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM5.5 10a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" clip-rule="evenodd" /><path d="M14.25 15a.75.75 0 0 0 .53-1.28l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06c.29.29.77.29 1.06 0Z" /><path d="M5.75 15a.75.75 0 0 0 1.28.53l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06A.75.75 0 0 0 5.75 15Z" /><path d="M3 18.25a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0-.75.75Z" />`) },
            { id: 'parking', formGroupName: 'parking', editorTitle: `Parking et Garage`, previewTitle: 'PARKING', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M4 2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Zm1.5 6.25a.75.75 0 0 0 0 1.5h.25V12h-2.5a.75.75 0 0 0 0 1.5h2.5v1.25a.75.75 0 0 0 1.5 0V13.5h.25a.75.75 0 0 0 1.5 0h-.25V12h2.5a.75.75 0 0 0 0-1.5h-2.5V9.5h.25a.75.75 0 0 0 1.5 0H10V8.25a.75.75 0 0 0-1.5 0V9.5h-.25a.75.75 0 0 0-1.5 0h.25v1.25H5.5a.75.75 0 0 0-.75-.75h-.25Z" clip-rule="evenodd" />`) },
            { id: 'regles', formGroupName: 'regles', editorTitle: `Règles de la Maison`, previewTitle: 'RÈGLES', icon: this.sanitizer.bypassSecurityTrustHtml(`<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />`) },
            { id: 'animaux', formGroupName: 'animaux', editorTitle: `Animaux de Compagnie`, previewTitle: 'ANIMAUX', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M14.5,4 C14.5,4 14.2,2.7 12.5,2.7 C10.8,2.7 10.5,4 10.5,4 C10.5,4 10.8,5.3 12.5,5.3 C14.2,5.3 14.5,4 14.5,4 Z M9.5,4 C9.5,4 9.2,2.7 7.5,2.7 C5.8,2.7 5.5,4 5.5,4 C5.5,4 5.8,5.3 7.5,5.3 C9.2,5.3 9.5,4 9.5,4 Z" /><path d="M10,12 C10,12 10.1,13.8 8.8,15 C7.5,16.2 6.1,15.7 6.1,15.7 C6.1,15.7 6,17 7.5,17.5 C9,18 11.5,18 12.5,17.5 C13.5,17 13.9,15.7 13.9,15.7 C13.9,15.7 12.5,16.2 11.2,15 C9.9,13.8 10,12 10,12 Z" /><path d="M10,10.2 C12.5,10.2 14,8.2 14,6 L6,6 C6,8.2 7.5,10.2 10,10.2 Z" />`) },
            { id: 'dechets', formGroupName: 'dechets', editorTitle: `Gestion des Déchets`, previewTitle: 'DÉCHETS', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M6.5 2.75a.75.75 0 0 0-1.5 0V3.5h9V2.75a.75.75 0 0 0-1.5 0V3.5h-1.5V2.75a.75.75 0 0 0-1.5 0V3.5h-1.5V2.75a.75.75 0 0 0-1.5 0V3.5H5V2.75Z" /><path fill-rule="evenodd" d="M5 5.75A.75.75 0 0 1 5.75 5h8.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H5.75a.75.75 0 0 1-.75-.75V5.75Zm.75-.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75h-8.5Z" clip-rule="evenodd" />`) },
            { id: 'guideGastro', formGroupName: 'guideGastro', editorTitle: `Guide Gastronomique Local`, previewTitle: 'RESTAURANTS', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M6 1a1 1 0 0 0-1 1v1.75A2.25 2.25 0 0 0 7.25 6h.5A2.25 2.25 0 0 0 10 3.75V2a1 1 0 0 0-1-1H6Zm2.25 3.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Z" /><path d="M4.58 7.39a.75.75 0 0 0-1.16 1.02l2.25 2.5a.75.75 0 0 0 1.16-1.02l-2.25-2.5Z" /><path fill-rule="evenodd" d="M12.5 1.5a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V2a.5.5 0 0 1 .5-.5ZM15 2.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Z" clip-rule="evenodd" />`) },
            { id: 'guideActivites', formGroupName: 'guideActivites', editorTitle: `Guide des Activités et Découvertes`, previewTitle: 'À VISITER', icon: this.sanitizer.bypassSecurityTrustHtml(`<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />`) },
            { id: 'infosLocales', formGroupName: 'infosLocales', editorTitle: `Informations Locales et Culturelles`, previewTitle: 'INFOS LOCALES', icon: this.sanitizer.bypassSecurityTrustHtml(`<path d="M5.337 4.112A3.25 3.25 0 0 1 8 2.5h4a3.25 3.25 0 0 1 2.663 1.612A3.25 3.25 0 0 1 18 8.5v3a3.25 3.25 0 0 1-1.612 2.663A3.25 3.25 0 0 1 12 17.5h-4a3.25 3.25 0 0 1-2.663-1.612A3.25 3.25 0 0 1 2 11.5v-3A3.25 3.25 0 0 1 5.337 4.112ZM11.25 7a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 0 0 1.5h2.5Z" />`) },
            { id: 'transports', formGroupName: 'transports', editorTitle: `Transports`, previewTitle: 'TRANSPORTS', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M6 3a1 1 0 0 0-1 1v1.5a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 5.5V4a1 1 0 0 0-1-1H6Zm1.5 1.5a.5.5 0 0 0 .5-.5h3a.5.5 0 0 0 .5.5H13v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V4.5h.5Z" clip-rule="evenodd" /><path d="M3.75 9.5a2.75 2.75 0 0 1 2.58-2.744 1 1 0 0 1 1.961.392A.75.75 0 0 0 9 6.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75.75.75 0 0 0 .75.75 1 1 0 0 1 1.96-.392A2.75 2.75 0 0 1 16.25 9.5v2.857a.75.75 0 0 0 .22.53l1.14 1.14a.75.75 0 0 1-1.06 1.06l-1.14-1.14a.75.75 0 0 0-.53-.22H4.75a.75.75 0 0 0-.53.22l-1.14 1.14a.75.75 0 0 1-1.06-1.06l1.14-1.14a.75.75 0 0 0 .22-.53V9.5Z" /><path d="M6.5 15.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm8.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />`) },
            { id: 'servicesCrises', formGroupName: 'servicesCrises', editorTitle: `Services Administratifs et Crises`, previewTitle: 'SERVICES', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />`) },
            { id: 'servicesAdditionnels', formGroupName: 'servicesAdditionnels', editorTitle: `Services Additionnels`, previewTitle: 'EXTRAS', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd" />`) },
            { id: 'depart', formGroupName: 'depart', editorTitle: `Procédure de Départ`, previewTitle: 'DÉPART', icon: this.sanitizer.bypassSecurityTrustHtml(`<path fill-rule="evenodd" d="M11.053 2.2a.75.75 0 0 1 .792.052l4.5 3.5a.75.75 0 0 1-.097 1.298h-1.25a.75.75 0 0 0-.75.75V15.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 0-.75-.75h-1.25a.75.75 0 0 1-.097-1.298l4.5-3.5a.75.75 0 0 1 .645-.102ZM12.25 10.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path d="M8.75 3.5a.75.75 0 0 0-1.5 0v.093c-.456.286-.829.74-1.042 1.256l-.107.266a.75.75 0 0 0 .888.97l.383-.153a1.75 1.75 0 0 1 1.63.023l.111.058a.75.75 0 0 0 .868-.024l.058-.046a1.75 1.75 0 0 1 1.83-.004l.16.1a.75.75 0 0 0 .82-.187l.034-.05a1.75 1.75 0 0 1 1.493-.016l.245.147a.75.75 0 0 0 .96-.888l-.107-.266A1.75 1.75 0 0 1 15 5.093V3.5a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 0 .25.25c.023 0 .045.002.067.005a.25.25 0 0 1 .184.39l-.034.05a.25.25 0 0 0-.213.002l-.16-.1a.25.25 0 0 0-.26 0l-.059.046a.75.75 0 0 1-.868.024l-.11-.058a.25.25 0 0 0-.233-.003l-.383.153a.75.75 0 0 1-.888-.97l.107-.266a.25.25 0 0 0 .148-.214V5.25a.25.25 0 0 0 .25-.25v-1.5Z" />`) },
        ];

        // Re-initialize the form with the new sections
        const formGroups: { [key: string]: any } = {};
        Object.keys(this.controlLabels).forEach(sectionKey => {
            const controls: { [key: string]: any } = {};
            const labels = this.controlLabels[sectionKey];
            if (labels) {
                Object.keys(labels).forEach(key => {
                    controls[key] = [''];
                    controls[key + '_pdf'] = [''];
                });
            }
            if (!formGroups['toggles']) formGroups['toggles'] = this.fb.group({});
            formGroups[sectionKey] = this.fb.group(controls);
        });

        // Initialize form with new groups and empty values
        // Note: The previous constructor initialization initialized some values. 
        // We will just initialize the structure here, loadBookletData will populate values.
        this.editorForm = this.fb.group({
            ...formGroups,
            coverImageUrl: [''],
            address: [''],
            gpsCoordinates: [''],
            toggles: this.fb.group(
                this.sections.reduce((acc: any, section) => {
                    acc[section.id] = [true];
                    return acc;
                }, {})
            ),
            photos: this.fb.array([])
        });

        // Trigger CD
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        if (this.addressSub) this.addressSub.unsubscribe();
    }

    // --- Logic Methods ---

    setActiveTab(tab: 'edit' | 'listing' | 'microsite' | 'booklet') {
        this.activeTab.set(tab);
    }

    toggleChapter(id: string) {
        this.openChapter.update(current => current === id ? '' : id);
    }

    toggleCoverSection() { this.isCoverOpen.update(v => !v); }
    toggleLocationSection() { this.isLocationOpen.update(v => !v); }
    togglePhotosSection() { this.isPhotosOpen.update(v => !v); }
    toggleCategoryManager() { this.showCategoryManager.update(v => !v); }

    getSectionCompletion(sectionId: string): number {
        if (sectionId === 'cover') return this.editorForm.get('coverImageUrl')?.value ? 100 : 0;
        if (sectionId === 'location') return this.editorForm.get('address')?.value ? 100 : 0;
        if (sectionId === 'photos') return this.photosArray.length > 0 ? 100 : 0;

        const group = this.editorForm.get(sectionId) as FormGroup;
        if (!group) return 0;

        const controls = Object.keys(group.controls).filter(k => !k.endsWith('_pdf'));
        if (controls.length === 0) return 0;

        const filled = controls.filter(key => !!group.get(key)?.value).length;
        return Math.round((filled / controls.length) * 100);
    }

    getGroupControls(groupName: string): string[] {
        const group = this.editorForm.get(groupName) as FormGroup;
        return group ? Object.keys(group.controls).filter(k => !k.endsWith('_pdf')) : [];
    }

    getLabelForControl(section: string, control: string): string {
        return this.controlLabels[section]?.[control] || control;
    }

    getFormKeys(): string {
        return this.editorForm ? Object.keys(this.editorForm.controls).join(', ') : 'Form Null';
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getBadge(featureId: string) {
        return this.store.getFeatureBadge(featureId);
    }

    async loadBookletData() {
        this.isLoading.set(true);
        try {
            const propName = this.propertyName();
            const propData = await this.repository.getPropertyByName(propName);
            const bookletData = await this.repository.getBooklet(propName);

            this.propertyDetails.set(propData);
            this.bookletContent.set(bookletData);

            if (propData) {
                this.propertyId.set(propData.id);
                this.marketingText.set(propData.listing_description || '');

                if (propData.property_photos) {
                    // Merge DB photos with local visible state logic if needed
                    const hidden = bookletData?.microsite_config ?
                        (typeof bookletData.microsite_config === 'string' ? JSON.parse(bookletData.microsite_config).hiddenPhotoUrls : bookletData.microsite_config.hiddenPhotoUrls) || []
                        : [];

                    const mappedPhotos = propData.property_photos.map((p: any) => ({
                        url: p.url,
                        category: p.category,
                        visible: !hidden.includes(p.url)
                    }));
                    this.propertyPhotos.set(mappedPhotos);
                }
            }

            // Populate Form
            if (bookletData) {
                this.editorForm.patchValue({
                    coverImageUrl: bookletData.coverImageUrl,
                    address: propData?.address, // Prioritize property table address
                    gpsCoordinates: bookletData.gpsCoordinates,
                });

                // Patch sections
                Object.keys(this.controlLabels).forEach(sectionKey => {
                    if (bookletData[sectionKey]) {
                        this.editorForm.get(sectionKey)?.patchValue(bookletData[sectionKey]);
                    }
                });


                // Patch Toggles
                if (bookletData.toggles) {
                    this.editorForm.get('toggles')?.patchValue(bookletData.toggles);
                }

                // Patch Photos FormArray
                this.photosArray.clear();
                this.propertyPhotos().forEach(photo => {
                    this.addPhoto(photo.url, photo.category, false);
                });

                // Load Microsite Config
                if (bookletData.microsite_config) {
                    let config = bookletData.microsite_config;
                    if (typeof config === 'string') {
                        try { config = JSON.parse(config); } catch (e) { }
                    }
                    this.micrositeConfig.set({ ...this.micrositeConfig(), ...config });
                }

                // Load custom categories
                if (bookletData.photo_categories && Array.isArray(bookletData.photo_categories)) {
                    this.availableCategories.update(cats => {
                        const newCats = new Set([...cats, ...bookletData.photo_categories]);
                        return Array.from(newCats);
                    });
                }
            }
        } catch (e) {
            console.error("Error loading booklet:", e);
        } finally {
            this.isLoading.set(false);
        }
    }

    // --- Photo Management ---
    addPhoto(url: string = '', category: string = '', isUserAction: boolean = true) {
        const group = this.fb.group({
            url: [url],
            category: [category]
        });
        this.photosArray.push(group);

        // If user clicked button, scroll to bottom
        if (isUserAction) {
            // logic to scroll could be added here
        }
    }

    removePhoto(index: number) {
        this.photosArray.removeAt(index);
    }

    getPhotoGroup(index: number): FormGroup {
        return this.photosArray.at(index) as FormGroup;
    }

    addCategory() {
        const val = this.newCategoryName().trim();
        if (val && !this.availableCategories().includes(val)) {
            this.availableCategories.update(c => [...c, val]);
            this.newCategoryName.set('');
        }
    }

    removeCategory(cat: string) {
        if (this.defaultCategories.includes(cat)) return; // Prevent removing defaults
        this.availableCategories.update(c => c.filter(item => item !== cat));
    }

    updateNewCategoryName(event: Event) {
        this.newCategoryName.set((event.target as HTMLInputElement).value);
    }

    // --- Actions ---

    async save() {
        if (this.editorForm.valid && this.propertyId()) {
            this.isLoading.set(true);
            try {
                const formValue = this.editorForm.value;
                const propId = this.propertyId()!;

                // 1. Save main form data to booklet_content
                // Separate photos and toggles from main content structure
                const { photos, ...bookletData } = formValue;

                // Add address to property update
                if (formValue.address) {
                    await this.repository.updatePropertyData(propId, { operational: { address: formValue.address } });
                }

                // Save photo categories custom list
                const customCats = this.availableCategories().filter(c => !this.defaultCategories.includes(c));

                // Persist booklet content
                await this.repository.saveBooklet(this.propertyName(), {
                    ...bookletData,
                    photo_categories: customCats
                });

                // 2. Save Photos to property_photos table
                const photoData = photos.map((p: any) => ({ url: p.url, category: p.category }));
                await this.repository.savePropertyPhotos(propId, photoData);

                // 3. Save Microsite Config (if modified via this view's implied logic)
                // (Usually done via separate method, but good to ensure sync)

                this.saveMessage.set("Sauvegarde réussie !");
                setTimeout(() => this.saveMessage.set(null), 3000);

                // Reload to refresh view state
                await this.loadBookletData();

            } catch (e) {
                console.error("Save error:", e);
                alert("Erreur lors de la sauvegarde.");
            } finally {
                this.isLoading.set(false);
            }
        }
    }

    async autoFillAI() {
        const address = this.editorForm.get('address')?.value;
        if (!address || address.length < 5) {
            alert("Veuillez d'abord renseigner une adresse précise dans la section Localisation.");
            this.isLocationOpen.set(true);
            return;
        }

        this.isAiLoading.set(true);
        try {
            // Prepare structure to fill
            const currentData = this.editorForm.value;
            const structureToFill = {
                guideGastro: currentData.guideGastro,
                guideActivites: currentData.guideActivites,
                transports: currentData.transports,
                // Only ask for external info, not private stuff like wifi codes
            };

            const filledData = await this.geminiService.autoFillBooklet(address, structureToFill);

            if (filledData) {
                this.editorForm.patchValue(filledData);
                this.saveMessage.set("Données locales trouvées par l'IA !");
                setTimeout(() => this.saveMessage.set(null), 3000);
            }
        } catch (e) {
            console.error("AI Fill Error:", e);
            alert("L'IA n'a pas pu compléter les informations. Vérifiez votre clé API ou réessayez plus tard.");
        } finally {
            this.isAiLoading.set(false);
        }
    }

    regenerateSection(sectionId: string, event: Event) {
        event.stopPropagation();
        // Placeholder for section-specific regeneration
        alert("Fonctionnalité de régénération ciblée à venir ! Utilisez 'Remplir avec l'IA' pour le moment.");
    }

    // --- Microsite Methods (Proxies to AngleView logic or shared service if refactored) ---

    updateConfig(key: string, value: any) {
        this.micrositeConfig.update(c => ({ ...c, [key]: value }));
    }

    updateBookletText(section: string, field: string, value: any) {
        // Update local signal for preview
        this.bookletContent.update(c => {
            const nc = JSON.parse(JSON.stringify(c || {}));
            if (!nc[section]) nc[section] = {};
            nc[section][field] = value;
            return nc;
        });
        // Update Form control so save works
        this.editorForm.get(section)?.get(field)?.setValue(value);
    }

    toggleDescriptionVisibility(event: Event) { this.updateConfig('showDescription', (event.target as HTMLInputElement).checked); }
    toggleContactForm(event: Event) { this.updateConfig('showContact', (event.target as HTMLInputElement).checked); }

    toggleSectionVisibility(sectionId: string, event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        const current = this.micrositeConfig().visibleSections || [];
        if (checked) {
            if (!current.includes(sectionId)) this.updateConfig('visibleSections', [...current, sectionId]);
        } else {
            this.updateConfig('visibleSections', current.filter((id: string) => id !== sectionId));
        }
    }

    moveSection(index: number, direction: 'up' | 'down') {
        const sections = [...this.micrositeConfig().visibleSections];
        if (direction === 'up' && index > 0) {
            [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
        } else if (direction === 'down' && index < sections.length - 1) {
            [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        }
        this.updateConfig('visibleSections', sections);
    }

    togglePhotoVisibility(index: number) {
        this.propertyPhotos.update(photos => {
            const newPhotos = [...photos];
            newPhotos[index] = { ...newPhotos[index], visible: !newPhotos[index].visible };

            // Sync hidden photos to config
            const hidden = newPhotos.filter(p => !p.visible).map(p => p.url);
            this.updateConfig('hiddenPhotoUrls', hidden);

            return newPhotos;
        });
    }

    setCoverPhoto(url: string) {
        this.updateConfig('headerPhotoUrl', url);
    }

    movePhoto(index: number, direction: 'up' | 'down') {
        // Only moves in local visual list for microsite preview, 
        // Re-ordering actual photos in DB would require an 'order' field or array re-save
        const photos = [...this.propertyPhotos()];
        if (direction === 'up' && index > 0) {
            [photos[index], photos[index - 1]] = [photos[index - 1], photos[index]];
        } else if (direction === 'down' && index < photos.length - 1) {
            [photos[index], photos[index + 1]] = [photos[index + 1], photos[index]];
        }
        this.propertyPhotos.set(photos);
    }

    async saveMicrosite() {
        // Save config only
        if (!this.propertyId()) return;
        this.isLoading.set(true);
        try {
            await this.repository.saveBooklet(this.propertyName(), {
                microsite_config: JSON.stringify(this.micrositeConfig())
            });
            this.saveMessage.set("Microsite publié !");
            setTimeout(() => this.saveMessage.set(null), 3000);
        } catch (e) {
            console.error(e);
        } finally {
            this.isLoading.set(false);
        }
    }

    async generateMicrositeWithAI() {
        if (!this.hasAiAccess()) return;
        this.isAiDesigning.set(true);
        try {
            const context = {
                name: this.propertyName(),
                description: this.marketingText(),
                address: this.editorForm.get('address')?.value,
                type: 'Vacation Rental',
                amenities: this.propertyDetails()?.property_equipments?.map((e: any) => e.name) || [],
                bookletSummary: JSON.stringify(this.bookletContent()).substring(0, 1000)
            };

            const aiConfig = await this.geminiService.generateMicrositeDesign(context);
            if (aiConfig) {
                this.micrositeConfig.update(c => ({
                    ...c,
                    ...aiConfig,
                    // Ensure we don't lose valid section IDs
                    visibleSections: (aiConfig.visibleSections || []).filter((s: string) =>
                        this.availableSections.some(avail => avail.id === s)
                    )
                }));
                this.saveMessage.set("Design généré par l'IA !");
                setTimeout(() => this.saveMessage.set(null), 3000);
            }
        } catch (e) {
            console.error(e);
            alert("Erreur génération design");
        } finally {
            this.isAiDesigning.set(false);
        }
    }

    // --- Modal Helpers ---
    openGuideModal(title: string, content: string, icon: string) {
        this.guideModalState.set({ isOpen: true, title, content, icon });
    }
    closeGuideModal() {
        this.guideModalState.update(s => ({ ...s, isOpen: false }));
    }
}

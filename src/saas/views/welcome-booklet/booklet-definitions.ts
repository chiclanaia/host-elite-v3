import { SafeHtml } from '@angular/platform-browser';

export interface BookletSection {
    id: string;
    formGroupName: string;
    editorTitle: string;
    previewTitle: string;
    icon?: SafeHtml; // Created by service using iconSource
    iconSource?: string; // The raw SVG string
}

export interface WidgetDisplayData {
    value: string;
    link?: string; // Optional Smart Link
    loading?: boolean;
}

export const WIDGET_DEFINITIONS: Record<string, { name: string, icon: string }> = {
    'weather': { name: 'Météo', icon: '☀️' },
    'air-quality': { name: 'Qualité Air', icon: '💨' },
    'uv-index': { name: 'Indice UV', icon: '😎' },
    'tides': { name: 'Marées', icon: '🌊' },
    'avalanche-risk': { name: 'Avalanche', icon: '🏔️' },
    'pharmacy': { name: 'Pharmacie', icon: '⚕️' },
    'local-events': { name: 'Agenda', icon: '🎉' },
    'public-transport': { name: 'Transports', icon: '🚌' },
    'currency-converter': { name: 'Devises', icon: '💱' },
};

export const CONTROL_LABELS: Record<string, Record<string, string>> = {
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

// Raw sections configuration with SVG strings
export const SECTIONS_CONFIG: BookletSection[] = [
    { id: 'bienvenue', formGroupName: 'bienvenue', editorTitle: `Bienvenue et Urgences`, previewTitle: 'BIENVENUE', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"/></svg>` },
    { id: 'accessibilite', formGroupName: 'accessibilite', editorTitle: `Accessibilité`, previewTitle: 'ACCÈS', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M11.53 2.3A1.85 1.85 0 0 0 10 3.85V11h3.85a1.85 1.85 0 1 0 0-3.7H12V5.7A1.85 1.85 0 0 0 11.53 2.3ZM12 12.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /><path d="M4.53 11.2A3.3 3.3 0 0 0 2 14.5v.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-.5a3.3 3.3 0 0 0-2.97-3.3Zm13 0A3.3 3.3 0 0 0 14.56 14v1.5a1 1 0 0 0 1 1H17a1 1 0 0 0 1-1v-1.5a3.3 3.3 0 0 0-3.47-3.3Z" /><path fill-rule="evenodd" d="M12 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9.5 3.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" clip-rule="evenodd" /></svg>` },
    { id: 'systemes', formGroupName: 'systemes', editorTitle: `Systèmes Maison`, previewTitle: 'CONFORT', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1-2.287-.947ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg>` },
    { id: 'securite', formGroupName: 'securite', editorTitle: `Sécurité`, previewTitle: 'SÉCURITÉ', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10 1.5a1.5 1.5 0 0 0-1.5 1.5v2.333a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V3A1.5 1.5 0 0 0 10 1.5ZM8.5 6A.5.5 0 0 0 8 6.5v1.833a3.25 3.25 0 0 0 2.51 3.149A3.25 3.25 0 0 0 13.25 8.5A.75.75 0 0 0 12.5 8V6.5a.5.5 0 0 0-.5-.5h-3.5Z" /><path d="M4.18 9.32a.75.75 0 0 0-1.03.22l-1.34 2.233a.75.75 0 0 0 .65 1.133H4.25a.75.75 0 0 0 .75-.75V12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v3.19l-1.32.88a.75.75 0 0 1-1.1-.1l-1.57-2.2a.75.75 0 0 0-1.28.51v.19l.5 2.5a.75.75 0 0 0 .73.63H8a.75.75 0 0 0 .75-.75v-1a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 0 .75.75h1.73a.75.75 0 0 0 .73-.63l.5-2.5v-.19a.75.75 0 0 0-1.28-.5l-1.57 2.2a.75.75 0 0 1-1.1.1l-1.32-.88V12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.083a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .65-1.133l-1.34-2.233a.75.75 0 0 0-1.03-.22A3.24 3.24 0 0 0 12 8.333V6.5a2 2 0 0 0-2-2h-1.5a2 2 0 0 0-2 2v1.833c0 .463.118.904.339 1.289l.01.018a3.24 3.24 0 0 0 1.33 1.18Z" /></svg>` },
    { id: 'cuisine', formGroupName: 'cuisine', editorTitle: `Cuisine`, previewTitle: 'CUISINE', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12.5 4.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v3.342c0 .32.16.613.424.786l2.5 1.667a.5.5 0 0 0 .552 0l2.5-1.667a.998.998 0 0 0 .424-.786V4.5ZM9.5 3a1 1 0 0 0-1 1v.5h5V4a1 1 0 0 0-1-1h-3Z" /><path d="M8.5 10.43a1.5 1.5 0 0 0-1.06.44l-2 2a1.5 1.5 0 0 0 2.12 2.12l2-2a1.5 1.5 0 0 0-1.06-2.56Zm-1.5 3.07a.5.5 0 0 1 0-.7.5.5 0 0 1 .7 0l1.23 1.22a.5.5 0 0 1 0 .7l-1.22 1.23a.5.5 0 0 1-.7 0l-.01-.01v-.01a.5.5 0 0 1 0-.7l.01-.01.52-.52-.52-.52-.01-.01Zm4.94-3.51a1.5 1.5 0 0 0-2.12 0l-2 2a1.5 1.5 0 0 0 2.12 2.12l2-2a1.5 1.5 0 0 0 0-2.12Zm-.5 1.62a.5.5 0 0 1 .7 0l.01.01a.5.5 0 0 1 0 .7l-1.23 1.23-.01.01a.5.5 0 0 1-.7 0l-1.23-1.22a.5.5 0 0 1 0-.7l1.22-1.23a.5.5 0 0 1 .7 0Z" /></svg>` },
    { id: 'salon', formGroupName: 'salon', editorTitle: `Salon et Multimédia`, previewTitle: 'SALON', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M3.75 5.25a1.5 1.5 0 0 0-1.5 1.5v8.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-8.5a1.5 1.5 0 0 0-1.5-1.5H3.75Z" /></svg>` },
    { id: 'chambres', formGroupName: 'chambres', editorTitle: `Chambres et Linge`, previewTitle: 'CHAMBRES', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M3.75 3.75A1.75 1.75 0 0 0 2 5.5v10A1.75 1.75 0 0 0 3.75 17h12.5A1.75 1.75 0 0 0 18 15.5v-10A1.75 1.75 0 0 0 16.25 3.75H3.75Z" /><path d="M4 7.5h12v1.5H4v-1.5Z" /></svg>` },
    { id: 'buanderie', formGroupName: 'buanderie', editorTitle: `Buanderie`, previewTitle: 'BUANDERIE', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M12.5 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M5 5.75A.75.75 0 0 1 5.75 5h1.5a.75.75 0 0 1 0 1.5H5.75A.75.75 0 0 1 5 5.75Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M7.75 7.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M14.25 7.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path d="M4 11.75A2.75 2.75 0 0 1 6.75 9h6.5A2.75 2.75 0 0 1 16 11.75v.5A2.75 2.75 0 0 1 13.25 15h-6.5A2.75 2.75 0 0 1 4 12.25v-.5Z" /><path d="M4.75 18a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Z" /></svg>` },
    { id: 'bienEtreExterieurs', formGroupName: 'bienEtreExterieurs', editorTitle: `Bien-être et Extérieurs`, previewTitle: 'EXTÉRIEUR', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Z" /><path d="M14.25 5a.75.75 0 0 0-.53 1.28l1.06 1.06a.75.75 0 0 0 1.06-1.06l-1.06-1.06A.75.75 0 0 0 14.25 5Z" /><path d="M5.75 5a.75.75 0 0 0-1.28.53l1.06 1.06a.75.75 0 0 0 1.06-1.06l-1.06-1.06A.75.75 0 0 0 5.75 5Z" /><path d="M18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10Z" /><path d="M4.75 10.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5Z" /><path fill-rule="evenodd" d="M10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM5.5 10a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" clip-rule="evenodd" /><path d="M14.25 15a.75.75 0 0 0 .53-1.28l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06c.29.29.77.29 1.06 0Z" /><path d="M5.75 15a.75.75 0 0 0 1.28.53l-1.06-1.06a.75.75 0 0 0-1.06 1.06l1.06 1.06A.75.75 0 0 0 5.75 15Z" /><path d="M3 18.25a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0-.75.75Z" /></svg>` },
    { id: 'parking', formGroupName: 'parking', editorTitle: `Parking et Garage`, previewTitle: 'PARKING', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M4 2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Zm1.5 6.25a.75.75 0 0 0 0 1.5h.25V12h-2.5a.75.75 0 0 0 0 1.5h2.5v1.25a.75.75 0 0 0 1.5 0V13.5h.25a.75.75 0 0 0 1.5 0h-.25V12h2.5a.75.75 0 0 0 0-1.5h-2.5V9.5h.25a.75.75 0 0 0 1.5 0H10V8.25a.75.75 0 0 0-1.5 0V9.5h-.25a.75.75 0 0 0-1.5 0h.25v1.25H5.5a.75.75 0 0 0-.75-.75h-.25Z" clip-rule="evenodd" /></svg>` },
    { id: 'regles', formGroupName: 'regles', editorTitle: `Règles de la Maison`, previewTitle: 'RÈGLES', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>` },
    { id: 'animaux', formGroupName: 'animaux', editorTitle: `Animaux de Compagnie`, previewTitle: 'ANIMAUX', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M14.5,4 C14.5,4 14.2,2.7 12.5,2.7 C10.8,2.7 10.5,4 10.5,4 C10.5,4 10.8,5.3 12.5,5.3 C14.2,5.3 14.5,4 14.5,4 Z M9.5,4 C9.5,4 9.2,2.7 7.5,2.7 C5.8,2.7 5.5,4 5.5,4 C5.5,4 5.8,5.3 7.5,5.3 C9.2,5.3 9.5,4 9.5,4 Z" /><path d="M10,12 C10,12 10.1,13.8 8.8,15 C7.5,16.2 6.1,15.7 6.1,15.7 C6.1,15.7 6,17 7.5,17.5 C9,18 11.5,18 12.5,17.5 C13.5,17 13.9,15.7 13.9,15.7 C13.9,15.7 12.5,16.2 11.2,15 C9.9,13.8 10,12 10,12 Z" /><path d="M10,10.2 C12.5,10.2 14,8.2 14,6 L6,6 C6,8.2 7.5,10.2 10,10.2 Z" /></svg>` },
    { id: 'dechets', formGroupName: 'dechets', editorTitle: `Gestion des Déchets`, previewTitle: 'DÉCHETS', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M6.5 2.75a.75.75 0 0 0-1.5 0V3.5h9V2.75a.75.75 0 0 0-1.5 0V3.5h-1.5V2.75a.75.75 0 0 0-1.5 0V3.5h-1.5V2.75a.75.75 0 0 0-1.5 0V3.5H5V2.75Z" /><path fill-rule="evenodd" d="M5 5.75A.75.75 0 0 1 5.75 5h8.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H5.75a.75.75 0 0 1-.75-.75V5.75Zm.75-.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75h-8.5Z" clip-rule="evenodd" /></svg>` },
    { id: 'guideGastro', formGroupName: 'guideGastro', editorTitle: `Guide Gastronomique Local`, previewTitle: 'RESTAURANTS', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M6 1a1 1 0 0 0-1 1v1.75A2.25 2.25 0 0 0 7.25 6h.5A2.25 2.25 0 0 0 10 3.75V2a1 1 0 0 0-1-1H6Zm2.25 3.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Z" /><path d="M4.58 7.39a.75.75 0 0 0-1.16 1.02l2.25 2.5a.75.75 0 0 0 1.16-1.02l-2.25-2.5Z" /><path fill-rule="evenodd" d="M12.5 1.5a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V2a.5.5 0 0 1 .5-.5ZM15 2.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5Z" clip-rule="evenodd" /></svg>` },
    { id: 'guideActivites', formGroupName: 'guideActivites', editorTitle: `Guide Activités et Découvertes`, previewTitle: 'À VISITER', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>` },
    { id: 'infosLocales', formGroupName: 'infosLocales', editorTitle: `Infos Locales et Culturelles`, previewTitle: 'INFOS LOCALES', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M5.337 4.112A3.25 3.25 0 0 1 8 2.5h4a3.25 3.25 0 0 1 2.663 1.612A3.25 3.25 0 0 1 18 8.5v3a3.25 3.25 0 0 1-1.612 2.663A3.25 3.25 0 0 1 12 17.5h-4a3.25 3.25 0 0 1-2.663-1.612A3.25 3.25 0 0 1 2 11.5v-3A3.25 3.25 0 0 1 5.337 4.112ZM11.25 7a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 0 0 1.5h2.5Z" /></svg>` },
    { id: 'transports', formGroupName: 'transports', editorTitle: `Transports`, previewTitle: 'TRANSPORTS', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M6 3a1 1 0 0 0-1 1v1.5a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 5.5V4a1 1 0 0 0-1-1H6Zm1.5 1.5a.5.5 0 0 0 .5-.5h3a.5.5 0 0 0 .5.5H13v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V4.5h.5Z" clip-rule="evenodd" /><path d="M3.75 9.5a2.75 2.75 0 0 1 2.58-2.744 1 1 0 0 1 1.961.392A.75.75 0 0 0 9 6.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75.75.75 0 0 0 .75.75 1 1 0 0 1 1.96-.392A2.75 2.75 0 0 1 16.25 9.5v2.857a.75.75 0 0 0 .22.53l1.14 1.14a.75.75 0 0 1-1.06 1.06l-1.14-1.14a.75.75 0 0 0-.53-.22H4.75a.75.75 0 0 0-.53.22l-1.14 1.14a.75.75 0 0 1-1.06-1.06l1.14-1.14a.75.75 0 0 0 .22-.53V9.5Z" /><path d="M6.5 15.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm8.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>` },
    { id: 'servicesCrises', formGroupName: 'servicesCrises', editorTitle: `Services Administratifs et Crises`, previewTitle: 'SERVICES', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" /></svg>` },
    { id: 'servicesAdditionnels', formGroupName: 'servicesAdditionnels', editorTitle: `Services Additionnels`, previewTitle: 'EXTRAS', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd" /></svg>` },
    { id: 'depart', formGroupName: 'depart', editorTitle: `Procédure de Départ`, previewTitle: 'DÉPART', iconSource: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.053 2.2a.75.75 0 0 1 .792.052l4.5 3.5a.75.75 0 0 1-.097 1.298h-1.25a.75.75 0 0 0-.75.75V15.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 0-.75-.75h-1.25a.75.75 0 0 1-.097-1.298l4.5-3.5a.75.75 0 0 1 .645-.102ZM12.25 10.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clip-rule="evenodd" /><path d="M8.75 3.5a.75.75 0 0 0-1.5 0v.093c-.456.286-.829.74-1.042 1.256l-.107.266a.75.75 0 0 0 .888.97l.383-.153a1.75 1.75 0 0 1 1.63.023l.111.058a.75.75 0 0 0 .868-.024l.058-.046a1.75 1.75 0 0 1 1.83-.004l.16.1a.75.75 0 0 0 .82-.187l.034-.05a1.75 1.75 0 0 1 1.493-.016l.245.147a.75.75 0 0 0 .96-.888l-.107-.266A1.75 1.75 0 0 1 15 5.093V3.5a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 0 .25.25c.023 0 .045.002.067.005a.25.25 0 0 1 .184.39l-.034.05a.25.25 0 0 0-.213.002l-.16-.1a.25.25 0 0 0-.26 0l-.059.046a.75.75 0 0 1-.868.024l-.11-.058a.25.25 0 0 0-.233-.003l-.383.153a.75.75 0 0 1-.888-.97l.107-.266a.25.25 0 0 0 .148-.214V5.25a.25.25 0 0 0 .25-.25v-1.5Z" /></svg>` },
];

// -- Microsite Definitions --

export interface MicrositeConfig {
    template: 'modern' | 'cozy' | 'luxury';
    primaryColor: string;
    showDescription: boolean;
    showContact: boolean;
    visibleSections: string[];
    headerPhotoUrl: string | null;
    hiddenPhotoUrls: string[];
    heroLayout: 'full' | 'split';
    headline: string;
}

export interface BuilderPhoto {
    url: string;
    category: string;
    visible: boolean;
}

export interface SectionDef {
    id: string;
    label: string;
}

/**
 * Resolves the Microsite Configuration.
 * If a saved configuration exists, it is returned (merging over defaults).
 * If NO saved configuration exists, it generates a "Smart Default" based on
 * the content present in the bookletData (e.g. auto-enabling Guide if populated).
 */
export function resolveMicrositeConfig(bookletData: any, savedConfig: Partial<MicrositeConfig> | null | undefined, defaultHeadline: string = 'Bienvenue'): MicrositeConfig {
    const defaults: MicrositeConfig = {
        template: 'modern',
        primaryColor: '#3b82f6',
        showDescription: true,
        showContact: true,
        visibleSections: ['gallery', 'amenities'],
        headerPhotoUrl: null,
        hiddenPhotoUrls: [],
        heroLayout: 'full',
        headline: defaultHeadline
    };

    if (savedConfig) {
        return {
            ...defaults,
            ...savedConfig,
            // Ensure array integrity if saved as null/undefined
            visibleSections: savedConfig.visibleSections || defaults.visibleSections,
            hiddenPhotoUrls: savedConfig.hiddenPhotoUrls || []
        };
    }

    // -- Smart Default Generation --
    // Analyze bookletData to see what sections should be enabled by default
    const smartSections = ['gallery', 'amenities'];

    // Check Guide (Gastro or Activities)
    if (bookletData?.guideGastro?.recommandationRestaurants || bookletData?.guideActivites?.guideActivites) {
        smartSections.push('guide');
    }

    // Check Rules (Rules or Departure)
    if (bookletData?.regles?.politiqueFetes || bookletData?.regles?.politiqueNonFumeur || bookletData?.regles?.heuresSilence || bookletData?.depart?.heureLimiteCheckout) {
        smartSections.push('rules');
    }

    return {
        ...defaults,
        visibleSections: smartSections
    };
}

import { OnboardingQuestion } from '../onboarding.service';

export const DEFAULT_QUESTIONS: OnboardingQuestion[] = [
    // -------------------------------------------------------------------------
    // DIM_OPS (Audit Logement / Accommodation) - 40 Questions (Bronze to Gold)
    // -------------------------------------------------------------------------

    // BRONZE (1-10): Sécurité & Indispensables
    {
        id: 'ops_q1',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q1', // "Avez-vous un détecteur de fumée ?"
        level: 'Bronze',
        order_index: 1,
        has_sub_question: false
    },
    {
        id: 'ops_q2',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q2', // "Le Wifi est-il performant (>20Mbps) ?"
        level: 'Bronze',
        order_index: 2,
        has_sub_question: true,
        sub_question_config: { id: 'ops_q2_sub', label_key: 'AUDIT.accomodation_q2_sub', type: 'text', placeholder: 'Mbps ou Code Wifi' }
    },
    {
        id: 'ops_q3',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q3', // "Kit de premiers secours accessible ?"
        level: 'Bronze',
        order_index: 3,
        has_sub_question: false
    },
    {
        id: 'ops_q4',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q4', // "Extincteur présent et vérifié ?"
        level: 'Bronze',
        order_index: 4,
        has_sub_question: false
    },
    {
        id: 'ops_q5',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q5', // "Literie propre et en bon état ?"
        level: 'Bronze',
        order_index: 5,
        has_sub_question: false
    },
    {
        id: 'ops_q6',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q6', // "Salle de bain fonctionnelle (eau chaude, pression) ?"
        level: 'Bronze',
        order_index: 6,
        has_sub_question: false
    },
    {
        id: 'ops_q7',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q7', // "Cuisine équipée (réfrigérateur, cuisson) ?"
        level: 'Bronze',
        order_index: 7,
        has_sub_question: false
    },
    {
        id: 'ops_q8',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q8', // "Propreté impeccable à l'arrivée ?"
        level: 'Bronze',
        order_index: 8,
        has_sub_question: false
    },
    {
        id: 'ops_q9',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q9', // "Instructions d'arrivée claires ?"
        level: 'Bronze',
        order_index: 9,
        has_sub_question: false
    },
    {
        id: 'ops_q10',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q10', // "Coordonnées d'urgence affichées ?"
        level: 'Bronze',
        order_index: 10,
        has_sub_question: false
    },

    // SILVER (11-20): Confort & Standards Professionnels
    {
        id: 'ops_q11',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q11', // "Télévision avec chaînes ou services de streaming ?"
        level: 'Silver',
        order_index: 11,
        has_sub_question: false
    },
    {
        id: 'ops_q12',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q12', // "Espace de travail dédié (bureau/chaise) ?"
        level: 'Silver',
        order_index: 12,
        has_sub_question: false
    },
    {
        id: 'ops_q13',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q13', // "Machine à café (avec capsules/filtres) ?"
        level: 'Silver',
        order_index: 13,
        has_sub_question: false
    },
    {
        id: 'ops_q14',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q14', // "Lave-linge disponible ?"
        level: 'Silver',
        order_index: 14,
        has_sub_question: false
    },
    {
        id: 'ops_q15',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q15', // "Sèche-cheveux dans la salle de bain ?"
        level: 'Silver',
        order_index: 15,
        has_sub_question: false
    },
    {
        id: 'ops_q16',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q16', // "Fer et table à repasser ?"
        level: 'Silver',
        order_index: 16,
        has_sub_question: false
    },
    {
        id: 'ops_q17',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q17', // "Rangements suffisants pour les vêtements ?"
        level: 'Silver',
        order_index: 17,
        has_sub_question: false
    },
    {
        id: 'ops_q18',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q18', // "Occultation efficace des fenêtres (rideaux/volets) ?"
        level: 'Silver',
        order_index: 18,
        has_sub_question: false
    },
    {
        id: 'ops_q19',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q19', // "Miroir en pied ?"
        level: 'Silver',
        order_index: 19,
        has_sub_question: false
    },
    {
        id: 'ops_q20',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q20', // "Produits de base (sel, poivre, huile, savon) ?"
        level: 'Silver',
        order_index: 20,
        has_sub_question: false
    },

    // GOLD (21-30): Expérience & Détails
    {
        id: 'ops_q21',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q21', // "Guide d'accueil numérique ou papier complet ?"
        level: 'Gold',
        order_index: 21,
        has_sub_question: false
    },
    {
        id: 'ops_q22',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q22', // "Cadeau de bienvenue (vin, local, mot manuscrit) ?"
        level: 'Gold',
        order_index: 22,
        has_sub_question: false
    },
    {
        id: 'ops_q23',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q23', // "Décoration soignée et locale ?"
        level: 'Gold',
        order_index: 23,
        has_sub_question: false
    },
    {
        id: 'ops_q24',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q24', // "Jeux de société ou livres disponibles ?"
        level: 'Gold',
        order_index: 24,
        has_sub_question: false
    },
    {
        id: 'ops_q25',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q25', // "Adaptateurs prises électriques internationaux ?"
        level: 'Gold',
        order_index: 25,
        has_sub_question: false
    },
    {
        id: 'ops_q26',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q26', // "Enceinte Bluetooth ?"
        level: 'Gold',
        order_index: 26,
        has_sub_question: false
    },
    {
        id: 'ops_q27',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q27', // "Climatisation ou ventilateurs de qualité ?"
        level: 'Gold',
        order_index: 27,
        has_sub_question: false
    },
    {
        id: 'ops_q28',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q28', // "Matelas de qualité supérieure ?"
        level: 'Gold',
        order_index: 28,
        has_sub_question: false
    },
    {
        id: 'ops_q29',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q29', // "Linge de lit en percale ou satin ?"
        level: 'Gold',
        order_index: 29,
        has_sub_question: false
    },
    {
        id: 'ops_q30',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q30', // "Isolation phonique performante ?"
        level: 'Gold',
        order_index: 30,
        has_sub_question: false
    },

    // EXCELLENCE (31-40): Luxe & Exception
    {
        id: 'ops_q31',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q31', // "Conciergerie ou services à la demande ?"
        level: 'TIER_3', // Mapping to Excellence/Tier 3
        order_index: 31,
        has_sub_question: false
    },
    {
        id: 'ops_q32',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q32', // "Spa, Jacuzzi ou Piscine ?"
        level: 'TIER_3',
        order_index: 32,
        has_sub_question: false
    },
    {
        id: 'ops_q33',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q33', // "Vélos ou équipements sportifs à disposition ?"
        level: 'TIER_3',
        order_index: 33,
        has_sub_question: false
    },
    {
        id: 'ops_q34',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q34', // "Produits de toilette de marque (L'Occitane, etc.) ?"
        level: 'TIER_3',
        order_index: 34,
        has_sub_question: false
    },
    {
        id: 'ops_q35',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q35', // "Service de ménage quotidien proposé ?"
        level: 'TIER_3',
        order_index: 35,
        has_sub_question: false
    },
    {
        id: 'ops_q36',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q36', // "Chef à domicile ou traiteur partenaire ?"
        level: 'TIER_3',
        order_index: 36,
        has_sub_question: false
    },
    {
        id: 'ops_q37',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q37', // "Chauffeur privé ou transfert gare/aéroport ?"
        level: 'TIER_3',
        order_index: 37,
        has_sub_question: false
    },
    {
        id: 'ops_q38',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q38', // "Expériences locales exclusives (visites privées) ?"
        level: 'TIER_3',
        order_index: 38,
        has_sub_question: false
    },
    {
        id: 'ops_q39',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q39', // "Domotique avancée (lumières, son, scénarios) ?"
        level: 'TIER_3',
        order_index: 39,
        has_sub_question: false
    },
    {
        id: 'ops_q40',
        dimension_id: 'DIM_OPS',
        question_key: 'AUDIT.accomodation_q40', // "Vue exceptionnelle ou emplacement unique ?"
        level: 'TIER_3',
        order_index: 40,
        has_sub_question: false
    }
];

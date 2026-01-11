
import { ChangeDetectionStrategy, Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContextData } from '../types';
import { SessionStore } from '../state/session.store';
import { GeminiService } from '../services/gemini.service';
import { SupabaseService } from '../services/supabase.service';

interface Plan {
  name: string;
  price: string;
  priceDetails: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  badge?: string;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  submitContext = output<ContextData>();

  private store = inject(SessionStore);
  private geminiService = inject(GeminiService);
  private supabaseService = inject(SupabaseService);
  private fb: FormBuilder = inject(FormBuilder);

  readonly currentYear = new Date().getFullYear();
  contextForm: FormGroup;
  
  // Auth Modal State
  isAuthModalOpen = signal(false);
  authMode = signal<'login' | 'register'>('login');
  authForm: FormGroup;
  authError = signal<string | null>(null);

  // DB Config Modal State
  isDbConfigOpen = signal(false);
  dbConfigForm: FormGroup;

  situations = [
    { id: 'Je me lance', icon: '🚀', title: 'Je me lance', description: 'Je n\'ai pas encore de location ou je viens de commencer.' },
    { id: 'J\'ai déjà un bien', icon: '📈', title: 'J\'ai déjà un bien', description: 'Je cherche à améliorer mes revenus et à gagner du temps.' },
    { id: 'Je vise l\'excellence', icon: '🏆', title: 'Je vise l\'excellence', description: 'Je veux devenir Superhost, automatiser et scaler mon activité.' },
  ];

  plans = signal<Plan[]>([
    {
      name: 'Freemium',
      price: '0€',
      priceDetails: '',
      description: 'Découvrez votre potentiel avec notre outil de diagnostic gratuit.',
      features: ['Auto-diagnostic "Roue de l\'Hôte"', 'Rapport IA personnalisé', 'Contenu de sensibilisation'],
      cta: 'Commencer le diagnostic',
      highlight: false,
    },
    {
      name: 'Bronze',
      price: '49€',
      priceDetails: '/mois',
      description: 'Le kit de lancement essentiel pour démarrer sur des bases solides.',
      features: ['Tout le Freemium', 'Générateur de Microsite', 'Template Livret d\'Accueil', 'Checklists interactives'],
      cta: 'Choisir ce plan',
      highlight: false,
    },
    {
      name: 'Silver',
      price: '99€',
      priceDetails: '/mois',
      description: 'Automatisez et optimisez pour devenir un hôte plus efficace.',
      features: ['Tout le Bronze', 'Synchronisation iCal', 'Assistant IA (Niveau 1)', 'Communauté privée'],
      cta: 'Choisir ce plan',
      highlight: true,
      badge: 'Recommandé'
    },
    {
      name: 'Gold',
      price: '199€',
      priceDetails: '/mois',
      description: 'Maîtrisez votre stratégie et passez à l\'échelle pour maximiser vos revenus.',
      features: ['Tout le Silver', 'IA Avancée (Audit, Screening)', 'Coaching 1:1 & Groupe', 'Dashboards KPIs avancés'],
      cta: 'Choisir ce plan',
      highlight: false,
    },
  ]);

  faqs = signal<FaqItem[]>([
    {
      question: "À qui s'adresse la plateforme Hôte d'Exception ?",
      answer: "Elle s'adresse à tous les hôtes en France et en Espagne, que vous soyez débutant souhaitant lancer votre premier bien, un hôte expérimenté cherchant à optimiser vos revenus, ou un Superhost visant l'automatisation et la croissance.",
      open: true
    },
    {
      question: 'Comment fonctionne le diagnostic "Roue de l\'Hôte" ?',
      answer: "C'est un quiz rapide en 4 étapes qui vous permet de vous auto-évaluer sur 7 domaines clés. À la fin, notre IA génère un bilan visuel, identifie vos points forts et vos opportunités, et vous recommande le plan d'action le plus adapté.",
      open: false
    },
    {
      question: "Les outils sont-ils complexes à utiliser ?",
      answer: "Non, au contraire ! Tous nos outils sont conçus pour être intuitifs et sans code. Vous remplissez les informations de votre propriété une seule fois, et la plateforme génère automatiquement votre microsite, votre livret d'accueil, etc.",
      open: false
    },
    {
      question: "Puis-je changer d'offre à tout moment ?",
      answer: "Absolument. Vous pouvez faire évoluer votre abonnement (par exemple de Bronze à Silver) ou le résilier à tout moment directement depuis votre espace client, en toute simplicité.",
      open: false
    }
  ]);

  constructor() {
    this.contextForm = this.fb.group({
      situation: ['J\'ai déjà un bien', Validators.required],
      challenge: ['Manque de temps', [Validators.required, Validators.minLength(10)]],
    });

    this.authForm = this.fb.group({
      email: ['', [Validators.required]], // Remove email validator to allow 'admin'
      password: ['', [Validators.required, Validators.minLength(4)]],
      fullName: [''] // Optional, required only for register
    });

    this.dbConfigForm = this.fb.group({
      url: ['', Validators.required],
      key: ['', Validators.required]
    });
  }

  selectSituation(situationId: string): void {
    this.contextForm.get('situation')?.setValue(situationId);
  }
  
  onSubmit(): void {
    if (this.contextForm.valid) {
      this.submitContext.emit(this.contextForm.value);
    }
  }

  toggleFaq(faqToToggle: FaqItem): void {
    this.faqs.update(faqs => 
      faqs.map(faq => 
        faq.question === faqToToggle.question 
          ? { ...faq, open: !faq.open }
          : { ...faq, open: false } // close others
      )
    );
  }

  onOpenAuthModal(): void {
    this.isAuthModalOpen.set(true);
    this.authError.set(null);
  }

  onCloseAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  toggleAuthMode(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.authError.set(null);
    if (mode === 'register') {
        this.authForm.get('fullName')?.setValidators([Validators.required]);
        this.authForm.get('email')?.setValidators([Validators.required, Validators.email]); // Enforce email for register
    } else {
        this.authForm.get('fullName')?.clearValidators();
        this.authForm.get('email')?.clearValidators();
        this.authForm.get('email')?.setValidators([Validators.required]); // Relax for admin login
    }
    this.authForm.get('fullName')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
  }

  async onAuthSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    const { email, password, fullName } = this.authForm.value;
    let success = false;

    if (this.authMode() === 'login') {
        success = await this.store.login(email, password);
    } else {
        success = await this.store.register(email, password, fullName);
    }

    if (success) {
        this.onCloseAuthModal();
    } else {
        this.authError.set(this.store.error());
    }
  }
  
  // DB Config
  onOpenDbConfig(): void {
      this.dbConfigForm.patchValue({
          url: localStorage.getItem('SUPABASE_URL') || '',
          key: localStorage.getItem('SUPABASE_KEY') || ''
      });
      this.isDbConfigOpen.set(true);
  }

  onCloseDbConfig(): void {
      this.isDbConfigOpen.set(false);
  }

  onSaveDbConfig(): void {
      if (this.dbConfigForm.valid) {
          const { url, key } = this.dbConfigForm.value;
          this.supabaseService.configure(url, key);
          this.onCloseDbConfig();
      }
  }

  scrollToDiagnostic(event?: Event): void {
    if (event) {
        event.preventDefault();
    }
    const element = document.getElementById('diagnostic-form');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
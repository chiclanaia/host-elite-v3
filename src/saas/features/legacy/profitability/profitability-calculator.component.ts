import { Component, computed, effect, inject, signal, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../services/translation.service';
import { SessionStore } from '../../../../state/session.store';
import { FinancialCalculator } from '../../../../services/financial-engine/engine';
import { FinancialInput, FinancialOutput, TierLevel } from '../../../../services/financial-engine/types';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'saas-profitability-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './profitability-calculator.component.html',
  styleUrls: ['./profitability-calculator.component.css']
})
export class ProfitabilityCalculatorComponent implements OnInit, AfterViewInit {
  store = inject(SessionStore);
  ts = inject(TranslationService);
  private fb = inject(FormBuilder);
  TierLevel = TierLevel;

  // View State
  activeStep = signal<number>(1); // 1: Acquisition, 2: Exploitation, 3: Charges
  activeTier = signal<TierLevel>(TierLevel.BASIC);
  simulationCount = signal<number>(0);
  maxSimulationsT0 = 3;

  // Calculation State
  form: FormGroup;
  today = new Date();
  results = signal<FinancialOutput | null>(null);
  coachingMessage = signal<string>("Prêt à analyser votre prochaine pépite ? Commencez par les frais d'acquisition.");

  // Tax Regimes based on Country
  availableRegimes = computed(() => {
    const country = this.form.get('country')?.value;
    if (country === 'Spain') {
      return [
        { id: 'ES_IRPF', label: 'IRPF (Non-résidents)' },
        { id: 'SPAIN_IVA', label: 'Gestion avec IVA' }
      ];
    }
    // RG_FIN_02: Comprehensive French Regimes
    return [
      { id: 'LMNP_MICRO', label: 'LMNP Micro-BIC (Abattement 50%)' },
      { id: 'LMNP_REEL', label: 'LMNP Réel (Amortissement)' },
      { id: 'LMNP_CENSI', label: 'LMNP Censi-Bouvard (Réduction 11%)' },
      { id: 'SCI_IS', label: 'SCI à l\'IS (Impôt Société)' },
      { id: 'SCI_IR', label: 'SCI à l\'IR (Transparente)' }
    ];
  });

  @ViewChild('expenseChart') expenseChartRef!: ElementRef;
  private chart: Chart | null = null;

  constructor() {
    Chart.register(...registerables);

    this.form = this.fb.group({
      // Step 1: Acquisition
      purchasePrice: [0, [Validators.required, Validators.min(1000)]],
      renovationCosts: [0],
      notaryFees: [0, [Validators.required]],
      furnitureCosts: [0],

      // Step 2: Exploitation
      grossMonthlyRevenue: [0, [Validators.required]],
      isApiEnabled: [false], // T3 Only
      announcementUrl: [''], // RG_FIN_04

      // Step 3: Charges
      electricity: [0],
      wifi: [15],
      cleaning: [0],
      insurance: [0],
      managementFees: [0],

      // Advanced
      taxRegime: ['LMNP_REEL'],
      country: ['France'],
      isEuResident: [true]
    });

    // RG_03: Update tax regime when country changes
    this.form.get('country')?.valueChanges.subscribe(country => {
      const defaultRegime = country === 'Spain' ? 'ES_IRPF' : 'LMNP_REEL';
      this.form.patchValue({ taxRegime: defaultRegime }, { emitEvent: false });
    });

    // Contextual Coaching & Auto-calculation
    this.form.valueChanges.subscribe(val => {
      this.updateCoaching(val);
      this.runCalculation(val);
    });
  }

  ngOnInit() {
    this.syncTierWithPlan();
    this.runCalculation(this.form.value);
  }

  ngAfterViewInit() {
    if (this.results()) this.renderExpenseChart();
  }

  userPlan = computed(() => this.store.userProfile()?.plan || 'Freemium');

  syncTierWithPlan() {
    const plan = this.userPlan();
    if (plan === 'Gold') this.activeTier.set(TierLevel.EXPERT);
    else if (plan === 'Silver' || plan === 'Bronze') this.activeTier.set(TierLevel.LOW);
    else this.activeTier.set(TierLevel.BASIC);
  }

  isTierLocked(tier: TierLevel): boolean {
    const levels = { 'BASIC': 0, 'LOW': 1, 'MEDIUM': 2, 'EXPERT': 3 };
    const userLevel = { 'Freemium': 0, 'Bronze': 1, 'Silver': 2, 'Gold': 3 }[this.userPlan()] || 0;
    return userLevel < levels[tier];
  }

  nextStep() {
    if (this.activeStep() < 3) {
      // RG_02: Notary Fees integrity
      const notaryValue = this.form.get('notaryFees')?.value;
      if (this.activeStep() === 1 && (!notaryValue || notaryValue === 0)) {
        const price = this.form.get('purchasePrice')?.value;
        const defaultFees = Math.round(price * 0.08);
        this.form.patchValue({ notaryFees: defaultFees });
        this.coachingMessage.set("L'État n'oublie jamais ses frais, nous avons pré-rempli 8% par défaut.");
      }
      this.activeStep.update(s => s + 1);
    } else {
      // RG_01: Simulation limit for TIER_0
      if (this.activeTier() === TierLevel.BASIC && this.simulationCount() >= this.maxSimulationsT0) {
        return; // Button logic in HTML will handle the upsell display
      }
      this.simulationCount.update(c => c + 1);
      this.runCalculation(this.form.value);
    }
  }

  prevStep() {
    if (this.activeStep() > 1) this.activeStep.update(s => s - 1);
  }

  updateCoaching(val: any) {
    if (this.activeStep() === 1) {
      this.coachingMessage.set("Pensez à inclure le mobilier (€) pour optimiser votre amortissement fiscal LMNP.");
    } else if (this.activeStep() === 2) {
      // Fiscal explanations
      if (val.taxRegime === 'LMNP_MICRO') {
        this.coachingMessage.set("Le Micro-BIC est simple : 50% d'abattement forfaitaire. Idéal si peu de charges.");
      } else if (val.taxRegime === 'LMNP_REEL') {
        this.coachingMessage.set("Le Réel permet de déduire travaux et amortissements. Souvent plus rentable !");
      } else {
        this.coachingMessage.set("Estimez vos revenus. Les experts visent au moins 8% de rendement brut.");
      }
    } else if (this.activeStep() === 3) {
      // Updated Warning Logic
      const costsRatio = (val.cleaning + val.managementFees) / (val.grossMonthlyRevenue || 1);
      if (costsRatio > 0.3) {
        this.coachingMessage.set("N'oubliez pas les frais de ménage, ils peuvent représenter 15% de votre CA !");
      }
    }
  }

  // RG_FIN_01: Save restriction for T0
  saveSimulation() {
    if (this.isTierLocked(TierLevel.LOW)) {
      alert("Ne perdez plus vos calculs. Passez au Tier 1 pour historiser vos recherches.");
      return;
    }
    console.log("Simulation saved");
  }

  // Tier 3: Bank Dossier PDF
  generatePdf() {
    if (this.isTierLocked(TierLevel.EXPERT)) {
      alert("Cette fonctionnalité est réservée aux abonnés Gold (Tier 3). Elle génère un dossier bancaire complet.");
      return;
    }
    window.print();
  }

  // RG_FIN_04: AI Extraction placeholder
  extractDataFromUrl() {
    const url = this.form.get('announcementUrl')?.value;
    if (!url) return;

    // Simulate AI extraction
    this.form.patchValue({
      purchasePrice: 280000,
      grossMonthlyRevenue: 3200,
      cleaning: 60
    });
    this.coachingMessage.set("IA : Données extraites de l'annonce. Vérifiez les montants.");
  }

  runCalculation(val: any) {
    const calc = new FinancialCalculator();
    const revenue = val.grossMonthlyRevenue * 100;
    const managementFeeCents = Math.round(revenue * (val.managementFees / 100));

    const input: FinancialInput = {
      tier: this.activeTier(),
      purchasePrice: val.purchasePrice * 100,
      renovationCosts: val.renovationCosts * 100,
      notaryFees: val.notaryFees * 100,
      furnitureCosts: val.furnitureCosts * 100,
      grossMonthlyRevenue: revenue,
      fixedCosts: [(val.electricity + val.wifi + val.insurance) * 100],
      variableCosts: [val.cleaning * 100, managementFeeCents],
      taxRegime: val.taxRegime
    };

    try {
      const output = calc.calculate(input);
      this.results.set(output);
      setTimeout(() => this.renderExpenseChart(), 0);
    } catch (e) {
      console.error("Calculation error", e);
    }
  }

  getProfitabilityColor(): string {
    const res = this.results();
    if (!res) return 'bg-slate-500';
    const cashflow = res.netMonthlyCashFlow;
    if (cashflow > 50000) return 'bg-emerald-500'; // > 500€
    if (cashflow > 0) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  renderExpenseChart() {
    if (!this.expenseChartRef) return;
    const ctx = this.expenseChartRef.nativeElement.getContext('2d');
    if (this.chart) this.chart.destroy();

    const val = this.form.value;
    const revenue = val.grossMonthlyRevenue * 100;
    const mgmtCents = Math.round(revenue * (val.managementFees / 100)) / 100;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Fixe', 'Ménage', 'Gestion', 'Energie'],
        datasets: [{
          data: [1000, val.cleaning, mgmtCents, val.electricity + val.wifi],
          backgroundColor: ['#D4AF37', '#10B981', '#3B82F6', '#F59E0B'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  }

  fromCents(v: number | undefined) { return (v || 0) / 100; }
}

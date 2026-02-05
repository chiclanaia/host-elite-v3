import { Component, computed, EventEmitter, Output, signal, input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStore } from '../../../../state/session.store';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { GeminiService } from '../../../../services/gemini.service';
import { TranslationService } from '../../../../services/translation.service';


@Component({
    selector: 'app-delegation-simulator',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './delegation-simulator.component.html'
})
export class DelegationSimulatorComponent {
    @Output() close = new EventEmitter<void>();
    private geminiService = inject(GeminiService);

    userPlan = input<string>('TIER_0');

    private store = inject(SessionStore);
    propertyDetails = input<any>(null);

    // Can only view "Supplier Interaction" if plan is Silver or Gold (Rank >= 2)
    canViewSupplierSection = computed(() => this.store.getTierRank(this.userPlan()) >= 2);
    isGold = computed(() => this.store.getTierRank(this.userPlan()) >= 3);

    // Toggle for Supplier Section
    isSupplierSectionOpen = signal(false);

    // AI Analysis State
    isAnalyzing = signal(false);
    aiSummary = signal<{
        nightlyRate: number;
        occupancy: number;
        commission: number;
        cleaning: number;
        message: string;
    } | null>(null);

    constructor() {
        // Auto-open if user has access
        effect(() => {
            this.isSupplierSectionOpen.set(this.canViewSupplierSection());
        }, { allowSignalWrites: true });
    }

    async runAiAnalysis() {
        if (!this.isGold() || !this.propertyDetails()) return;

        this.isAnalyzing.set(true);
        const address = this.propertyDetails().address || 'France'; // Fallback

        try {
            const result = await this.geminiService.getMarketAnalysis(address);

            // Update Simulator Signals
            this.nightlyRate.set(result.estimatedNightlyRate);
            this.occupancyDirect.set(result.estimatedOccupancy);
            this.occupancyConcierge.set(Math.min(result.estimatedOccupancy + 10, 95)); // Concierge usually better
            this.commissionConcierge.set(result.conciergeCommission);
            // We don't have a direct inputs for cleaning revenue/cost in the basic calc, 
            // but we can update the summary.

            this.aiSummary.set({
                nightlyRate: result.estimatedNightlyRate,
                occupancy: result.estimatedOccupancy,
                commission: result.conciergeCommission,
                cleaning: result.cleaningFees,
                message: result.summary
            });

        } catch (e) {
            console.error('AI Analysis failed', e);
        } finally {
            this.isAnalyzing.set(false);
        }
    }

    // --- INPUT SIGNALS ---
    nightlyRate = signal(120);
    occupancyDirect = signal(65);
    occupancyConcierge = signal(85); // Concierges often optimize occupancy

    commissionPlatform = signal(17); // Airbnb/Booking avg
    commissionConcierge = signal(20);

    hoursPerStay = signal(4); // Cleaning, check-in, messages, maintenance
    ownerHourlyRate = signal(25); // What the owner's time is worth

    // --- COMPUTATIONS ---

    // 1. Annual Revenue Calculation
    annualRevenueDirect = computed(() => {
        return this.nightlyRate() * 365 * (this.occupancyDirect() / 100);
    });

    annualRevenueConcierge = computed(() => {
        return this.nightlyRate() * 365 * (this.occupancyConcierge() / 100);
    });

    // 2. Net Revenue (Financial Only)
    netRevenueDirect = computed(() => {
        const gross = this.annualRevenueDirect();
        const platformCost = gross * (this.commissionPlatform() / 100);
        return gross - platformCost;
    });

    netRevenueConcierge = computed(() => {
        const gross = this.annualRevenueConcierge();
        const platformCost = gross * (this.commissionPlatform() / 100);
        const conciergeCost = gross * (this.commissionConcierge() / 100);
        return gross - platformCost - conciergeCost;
    });

    // 3. Time Cost Calculation
    annualStaysDirect = computed(() => {
        return 365 * (this.occupancyDirect() / 100) / 2.5; // Avg stay 2.5 days
    });

    annualHoursSpent = computed(() => {
        return this.annualStaysDirect() * this.hoursPerStay();
    });

    timeCostValue = computed(() => {
        return this.annualHoursSpent() * this.ownerHourlyRate();
    });

    // 4. "Real" Value Comparison (Financial + Time Value)
    totalValueConcierge = computed(() => this.netRevenueConcierge());

    // Direct = Net Revenue - Value of Time Lost
    totalValueDirectReal = computed(() => {
        return this.netRevenueDirect() - this.timeCostValue();
    });

    // 5. Deltas
    financialDelta = computed(() => this.netRevenueConcierge() - this.netRevenueDirect());
    realValueDelta = computed(() => this.totalValueConcierge() - this.totalValueDirectReal());

    private ts = inject(TranslationService);

    // 6. Expert Advice Logic
    expertAdvice = computed(() => {
        const financialDiff = this.financialDelta(); // If negative, Owner makes less money with concierge
        const hoursSaved = this.annualHoursSpent();

        if (this.totalValueConcierge() > this.netRevenueDirect()) {
            return {
                type: 'success',
                key: 'DELEGATION.Advice.Win',
                params: {}
            };
        } else if (this.realValueDelta() > 0) {
            const costPerHour = (Math.abs(financialDiff) / hoursSaved).toFixed(2);
            return {
                type: 'info',
                key: 'DELEGATION.Advice.Freedom',
                params: {
                    amount: Math.abs(Math.round(financialDiff)),
                    hours: Math.round(hoursSaved),
                    cost: costPerHour
                }
            };
        } else {
            return {
                type: 'warning',
                key: 'DELEGATION.Advice.Control',
                params: {}
            };
        }
    });

    translateAdvice(advice: any): string {
        return this.ts.translate(advice.key, advice.params) || '';
    }

    // Helpers for Chart Bars (0-100% relative width)
    maxRevenue = computed(() => Math.max(this.netRevenueDirect(), this.netRevenueConcierge(), this.totalValueDirectReal()));

    getBarWidth(value: number): string {
        return (value / this.maxRevenue() * 100) + '%';
    }
}

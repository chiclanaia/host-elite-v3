
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { View, Feature } from '../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HostRepository } from '../../services/host-repository.service';
import { GeminiService } from '../../services/gemini.service';
import { SessionStore } from '../../state/session.store';

import { MicrositeConfig, BuilderPhoto, SectionDef, resolveMicrositeConfig } from './welcome-booklet/booklet-definitions';
import { MicrositeContainerComponent } from '../features/legacy/microsite/microsite-container.component';
import { AiPromptsComponent } from '../features/legacy/ai-prompts/ai-prompts.component';
import { VisibilityAuditComponent } from '../features/legacy/visibility-audit/visibility-audit.component';
import { BookletToolComponent } from '../features/legacy/booklet-tool/booklet-tool.component';
import { AiMessageAssistantComponent } from '../features/legacy/ai-message-assistant/ai-message-assistant.component';
import { ChecklistsToolComponent } from '../features/legacy/checklists/checklists-tool.component';
import { DelegationSimulatorComponent } from '../features/legacy/delegation/delegation-simulator.component';
import { CalendarToolComponent } from '../features/legacy/calendar-tool/components/calendar-tool.component';
import { ProfitabilityCalculatorComponent } from '../features/legacy/profitability/profitability-calculator.component';
import { MarketAlertsComponent } from '../features/legacy/market-alerts/market-alerts.component';
import { PropertyAuditComponent } from '../features/legacy/property-audit/property-audit.component';
import { TranslationService } from '../../services/translation.service';

import { TranslatePipe } from '../../pipes/translate.pipe';
import { WelcomeBookletService } from './welcome-booklet/welcome-booklet.service';
import { OnboardingService } from '../../services/onboarding.service';

interface OnboardingQuestion {
    id: string;
    question_key: string;
    level: 'Bronze' | 'Silver' | 'Gold' | 'TIER_1' | 'TIER_2' | 'TIER_3';
    order_index: number;
    has_sub_question: boolean;
    sub_question_config?: {
        id: string;
        label_key: string;
        type: 'text' | 'url' | 'number';
        placeholder?: string;
    }
}

@Component({
    selector: 'saas-angle-view',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        ReactiveFormsModule,
        AiPromptsComponent,
        VisibilityAuditComponent,
        BookletToolComponent,
        AiMessageAssistantComponent,
        ChecklistsToolComponent,
        MicrositeContainerComponent,
        DelegationSimulatorComponent,
        CalendarToolComponent,
        ProfitabilityCalculatorComponent,
        MarketAlertsComponent,
        PropertyAuditComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './angle-view.component.html',
})
export class PhaseViewComponent implements OnInit {
    translationService = inject(TranslationService);
    view = input.required<View>();
    userPlan = input.required<string>();

    private repository = inject(HostRepository);
    public store = inject(SessionStore); // Public for template access
    private bookletService = inject(WelcomeBookletService);
    private onboardingService = inject(OnboardingService);
    private fb: FormBuilder = inject(FormBuilder);
    private geminiService = inject(GeminiService); // Injected but maybe unused if logic moved

    // Legacy support state
    activeToolId = signal<string | null>(null);
    currentPropertyId = signal<string | null>(null);
    propertyDetails = signal<any>(null);
    isModalOpen = signal(false);
    onboardingForm = signal<FormGroup | null>(null);
    currentQuestions = signal<OnboardingQuestion[]>([]);
    saveMessage = signal<string | null>(null);

    // Maturity for legacy badge in header (optional, maybe specific to dimension)
    maturityInfo = signal<any>(null);


    // Computed Data for Phase View
    phaseFeatures = computed(() => {
        const viewId = this.view().id;
        // The view ID should correspond to the Phase ID (e.g. PH_1_INVEST)
        const allFeatures = this.store.featuresByPhase();
        return allFeatures[viewId] || [];
    });

    phaseDimensions = computed(() => {
        const features = this.phaseFeatures();
        // Group by dimension
        const groups: Record<string, { id: string, name: string, features: Feature[] }> = {};

        features.forEach(f => {
            const dimId = f.dimension_id;
            if (!groups[dimId]) {
                groups[dimId] = {
                    id: dimId,
                    name: f.dimension_name || dimId,
                    features: []
                };
            }
            groups[dimId].features.push(f);
        });

        // Return array sorted by logic or just keys
        // Ideally sorting by dimension order would be better but we don't have rank_order on dim yet.
        return Object.values(groups);
    });

    // Mapping DB Features to Legacy Tools
    // Key: DB Feature ID / Name (or part of it) -> Value: Legacy Tool Selector ID
    private legacyToolMapping: Record<string, string> = {
        'MKT_01': 'microsite',
        'MKT_02': 'ai-prompts',
        'MKT_03': 'visibility-audit',
        'EXP_01': 'booklet',
        'EXP_02': 'ai-assistant',
        'EXP_03': 'guest-screening', // No implementation?
        'OPS_01': 'checklists',
        'OPS_02': 'calendar-sync',
        'OPS_03': 'delegation-sim',
        'OPS_04': 'airbnb-ready',
        // 'OPS_05': 'security-check',
        'PRC_01': 'profitability',
        'PRC_02': 'market-alerts',
        // 'PRC_03': 'pricing-tools' 
    };

    constructor() {
        effect(() => {
            // Reset tool when view changes
            this.activeToolId.set(null);
            this.loadPropertyData();

            // Sync booklet service
            const currentProp = this.view().propertyName;
            if (currentProp && this.bookletService.propertyName() !== currentProp) {
                this.bookletService.propertyName.set(currentProp);
            }
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
                }
            } catch (e) {
                console.error("Error loading property:", e);
            }
        }
    }

    openFeature(feature: Feature) {
        // Check legacy mapping
        const legacyId = this.legacyToolMapping[feature.id];
        if (legacyId) {
            this.activeToolId.set(legacyId);
        } else {
            // New feature placeholder
            console.log("Opening new feature:", feature.name);
            // Optionally set a specialized ID or show a "Coming Soon" toast
            this.saveMessage.set(`Feature "${feature.name}" is coming soon!`);
            setTimeout(() => this.saveMessage.set(null), 3000);
        }
    }

    closeTool() {
        this.activeToolId.set(null);
    }

    isFeatureLocked(feature: Feature): boolean {
        // Simple tier check: User Tier Rank vs Feature Required Tier Rank
        // We need a helper for rank
        const levels: Record<string, number> = { 'Freemium': 0, 'TIER_0': 0, 'Bronze': 1, 'TIER_1': 1, 'Silver': 2, 'TIER_2': 2, 'Gold': 3, 'TIER_3': 3 };

        const userLevel = levels[this.userPlan()] || 0;
        const requiredLevel = levels[feature.required_tier || 'TIER_0'] || 0;

        return userLevel < requiredLevel;
    }

    getTierClass(tier: string | undefined): string {
        const t = tier || 'TIER_0';
        if (t.includes('TIER_3') || t.includes('Gold')) return 'bg-yellow-400'; // Gold
        if (t.includes('TIER_2') || t.includes('Silver')) return 'bg-slate-300'; // Silver
        if (t.includes('TIER_1') || t.includes('Bronze')) return 'bg-amber-600'; // Bronze
        return 'bg-emerald-500'; // Free/Starter (Green for visibility in debug)
    }

    getTierLabel(tier: string | undefined): string {
        const t = tier || 'TIER_0';
        if (t.includes('TIER_3') || t.includes('Gold')) return 'Gold';
        if (t.includes('TIER_2') || t.includes('Silver')) return 'Silver';
        if (t.includes('TIER_1') || t.includes('Bronze')) return 'Bronze';
        return 'Free';
    }

    // --- Legacy Audit / Onboarding Logic ---

    async openLegacyAudit(dimensionId: string) {
        try {
            const propertyId = this.currentPropertyId();
            if (!propertyId) return;

            // Map dimension ID if necessary? 
            // The DB dimensions are 'MKT', 'EXP', 'OPS', etc.
            // The legacy audit expects 'DIM_MKT', 'DIM_EXP', etc.
            let legacyDimId = dimensionId;
            if (!dimensionId.startsWith('DIM_')) {
                // Try to guess mapping. 
                // DB: Marketing -> MKT. Legacy: DIM_MKT.
                // Actually the DB seeds for app_dimensions have ids like 'Marketing', 'Experience'.
                // Wait, check types.ts or DB seed.
                // In create_features_system.sql: ('Marketing', 'Marketing'), ('Finance', 'Finance')...
                // The legacy IDs were 'DIM_MKT'. 
                // I might need a mapping here too.

                const map: Record<string, string> = {
                    'Marketing': 'DIM_MKT',
                    'Experience': 'DIM_EXP',
                    'Operations': 'DIM_OPS', // Or 'Logement'?
                    'Pricing': 'DIM_PRICING',
                    'Legal': 'DIM_LEGAL',
                    'Mindset': 'mindset',
                    'Finance': 'DIM_FINANCE'
                };
                legacyDimId = map[dimensionId] || dimensionId;
            }

            // Load questions
            let questions = await this.onboardingService.getQuestionsByDimension(legacyDimId);

            // Legacy synthetic questions logic for OPS
            if (legacyDimId === 'DIM_OPS' && questions.length < 40) {
                const existingKeys = new Set(questions.map(q => q.question_key));
                for (let i = 1; i <= 40; i++) {
                    const key = `AUDIT.accomodation_q${i}`;
                    if (!existingKeys.has(key)) {
                        questions.push({
                            id: `synthetic_${i}`,
                            dimension: legacyDimId, // Type mismatch fix might be needed if strictly typed
                            question_key: key,
                            level: i <= 10 ? 'Bronze' : (i <= 20 ? 'Silver' : 'Gold'),
                            order_index: i,
                            has_sub_question: false
                        } as any);
                    }
                }
                questions.sort((a, b) => a.order_index - b.order_index);
            }

            if (!questions || questions.length === 0) {
                // Fallback or alert
                console.warn("No questions for", legacyDimId);
                this.saveMessage.set("Audit non disponible pour cette dimension.");
                setTimeout(() => this.saveMessage.set(null), 3000);
                return;
            }

            this.currentQuestions.set(questions);
            const answersMap = await this.onboardingService.getAnswers(propertyId, legacyDimId);
            const formControls = questions.reduce((acc, q) => {
                const answer = answersMap.get(q.id);
                acc[q.id] = [answer ? answer.answer : false];
                if (q.sub_question_config) {
                    acc[q.sub_question_config.id] = [answer ? answer.sub_answer : ''];
                }
                return acc;
            }, {} as Record<string, any>);

            this.onboardingForm.set(this.fb.group(formControls));
            this.isModalOpen.set(true);

        } catch (e) {
            console.error("Error opening audit:", e);
        }
    }

    closeOnboarding() {
        this.isModalOpen.set(false);
    }

    async saveOnboarding() {
        // Reuse logic
        const form = this.onboardingForm();
        const propertyId = this.currentPropertyId();
        const questions = this.currentQuestions();

        if (form?.valid && propertyId && questions.length > 0) {
            try {
                const formValues = form.value;
                const answersToSave = questions.map(q => ({
                    question_id: q.id,
                    answer: formValues[q.id],
                    sub_answer: q.sub_question_config ? formValues[q.sub_question_config.id] : undefined
                }));

                await this.onboardingService.saveAnswers(propertyId, answersToSave);
                this.saveMessage.set(this.translationService.translate('COMMON.AuditSaved'));
                setTimeout(() => this.saveMessage.set(null), 3000);
                this.closeOnboarding();
            } catch (error) {
                console.error('Error saving onboarding:', error);
            }
        }
    }
}

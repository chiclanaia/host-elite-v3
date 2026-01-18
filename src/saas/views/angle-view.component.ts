
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { View } from '../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HostRepository } from '../../services/host-repository.service';
import { GeminiService } from '../../services/gemini.service';
import { SessionStore } from '../../state/session.store';

import { MicrositeConfig, BuilderPhoto, SectionDef, resolveMicrositeConfig } from './welcome-booklet/booklet-definitions';
import { MicrositeContainerComponent } from '../features/microsite/microsite-container.component';
import { AiPromptsComponent } from '../features/ai-prompts/ai-prompts.component';
import { BookletToolComponent } from '../features/booklet-tool/booklet-tool.component';
import { VisibilityAuditComponent } from '../features/visibility-audit/visibility-audit.component';
import { AiMessageAssistantComponent } from '../features/ai-message-assistant/ai-message-assistant.component';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { WelcomeBookletService } from './welcome-booklet/welcome-booklet.service';
import { OnboardingService } from '../../services/onboarding.service';

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
    question_key: string;
    level: QuestionLevel;
    order_index: number;
    has_sub_question: boolean;
    sub_question_config?: {
        id: string;
        label_key: string;
        type: 'text' | 'url' | 'number';
        placeholder?: string;
    }
}

// Microsite Types imported from booklet-definitions.ts



@Component({
    selector: 'saas-angle-view',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MicrositeContainerComponent, AiPromptsComponent, VisibilityAuditComponent, BookletToolComponent, AiMessageAssistantComponent, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './angle-view.component.html',
})
export class AngleViewComponent implements OnInit {
    translationService = inject(TranslationService);
    view = input.required<View>();
    // Note: userPlan input might be string, force casting or handling in logic
    userPlan = input.required<string>();

    private repository = inject(HostRepository);
    private geminiService = inject(GeminiService);
    private store = inject(SessionStore);
    private bookletService = inject(WelcomeBookletService);
    private onboardingService = inject(OnboardingService);
    private fb: FormBuilder = inject(FormBuilder);



    isModalOpen = signal(false);
    onboardingForm = signal<FormGroup | null>(null);

    // Tools Logic
    activeToolId = signal<string | null>(null);

    // Marketing Description Logic - MOVED TO AiPromptsComponent
    // Keeping common signals that might be shared or needed for other tools
    saveMessage = signal<string | null>(null);
    isAiDesigning = signal(false);
    currentPropertyId = signal<string | null>(null);

    // AI Listing State - MOVED TO AiPromptsComponent

    // Dynamic Content Signals
    propertyDetails = signal<any>(null);
    bookletContent = signal<any>(null);
    maturityInfo = signal<{ level: 'Low' | 'Medium' | 'High', color: string, description: string } | null>(null);

    // Guide Modal State
    // Guide Modal State - Handled by renderer now


    // User contact info
    userEmail = computed(() => this.store.userProfile()?.email || '');

    // Microsite Builder Logic
    // Microsite Builder Logic - MOVED TO MicrositeContainerComponent
    // Keeping only propertyDetails and related logic needed for other tools or shared state loading


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
            title: 'NAV.marketing',
            description: 'ANGLE.marketing_desc',
            tools: [
                { id: 'microsite', name: 'TOOL.microsite_name', description: 'TOOL.microsite_desc', requiredPlan: 'Bronze' },
                { id: 'ai-prompts', name: 'TOOL.ai_listing_name', description: 'TOOL.ai_listing_desc', requiredPlan: 'Silver' },
                { id: 'visibility-audit', name: 'TOOL.audit_vis_name', description: 'TOOL.audit_vis_desc', requiredPlan: 'Gold' },
            ]
        },
        'experience': {
            title: 'NAV.experience',
            description: 'ANGLE.experience_desc',
            tools: [
                { id: 'booklet', name: 'TOOL.booklet_name', description: 'TOOL.booklet_desc', requiredPlan: 'Bronze' },
                { id: 'ai-assistant', name: 'TOOL.ai_msg_name', description: 'TOOL.ai_msg_desc', requiredPlan: 'Silver' },
                { id: 'guest-screening', name: 'TOOL.screening_name', description: 'TOOL.screening_desc', requiredPlan: 'Gold' },
            ]
        },
        'operations': {
            title: 'NAV.operations',
            description: 'ANGLE.operations_desc',
            tools: [
                { id: 'checklists', name: 'TOOL.checklists_name', description: 'TOOL.checklists_desc', requiredPlan: 'Bronze' },
                { id: 'ical-sync', name: 'TOOL.ical_name', description: 'TOOL.ical_desc', requiredPlan: 'Silver' },
                { id: 'delegation-sim', name: 'TOOL.delegation_name', description: 'TOOL.delegation_desc', requiredPlan: 'Gold' },
            ]
        },
        'pricing': {
            title: 'NAV.pricing',
            description: 'ANGLE.pricing_desc',
            tools: [
                { id: 'profitability', name: 'TOOL.profit_name', description: 'TOOL.profit_desc', requiredPlan: 'Bronze' },
                { id: 'market-alerts', name: 'TOOL.alerts_name', description: 'TOOL.alerts_desc', requiredPlan: 'Silver' },
                { id: 'pricing-tools', name: 'TOOL.dynamic_name', description: 'TOOL.dynamic_desc', requiredPlan: 'Gold' },
            ]
        },
        'accomodation': {
            title: 'NAV.accomodation',
            description: 'ANGLE.accomodation_desc',
            tools: [
                { id: 'airbnb-ready', name: 'TOOL.airbnb_ready_name', description: 'TOOL.airbnb_ready_desc', requiredPlan: 'Bronze' },
                { id: 'security-check', name: 'TOOL.security_name', description: 'TOOL.security_desc', requiredPlan: 'Bronze' },
                { id: 'manual-gen', name: 'TOOL.manual_name', description: 'TOOL.manual_desc', requiredPlan: 'Silver' },
                { id: 'unique-gen', name: 'TOOL.unique_name', description: 'TOOL.unique_desc', requiredPlan: 'Gold' },
            ]
        },
        'legal': {
            title: 'NAV.legal',
            description: 'ANGLE.legal_desc',
            tools: [
                { id: 'reminders', name: 'TOOL.reminders_name', description: 'TOOL.reminders_desc', requiredPlan: 'Bronze' },
                { id: 'kpis-simple', name: 'TOOL.kpi_simple_name', description: 'TOOL.kpi_simple_desc', requiredPlan: 'Silver' },
                { id: 'kpis-advanced', name: 'TOOL.kpi_adv_name', description: 'TOOL.kpi_adv_desc', requiredPlan: 'Gold' },
            ]
        },
        'mindset': {
            title: 'NAV.mindset',
            description: 'ANGLE.mindset_desc',
            tools: [
                { id: 'elearning', name: 'TOOL.elearning_name', description: 'TOOL.elearning_desc', requiredPlan: 'Bronze' },
                { id: 'community', name: 'TOOL.community_name', description: 'TOOL.community_desc', requiredPlan: 'Silver' },
                { id: 'coaching', name: 'TOOL.coaching_name', description: 'TOOL.coaching_desc', requiredPlan: 'Gold' },
            ]
        },
    };

    constructor() {
        effect(() => {
            // Reload data when the view changes (e.g., switching property)
            this.activeToolId.set(null); // Reset active tool on view change
            this.loadPropertyData();

            // CRITICAL FIX: Initialize Booklet Service with current property
            const currentProp = this.view().propertyName;
            if (currentProp && this.bookletService.propertyName() !== currentProp) {
                console.log('[AngleView] Initializing BookletService with:', currentProp);
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

                // Check if WelcomeBookletService has hot data for this property
                console.log(`[DEBUG] AngleView Load: ViewProp=${v.propertyName}, ServiceProp=${this.bookletService.propertyName()}, ServiceLoading=${this.bookletService.isLoading()}`);

                if (this.bookletService.propertyName() === v.propertyName && !this.bookletService.isLoading()) {
                    console.log('[AngleView] Using hot data from WelcomeBookletService');
                    const rawContent = this.bookletService.editorForm.getRawValue();
                    this.bookletContent.set(rawContent);
                    if (rawContent.bienvenue?.messageBienvenue) {
                        // this.marketingText.set(rawContent.bienvenue.messageBienvenue);
                    }
                } else {
                    // Fallback to DB
                    console.log('[AngleView] Loading booklet from DB');
                    const bookletData = await this.repository.getBooklet(v.propertyName);
                    if (bookletData) {
                        this.bookletContent.set(bookletData);
                        // We do NOT load microsite config here anymore, strictly content.
                    }
                }

                console.log('[AngleView] Data load complete.');
                this.loadMaturityLevel();
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

    // --- Microsite Builder Methods Removed (MOVED TO CONTAINER) ---

    // Debug logging state
    debugLogs = signal<string[]>(['Debug System Ready']);



    async generateBookletContentWithAI() {
        if (!this.hasAiAccess() || !this.view().propertyName) return;

        this.isAiDesigning.set(true);
        try {
            const propName = this.view().propertyName!;
            const propData = await this.repository.getPropertyByName(propName);
            const address = propData?.address || 'France'; // Use address for local context

            // Pass current structure to fill (only empty fields or update all?)
            // We pass the current structure so AI knows the schema, but we might want to prioritize filling empty ones.
            // geminiService.autoFillBooklet expects an empty structure to fill.

            const filledContent = await this.geminiService.autoFillBooklet(address, this.bookletContent());

            if (filledContent) {
                this.bookletContent.set(filledContent);
                this.saveMessage.set("Contenu généré par l'IA !");
                setTimeout(() => this.saveMessage.set(null), 3000);
            }
        } catch (e) {
            console.error("AI Booklet Error:", e);
            alert("Erreur lors de la génération du contenu.");
        } finally {
            this.saveMessage.set(null);
        }
    }

    private logToUi(message: string, data?: any) {
        const timestamp = new Date().toLocaleTimeString();
        const fullMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data) : ''}`;
        console.log(message, data); // Keep console log
        this.debugLogs.update(logs => [fullMessage, ...logs].slice(0, 10));
    }

    // --- Marketing AI Logic MOVED TO AiPromptsComponent ---
    // --- Visibility Audit Logic MOVED TO VisibilityAuditComponent ---
    // Methods removed: generateListingWithPhotos, saveDescription, runVisibilityAudit
    // Signals removed: auditStatus, auditProgress, auditStep, auditResult, airbnbUrl, bookingUrl, otherUrl



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

    currentQuestions = signal<OnboardingQuestion[]>([]);


    async openOnboarding(): Promise<void> {
        try {
            const angle = this.view().id;
            const propertyId = this.currentPropertyId();

            if (!propertyId) {
                console.error('No property ID found');
                return;
            }

            // Load questions from database for this angle
            const questions = await this.onboardingService.getQuestionsByAngle(angle);

            if (!questions || questions.length === 0) {
                console.warn('No questions found for angle:', angle);
                return;
            }

            // Update signal
            this.currentQuestions.set(questions);

            // Load existing answers
            const answersMap = await this.onboardingService.getAnswers(propertyId, angle);

            // Build form controls with existing values
            const formControls = questions.reduce((acc, q) => {
                const answer = answersMap.get(q.id);
                acc[q.id] = [answer ? answer.answer : false]; // checkbox

                if (q.sub_question_config) {
                    acc[q.sub_question_config.id] = [answer ? answer.sub_answer : '']; // sub-question input
                }
                return acc;
            }, {} as Record<string, any>);


            this.onboardingForm.set(this.fb.group(formControls));
            this.isModalOpen.set(true);
        } catch (error) {
            console.error('Error opening onboarding:', error);
        }
    }

    closeOnboarding(): void {
        this.isModalOpen.set(false);
        this.onboardingForm.set(null);
    }

    async saveOnboarding(): Promise<void> {
        const form = this.onboardingForm();
        const propertyId = this.currentPropertyId();
        const questions = this.currentQuestions();

        if (form?.valid && propertyId && questions.length > 0) {
            try {
                const formValues = form.value;
                const answersToSave = questions.map(q => {
                    return {
                        question_id: q.id,
                        answer: formValues[q.id],
                        sub_answer: q.sub_question_config ? formValues[q.sub_question_config.id] : undefined
                    };
                });

                await this.onboardingService.saveAnswers(propertyId, answersToSave);
                await this.loadMaturityLevel(); // Refresh maturity

                this.saveMessage.set("Audit enregistré avec succès !");
                setTimeout(() => this.saveMessage.set(null), 3000);
                this.closeOnboarding();
            } catch (error) {
                console.error('Error saving onboarding:', error);
                alert("Erreur lors de l'enregistrement de l'audit.");
            }
        }
    }

    async loadMaturityLevel() {
        const propertyId = this.currentPropertyId();
        const angle = this.view().id;
        if (propertyId) {
            const info = await this.onboardingService.getMaturityLevel(propertyId, angle);
            this.maturityInfo.set(info);
        }
    }
}

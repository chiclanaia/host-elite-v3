import { Component, computed, inject, input, signal, effect, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { OnboardingService, OnboardingQuestion } from '../../../../services/onboarding.service';
import { HostRepository } from '../../../../services/host-repository.service';
import { SessionStore } from '../../../../state/session.store';
import { DEFAULT_QUESTIONS } from '../../../../services/data/default-questions';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../services/translation.service';
import { GeminiService } from '../../../../services/gemini.service';

@Component({
    selector: 'app-property-audit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './property-audit.component.html',
    styleUrls: ['./property-audit.component.css']
})
export class PropertyAuditComponent implements OnInit {
    propertyId = input<string>('');
    @Output() close = new EventEmitter<void>();

    private onboardingService = inject(OnboardingService);
    private store = inject(SessionStore);
    private fb = inject(FormBuilder);
    private gemini = inject(GeminiService);
    private hostRepo = inject(HostRepository);

    questions = signal<OnboardingQuestion[]>([]);
    answers = signal<Map<string, any>>(new Map());
    isLoading = signal(false);
    isGeneratingAi = signal(false);
    aiRecommendation = signal<string | null>(null);
    auditForm: FormGroup = this.fb.group({});

    // Mapped levels for the 4-tier display (sense of progression towards excellence)
    tiers = computed(() => {
        const qs = this.questions();
        const tiersList = [
            { id: 'Indispensables', label: 'Indispensables (Sécurité & Base)', color: 'bg-rose-500', questions: [] as OnboardingQuestion[] },
            { id: 'Standards', label: 'Standards (Confort Professionnel)', color: 'bg-orange-500', questions: [] as OnboardingQuestion[] },
            { id: 'Premium', label: 'Premium (Expérience & Travail)', color: 'bg-indigo-500', questions: [] as OnboardingQuestion[] },
            { id: 'Excellence', label: 'Excellence (Haut de Gamme)', color: 'bg-[#D4AF37]', questions: [] as OnboardingQuestion[] }
        ];

        qs.forEach(q => {
            const keyNum = parseInt(q.question_key.match(/\d+/)?.[0] || '0');
            if (keyNum <= 10) {
                tiersList[0].questions.push(q);
            } else if (keyNum <= 20) {
                tiersList[1].questions.push(q);
            } else if (keyNum <= 30) {
                tiersList[2].questions.push(q);
            } else {
                tiersList[3].questions.push(q);
            }
        });
        return tiersList;
    });

    hospitalityScore = computed(() => {
        const qs = this.questions();
        if (qs.length === 0) return 0;
        const total = qs.length;
        const answered = Array.from(this.answers().values()).filter(a => a.answer === true).length;
        return Math.round((answered / total) * 100);
    });

    wifiWarning = computed(() => {
        // Special warning for gold hosts if Wi-Fi is missing (Q2)
        const wifiAns = this.answers().get(this.questions().find(q => q.question_key.includes('_q2'))?.id || '');
        return this.store.userProfile()?.plan === 'Gold' && !wifiAns?.answer;
    });

    hasAiAccess = computed(() => {
        return this.store.userProfile()?.plan === 'Gold';
    });

    constructor() {
        effect(() => {
            if (this.propertyId()) {
                this.loadDataWithId();
            }
        });
    }

    ngOnInit() { }

    async loadDataWithId() {
        const id = this.propertyId();
        if (!id) return;

        this.isLoading.set(true);
        try {
            const dimension = 'DIM_OPS';
            let qs = await this.onboardingService.getQuestionsByDimension(dimension);

            // Ensure DB has questions (Seeding) - REPLACES SYNTHETIC LOGIC
            // In a real prod app, seeding should be done via migration script, 
            // but for this MVP, we ensure questions exist on load.
            await this.onboardingService.ensureQuestions(DEFAULT_QUESTIONS);

            // Re-fetch now that we ensured they exist
            qs = await this.onboardingService.getQuestionsByDimension(dimension);

            console.log(`[PropertyAudit] Loaded ${qs.length} questions for dimension ${dimension}`);
            this.questions.set([...qs]);
            const ans = await this.onboardingService.getAnswers(id, dimension);
            this.answers.set(ans);

            // Auto-Fill Logic: Link Property Data to Audit Answers
            try {
                const property = await this.hostRepo.getPropertyById(id);
                if (property) {
                    const newAnsMap = new Map<string, any>(ans);
                    let hasUpdates = false;

                    this.questions().forEach(q => {
                        // Skip if already answered
                        if (newAnsMap.has(q.id) && newAnsMap.get(q.id)?.answer) return;

                        let inferredAnswer = false;
                        let inferredSub = '';

                        // Logic 1: Wifi (Q2)
                        if (q.question_key.includes('accomodation_q2')) {
                            if (property.wifi_code && property.wifi_code.length > 0) {
                                inferredAnswer = true;
                                inferredSub = property.wifi_code;
                            }
                        }

                        // Logic 2: Equipments matching
                        // We map question keys to equipment name keywords
                        const equipMap: Record<string, string[]> = {
                            'accomodation_q1': ['detecteur', 'fumee', 'smoke'],
                            'accomodation_q3': ['secours', 'first aid'],
                            'accomodation_q4': ['extincteur', 'fire'],
                            'accomodation_q13': ['cafe', 'coffee'],
                            'accomodation_q14': ['lave-linge', 'washing'],
                            'accomodation_q15': ['seche-cheveux', 'hair'],
                            'accomodation_q16': ['fer', 'iron'],
                            'accomodation_q32': ['spa', 'jacuzzi', 'piscine']
                        };

                        // Extract 'accomodation_qX' from 'AUDIT.accomodation_qX'
                        const shortKey = q.question_key.split('.').pop() || '';
                        const keywords = equipMap[shortKey];

                        if (keywords && property.property_equipments) {
                            const hasEquip = property.property_equipments.some((e: any) =>
                                keywords.some(k => e.name.toLowerCase().includes(k))
                            );
                            if (hasEquip) inferredAnswer = true;
                        }

                        if (inferredAnswer) {
                            newAnsMap.set(q.id, { answer: true, sub_answer: inferredSub });
                            hasUpdates = true;
                        }
                    });

                    if (hasUpdates) {
                        console.log("[PropertyAudit] Auto-filled answers from Property Data");
                        this.answers.set(newAnsMap);
                        // Optional: Auto-save these inferred answers?
                        // For now, we likely want the user to see them pre-filled in the form.
                        // We do NOT save immediately to DB to avoid "ghost" answers if user cancels.
                        // The user will check the box (it will be checked) and click save.
                    }
                }
            } catch (e) {
                console.warn("[PropertyAudit] Auto-fill failed", e);
            }

            this.initForm(qs, this.answers());
        } catch (error) {
            console.error('Error loading audit data:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    initForm(qs: OnboardingQuestion[], ans: Map<string, any>) {
        const group: any = {};
        qs.forEach(q => {
            group[q.id] = [ans.get(q.id)?.answer || false];
        });
        this.auditForm = this.fb.group(group);
    }


    async saveAudit() {
        const id = this.propertyId();
        if (!id) return;

        const answersToSave: any[] = [];
        const newAnsMap = new Map(this.answers());

        this.questions().forEach(q => {
            const val = this.auditForm.get(q.id)?.value;
            newAnsMap.set(q.id, { answer: val });

            // Only save non-synthetic questions to DB
            if (!q.id.startsWith('synthetic')) {
                answersToSave.push({
                    question_id: q.id,
                    answer: val
                });
            }
        });

        this.answers.set(newAnsMap);
        if (answersToSave.length > 0) {
            await this.onboardingService.saveAnswers(id, answersToSave);
        }
    }

    async generateAiRecommendations() {
        this.isGeneratingAi.set(true);
        try {
            const score = this.hospitalityScore();
            const missed = this.questions()
                .filter(q => !this.answers().get(q.id)?.answer)
                .map(q => q.question_key);

            const prompt = `As a Short Term Rental Consultant, analyze this property audit. 
            Score: ${score}/100. 
            Missing items: ${missed.join(', ')}.
            Provide a 3-step roadmap to reach "Excellence" (100%).
            Focus on ROI and guest satisfaction. Keep it concise.`;

            const result = await this.gemini.generateText(prompt);
            this.aiRecommendation.set(result);
        } catch (error) {
            console.error('AI Error:', error);
            this.aiRecommendation.set("Unable to generate recommendations at this time.");
        } finally {
            this.isGeneratingAi.set(false);
        }
    }
}

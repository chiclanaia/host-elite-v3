import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrainingService, TrainingModule, TrainingMaterial, UserTrainingProgress, Quiz, QuizQuestion } from '../../services/training.service';
import { OnboardingService, OnboardingAnswer, OnboardingQuestion } from '../../services/onboarding.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'saas-training-view',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    :host {
        display: block;
        height: 100%;
        overflow: hidden;
    }
    .aspect-video { aspect-ratio: 16 / 9; }
    .content-grid { height: calc(100vh - 8rem); }
  `],
    template: `
    <!-- CONTENEUR PRINCIPAL -->
    <div class="flex flex-col h-full w-full gap-4 p-4">
      
      <!-- 1. HEADER -->
      <div class="shrink-0 flex items-center justify-between h-12 px-2">
        <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <span class="bg-gradient-to-br from-[#D4AF37] to-[#F39C12] text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg mr-3 shadow-lg">🎓</span>
            {{ 'TRAINING.Title' | translate }}
        </h2>
        <div class="text-right">
            <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block">{{ 'TRAINING.Progression' | translate }}</span>
            <span class="text-lg font-bold text-[#D4AF37]">{{ overallProgress() }}%</span>
        </div>
      </div>

      <!-- 2. ZONE DE CONTENU (Grille) -->
      @if (isLoading()) {
          <div class="flex-1 flex items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
      } @else {
      <div class="content-grid flex gap-6 pb-2">
        
        <!-- COLONNE GAUCHE : LECTEUR + DOCK -->
        <div class="flex-1 flex flex-col gap-4 min-w-0 h-full">
            
            <!-- A. ZONE LECTEUR -->
            <div class="flex-1 min-h-0 relative flex items-center justify-center bg-black/40 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden p-1">
                
                @if (selectedModule()) {
                <div class="h-full w-full relative flex flex-col animate-fade-in">
                    
                    <!-- Content Player -->
                    <div class="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden">
                        @switch (activeMode()) {
                            @case ('video') {
                                <div class="aspect-video w-full max-h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
                                    <iframe *ngIf="sanitizedUrl()" [src]="sanitizedUrl()!" class="w-full h-full border-0" allowfullscreen></iframe>
                                    <div *ngIf="!sanitizedUrl()" class="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                        <span class="text-5xl mb-4">🎬</span>
                                        <p>{{ 'TRAINING.NoVideo' | translate }}</p>
                                    </div>
                                </div>
                            }
                            @case ('audio') {
                                <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div class="w-48 h-48 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative group">
                                         <div class="absolute inset-0 bg-[#D4AF37]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                         <span class="text-7xl relative z-10 animate-bounce-slow">🎧</span>
                                    </div>
                                    <h3 class="text-2xl font-bold text-white mb-2">{{ selectedModule()?.title_key | translate }}</h3>
                                    <p class="text-slate-400 mb-8">{{ selectedModule()?.description_key | translate }}</p>
                                    <audio *ngIf="currentMaterial()?.audio_url" controls class="w-full h-12 rounded-full shadow-lg">
                                        <source [src]="currentMaterial()?.audio_url" type="audio/mpeg">
                                    </audio>
                                </div>
                            }
                            @case ('pdf') {
                                <div class="w-full h-full max-h-full bg-[#1e293b] rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-inner relative group">
                                     <!-- PDF Toolbar Overlay -->
                                     <div class="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                         <a [href]="currentMaterial()?.pdf_url" target="_blank" 
                                            class="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-[#D4AF37] hover:text-slate-900 transition-all border border-white/10 flex items-center gap-2 text-xs font-bold shadow-2xl">
                                             <span>📂</span> {{ 'TRAINING.Fullscreen' | translate }}
                                         </a>
                                         <a [href]="currentMaterial()?.pdf_url" [download]="selectedModule()?.title_key + '.pdf'"
                                            class="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-emerald-500 hover:text-white transition-all border border-white/10 flex items-center gap-2 text-xs font-bold shadow-2xl">
                                             <span>⬇️</span> {{ 'TRAINING.Download' | translate }}
                                         </a>
                                     </div>
                                     
                                     <!-- PDF Viewer Iframe -->
                                     <iframe *ngIf="sanitizedUrl()" 
                                             [src]="sanitizedUrl()!" 
                                             class="w-full h-full border-0 rounded-2xl bg-white shadow-2xl" 
                                             type="application/pdf">
                                     </iframe>
                                     
                                     <div *ngIf="!sanitizedUrl()" class="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                         <span class="text-6xl mb-4 animate-pulse">📄</span>
                                         <p class="font-medium text-lg">{{ 'TRAINING.NoPDF' | translate }}</p>
                                         <p class="text-sm opacity-50 mt-2">Le document n'est pas disponible pour le moment.</p>
                                     </div>
                                </div>
                            }
                            @case ('flipbook') {
                                <div class="w-full h-full max-h-full bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-white/10">
                                     <iframe *ngIf="sanitizedUrl()" [src]="sanitizedUrl()!" class="w-full h-full border-0"></iframe>
                                     <div *ngIf="!sanitizedUrl()" class="w-full h-full flex items-center justify-center text-slate-500">
                                         <p>{{ 'TRAINING.NoFlipbook' | translate }}</p>
                                     </div>
                                </div>
                            }
                            @case ('quiz') {
                                <div class="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
                                    <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
                                        <span class="text-3xl mr-3">📝</span> Quiz de Validation
                                    </h3>
                                    @if (currentQuiz(); as quiz) {
                                        <div class="space-y-8">
                                            @for (q of quiz.questions; track q.id) {
                                                <div>
                                                    <p class="text-white font-semibold mb-4">{{ q.question_text_key | translate }}</p>
                                                    <div class="grid grid-cols-1 gap-3">
                                                        @for (opt of q.options; track opt.id) {
                                                            <button class="p-4 rounded-xl border border-white/10 bg-white/5 text-left text-slate-300 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all">
                                                                {{ opt.option_text_key | translate }}
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            <button (click)="submitQuiz()" class="w-full py-4 bg-[#D4AF37] text-slate-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] transform transition-all active:scale-95">
                                                Valider mes réponses
                                            </button>
                                        </div>
                                    } @else {
                                        <p class="text-slate-400 text-center py-12">{{ 'TRAINING.NoQuiz' | translate }}</p>
                                    }
                                </div>
                            }
                        }
                    </div>

                    <!-- Dock de Contrôle (Modes) -->
                    <div class="h-28 shrink-0 px-8 pb-4">
                        <div class="h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl px-4">
                            <div class="flex items-center gap-4 w-full justify-around max-w-2xl">
                                @for (mode of learningModes; track mode.id) {
                                    <button (click)="activeMode.set(mode.id)" 
                                        class="flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 group relative overflow-hidden h-20"
                                        [class]="activeMode() === mode.id ? 'bg-white shadow-lg transform -translate-y-2' : 'hover:bg-white/5'">
                                        
                                        <span class="text-2xl mb-1 relative z-10 transition-transform group-hover:scale-110" 
                                              [class]="activeMode() === mode.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'">
                                            {{ mode.icon }}
                                        </span>
                                        <span class="text-[10px] font-bold uppercase tracking-wider relative z-10" 
                                              [class]="activeMode() === mode.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'">
                                            {{ mode.label }}
                                        </span>
                                        
                                        <!-- Availability Dot -->
                                        @if (isModeAvailable(mode.id)) {
                                            <div class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                                        }
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                } @else {
                <div class="text-center p-12">
                    <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">🔦</div>
                    <h3 class="text-2xl font-bold text-white mb-2">{{ 'TRAINING.SelectModule' | translate }}</h3>
                    <p class="text-slate-400 max-w-md mx-auto">{{ 'TRAINING.SelectModuleDesc' | translate }}</p>
                </div>
                }
            </div>
        </div>

        <!-- COLONNE DROITE : LISTE (Largeur Fixe) -->
        <div class="w-96 shrink-0 h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-xl">
            
            <!-- Header Liste -->
            <div class="h-16 shrink-0 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                <span class="text-xs font-bold text-white uppercase tracking-wider">Programme</span>
                <span class="text-[10px] text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20">{{ overallProgress() }}% {{ 'TRAINING.CompletedLabel' | translate }}</span>
            </div>

            <!-- Liste Scrollable -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                @for (angleData of angleMetadata; track angleData.id) {
                    @let modulesInAngle = modulesByAngle().get(angleData.id) || [];
                    @if (modulesInAngle.length > 0) {
                        <div class="mb-3">
                            <!-- Angle Header -->
                            <button (click)="toggleAngle(angleData.id)" 
                                    class="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r {{angleData.color}} hover:opacity-90 transition-all group mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">{{angleData.icon}}</span>
                                    <span class="text-sm font-bold text-white">{{ angleData.nameKey | translate }}</span>
                                    <span class="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">{{modulesInAngle.length}}</span>
                                </div>
                                <svg class="w-5 h-5 text-white transition-transform duration-300" 
                                     [class.rotate-180]="!isAngleCollapsed(angleData.id)"
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            <!-- Modules List (Collapsible) -->
                            @if (!isAngleCollapsed(angleData.id)) {
                                <div class="space-y-2 pl-2 animate-fade-in">
                                    @for (module of modulesInAngle; track module.id) {
                                        @let progress = progressMap().get(module.id);
                                        @let recommendation = getRecommendation(module.question_id);
                                        
                                        <div (click)="selectModule(module)" class="p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 relative overflow-hidden"
                                             [class]="selectedModule()?.id === module.id ? 'bg-white/10 border-[#D4AF37]/50 shadow-lg' : 'border-white/5 hover:bg-white/5 hover:border-white/10'">
                                            
                                            <!-- Recommendation Banner -->
                                            @if (recommendation === 'recommended') {
                                                <div class="absolute top-0 right-0 px-2 py-0.5 bg-[#D4AF37] text-slate-900 text-[8px] font-black uppercase tracking-tighter rounded-bl-lg transform">
                                                    Recommandé
                                                </div>
                                            }

                                            <div class="mt-1 shrink-0">
                                                @if (progress?.status === 'completed') {
                                                    <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" /></svg>
                                                    </div>
                                                } @else if (progress?.status === 'in_progress' || selectedModule()?.id === module.id) {
                                                    <div class="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_10px_#D4AF37] animate-pulse">
                                                        <svg class="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" /></svg>
                                                    </div>
                                                } @else {
                                                    <div class="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-600">
                                                        <span class="text-[10px] font-bold">PDF</span>
                                                    </div>
                                                }
                                            </div>

                                            <div class="min-w-0 flex-1">
                                                <h4 class="text-sm font-semibold leading-tight mb-1" [class]="selectedModule()?.id === module.id ? 'text-white' : 'text-slate-300'">{{ module.title_key | translate }}</h4>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-[10px] text-slate-500 uppercase font-bold">{{ recommendation === 'acquired' ? 'Savoir acquis' : 'À découvrir' }}</span>
                                                    <span class="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <span class="text-[10px] text-slate-500">{{ progress?.last_score ? 'Score: ' + progress?.last_score + '%' : 'Prêt' }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                }
            </div>
        </div>

      </div>
      }

    </div>

    <style>
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
    .animate-bounce-slow { animation: bounce 3s infinite; }
    @keyframes bounce { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }
    </style>
  `
})
export class TrainingViewComponent implements OnInit {
    private trainingService = inject(TrainingService);
    private onboardingService = inject(OnboardingService);
    private translationService = inject(TranslationService);
    private sanitizer = inject(DomSanitizer);

    // State
    isLoading = signal(true);
    modules = signal<TrainingModule[]>([]);
    progressMap = signal<Map<string, UserTrainingProgress>>(new Map());
    auditAnswers = signal<Map<string, OnboardingAnswer>>(new Map());
    questionToAngleMap = signal<Map<string, string>>(new Map());
    collapsedAngles = signal<Set<string>>(new Set());

    selectedModule = signal<TrainingModule | null>(null);
    currentMaterial = signal<TrainingMaterial | null>(null);
    currentQuiz = signal<(Quiz & { questions: QuizQuestion[] }) | null>(null);

    activeMode = signal<string>('flipbook'); // Default to flipbook as priority
    learningModes = [
        { id: 'flipbook', label: 'Flipbook', icon: '📖' },
        { id: 'pdf', label: 'PDF', icon: '📄' },
        { id: 'video', label: 'Masterclass', icon: '🎬' },
        { id: 'audio', label: 'Audio', icon: '🎧' },
        { id: 'quiz', label: 'Quiz', icon: '📝' }
    ];

    // Dimension metadata
    angleMetadata = [
        { id: 'DIM_MKT', nameKey: 'TRAINING.Angles.Marketing', icon: '📢', color: 'from-blue-500 to-cyan-500' },
        { id: 'DIM_EXP', nameKey: 'TRAINING.Angles.Experience', icon: '⭐', color: 'from-purple-500 to-pink-500' },
        { id: 'DIM_OPS', nameKey: 'TRAINING.Angles.Operations', icon: '⚙️', color: 'from-orange-500 to-red-500' },
        { id: 'DIM_PRICING', nameKey: 'TRAINING.Angles.Pricing', icon: '💰', color: 'from-emerald-500 to-teal-500' },
        { id: 'DIM_LEGAL', nameKey: 'TRAINING.Angles.Legal', icon: '⚖️', color: 'from-slate-500 to-gray-500' },
        { id: 'mindset', nameKey: 'TRAINING.Angles.Mindset', icon: '🧠', color: 'from-indigo-500 to-purple-500' }
    ];

    // Group modules by angle
    modulesByAngle = computed(() => {
        const grouped = new Map<string, TrainingModule[]>();
        const questionMap = this.questionToAngleMap();

        this.modules().forEach(module => {
            const angle = questionMap.get(module.question_id) || 'other';
            if (!grouped.has(angle)) {
                grouped.set(angle, []);
            }
            grouped.get(angle)!.push(module);
        });

        return grouped;
    });

    sanitizedUrl = computed<SafeResourceUrl | null>(() => {
        const material = this.currentMaterial();
        const mode = this.activeMode();
        if (!material) return null;

        let url: string | undefined;
        if (mode === 'video') url = material.video_url;
        else if (mode === 'pdf') url = material.pdf_url;
        else if (mode === 'flipbook') url = material.flipbook_url;

        if (!url) return null;

        // Ensure proper URL for local PDFs
        let finalUrl = url;
        const localPrefixes = ['/training/pdfs/', '/assets/training/pdfs/'];
        if (mode === 'pdf' && localPrefixes.some(p => url.startsWith(p))) {
            finalUrl = window.location.origin + url;
        }

        return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
    });

    overallProgress = computed(() => {
        if (this.modules().length === 0) return 0;
        const completed = Array.from(this.progressMap().values()).filter(p => p.status === 'completed').length;
        return Math.round((completed / this.modules().length) * 100);
    });

    async ngOnInit() {
        try {
            await this.loadData();
        } finally {
            this.isLoading.set(false);
        }
    }

    async loadData() {
        const [modules, progress, answers, questions] = await Promise.all([
            this.trainingService.getModules(),
            this.trainingService.getUserProgress(),
            this.fetchAuditAnswers(),
            this.onboardingService.getAllQuestions()
        ]);

        this.modules.set(modules);
        this.progressMap.set(progress);
        this.auditAnswers.set(answers);

        // Build question_id -> angle mapping
        const questionMap = new Map<string, string>();
        questions.forEach(q => questionMap.set(q.id, q.dimension_id));
        this.questionToAngleMap.set(questionMap);
    }

    async fetchAuditAnswers(): Promise<Map<string, OnboardingAnswer>> {
        const { data: properties } = await (this.onboardingService as any).supabase.supabase
            .from('properties')
            .select('id')
            .limit(1)
            .single();

        if (properties?.id) {
            // Fetch answers for all questions in one go for efficiency if possible, 
            // but the service uses angle-based fetching. Let's do it per angle as before.
            const dimensions = ['DIM_MKT', 'DIM_EXP', 'DIM_OPS', 'DIM_PRICING', 'DIM_LEGAL', 'mindset'];
            const allAnswers = new Map<string, OnboardingAnswer>();
            for (const dim of dimensions) {
                const answers = await this.onboardingService.getAnswers(properties.id, dim);
                answers.forEach((val, key) => allAnswers.set(key, val));
            }
            return allAnswers;
        }
        return new Map();
    }

    async selectModule(module: TrainingModule) {
        this.selectedModule.set(module);
        this.isLoading.set(true);
        try {
            const [material, quiz] = await Promise.all([
                this.trainingService.getMaterial(module.id, this.translationService.currentLang()),
                this.trainingService.getQuiz(module.id)
            ]);
            this.currentMaterial.set(material);
            this.currentQuiz.set(quiz);

            // Auto-select priority order: Flipbook > Video > PDF > Audio > Quiz
            if (material?.flipbook_url) this.activeMode.set('flipbook');
            else if (material?.video_url) this.activeMode.set('video');
            else if (material?.pdf_url) this.activeMode.set('pdf');
            else if (material?.audio_url) this.activeMode.set('audio');
            else this.activeMode.set('quiz');

            const progress = this.progressMap().get(module.id);
            if (progress?.status !== 'completed') {
                await this.trainingService.updateProgress(module.id, 'in_progress');
                this.progressMap.set(await this.trainingService.getUserProgress());
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    isModeAvailable(modeId: string): boolean {
        const material = this.currentMaterial();
        const quiz = this.currentQuiz();
        if (!material && modeId !== 'quiz') return false;

        switch (modeId) {
            case 'pdf': return !!material?.pdf_url;
            case 'flipbook': return !!material?.flipbook_url;
            case 'video': return !!material?.video_url;
            case 'audio': return !!material?.audio_url;
            case 'quiz': return !!quiz;
            default: return false;
        }
    }

    getRecommendation(questionId: string): 'recommended' | 'acquired' | 'none' {
        const answer = this.auditAnswers().get(questionId);
        if (!answer) return 'none';
        return answer.answer ? 'acquired' : 'recommended';
    }

    toggleAngle(angleId: string) {
        const collapsed = new Set(this.collapsedAngles());
        if (collapsed.has(angleId)) {
            collapsed.delete(angleId);
        } else {
            collapsed.add(angleId);
        }
        this.collapsedAngles.set(collapsed);
    }

    isAngleCollapsed(angleId: string): boolean {
        return this.collapsedAngles().has(angleId);
    }

    async submitQuiz() {
        if (!this.selectedModule()) return;
        await this.trainingService.updateProgress(this.selectedModule()!.id, 'completed', 100);
        this.progressMap.set(await this.trainingService.getUserProgress());
        alert("Félicitations ! Quiz validé à 100%.");
    }
}

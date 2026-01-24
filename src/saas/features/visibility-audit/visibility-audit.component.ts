import { Component, computed, inject, input, signal, Output, EventEmitter, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { GeminiService } from '../../../services/gemini.service';
import { HostRepository } from '../../../services/host-repository.service';
import { SessionStore } from '../../../state/session.store';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-visibility-audit',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './visibility-audit.component.html',
    styles: [`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `]
})
export class VisibilityAuditComponent {
    propertyName = input.required<string>();
    @Output() close = new EventEmitter<void>();

    private geminiService = inject(GeminiService);
    private repository = inject(HostRepository);
    private store = inject(SessionStore);
    private injector = inject(Injector);

    // Audit State
    auditStatus = signal<'idle' | 'searching' | 'analyzing' | 'complete'>('idle');
    auditProgress = signal<number>(0);
    auditStep = signal<string>('');
    auditResult = signal<any>(null);

    // Audit Inputs
    airbnbUrl = signal('');
    bookingUrl = signal('');
    otherUrl = signal('');

    hasAiAccess = computed(() => {
        const plan = this.store.userProfile()?.plan;
        return plan === 'Silver' || plan === 'Gold';
    });

    async runVisibilityAudit() {
        if (!this.hasAiAccess()) return;
        const propName = this.propertyName();
        const propData = await this.repository.getPropertyByName(propName);

        // 1. Reset State
        this.auditStatus.set('searching');
        this.auditProgress.set(0);
        this.auditResult.set(null);

        // 2. Simulate Deep Search (Visual Effect)
        const translationService = this.injector.get(TranslationService);
        const steps = [
            translationService.translate('VISIBILITY.Step1'),
            translationService.translate('VISIBILITY.Step2'),
            translationService.translate('VISIBILITY.Step3'),
            translationService.translate('VISIBILITY.Step4'),
            translationService.translate('VISIBILITY.Step5'),
            translationService.translate('VISIBILITY.Step6')
        ];

        for (let i = 0; i < steps.length; i++) {
            this.auditStep.set(steps[i]);
            // Random delay between 500ms and 1500ms for realism
            await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
            this.auditProgress.set(Math.floor(((i + 1) / steps.length) * 80));
        }

        // 3. AI Analysis Step
        this.auditStatus.set('analyzing');
        this.auditStep.set(translationService.translate('VISIBILITY.StepAI') || "Generating report...");
        this.auditProgress.set(90);

        try {
            // Construct Context
            const notSpecified = translationService.translate('VISIBILITY.NotSpecified') || 'Not specified';
            const context = {
                name: propName,
                address: propData?.address || notSpecified,
                description: propData?.listing_description || notSpecified,
                amenities: propData?.property_equipments ? propData.property_equipments.map((e: any) => e.name) : [],
                urls: {
                    airbnb: this.airbnbUrl(),
                    booking: this.bookingUrl(),
                    other: this.otherUrl()
                }
            };

            const report = await this.geminiService.generateVisibilityAudit(context, translationService.currentLang());
            this.auditResult.set(report);
            this.auditProgress.set(100);
            this.auditStatus.set('complete');

        } catch (error) {
            console.error(error);
            const errorMsg = translationService.translate('VISIBILITY.ErrorAudit') || "Error during audit.";
            alert(errorMsg);
            this.auditStatus.set('idle');
        }
    }
}

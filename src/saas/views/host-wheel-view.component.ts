
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scores, ReportData, ContextData } from '../../types';
import { HostRepository } from '../../services/host-repository.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'saas-host-wheel-view',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './host-wheel-view.component.html',
    styles: [`
    /* Custom Slider Styles */
    input[type=range] {
      -webkit-appearance: none; 
      background: transparent; /* Track handled via inline style for fill effect */
      height: 6px;
      border-radius: 5px;
      cursor: pointer;
    }

    /* Webkit (Chrome/Safari) Thumb */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 28px;
      width: 28px;
      margin-top: -12px; /* Center thumb on track */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' filter='drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'%3E%3Cpath d='M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z' /%3E%3Cpath d='M12 5.432 1.674 15.756a2.25 2.25 0 0 0 1.59 3.84h17.472a2.25 2.25 0 0 0 1.59-3.84l-4.457-4.457-5.832-5.832a.75.75 0 0 0-1.062-1.062l-.976.976Z' opacity='0.3' /%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      transition: transform 0.1s;
    }

    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    input[type=range]:focus {
      outline: none;
    }
    
    /* Firefox Thumb */
    input[type=range]::-moz-range-thumb {
      height: 28px;
      width: 28px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' filter='drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'%3E%3Cpath d='M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z' /%3E%3Cpath d='M12 5.432 1.674 15.756a2.25 2.25 0 0 0 1.59 3.84h17.472a2.25 2.25 0 0 0 1.59-3.84l-4.457-4.457-5.832-5.832a.75.75 0 0 0-1.062-1.062l-.976.976Z' opacity='0.3' /%3E%3C/svg%3E");
      background-color: transparent;
      border: none;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  `]
})
export class HostWheelViewComponent {
    // Input data from Global State
    initialScores = input.required<Scores>();
    reportData = input.required<ReportData>();
    contextData = input.required<ContextData>();

    private repository = inject(HostRepository);

    // Local mutable state for editing
    currentScores = signal<Scores>({
        marketing: 0,
        experience: 0,
        operations: 0,
        pricing: 0,
        accomodation: 0,
        legal: 0,
        mindset: 0
    });

    isSaving = signal(false);
    saveMessage = signal<string | null>(null);

    readonly angleLabels = ['Marketing', 'Expérience', 'Opérations', 'Pricing', 'Logement', 'Légal', 'Mindset'];
    readonly angleKeys: (keyof Scores)[] = ['marketing', 'experience', 'operations', 'pricing', 'accomodation', 'legal', 'mindset'];

    // Polar Chart Configuration
    readonly size = 500;
    readonly center = this.size / 2;
    readonly radius = this.size / 2 - 40; // Padding

    // Vibrant "Stained Glass" Color Palette
    readonly categoryColors: Record<keyof Scores, { from: string, to: string, stroke: string }> = {
        marketing: { from: '#3b82f6', to: '#60a5fa', stroke: '#93c5fd' }, // Blue
        experience: { from: '#eab308', to: '#facc15', stroke: '#fef08a' }, // Yellow/Gold
        operations: { from: '#10b981', to: '#34d399', stroke: '#6ee7b7' }, // Emerald
        pricing: { from: '#f97316', to: '#fb923c', stroke: '#fdba74' }, // Orange
        accomodation: { from: '#ef4444', to: '#f87171', stroke: '#fca5a5' }, // Red
        legal: { from: '#8b5cf6', to: '#a78bfa', stroke: '#c4b5fd' }, // Violet
        mindset: { from: '#ec4899', to: '#f472b6', stroke: '#fbcfe8' } // Pink
    };

    constructor() {
        // Sync input with local state when component loads
        effect(() => {
            if (this.initialScores()) {
                this.currentScores.set({ ...this.initialScores() });
            }
        });
    }

    // Computed Average Score for the center
    averageScore = computed(() => {
        const scores = this.currentScores();
        // Object.values can return unknown[], ensure it's number[]
        const values = Object.values(scores) as number[];
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / 7).toFixed(1);
    });

    // Polar Area Chart Calculation
    polarSectors = computed(() => {
        const scoresData = this.currentScores();
        const count = this.angleKeys.length;
        const anglePerSlice = (2 * Math.PI) / count;

        return this.angleKeys.map((key, i) => {
            const score = scoresData[key];
            const startAngle = i * anglePerSlice - Math.PI / 2; // Rotate -90deg to start at top
            const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

            // Calculate Radius based on Score (1-10)
            // Min radius of 10% to show color even at score 1
            const r = (Math.max(score, 0.5) / 10) * this.radius;

            return {
                id: key,
                label: 'NAV.' + key,
                path: this.describeArc(this.center, this.center, r, startAngle, endAngle),
                color: this.categoryColors[key],
                score: score,
                // Label positioning (outside the slice)
                labelX: this.center + (this.radius + 20) * Math.cos(startAngle + anglePerSlice / 2),
                labelY: this.center + (this.radius + 20) * Math.sin(startAngle + anglePerSlice / 2)
            };
        });
    });

    // Helper to create SVG Arc Path
    private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
        const start = this.polarToCartesian(x, y, radius, endAngle);
        const end = this.polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y,
            "Z"
        ].join(" ");
    }

    private polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: number) {
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    // Dynamic Slider Track Gradient
    // Returns a CSS gradient string that fills the track up to the current value
    getSliderBackground(key: keyof Scores): string {
        const val = this.currentScores()[key];
        const percentage = (val / 10) * 100;
        const color = this.categoryColors[key].from;

        // Solid color part + transparent grey part
        return `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`;
    }

    updateScore(key: keyof Scores, event: Event): void {
        const val = parseInt((event.target as HTMLInputElement).value, 10);
        this.currentScores.update(s => ({ ...s, [key]: val }));
    }

    async saveProgress(): Promise<void> {
        this.isSaving.set(true);
        this.saveMessage.set(null);
        try {
            await this.repository.saveDiagnosticResult(
                this.contextData(),
                this.currentScores(),
                this.reportData()
            );
            this.saveMessage.set("Progrès enregistrés !");
            setTimeout(() => this.saveMessage.set(null), 3000);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            this.isSaving.set(false);
        }
    }
}

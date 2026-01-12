import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicrositeConfig, BuilderPhoto } from '../../views/welcome-booklet/booklet-definitions';

interface GuideModalState {
    isOpen: boolean;
    title: string;
    content: string;
    icon: string;
}

@Component({
    selector: 'app-microsite-renderer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './microsite-renderer.component.html',
    styles: [`
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-bounce-subtle { animation: bounceSubtle 2s infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceSubtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    `]
})
export class MicrositeRendererComponent {
    @Input() config!: MicrositeConfig;
    @Input() content!: any; // The full booklet form value
    @Input() photos: BuilderPhoto[] = [];
    @Input() propertyDetails!: any;
    @Input() marketingText: string = '';
    @Input() userEmail: string = '';

    // Internal state for the guide modal
    guideModalState = signal<GuideModalState>({ isOpen: false, title: '', content: '', icon: '' });

    openGuideModal(title: string, content: string, icon: string) {
        this.guideModalState.set({ isOpen: true, title, content, icon });
    }

    closeGuideModal() {
        this.guideModalState.update(s => ({ ...s, isOpen: false }));
    }
}

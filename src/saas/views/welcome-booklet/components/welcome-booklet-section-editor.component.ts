import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BookletSection, CONTROL_LABELS } from '../booklet-definitions';
import { WelcomeBookletAiService } from '../welcome-booklet-ai.service';
import { WelcomeBookletService } from '../welcome-booklet.service';

@Component({
    selector: 'app-welcome-booklet-section-editor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './welcome-booklet-section-editor.component.html',
})
export class WelcomeBookletSectionEditorComponent {
    @Input({ required: true }) section!: BookletSection;
    @Input({ required: true }) group!: FormGroup;
    @Input({ required: true }) parentForm!: FormGroup; // For address access

    aiService = inject(WelcomeBookletAiService);
    mainService = inject(WelcomeBookletService);

    isOpen = signal(true); // Or controlled by parent

    toggle() {
        this.isOpen.update(v => !v);
    }

    getFields() {
        return CONTROL_LABELS[this.section.formGroupName] ? Object.keys(CONTROL_LABELS[this.section.formGroupName]) : [];
    }

    getLabel(key: string) {
        return CONTROL_LABELS[this.section.formGroupName][key];
    }

    async autoFill() {
        const address = this.parentForm.get('address')?.value;
        await this.aiService.autoFill(this.parentForm, address, [this.section]);
    }
}

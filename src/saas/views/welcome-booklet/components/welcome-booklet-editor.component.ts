import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { WelcomeBookletService } from '../welcome-booklet.service';
import { WelcomeBookletSectionEditorComponent } from './welcome-booklet-section-editor.component';

@Component({
    selector: 'app-welcome-booklet-editor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, WelcomeBookletSectionEditorComponent],
    templateUrl: './welcome-booklet-editor.component.html',
})
export class WelcomeBookletEditorComponent {
    service = inject(WelcomeBookletService);
    form = this.service.editorForm;
    sections = this.service.sections;

    getSectionGroup(name: string): FormGroup {
        return this.form.get(name) as FormGroup;
    }
}

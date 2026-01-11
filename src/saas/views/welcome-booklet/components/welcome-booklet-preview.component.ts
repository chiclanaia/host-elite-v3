import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeBookletService } from '../welcome-booklet.service';
import { WelcomeBookletAiService } from '../welcome-booklet-ai.service';
import { BookletSection, WIDGET_DEFINITIONS, CONTROL_LABELS } from '../booklet-definitions';

@Component({
    selector: 'app-welcome-booklet-preview',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './welcome-booklet-preview.component.html',
})
export class WelcomeBookletPreviewComponent {
    service = inject(WelcomeBookletService);
    aiService = inject(WelcomeBookletAiService);

    editorForm = this.service.editorForm;
    widgetData = this.service.widgetData;
    activeWidgets = this.service.activeWidgets;
    propertyName = this.service.propertyName;
    propertyPhotos = this.service.propertyPhotos;
    sections = this.service.sections;

    previewState = signal<'home' | 'section'>('home');
    currentSectionId = signal<string | null>(null);

    activeSections = computed(() => {
        const form = this.editorForm;
        return this.sections.filter(s => form.get('toggles.' + s.id)?.value);
    });

    enabledWidgetIds = computed(() => {
        const active = this.activeWidgets();
        return Object.keys(active).filter(k => active[k]);
    });

    currentSection = computed(() => {
        const id = this.currentSectionId();
        return id ? this.sections.find(s => s.id === id) || null : null;
    });

    showSection(id: string) {
        this.currentSectionId.set(id);
        this.previewState.set('section');
    }

    showHome() {
        this.previewState.set('home');
        this.currentSectionId.set(null);
    }

    getWidgetLink(id: string): string | undefined {
        return this.widgetData()[id]?.link;
    }

    getWidgetIcon(id: string): string {
        return WIDGET_DEFINITIONS[id]?.icon || '❓';
    }

    getWidgetName(id: string): string {
        return WIDGET_DEFINITIONS[id]?.name || id;
    }

    getWidgetValue(id: string): string {
        return this.widgetData()[id]?.value || '--';
    }

    isValidContent(value: any): boolean {
        if (!value) return false;
        return this.aiService.isValidContent(String(value));
    }

    getGroupControls(groupName: string): string[] {
        const group = this.editorForm.get(groupName);
        if (!group) return [];
        // Filter out _pdf fields to avoid duplicates in the loop
        return Object.keys(group.value).filter(k => !k.endsWith('_pdf'));
    }

    getLabelForControl(sectionId: string, controlKey: string): string {
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) return controlKey;
        const labels = CONTROL_LABELS[section.formGroupName];
        return labels ? labels[controlKey] || controlKey : controlKey;
    }

    isSectionEmpty(groupName: string): boolean {
        const group = this.editorForm.get(groupName);
        if (!group) return true;
        return !Object.keys(group.value).some(k => !k.endsWith('_pdf') && group.value[k]);
    }
}

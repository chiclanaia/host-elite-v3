import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBookletService } from './welcome-booklet/welcome-booklet.service';
import { WelcomeBookletEditorComponent } from './welcome-booklet/components/welcome-booklet-editor.component';
import { WelcomeBookletListingComponent } from './welcome-booklet/components/welcome-booklet-listing.component';
import { WelcomeBookletMicrositeComponent } from './welcome-booklet/components/welcome-booklet-microsite.component';
import { WelcomeBookletPreviewComponent } from './welcome-booklet/components/welcome-booklet-preview.component';

@Component({
    selector: 'saas-welcome-booklet-view',
    standalone: true,
    imports: [
        CommonModule,
        WelcomeBookletEditorComponent,
        WelcomeBookletListingComponent,
        WelcomeBookletMicrositeComponent,
        WelcomeBookletPreviewComponent
    ],
    templateUrl: './welcome-booklet-view.component.html',
})
export class WelcomeBookletViewComponent implements OnInit {
    @Input() set propertyName(value: string) {
        this.service.propertyName.set(value);
    }

    service = inject(WelcomeBookletService);

    activeTab = this.service.activeTab;
    isLoading = this.service.isLoading;
    saveMessage = this.service.saveMessage;

    ngOnInit() {
        // Force reload to ensure fresh data even if propertyName hasn't changed (e.g. returning from Marketing view)
        this.refreshData();
    }

    setActiveTab(tab: 'edit' | 'listing' | 'microsite' | 'booklet') {
        this.service.activeTab.set(tab);
    }

    save() {
        this.service.save();
    }

    refreshData() {
        const name = this.service.propertyName();
        if (name) {
            this.service.loadData(name);
        }
    }
}

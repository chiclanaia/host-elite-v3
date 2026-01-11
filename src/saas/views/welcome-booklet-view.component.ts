import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBookletService } from './welcome-booklet/welcome-booklet.service';
import { WelcomeBookletEditorComponent } from './welcome-booklet/components/welcome-booklet-editor.component';
import { WelcomeBookletListingComponent } from './welcome-booklet/components/welcome-booklet-listing.component';
import { WelcomeBookletMicrositeComponent } from './welcome-booklet/components/welcome-booklet-microsite.component';
import { WelcomeBookletPreviewComponent } from './welcome-booklet/components/welcome-booklet-preview.component';

@Component({
    selector: 'app-welcome-booklet-view',
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
export class WelcomeBookletViewComponent {
    service = inject(WelcomeBookletService);

    activeTab = this.service.activeTab;

    setActiveTab(tab: 'edit' | 'listing' | 'microsite' | 'booklet') {
        this.service.activeTab.set(tab);
    }
}

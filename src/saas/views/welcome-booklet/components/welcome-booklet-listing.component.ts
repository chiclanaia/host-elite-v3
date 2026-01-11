import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBookletService } from '../welcome-booklet.service';

@Component({
    selector: 'app-welcome-booklet-listing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome-booklet-listing.component.html',
})
export class WelcomeBookletListingComponent {
    service = inject(WelcomeBookletService);
    editorForm = this.service.editorForm;
    propertyName = this.service.propertyName;
    propertyEquipments = this.service.propertyEquipments;
}

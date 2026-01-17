import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBookletService } from '../welcome-booklet.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'app-welcome-booklet-listing',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './welcome-booklet-listing.component.html',
})
export class WelcomeBookletListingComponent {
    service = inject(WelcomeBookletService);
    cdr = inject(ChangeDetectorRef);
    editorForm = this.service.editorForm;
    propertyName = this.service.propertyName;
    propertyEquipments = this.service.propertyEquipments;

    constructor() {
        // Debug: Monitor form value changes
        const effectRef = import('@angular/core').then(c => {
            // Can't use effect directly in constructor if not imported, but it is imported.
            // Wait, import is needed.
        });

        // Simpler: use the existing form reference
        console.log('[ListingComponent] Form Instance ID:', (this.editorForm as any)._debugId || 'N/A');

        // Subscribe to changes for debugging
        this.editorForm.get('welcome.welcomeMessage')?.valueChanges.subscribe(val => {
            console.log('[ListingComponent] Value Changed:', val ? val.substring(0, 20) + '...' : 'EMPTY');
            this.cdr.detectChanges();
        });

        // Log initial value
        const initial = this.editorForm.get('welcome.welcomeMessage')?.value;
        console.log('[ListingComponent] Initial Value:', initial ? initial.substring(0, 20) + '...' : 'EMPTY');
    }
}

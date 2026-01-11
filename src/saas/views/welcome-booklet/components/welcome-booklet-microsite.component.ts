import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeBookletService } from '../welcome-booklet.service';

@Component({
    selector: 'app-welcome-booklet-microsite',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome-booklet-microsite.component.html',
})
export class WelcomeBookletMicrositeComponent {
    service = inject(WelcomeBookletService);
    editorForm = this.service.editorForm;
    micrositeConfig = this.service.micrositeConfig;
    propertyPhotos = this.service.propertyPhotos;
}

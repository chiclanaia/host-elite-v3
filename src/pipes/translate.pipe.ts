import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Impure to detect signal changes automatically
})
export class TranslatePipe implements PipeTransform {
    private ts = inject(TranslationService);

    transform(key: string, params?: Record<string, string | number>): string {
        return this.ts.translate(key, params);
    }
}

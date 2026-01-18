import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeBookletService } from '../../views/welcome-booklet/welcome-booklet.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
    selector: 'app-booklet-config-panel',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    template: `
    <div class="p-6 max-w-2xl mx-auto space-y-4">
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <h3 class="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span>📑</span> {{ 'BOOKLET.structure_title' | translate }}
            </h3>
            
            <div class="space-y-3" [formGroup]="form">
                <div formGroupName="toggles" class="grid grid-cols-2 gap-2">
                    @for(section of sections; track section.id) {
                    <label class="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                        <div class="flex items-center gap-2 overflow-hidden">
                            <div class="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-sm group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:fill-white" [innerHTML]="section.icon"></div>
                            <span class="text-xs text-slate-300 font-medium group-hover:text-white transition-colors truncate">{{ section.title | translate }}</span>
                        </div>
                        
                        <div class="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2 gap-2">
                            <span class="text-[11px] text-white/60 font-medium group-hover:text-white transition-colors text-right leading-tight block max-w-[120px]">
                                {{ section.description | translate }}
                            </span>
                            <div class="relative">
                                <input type="checkbox" [formControlName]="section.id" class="sr-only peer">
                                <div class="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                            </div>
                        </div>
                    </label>
                    }
                </div>
            </div>
        </div>
    </div>
    `
})
export class BookletContentConfigComponent {
    service = inject(WelcomeBookletService);
    form = this.service.editorForm;
    sections = this.service.sections;
    config = this.service.micrositeConfig; // Inject config

    getSectionIcon(section: any): string | any {
        const style = this.config().iconStyle || 'emoji';

        if (style === 'emoji') {
            const emojiMap: Record<string, string> = {
                'welcome': '👋', 'accessibility': '♿', 'systems': '🔧', 'security': '🛡️',
                'kitchen': '🍳', 'livingRoom': '🛋️', 'bedrooms': '🛏️', 'laundry': '🧺',
                'wellness': '🧖', 'parking': '🅿️', 'rules': '📜', 'pets': '🐾',
                'waste': '♻️', 'dining': '🍽️', 'activities': '🏄', 'localInfo': 'ℹ️',
                'transport': '🚌', 'administrative': '👮', 'extraServices': '🧹', 'departure': '👋'
            };
            return emojiMap[section.id] || '📁';
        }

        // Return the sanitizer safe HTML (SVG)
        // If it's a SafeHtml object we return it, if strict string needed we might need logic, but innerHTML handles SafeHtml usually
        return section.icon;
    }
}

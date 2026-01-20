import { Component, inject, input, output, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CalendarService, CalendarSource } from '../calendar.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'app-calendar-sidebar',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
    template: `
    <div class="p-4">
        <!-- New Event Button (Primary Action) -->
        @if (!filterToInternal() && !isReadOnly()) {
            <button (click)="addEventClicked.emit()" 
                class="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 group">
                <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Nouvel événement</span>
            </button>
        }

        <h3 class="text-white font-medium mb-4 uppercase text-xs tracking-wider opacity-60">
            {{ (filterToInternal() ? 'CALENDAR.InternalSources' : 'CALENDAR.Sources') | translate }}
        </h3>

        <!-- Source List -->
        <div class="space-y-3 mb-6">
            @for (source of displaySources(); track source.id) {
                <div class="group flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    [class.opacity-50]="source.visible === false">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="w-3 h-3 rounded-full shrink-0" [style.backgroundColor]="source.color"></div>
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm text-white truncate font-medium">{{ source.name }}</span>
                            <span class="text-xs text-white/40 truncate">{{ source.type === 'internal' ? 'Calendrier Principal' : 'iCal' }}</span>
                        </div>
                    </div>
                    
                    @if (source.type !== 'internal') {
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <!-- Toggle Visibility -->
                            <button (click)="toggleVisibility(source)" class="p-1.5 transition-colors"
                                [class.text-white/60]="source.visible !== false"
                                [class.text-white/20]="source.visible === false"
                                [title]="source.visible === false ? 'Show' : 'Hide'">
                                @if (source.visible !== false) {
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                } @else {
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.274 0 2.457.224 3.553.633M19.713 14.123A7.944 7.944 0 0121.542 12c-1.274-4.057-5.064-7-9.542-7-1.274 0-2.457.224-3.553.633M14.121 14.121L19 19m-4.879-4.879a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
                                    </svg>
                                }
                            </button>
                            
                            <!-- Delete Source -->
                            <button (click)="removeSource(source.id)" class="p-1.5 text-red-400 hover:text-red-300 transition-colors">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    } @else {
                        <!-- Locked indicator -->
                        <div class="px-2 py-1 text-[10px] font-bold text-white/20 uppercase tracking-tight">
                            Fixe
                        </div>
                    }
                </div>
            }
            @if (sources().length === 0) {
                <div class="text-sm text-white/30 italic text-center py-4">
                    {{ 'CALENDAR.NoSources' | translate }}
                </div>
            }
        </div>

        @if (!filterToInternal() && !isReadOnly()) {
            <!-- Add Source Form -->
            <div class="border-t border-white/10 pt-4">
                <h4 class="text-white/80 text-sm font-medium mb-3">{{ 'CALENDAR.AddSource' | translate }}</h4>
                <form [formGroup]="addForm" (ngSubmit)="onSubmit()" class="space-y-3">
                    
                    <!-- Name -->
                    <div>
                        <input type="text" formControlName="name" 
                            [placeholder]="'CALENDAR.SourceNamePlaceholder' | translate"
                            class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/20">
                    </div>

                    <!-- Type Selector -->
                    <div>
                        <select formControlName="type"
                            class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                            <option value="external">{{ typeExternalLabel }}</option>
                        </select>
                        <p class="text-[10px] text-white/30 mt-1 pl-1">Synchronisez un calendrier iCal (Airbnb, Booking...) en lecture seule.</p>
                    </div>

                    <!-- URL (only for external) -->
                    @if (addForm.get('type')?.value === 'external') {
                        <div>
                            <input type="text" formControlName="url" 
                                placeholder="https://airbnb.com/calendar/..."
                                class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/20">
                            <p class="text-[10px] text-white/30 mt-1 pl-1">Ex: Airbnb iCal, Booking.com iCal...</p>
                        </div>
                    }

                    <!-- Color Picker (Simple) -->
                    <div class="flex gap-2">
                        @for (color of presetColors; track color) {
                            <button type="button" 
                                (click)="selectColor(color)"
                                class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                                [style.backgroundColor]="color"
                                [class.border-white]="addForm.get('color')?.value === color"
                                [class.border-transparent]="addForm.get('color')?.value !== color">
                            </button>
                        }
                    </div>

                    <button type="submit" 
                        [disabled]="addForm.invalid || isSubmitting()"
                        class="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                        @if (isSubmitting()) {
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        }
                        {{ 'CALENDAR.AddButton' | translate }}
                    </button>
                </form>
            </div>
        }
    </div>
  `
})
export class CalendarSidebarComponent implements OnInit {
    propertyId = input.required<string>();
    propertyName = input<string>('');
    filterToInternal = input<boolean>(false);
    isReadOnly = input<boolean>(false);
    sourceChanged = output<void>();
    addEventClicked = output<void>();

    private calendarService = inject(CalendarService);
    private fb = inject(FormBuilder);

    typeExternalLabel = 'iCal (Airbnb, Booking...)';

    sources = this.calendarService.sources;
    displaySources = computed(() => {
        const s = this.sources();
        if (this.filterToInternal()) {
            return s.filter(src => src.type === 'internal');
        }
        return s;
    });
    isSubmitting = signal(false);

    presetColors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

    addForm = this.fb.group({
        name: ['', Validators.required],
        type: ['external', Validators.required],
        url: ['', [Validators.required, Validators.pattern('https?://.+')]],
        color: ['#3b82f6', Validators.required]
    });

    ngOnInit() {
        this.load();

        // Update URL validators based on type
        this.addForm.get('type')?.valueChanges.subscribe(type => {
            const urlControl = this.addForm.get('url');
            if (type === 'external') {
                urlControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
            } else {
                urlControl?.clearValidators();
            }
            urlControl?.updateValueAndValidity();
        });
    }

    async load() {
        try {
            await this.calendarService.loadSources(this.propertyId(), this.propertyName());
        } catch (e) {
            console.error(e);
        }
    }

    selectColor(color: string) {
        this.addForm.patchValue({ color });
    }

    async onSubmit() {
        if (this.addForm.valid) {
            this.isSubmitting.set(true);
            try {
                const val = this.addForm.value;
                await this.calendarService.addSource({
                    name: val.name!,
                    url: val.type === 'external' ? val.url! : undefined,
                    color: val.color!,
                    type: val.type as 'external' | 'internal',
                    property_id: this.propertyId()
                });
                this.addForm.reset({ color: '#3b82f6', type: 'external' });
                this.sourceChanged.emit();
            } catch (e: any) {
                console.error('Error adding calendar source:', e);
                alert(`Erreur: ${e.message || 'Impossible d\'ajouter le calendrier'}`);
            } finally {
                this.isSubmitting.set(false);
            }
        }
    }

    async removeSource(id: string) {
        if (confirm('Delete this calendar source?')) {
            await this.calendarService.deleteSource(id);
            this.sourceChanged.emit();
        }
    }

    toggleVisibility(source: CalendarSource) {
        this.calendarService.toggleVisibility(source.id);
    }
}

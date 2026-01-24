import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService, CalendarEvent } from '../calendar.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full w-full p-4 bg-slate-900 relative">
      <full-calendar 
        [options]="calendarOptions" 
        [events]="events()">
      </full-calendar>

      <!-- Event Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
                <!-- Modal Header -->
                <div class="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                    <h3 class="text-xl font-bold text-white">
                        {{ (isEditing() ? 'CALENDAR.EditEvent' : 'CALENDAR.NewEvent') | translate }}
                    </h3>
                    <button (click)="closeModal()" [title]="'COMMON.Close' | translate" class="text-white/40 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    @if (!showDeleteConfirm()) {
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-400 mb-1">{{ 'CALENDAR.TitleLabel' | translate }}</label>
                                <input [(ngModel)]="eventForm.title" type="text" [title]="'CALENDAR.TitleLabel' | translate"
                                    class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
                                    [placeholder]="'CALENDAR.TitlePlaceholder' | translate">
                            </div>

                             <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-400 mb-1">{{ 'CALENDAR.StartLabel' | translate }}</label>
                                    <input [(ngModel)]="eventForm.start" type="datetime-local" [title]="'CALENDAR.StartLabel' | translate"
                                        class="w-full bg-slate-900/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-base">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-400 mb-1">{{ 'CALENDAR.EndLabel' | translate }}</label>
                                    <input [(ngModel)]="eventForm.end" type="datetime-local" [title]="'CALENDAR.EndLabel' | translate"
                                        class="w-full bg-slate-900/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-base">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-400 mb-1">{{ 'CALENDAR.DescriptionLabel' | translate }}</label>
                                <textarea [(ngModel)]="eventForm.description" rows="3" [title]="'CALENDAR.DescriptionLabel' | translate"
                                    class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
                                    [placeholder]="'CALENDAR.DescriptionPlaceholder' | translate"></textarea>
                            </div>
                        </div>
                    } @else {
                        <div class="py-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div class="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-2">
                                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold text-white">{{ 'CALENDAR.DeleteConfirmEvent' | translate }}</h4>
                            <p class="text-slate-400 text-sm max-w-[280px]">
                                {{ 'CALENDAR.DeleteConfirmEventDesc' | translate:{title: eventForm.title} }}
                            </p>
                        </div>
                    }
                </div>

                <!-- Modal Footer -->
                 <div class="p-6 bg-slate-900/50 border-t border-white/10">
                    @if (!showDeleteConfirm()) {
                        <div class="flex items-center justify-between gap-3 w-full">
                            @if (isEditing()) {
                                <button (click)="onDelete()" [title]="'COMMON.Delete' | translate"
                                    class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all">
                                    {{ 'COMMON.Delete' | translate }}
                                </button>
                            } @else {
                                <div></div>
                            }
                            
                            <div class="flex gap-3">
                                <button (click)="closeModal()" [title]="'COMMON.Cancel' | translate"
                                    class="px-5 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    {{ 'COMMON.Cancel' | translate }}
                                </button>
                                <button (click)="onSave()" [disabled]="!eventForm.title"
                                    [title]="(isEditing() ? 'CALENDAR.UpdateBtn' : 'CALENDAR.SaveBtn') | translate"
                                    class="px-6 py-2 text-sm font-bold text-slate-900 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg active:scale-95">
                                    {{ (isEditing() ? 'CALENDAR.UpdateBtn' : 'CALENDAR.SaveBtn') | translate }}
                                </button>
                            </div>
                        </div>
                    } @else {
                        <div class="grid grid-cols-2 gap-3 w-full animate-in slide-in-from-bottom-2 duration-300">
                            <button (click)="cancelDelete()" [title]="'CALENDAR.CancelDelete' | translate"
                                class="px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-all">
                                {{ 'CALENDAR.CancelDelete' | translate }}
                            </button>
                            <button (click)="confirmDelete()" [title]="'CALENDAR.ConfirmDelete' | translate"
                                class="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-900/30 active:scale-95">
                                {{ 'CALENDAR.ConfirmDelete' | translate }}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
      }
    </div>
  `,
    styles: [`
    :host ::ng-deep .fc {
        --fc-border-color: rgba(255, 255, 255, 0.1);
        --fc-page-bg-color: transparent;
        --fc-neutral-bg-color: rgba(255, 255, 255, 0.05);
        color: white;
    }
    :host ::ng-deep .fc-col-header-cell {
        background: rgba(255, 255, 255, 0.05);
        padding: 8px 0;
    }
    :host ::ng-deep .fc-daygrid-day:hover {
        background: rgba(255, 255, 255, 0.02);
    }
    :host ::ng-deep .fc-button-primary {
        background-color: #3b82f6 !important;
        border-color: #3b82f6 !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        text-transform: capitalize !important;
    }
    :host ::ng-deep .fc-button-primary:hover {
        background-color: #2563eb !important;
        border-color: #2563eb !important;
    }
    :host ::ng-deep .fc-event {
        cursor: pointer;
        border: none;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.85em;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    :host ::ng-deep .fc-day-today {
        background: rgba(59, 130, 246, 0.1) !important;
    }
    
    /* Input focus styles */
    input:focus, textarea:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    /* Improved visibility for datetime-local */
    input, textarea {
        background-color: rgba(15, 23, 42, 0.6) !important; /* Lighter background for better contrast */
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }
    input[type="datetime-local"] {
        color-scheme: dark;
        color: white;
    }
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
        opacity: 0.6;
    }
    input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }
  `]
})
export class CalendarViewComponent {
    propertyId = input.required<string>();
    events = input<CalendarEvent[]>([]);
    isReadOnly = input<boolean>(false);
    eventCreated = output<void>();

    calendarService = inject(CalendarService);

    // Modal State
    showModal = signal(false);
    isEditing = signal(false);
    showDeleteConfirm = signal(false);
    selectedEventId = signal<string | null>(null);
    eventForm = {
        title: '',
        start: '',
        end: '',
        description: ''
    };

    // Static config
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'fr',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        weekends: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        height: 'auto',
    };

    constructor() { }

    closeModal() {
        this.showModal.set(false);
        this.isEditing.set(false);
        this.showDeleteConfirm.set(false);
        this.selectedEventId.set(null);
        this.eventForm = { title: '', start: '', end: '', description: '' };
    }

    openCreateModal() {
        if (this.isReadOnly()) return;
        // Default to midnight today and midnight tomorrow
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        this.isEditing.set(false);
        this.eventForm = {
            title: '',
            start: this.formatDateForInput(start),
            end: this.formatDateForInput(end),
            description: ''
        };
        this.showModal.set(true);
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        if (this.isReadOnly()) return;

        // Ensure times are at midnight
        const start = new Date(selectInfo.start);
        start.setHours(0, 0, 0, 0);

        const end = new Date(selectInfo.end);
        end.setHours(0, 0, 0, 0);

        // Prepare form with defaults
        this.isEditing.set(false);
        this.eventForm = {
            title: '',
            start: this.formatDateForInput(start),
            end: this.formatDateForInput(end),
            description: ''
        };
        this.showModal.set(true);
    }

    handleEventClick(clickInfo: EventClickArg) {
        const isManual = clickInfo.event.extendedProps['isManual'];
        if (!isManual) return;

        this.isEditing.set(true);
        this.selectedEventId.set(clickInfo.event.id);
        this.eventForm = {
            title: clickInfo.event.title,
            start: this.formatDateForInput(clickInfo.event.start!),
            end: this.formatDateForInput(clickInfo.event.end || clickInfo.event.start!),
            description: clickInfo.event.extendedProps['description'] || ''
        };
        this.showModal.set(true);
    }

    async onSave() {
        try {
            const eventData: any = {
                title: this.eventForm.title,
                start: new Date(this.eventForm.start).toISOString(),
                end: this.eventForm.end ? new Date(this.eventForm.end).toISOString() : null,
                description: this.eventForm.description,
                property_id: this.propertyId(),
            };

            if (this.isEditing() && this.selectedEventId()) {
                await this.calendarService.updateManualEvent(this.selectedEventId()!, eventData);
            } else {
                await this.calendarService.addManualEvent(eventData);
            }

            this.eventCreated.emit();
            this.closeModal();
        } catch (e) {
            console.error(e);
            alert('Erreur lors de l\'enregistrement de l\'événement');
        }
    }

    onDelete() {
        if (!this.selectedEventId()) return;
        this.showDeleteConfirm.set(true);
    }

    cancelDelete() {
        this.showDeleteConfirm.set(false);
    }

    async confirmDelete() {
        if (!this.selectedEventId()) return;
        try {
            await this.calendarService.deleteManualEvent(this.selectedEventId()!);
            this.eventCreated.emit();
            this.closeModal();
        } catch (e) {
            console.error(e);
            alert('Erreur lors de la suppression');
        }
    }

    private formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarService, CalendarEvent } from '../calendar.service';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    template: `
    <div class="h-full w-full p-4 bg-slate-900">
      <full-calendar 
        [options]="calendarOptions" 
        [events]="events()">
      </full-calendar>
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
    }
    :host ::ng-deep .fc-button-primary:hover {
        background-color: #2563eb !important;
        border-color: #2563eb !important;
    }
    :host ::ng-deep .fc-event {
        cursor: pointer;
        border: none;
        padding: 2px 4px;
        font-size: 0.85em;
    }
    :host ::ng-deep .fc-day-today {
        background: rgba(59, 130, 246, 0.1) !important;
    }
  `]
})
export class CalendarViewComponent {
    propertyId = input.required<string>();
    events = input<CalendarEvent[]>([]);
    eventCreated = output<void>();

    calendarService = inject(CalendarService);

    // Simplified options - only the static config
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'fr', // Use string for locale
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
        height: 'auto', // Changed to auto to ensure visibility
    };

    constructor() { }


    async handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Titre du blocage / réservation (ex: Travaux):');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            // Add to DB
            try {
                await this.calendarService.addManualEvent({
                    title,
                    start_date: selectInfo.startStr,
                    end_date: selectInfo.endStr,
                    is_manual: true,
                    property_id: this.propertyId()
                });
                this.eventCreated.emit();
            } catch (e) {
                console.error(e);
                alert('Erreur lors de la création de l\'événement');
            }
        }
    }

    handleEventClick(clickInfo: EventClickArg) {
        const isManual = clickInfo.event.extendedProps['isManual'];
        if (isManual) {
            if (confirm(`Supprimer l'événement "${clickInfo.event.title}" ?`)) {
                // TODO: Implement delete in service
                // await this.calendarService.deleteEvent(clickInfo.event.id);
                // this.eventCreated.emit();
                alert("Suppression à implémenter");
            }
        } else {
            alert(`Détails: ${clickInfo.event.title}\nSource: Externe`);
        }
    }
}

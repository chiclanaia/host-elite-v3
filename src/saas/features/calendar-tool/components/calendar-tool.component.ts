import { Component, inject, signal, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSidebarComponent } from './calendar-sidebar.component';
import { CalendarViewComponent } from './calendar-view.component';
import { CalendarService } from '../calendar.service';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-calendar-tool',
  standalone: true,
  imports: [CommonModule, CalendarSidebarComponent, CalendarViewComponent, TranslatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-white flex items-center gap-3 min-w-0">
            <span class="text-3xl shrink-0">🗓️</span>
            <span class="truncate">{{ 'TOOL.calendar_name' | translate }}</span>
            <span class="hidden sm:block text-white/40 font-light ml-2 border-l border-white/20 pl-4 truncate">{{ propertyName() }}</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1 truncate">{{ 'TOOL.calendar_desc' | translate }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="view.openCreateModal()" 
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nouvel événement</span>
          </button>
          
          <button (click)="close.emit()" class="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar -->
        <div class="w-80 border-r border-white/10 bg-slate-800/30 overflow-y-auto custom-scrollbar">
          <app-calendar-sidebar 
            [propertyId]="propertyId()" 
            [propertyName]="propertyName()"
            (sourceChanged)="onSourcesChanged()"
            (addEventClicked)="view.openCreateModal()">
          </app-calendar-sidebar>
        </div>

        <!-- Calendar -->
        <div class="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden relative">
            @if (isLoading()) {
                <div class="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div class="flex flex-col items-center gap-3">
                        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-white font-medium">{{ 'COMMON.Loading' | translate }}...</span>
                    </div>
                </div>
            }
            <app-calendar-view #view
                [propertyId]="propertyId()"
                [events]="filteredEvents()"
                (eventCreated)="onEventCreated()">
            </app-calendar-view>
        </div>
      </div>
    </div>
  `
})
export class CalendarToolComponent implements OnInit {
  propertyDetails = input.required<any>();
  close = output<void>();

  calendarService = inject(CalendarService);
  isLoading = this.calendarService.isLoading;
  events = signal<any[]>([]);

  // Extract property ID from propertyDetails
  propertyId = computed(() => {
    const details = this.propertyDetails();
    return details?.id || details?.propertyId || '';
  });

  // Extract property Name for auto-creation logic
  propertyName = computed(() => this.propertyDetails()?.name || '');

  // Filter events based on source visibility
  filteredEvents = computed(() => {
    const allEvents = this.events();
    const sources = this.calendarService.sources();
    const visibleSourceIds = new Set(
      sources.filter(s => s.visible !== false).map(s => s.id)
    );

    return allEvents.filter(event => {
      // Allow manual events if they are not linked to a source or if we handle them differently
      if (event.isManual && !event.sourceId) return true;
      return visibleSourceIds.has(event.sourceId);
    });
  });

  ngOnInit() {
    this.refreshEvents();
  }

  onSourcesChanged() {
    this.refreshEvents();
  }

  onEventCreated() {
    this.refreshEvents();
  }

  refreshEvents() {
    const id = this.propertyId();
    if (!id) {
      return;
    }
    const name = this.propertyDetails()?.name;
    this.calendarService.getAllEvents(id, name)
      .then(evts => {
        this.events.set(evts);
      })
      .catch(err => { });
  }
}

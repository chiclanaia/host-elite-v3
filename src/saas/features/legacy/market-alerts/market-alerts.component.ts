import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { EventsDiscoveryService, LocalEvent } from '../../../../services/events-discovery.service';
import { GeminiService } from '../../../../services/gemini.service';
import { CalendarService } from '../calendar-tool/calendar.service';

@Component({
  selector: 'app-market-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            {{ 'EVENTS.Title' | translate }}
          </h2>
          <p class="text-sm text-slate-400 mt-1">{{ 'EVENTS.Subtitle' | translate }}</p>
        </div>
        <button (click)="close.emit()" data-debug-id="tool-back-btn"
          title="Close" aria-label="Close"
          class="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Filters -->
      <div class="p-6 border-b border-white/10 bg-black/20">
        <div class="flex justify-center">
          <!-- AI Generate Button (Silver+ only) -->
          <button *ngIf="hasSilverAccess()" (click)="generateWithAI()" [disabled]="isAiGenerating()"
            [title]="'EVENTS.GenerateAI' | translate"
            class="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg">
            <svg *ngIf="!isAiGenerating()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            <svg *ngIf="isAiGenerating()" class="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isAiGenerating() ? ('EVENTS.Generating' | translate) : ('EVENTS.GenerateAI' | translate) }}
          </button>
        </div>
      </div>

      <!-- Events List -->
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div *ngIf="events().length === 0 && !isLoading()" 
          class="text-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-slate-400 text-lg">{{ 'EVENTS.NoEvents' | translate }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let event of events()" 
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all group">
            
            <!-- Event Image -->
            <div *ngIf="event.imageUrl" class="h-48 overflow-hidden">
              <img [src]="event.imageUrl" [alt]="event.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
            </div>

            <div class="p-5">
              <!-- Category Badge -->
              <span class="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full mb-3">
                {{ event.category }}
              </span>

              <!-- Title -->
              <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">
                {{ event.title }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-slate-400 mb-4 line-clamp-3">
                {{ event.description }}
              </p>

              <!-- Details -->
              <div class="space-y-2 mb-4 text-sm">
                <!-- Date -->
                <div class="flex items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ event.startDate | date:'short' }}
                </div>
                
                <!-- Location (exact address) -->
                <div class="flex items-start text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="flex-1">{{ event.location }}</span>
                </div>
                
                <!-- Distance from property -->
                <div class="flex items-center text-slate-400 text-xs ml-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {{ event.distance.toFixed(1) }} km {{ 'EVENTS.FromProperty' | translate }}
                </div>
                
                <!-- Source URL (if available) -->
                <div *ngIf="event.url" class="flex items-center text-purple-300 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a [href]="event.url" target="_blank" rel="noopener noreferrer" 
                    class="hover:text-purple-200 underline truncate">
                    {{ 'EVENTS.SourceLink' | translate }}
                  </a>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <a *ngIf="event.url" [href]="event.url" target="_blank"
                  class="flex-1 text-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
                  {{ 'EVENTS.Details' | translate }}
                </a>
                
                <!-- Add to Calendar Button -->
                <button *ngIf="isGoldUser()" (click)="addToCalendar(event)"
                  [disabled]="isEventAdded(event.id)"
                  [title]="'EVENTS.AddToCalendar' | translate"
                  class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  [class]="isEventAdded(event.id) 
                    ? 'bg-emerald-600/50 text-white cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path *ngIf="!isEventAdded(event.id)" fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                    <path *ngIf="isEventAdded(event.id)" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ isEventAdded(event.id) ? ('EVENTS.AlreadyAdded' | translate) : ('EVENTS.AddToCalendar' | translate) }}
                </button>

                <!-- Upgrade Teaser for Silver -->
                <div *ngIf="!isGoldUser()" 
                  class="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg text-xs text-amber-200 text-center">
                  {{ 'EVENTS.UpgradePrompt' | translate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage()" 
        class="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
        {{ successMessage() | translate }}
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class MarketAlertsComponent {
  propertyDetails = input.required<any>();
  userPlan = input.required<string>();
  close = output<void>();

  private eventsService = inject(EventsDiscoveryService);
  private geminiService = inject(GeminiService);
  private calendarService = inject(CalendarService);

  events = signal<LocalEvent[]>([]);
  isLoading = signal(false);
  isAiGenerating = signal(false);
  successMessage = signal<string | null>(null);
  addedEventIds = signal<Set<string>>(new Set());
  radiusKm = 20;

  isGoldUser = computed(() => this.userPlan() === 'Gold' || this.userPlan() === 'TIER_3');
  hasSilverAccess = computed(() => {
    const plan = this.userPlan();
    return plan === 'Silver' || plan === 'Gold' || plan === 'TIER_2' || plan === 'TIER_3';
  });

  isEventAdded(eventId: string): boolean {
    return this.addedEventIds().has(eventId);
  }

  // Component no longer auto-loads events on init
  // Events only populate when user clicks "Generate with AI"

  async loadEvents() {
    const property = this.propertyDetails();
    if (!property?.address) {
      console.error('No property address available');
      return;
    }

    this.isLoading.set(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // Next 3 months

      const events = await this.eventsService.searchEvents(
        property.address,
        this.radiusKm,
        startDate,
        endDate
      );
      this.events.set(events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async addToCalendar(event: LocalEvent) {
    // Prevent duplicate additions
    if (this.addedEventIds().has(event.id)) {
      return;
    }

    const property = this.propertyDetails();
    if (!property?.id) {
      console.error('No property ID available');
      return;
    }

    try {
      // Ensure "Local Events" calendar source exists via Service
      const sourceId = await this.calendarService.ensureLocalEventsSource(property.id);

      // Prepare event for calendar
      const calendarEvent = {
        title: event.title,
        start: event.startDate.toISOString(),
        end: event.startDate.toISOString(),
        description: `${event.description}\n\n📍 ${event.distance.toFixed(1)} km away\n🏷️ ${event.category}\n🌐 ${event.url || ''}`,
        property_id: property.id,
        source_id: sourceId
      };

      // Save to calendar
      await this.calendarService.addManualEvent(calendarEvent);

      // Mark as added
      this.addedEventIds.update(ids => {
        const newSet = new Set(ids);
        newSet.add(event.id);
        return newSet;
      });

      this.successMessage.set('EVENTS.Added');
      setTimeout(() => this.successMessage.set(null), 3000);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      this.successMessage.set('EVENTS.ErrorCalendar');
      setTimeout(() => this.successMessage.set(null), 3000);
    }
  }

  // Simplified translate helper if needed, or use Pipe in template
  private translate(key: string): string {
    // We can inject TranslationService if needed, but for now we'll stick to the pipe in template
    // Actually, successMessage is a signal shown in template via {{ successMessage() }}
    // So we should set the key and use translate pipe in template, OR inject service.
    return key;
  }

  async generateWithAI() {
    const property = this.propertyDetails();
    if (!property?.address) {
      return;
    }

    this.isAiGenerating.set(true);
    try {
      const prompt = `SEARCH AND FIND REAL UPCOMING LOCAL EVENTS for a property located at: ${property.address}.
      
      CRITICAL INSTRUCTIONS:
      1. Find 5-8 REAL events happening in the NEXT 3 MONTHS.
      2. Include major festivals, concerts, sports, or local markets.
      3. For each event, provide:
         - title: Catchy name
         - description: Why a tourist would love it (2-3 sentences)
         - category: One of: Music, Food & Drink, Sports, Arts & Culture, Other
         - location: Specific venue name or address
         - distance: Estimated km from ${property.address}
         - startDate: ISO format (ensure it's in the future)
         - url: A REAL website URL for the event if possible.
      
      Format strictly as a JSON array. DO NOT include markdown formatting or explanations outside the JSON.`;

      const response = await this.geminiService.generateText(prompt);

      try {
        const aiEvents = JSON.parse(response);
        const localEvents: LocalEvent[] = aiEvents.map((e: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          title: e.title,
          description: e.description,
          category: e.category,
          startDate: new Date(e.startDate),
          location: e.location || `Venue ${index + 1}`,
          distance: e.distance || Math.random() * 10 + 1,
          url: e.url,
          imageUrl: `https://images.unsplash.com/photo-${['1514320291840-2e0a9bf2a9ae', '1488459716781-31db52582fe9', '1461896836934-ffe607ba8211', '1536924940846-227afb31e2a5'][index % 4]}?w=400`
        }));

        this.events.set(localEvents);
        this.successMessage.set('EVENTS.SuccessGenerated');
        setTimeout(() => this.successMessage.set(null), 3000);
      } catch (parseError) {
        console.error('[Market Alerts] Failed to parse AI response:', parseError);
        console.error('[Market Alerts] Raw response was:', response);
        this.successMessage.set('EVENTS.ErrorFallback');
        await this.loadEvents();
        setTimeout(() => this.successMessage.set(null), 3000);
      }
    } catch (error) {
      console.error('[Market Alerts] AI generation error:', error);
      this.successMessage.set('EVENTS.ErrorService');
      await this.loadEvents();
      setTimeout(() => this.successMessage.set(null), 3000);
    } finally {
      this.isAiGenerating.set(false);
    }
  }
}

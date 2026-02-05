import { Component, computed, inject, input, signal, effect, Output, EventEmitter, OnInit } from '@angular/core';
import { HostRepository } from '../../../../services/host-repository.service';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../services/translation.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChecklistService, ChecklistWithItems } from '../../../../services/checklist.service';

@Component({
    selector: 'app-checklists-tool',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './checklists-tool.component.html',
    styles: [`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
        
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white; }
        }
    `]
})
export class ChecklistsToolComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    propertyName = input<string>(); // Input for passing the property name for print


    private checklistService = inject(ChecklistService);
    private store = inject(SessionStore);
    private sanitizer = inject(DomSanitizer);

    // State
    availableChecklists = signal<ChecklistWithItems[]>([]);
    selectedChecklist = signal<ChecklistWithItems | null>(null);
    isLoading = signal<boolean>(true);

    userTier = computed(() => this.store.userProfile()?.plan || 'TIER_0');

    filteredChecklists = computed(() => {
        const checklists = this.availableChecklists();
        const userTierRank = this.store.getTierRank(this.userTier());

        // Group by category
        const byCategory: Record<string, ChecklistWithItems[]> = {};
        checklists.forEach(c => {
            const cat = c.category?.toLowerCase().trim() || 'uncategorized';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(c);
        });

        const result: ChecklistWithItems[] = [];

        Object.keys(byCategory).forEach(cat => {
            const group = byCategory[cat];

            // Find accessible checklists
            const accessible = group.filter(c => {
                const rank = this.store.getTierRank(this.store.normalizeTierId(c.tier));
                return rank <= userTierRank;
            });

            // Sort by rank DESC (Highest first)
            accessible.sort((a, b) => {
                const rankA = this.store.getTierRank(this.store.normalizeTierId(a.tier));
                const rankB = this.store.getTierRank(this.store.normalizeTierId(b.tier));
                return rankB - rankA;
            });

            const bestAccessible = accessible.length > 0 ? accessible[0] : null;
            const bestRank = bestAccessible
                ? this.store.getTierRank(this.store.normalizeTierId(bestAccessible.tier))
                : -1;

            // Logic: Show Best Accessible + Higher Tiers (Locked)
            // Hide Lower Tiers
            group.forEach(c => {
                const cRank = this.store.getTierRank(this.store.normalizeTierId(c.tier));

                const isBest = bestAccessible && c.id === bestAccessible.id;
                const isHigher = cRank > bestRank;

                if (isBest || isHigher) {
                    result.push(c);
                }
            });
        });

        // Final Sort: Category ASC, Tier ASC
        return result.sort((a, b) => {
            const catA = a.category || '';
            const catB = b.category || '';
            const catCompare = catA.localeCompare(catB);
            if (catCompare !== 0) return catCompare;

            const rankA = this.store.getTierRank(this.store.normalizeTierId(a.tier));
            const rankB = this.store.getTierRank(this.store.normalizeTierId(b.tier));
            return rankA - rankB;
        });
    });

    async ngOnInit() {
        await this.loadChecklists();
    }

    async loadChecklists() {
        this.isLoading.set(true);
        try {
            // We load ALL checklists to show the progression, but we mark them as accessible or not
            const all = await this.checklistService.getAllChecklists();

            // For each checklist, we need its items to show the metadata
            const checklistsWithItems = await Promise.all(all.map(async (c) => {
                const items = await this.checklistService.getChecklistItems(c.id);
                return { ...c, items };
            }));

            this.availableChecklists.set(checklistsWithItems);

            // Auto-select first available checklist if none is selected
            if (this.availableChecklists().length > 0 && !this.selectedChecklist()) {
                // Find the first checklist in the filtered list
                const bestOption = this.filteredChecklists()[0];
                if (bestOption) {
                    this.selectedChecklist.set(bestOption);
                }
            }
        } catch (error) {
            console.error('Error loading checklists:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    selectChecklist(checklist: ChecklistWithItems) {
        this.selectedChecklist.set(checklist);
    }

    isTierAllowed(checklistTier: string): boolean {
        const userRank = this.store.getTierRank(this.userTier());
        const requiredRank = this.store.getTierRank(this.store.normalizeTierId(checklistTier));
        return userRank >= requiredRank;
    }

    getTierLevelLabel(tier: string): number {
        return this.store.getTierRank(this.store.normalizeTierId(tier)) + 1;
    }

    getTotalTime(checklist: ChecklistWithItems): number {
        return this.getCumulativeItems(checklist).reduce((total, item) => total + (item.estimated_minutes || 0), 0);
    }

    public getCumulativeItems(currentChecklist: ChecklistWithItems): any[] {
        if (!currentChecklist.category) return currentChecklist.items;

        // 1. Get current checklist's rank
        const currentRank = this.store.getTierRank(this.store.normalizeTierId(currentChecklist.tier));
        const currentCategory = currentChecklist.category.toLowerCase().trim();

        // 2. Find all checklists in the same category with rank <= currentRank
        const relevantChecklists = this.availableChecklists().filter(c => {
            const cCategory = c.category?.toLowerCase().trim();
            const cRank = this.store.getTierRank(this.store.normalizeTierId(c.tier));
            return cCategory === currentCategory && cRank <= currentRank;
        });

        // 3. Flatten items
        const mergedItems = relevantChecklists.flatMap(c => c.items);

        // Remove duplicates if any (based on item text key)
        const uniqueItems = mergedItems.filter((item, index, self) =>
            index === self.findIndex((t) => t.item_text_key === item.item_text_key)
        );

        return uniqueItems;
    }

    printChecklist() {
        window.print();
    }

    async downloadPDF() {
        const checklist = this.selectedChecklist();
        if (!checklist) return;

        // For now, trigger print dialog which can save as PDF
        // In the future, we can use jsPDF for more control
        this.printChecklist();
    }

    getChecklistIcon(icon: string | undefined): SafeHtml {
        const defaultPath = '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />';
        if (!icon) return this.sanitizer.bypassSecurityTrustHtml(defaultPath);

        const mapping: Record<string, string> = {
            '📋': defaultPath,
            '✨': '<path d="M12 2v2M12 18v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />',
            '⭐': '<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />',
            '🔑': '<path d="M15 7l-3 3m0 0l-3-3m3 3V3m0 18a4 4 0 110-8 4 4 0 010 8z" />',
            '👋': '<path d="M18 10h-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2v-4h2a2 2 0 002-2v-1a2 2 0 00-2-2z" />',
            '🔧': '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l.3-.3a1 1 0 000-1.4L16.4 6a1 1 0 00-1.4 0l-.3.3z M6.7 14.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l.3-.3a1 1 0 000-1.4L8.4 14a1 1 0 00-1.4 0l-.3.3z M20 4L4 20" />',
            '⚡': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />',
            '🚀': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />',
            '🚨': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
            '🌟': '<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />',
            '🧼': '<path d="M3 21h18M3 10V5a2 2 0 012-2h14a2 2 0 012 2v5M8 3v18M16 3v18" />',
            '🛏️': '<path d="M2 20v-8a2 2 0 012-2h12a2 2 0 012 2v8M2 14h16M5 10V7a3 3 0 013-3h4a3 3 0 013 3v3" />'
        };

        const path = mapping[icon] || mapping['📋'];
        return this.sanitizer.bypassSecurityTrustHtml(path);
    }

    getTierBadgeClass(tier: string): string {
        return this.store.getTierClass(tier);
    }

    getSectionIcon(section: string): SafeHtml {
        const s = section.toLowerCase();
        const icons: Record<string, string> = {
            'entry': '<path d="M15 7l-3 3m0 0l-3-3m3 3V3m0 18a4 4 0 110-8 4 4 0 010 8z" />',
            'cleaning': '<path d="M12 21V10M18 21V10M6 21V10M3 10h18V6a2 2 0 00-2-2H5a2 2 0 00-2 2v4z" />',
            'linens': '<path d="M2 20v-8a2 2 0 012-2h12a2 2 0 012 2v8M2 14h16M5 10V7a3 3 0 013-3h4a3 3 0 013 3v3" />',
            'exit': '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />',
            'welcome': '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />',
            'tech': '<path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 13h4" />',
            'gift': '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />',
            'ambiance': '<path d="M12 2v2M12 18v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />',
            'followup': '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />',
            'maintenance': '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l.3-.3a1 1 0 000-1.4L16.4 6a1 1 0 00-1.4 0l-.3.3z M6.7 14.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l.3-.3a1 1 0 000-1.4L8.4 14a1 1 0 00-1.4 0l-.3.3z M20 4L4 20" />',
            'general': '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />',
            'bedroom': '<path d="M2 20v-8a2 2 0 012-2h12a2 2 0 012 2v8M2 14h16M5 10V7a3 3 0 013-3h4a3 3 0 013 3v3" />',
            'bathroom': '<path d="M20 18h-1a4 4 0 00-4 4H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8M9 2v3M15 2v3M3 9h18" />',
            'kitchen': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v11M16 2v11M13 18a2 2 0 012-2h2a2 2 0 012 2v3H13v-3z" />',
            'safety': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
            'security': '<rect x="3" y="11" width="14" height="10" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0110 0v4" />',
            'comfort': '<path d="M12 9v12M12 2v3M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />',
            'inventory': '<path d="M21 8a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v4zM10 12h4 M21 16a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4z" />'
        };
        const path = icons[s] || '<path d="M20 6L9 17l-5-5" />';
        return this.sanitizer.bypassSecurityTrustHtml(path);
    }

    getItemCount(checklist: ChecklistWithItems): number {
        return this.getCumulativeItems(checklist).length;
    }

    groupItemsBySection(checklist: ChecklistWithItems): Record<string, any[]> {
        const items = this.getCumulativeItems(checklist);
        return items.reduce((acc, item) => {
            const section = item.section || 'general';
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
        }, {} as Record<string, any[]>);
    }

    getSections(checklist: ChecklistWithItems): string[] {
        return Object.keys(this.groupItemsBySection(checklist));
    }

    getItemsForSection(checklist: ChecklistWithItems, section: string): any[] {
        return this.groupItemsBySection(checklist)[section] || [];
    }
}

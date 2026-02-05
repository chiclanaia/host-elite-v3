import { Component, input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslationService } from '../../../../services/translation.service';
import { HostRepository } from '../../../../services/host-repository.service';
import { GeminiService } from '../../../../services/gemini.service';
import { RenovationRoom } from '../../../../types';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'fin-02-renovation-budget',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
        <!-- Header -->
        <div class="flex justify-between items-start">
            <div>
                <h1 class="text-3xl font-extrabold text-white tracking-tight"> {{ 'RENOV.SmartCapexPlanner' | translate }}</h1>
                <p class="text-slate-400 mt-2 max-w-2xl"> {{ 'RENOV.StrategicRenovationBudgetingToPrevent' | translate }}</p>
            </div>

            <div class="flex items-center gap-4">
                @if (properties().length > 1) {
                    <select [ngModel]="selectedPropertyId()" (ngModelChange)="onPropertyChange($event)"
                    class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                        @for (prop of properties(); track prop.id) {
                            <option [value]="prop.id"> {{ prop.name }} </option>
                        }
                    </select>
                }

                <div class="flex gap-2">
                    <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                        <span>🏗️</span>{{ 'RENOV.Construction' | translate }}
                    </div>
                    <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
                        <span>💶</span>{{ 'RENOV.RoiFocused' | translate }}
                    </div>
                </div>
            </div>
        </div>

        <!-- TIER 0: Static Checklist -->
        @if (isTier0()) {
            <div class="flex-1 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-8 text-center min-h-[400px]">
                <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                    <span class="text-4xl">📋</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2"> {{ 'RENOV.RenovationChecklist' | translate }} </h3>
                <p class="text-slate-400 max-w-md mb-8"> {{ 'RENOV.AccessOurProfessionalRoombyroomRenovation' | translate }}</p>

                <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25 group" data-debug-id="renovation-download-pdf-btn">
                    <span class="material-icons group-hover:-translate-y-1 transition-transform">download</span>{{ 'RENOV.DownloadPdfGuide' | translate }}
                </button>
            </div>
        } @else {
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <!-- Left: Room Budget Planner -->
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col flex-1 overflow-hidden">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-white"> {{ 'RENOV.RoomBudgetPlanner' | translate }} </h3>
                            <button (click)="addRoom()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors" data-debug-id="renovation-add-room-btn">
                                <span class="material-icons text-xs">add</span>{{ 'RENOV.AddRoom' | translate }}
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            @for (room of rooms(); track $index) {
                                <div class="bg-black/20 rounded-xl p-4 border border-white/5 relative group hover:border-white/10 transition-colors">
                                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                        <div class="md:col-span-1">
                                            <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1"> {{ 'RENOV.RoomType' | translate }} </label>
                                            <select [ngModel]="room.type" (ngModelChange)="updateRoom($index, 'type', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs font-bold" [attr.data-debug-id]="'renovation-room-type-' + $index">
                                                <option value="Living Room"> {{ 'RENOV.LivingRoom' | translate }}</option>
                                                <option value="Kitchen"> {{ 'RENOV.Kitchen' | translate }}</option>
                                                <option value="Bathroom"> {{ 'RENOV.Bathroom' | translate }}</option>
                                                <option value="Bedroom"> {{ 'RENOV.Bedroom' | translate }}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1"> {{ 'RENOV.AreaM' | translate }}</label>
                                            <input type="number" [ngModel]="room.area" (ngModelChange)="updateRoom($index, 'area', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs" [attr.data-debug-id]="'renovation-room-area-' + $index">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1"> {{ 'RENOV.FinishLevel' | translate }}</label>
                                            <select [ngModel]="room.finish_level" (ngModelChange)="updateRoom($index, 'finish_level', $event)" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs" [attr.data-debug-id]="'renovation-room-finish-' + $index">
                                                <option value="Standard"> {{ 'RENOV.Standard' | translate }}</option>
                                                <option value="Premium"> {{ 'RENOV.Premium' | translate }}</option>
                                                <option value="Luxury"> {{ 'RENOV.Luxury' | translate }}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-[10px] text-slate-400 uppercase font-bold mb-1"> {{ 'RENOV.ActualSpend' | translate }}</label>
                                            <div class="relative">
                                                <input type="number" [ngModel]="room.actual_spend" (ngModelChange)="updateRoom($index, 'actual_spend', $event)" class="w-full bg-black/40 border border-slate-700 rounded px-2 py-1.5 text-white text-xs font-mono" placeholder="0">
                                                <div class="absolute bottom-0 left-0 h-0.5 bg-emerald-500/50 transition-all" [style.width.%]="(room.actual_spend / (room.budget_estimate || 1)) * 100"></div>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-[10px] text-slate-500 uppercase"> {{ 'RENOV.Budget' | translate }}</div>
                                            <div class="font-bold text-emerald-400 text-sm font-mono"> {{ room.budget_estimate | currency: 'EUR': 'symbol': '1.0-0' }}</div>
                                        </div>
                                    </div>
                                    <button (click)="removeRoom($index)" class="absolute top-2 right-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span class="material-icons text-sm">close</span>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>

                    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col" [class.opacity-50]="!isTier2OrAbove()" [class.pointer-events-none]="!isTier2OrAbove()">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-bold text-white flex items-center gap-2">
                                <span class="material-icons text-indigo-400 text-sm">handshake</span>{{ 'RENOV.VendorMatrix3Quotes' | translate }}
                            </h3>
                            @if (!isTier2OrAbove()) { <span class="text-[10px] text-amber-400 border border-amber-400/30 px-1.5 rounded"> SILVER + </span> }
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-xs text-center">
                            <div class="p-3 bg-black/20 rounded border border-white/5">
                                <span class="block text-slate-400 mb-1"> {{ 'RENOV.VendorA' | translate }}</span>
                                <input type="text" placeholder="{{ 'RENOV.Quote' | translate }}" class="w-full bg-transparent text-center border-b border-white/20 focus:border-indigo-500 outline-none text-white">
                            </div>
                            <div class="p-3 bg-black/20 rounded border border-white/5">
                                <span class="block text-slate-400 mb-1"> {{ 'RENOV.VendorB' | translate }}</span>
                                <input type="text" placeholder="{{ 'RENOV.Quote' | translate }}" class="w-full bg-transparent text-center border-b border-white/20 focus:border-indigo-500 outline-none text-white">
                            </div>
                            <div class="p-3 bg-indigo-500/10 rounded border border-indigo-500/30">
                                <span class="block text-indigo-300 font-bold mb-1"> {{ 'RENOV.VendorCBest' | translate }}</span>
                                <input type="text" placeholder="{{ 'RENOV.Quote' | translate }}" class="w-full bg-transparent text-center border-b border-indigo-500/50 focus:border-indigo-500 outline-none text-white font-bold">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="flex flex-col gap-6">
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center">
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 self-start"> {{ 'RENOV.SpendDistribution' | translate }}</h3>
                        <div class="w-40 h-40 rounded-full relative mb-6"
                            [style.background]="'conic-gradient(#10B981 0% ' + kitchenShare() + '%, #6366F1 ' + kitchenShare() + '% ' + (kitchenShare() + bathShare()) + '%, #F59E0B ' + (kitchenShare() + bathShare()) + '% 100%)'">
                            <div class="absolute inset-0 m-8 bg-slate-900 rounded-full flex flex-col items-center justify-center border border-white/10">
                                <span class="text-[10px] text-slate-500"> {{ 'RENOV.TotalBudget' | translate }}</span>
                                <span class="text-lg font-bold text-white"> {{ totalBudget() | currency: 'EUR': 'symbol': '1.0-0' }}</span>
                            </div>
                        </div>

                        <div class="w-full space-y-2 text-xs">
                            <div class="flex justify-between text-emerald-400">
                                <span class="flex items-center gap-2"> <div class="w-2 h-2 rounded-full bg-emerald-500"></div> {{ 'RENOV.Kitchen' | translate }}</span>
                                <span>{{ kitchenShare() | number: '1.0-0' }}% </span>
                            </div>
                            <div class="flex justify-between text-indigo-400">
                                <span class="flex items-center gap-2"> <div class="w-2 h-2 rounded-full bg-indigo-500"></div> {{ 'RENOV.Bathroom' | translate }}</span>
                                <span>{{ bathShare() | number: '1.0-0' }}% </span>
                            </div>
                            <div class="flex justify-between text-amber-400">
                                <span class="flex items-center gap-2"> <div class="w-2 h-2 rounded-full bg-amber-500"></div>{{ 'RENOV.Other' | translate }}</span>
                                <span>{{ 100 - kitchenShare() - bathShare() | number: '1.0-0' }}% </span>
                            </div>
                        </div>
                    </div>

                    <!-- AI Quote Auditor -->
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
                        <h3 class="text-white font-bold flex items-center gap-2 mb-4">
                            <span class="material-icons text-indigo-400">psychology</span>{{ 'RENOV.AiQuoteAuditor' | translate }}
                        </h3>

                        @if (isTier3()) {
                            @if (!auditData()?.auditing && !auditResult()) {
                                <div class="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer" (click)="triggerAudit()" data-debug-id="renovation-audit-upload-area">
                                    <span class="material-icons text-slate-500 text-3xl mb-2">upload_file</span>
                                    <p class="text-xs text-slate-400"> {{ 'RENOV.DropContractorPdfHereTo' | translate }} </p>
                                </div>
                            }

                            @if (auditData()?.auditing) {
                                <div class="py-12 flex flex-col items-center justify-center animate-pulse">
                                    <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p class="mt-4 text-xs text-indigo-300 font-bold uppercase tracking-widest">Auditing Quote...</p>
                                </div>
                            }

                            @if (auditResult() && auditData()) {
                                <div class="space-y-4 animate-fade-in">
                                    <div class="flex items-center justify-between">
                                        <div class="text-[10px] text-slate-400 uppercase font-bold">Audit Score</div>
                                        <div [class]="auditData().score > 70 ? 'text-emerald-400' : 'text-amber-400'" class="text-xl font-black font-mono">
                                            {{ auditData().score }}/100
                                        </div>
                                    </div>

                                    <div [class]="auditData().isReasonable ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'" class="p-3 border rounded-lg">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span [class]="auditData().isReasonable ? 'text-emerald-400' : 'text-rose-400'" class="material-icons text-sm">
                                                {{ auditData().isReasonable ? 'check_circle' : 'warning' }}
                                            </span>
                                            <span class="text-xs font-bold" [class]="auditData().isReasonable ? 'text-emerald-200' : 'text-rose-200'">
                                                {{ auditData().isReasonable ? 'Fair Market Value' : 'Potential Overcharge' }}
                                            </span>
                                        </div>
                                        <p class="text-[10px] leading-relaxed" [class]="auditData().isReasonable ? 'text-emerald-200/70' : 'text-rose-200/70'">
                                            {{ auditData().observations }}
                                        </p>
                                    </div>

                                    <div class="bg-indigo-500/5 border border-white/5 rounded-lg p-3">
                                        <h5 class="text-[10px] font-bold text-indigo-300 uppercase mb-2 flex items-center gap-2">
                                            <span class="material-icons text-[12px]">lightbulb</span> Savings Tips
                                        </h5>
                                        <ul class="space-y-1">
                                            @for (tip of auditData().tips; track tip) {
                                                <li class="text-[10px] text-slate-300 flex items-start gap-2">
                                                    <span class="text-indigo-400">•</span> {{ tip }}
                                                </li>
                                            }
                                        </ul>
                                    </div>

                                    <button (click)="auditResult.set(false); auditData.set(null)" class="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-400 font-bold uppercase transition-colors">
                                        Reset Audit
                                    </button>
                                </div>
                            }
                        } @else {
                            <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl group cursor-pointer transition-all hover:bg-black/50">
                                <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-full border border-white/10 shadow-lg transform group-hover:scale-105 transition-all">
                                    <span class="text-sm">🔒</span>
                                    <span class="text-white text-[10px] font-medium uppercase tracking-wide">{{ 'COMMON.UpgradeToUnlock' | translate }}</span>
                                </div>
                            </div>
                        }
                    </div>

                    <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                        <div class="flex items-start gap-3">
                            <span class="text-xl">🏆</span>
                            <div>
                                <h4 class="font-bold text-indigo-300 text-sm"> {{ 'RENOV.ProTip' | translate }}</h4>
                                <p class="text-xs text-indigo-200/80 mt-1"> {{ 'RENOV.CoachTipText' | translate }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class RenovationBudgetComponent {
    feature = input.required<Feature>();
    session = inject(SessionStore);
    repository = inject(HostRepository);
    gemini = inject(GeminiService);

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
    isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
    isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3', 'Silver', 'Gold'].includes(this.tier()));
    isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

    properties = signal<any[]>([]);
    selectedPropertyId = signal<string | null>(null);

    auditResult = signal<boolean>(false);
    auditData = signal<any>(null);
    rooms = signal<RenovationRoom[]>([]);

    constructor() {
        this.loadInitialData();
    }

    async loadInitialData() {
        const props = await this.repository.getProperties();
        this.properties.set(props);
        if (props.length > 0) {
            this.selectedPropertyId.set(props[0].id);
            this.loadRooms(props[0].id);
        }
    }

    async onPropertyChange(id: string) {
        this.selectedPropertyId.set(id);
        this.loadRooms(id);
    }

    async loadRooms(propertyId: string) {
        const data = await this.repository.getRenovationRooms(propertyId);
        this.rooms.set(data);
    }

    totalBudget = computed(() => this.rooms().reduce((acc, r) => acc + Number(r.budget_estimate || 0), 0));
    kitchenShare = computed(() => {
        const total = this.totalBudget() || 1;
        const kitchen = this.rooms().filter(r => r.type === 'Kitchen').reduce((acc, r) => acc + Number(r.budget_estimate || 0), 0);
        return (kitchen / total) * 100;
    });
    bathShare = computed(() => {
        const total = this.totalBudget() || 1;
        const bath = this.rooms().filter(r => r.type === 'Bathroom').reduce((acc, r) => acc + Number(r.budget_estimate || 0), 0);
        return (bath / total) * 100;
    });

    async addRoom() {
        const propId = this.selectedPropertyId();
        if (!propId) return;

        const newRoom: Partial<RenovationRoom> = {
            property_id: propId,
            type: 'Bedroom',
            area: 15,
            finish_level: 'Standard',
            budget_estimate: 6000,
            actual_spend: 0
        };

        const saved = await this.repository.upsertRenovationRoom(newRoom);
        if (saved) {
            this.rooms.update(prev => [...prev, saved]);
        }
    }

    async removeRoom(index: number) {
        const room = this.rooms()[index];
        if (room.id) {
            await this.repository.deleteRenovationRoom(room.id);
            this.rooms.update(prev => prev.filter((_, i) => i !== index));
        }
    }

    async updateRoom(index: number, field: keyof RenovationRoom, value: any) {
        const room = { ...this.rooms()[index] };

        if (field === 'area' || field === 'actual_spend' || field === 'budget_estimate') {
            (room as any)[field] = parseFloat(value) || 0;
        } else if (field === 'type' && typeof value === 'string') {
            room.type = value;
        } else if (field === 'finish_level' && (value === 'Standard' || value === 'Premium' || value === 'Luxury')) {
            room.finish_level = value;
        }

        if (field === 'area' || field === 'finish_level') {
            let rate = 400;
            if (room.finish_level === 'Premium') rate = 800;
            if (room.finish_level === 'Luxury') rate = 1200;
            room.budget_estimate = (room.area || 0) * rate;
        }

        this.rooms.update(prev => {
            const next = [...prev];
            next[index] = room;
            return next;
        });

        await this.repository.upsertRenovationRoom(room);
    }

    async triggerAudit() {
        if (this.rooms().length === 0) return;

        const firstRoom = this.rooms()[0];
        this.auditResult.set(false);
        this.auditData.set({ auditing: true });

        try {
            const audit = await this.gemini.auditRenovationQuote(
                firstRoom.type,
                firstRoom.area || 0,
                firstRoom.budget_estimate || 0,
                firstRoom.finish_level || 'Standard'
            );
            this.auditData.set(audit);
            this.auditResult.set(true);
        } catch (error) {
            console.error('Audit failed', error);
            this.auditData.set(null);
            this.auditResult.set(false);
        }
    }
}

import { Component, input, computed, inject, signal, OnInit, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { GeminiService } from '../../../../services/gemini.service';
import { TaxService } from '../../../../services/tax.service';
import { HostRepository } from '../../../../services/host-repository.service';
import { FeatureGatingComponent } from '../../../components/feature-gating.component';

@Component({
    selector: 'fin-01-roi-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule,
        TranslatePipe, FeatureGatingComponent
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
       <!-- Header -->
       <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'ROI.RoiCashflowArchitect' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'ROI.ProfessionalFinancialModelingEngineWith' | translate }}</p>
          

        </div>
         <div class="flex flex-col items-end gap-2">
             <div class="flex gap-2">
                 <button (click)="saveSimulation()" [disabled]="!canSaveMore() || isSaving()"
                         class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                     <span class="material-icons text-sm">{{ isSaving() ? 'hourglass_empty' : 'save' }}</span>
                     {{ (isSaving() ? 'COMMON.Saving' : 'COMMON.Save') | translate }}
                 </button>
             <div class="flex gap-2 relative">
                 <!-- Backdrop for closing dropdown -->
                 @if (simDropdownOpen()) {
                     <div class="fixed inset-0 z-40 cursor-default" (click)="simDropdownOpen.set(false)"></div>
                 }

                 <!-- Simulation Selection Dropdown -->
                 <div class="relative z-50">
                    <button (click)="toggleSimDropdown()" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-400 font-mono flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer active:scale-95">
                        <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="canSaveMore()" [class.bg-rose-500]="!canSaveMore()"></span>
                        {{ savedSimulations().length }} / {{ simulationLimit() === Infinity ? '∞' : simulationLimit() }} {{ 'ROI.Simulations' | translate }}
                        <span class="material-icons text-[14px] text-slate-500 transition-transform duration-300" [class.rotate-180]="simDropdownOpen()">expand_more</span>
                    </button>
                    <!-- Dropdown Menu -->
                    @if (simDropdownOpen()) {
                        <div class="absolute right-0 top-full mt-2 w-72 bg-[#1a1c23] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up origin-top-right">
                            @if (savedSimulations().length === 0) {
                                <div class="p-4 text-center">
                                    <span class="text-[10px] text-slate-500 italic">No saved simulations</span>
                                </div>
                            } @else {
                                <div class="max-h-80 overflow-y-auto custom-scrollbar">
                                    @for (sim of savedSimulations(); track sim.id) {
                                        <button (click)="loadSimulation(sim)" class="w-full text-left p-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex justify-between items-center group/item transition-colors">
                                            <div class="max-w-[70%]">
                                                <p class="text-[11px] font-bold text-slate-300 group-hover/item:text-white truncate" [title]="sim.name">{{ sim.name }}</p>
                                                <p class="text-[9px] text-slate-500 font-mono">{{ sim.createdAt | date:'shortDate' }}</p>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded border border-indigo-500/20 whitespace-nowrap">{{ sim.results.netCashflow | currency:'EUR':'symbol':'1.0-0' }}</span>
                                                <div (click)="$event.stopPropagation(); deleteSimulation(sim.id)" class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-rose-500/20 text-slate-600 hover:text-rose-500 transition-colors">
                                                    <span class="material-icons text-[12px]">delete</span>
                                                </div>
                                            </div>
                                        </button>
                                    }
                                </div>
                            }
                        </div>
                    }
                 </div>
             </div>
         </div>
         <div class="flex gap-2">
                 <div class="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-[10px] font-mono flex items-center gap-2">
                    <span>💰</span>{{ 'ROI.Cashflow' | translate }}</div>
                 <div class="px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-[10px] font-mono flex items-center gap-2">
                    <span>📈</span> {{ 'ROI.10yForecast' | translate }}
                </div>
             </div>
         </div>
      </div>

       <!-- Coach Tip -->
      <div class="p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
           <div class="flex items-center gap-2 mb-1">
               <span class="text-lg">💡</span>
               <span class="text-indigo-300 font-bold text-sm uppercase">{{ 'ROI.CoachTip' | translate }}</span>
           </div>
           <p class="text-slate-300 text-xs italic">
               "{{ 'ROI.CoachTipText' | translate }}"
           </p>
       </div>

      <div class="flex flex-col gap-8 h-full overflow-y-auto pr-1 pb-20">
        <!-- Main Content Area: 2 Columns for Inputs -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Section 0: Property Profiler (Subtle Gating) -->
            <saas-feature-gating featureId="FIN_01_PROPERTY_PROFILER">
                <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 animate-fade-in-up">
                    <button (click)="toggleProfiler()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                        <div class="flex items-center gap-3">
                            <div>
                                <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.PropertyProfiler' | translate }}</h3>
                                <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">{{ 'ROI.LocalizationCharacteristics' | translate }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            @if (propertyProfilerExpanded()) {
                                <span class="material-icons text-slate-500 transition-transform duration-300">expand_less</span>
                            } @else {
                                <span class="material-icons text-slate-500 transition-transform duration-300">expand_more</span>
                            }
                        </div>
                    </button>

                    <div class="p-5 pt-0 animate-fade-in" [class.hidden]="!propertyProfilerExpanded()">
                        <form [formGroup]="form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Host Residence Country</label>
                                    <input type="text" formControlName="hostCountry" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-bold" placeholder="Where you live">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Property Country</label>
                                    <input type="text" formControlName="propertyCountry" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-bold" placeholder="Property location">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Property Type</label>
                                    <select formControlName="propertyType" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-bold appearance-none">
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Total Surface (m²)</label>
                                    <input type="number" formControlName="totalSize" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-mono">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Rooms</label>
                                    <input type="number" formControlName="rooms" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-mono">
                                </div>
                                <div [class.opacity-30]="form.get('propertyType')?.value === 'Apartment'" [class.pointer-events-none]="form.get('propertyType')?.value === 'Apartment'">
                                    <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Garden size (m²)</label>
                                    <input type="number" formControlName="gardenSize" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-mono">
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" formControlName="hasPool" class="w-4 h-4 rounded bg-black/40 border-white/10 text-indigo-500 focus:ring-indigo-500/50">
                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Swimming Pool</span>
                                </label>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">Additional Details</label>
                                <textarea formControlName="additionalDetails" rows="2" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs font-medium resize-none" placeholder="Provide more details to enhance AI estimation..."></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </saas-feature-gating>

                <!-- Section 1: Financial Design -->
                <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 h-fit">
                        <button (click)="toggleDesign()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div>
                                    <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.FinancialDesign' | translate }}</h3>
                                    <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">{{ 'ROI.CoreInvestmentMetrics' | translate }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                @if (isTier3()) {
                                    <button (click)="$event.stopPropagation(); autoFill()" [disabled]="isAiLoading() || !isTier3()" 
                                            class="text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors flex items-center gap-1 disabled:opacity-50">
                                        <span>{{ isAiLoading() ? '...' : '✨' }}</span>
                                        {{ isAiLoading() ? '...' : ('ROI.AiEstimate' | translate) }}
                                    </button>
                                }
                                @if (designExpanded()) {
                                    <span class="material-icons text-slate-500 transition-transform duration-300">expand_less</span>
                                } @else {
                                    <span class="material-icons text-slate-500 transition-transform duration-300">expand_more</span>
                                }
                            </div>
                        </button>

                        <div class="p-5 pt-0 animate-fade-in" [class.hidden]="!designExpanded()">
                            <form [formGroup]="form" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.Price' | translate }}</label>
                                <div class="relative group/input">
                                    <input type="number" formControlName="price" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono" data-debug-id="roi-input-price">
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase">€</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.AvgNightlyRate' | translate }}</label>
                                <div class="relative group/input">
                                    <input type="number" formControlName="rent" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono" data-debug-id="roi-input-rent">
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase">€</span>
                                </div>
                            </div>
                        </div>
                        
                        @if (isTier0()) {
                            <div class="mt-4 pt-4 border-t border-white/5">
                                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.Loan' | translate }} / Mo</label>
                                <div class="relative group/input">
                                    <input type="number" formControlName="loan" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono">
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase">€</span>
                                </div>
                            </div>
                        }

                        <!-- Bronze+ Loan Calculator -->
                        @if (isTier1OrAbove()) {
                            <div class="mt-4 pt-4 border-t border-white/5 space-y-4">
                                <h4 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-1">{{ 'ROI.LoanCalculator' | translate }}</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.DownPayment' | translate }}</label>
                                        <div class="relative group/input">
                                            <input type="number" formControlName="downPayment" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono">
                                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase">€</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.InterestRate' | translate }}</label>
                                        <div class="relative group/input">
                                            <input type="number" formControlName="interestRate" step="0.1" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono">
                                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest pl-1">{{ 'ROI.LoanYears' | translate }}</label>
                                        <div class="relative group/input">
                                            <input type="number" formControlName="loanYears" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono">
                                        </div>
                                    </div>
                                    <div class="flex flex-col justify-end">
                                        <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
                                            <p class="text-[9px] text-indigo-300 uppercase font-black tracking-tighter">{{ 'ROI.Loan' | translate }} / Mo</p>
                                            <p class="text-white font-mono font-bold text-sm">{{ calculatedMonthlyLoan() | currency:'EUR':'symbol':'1.0-0' }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Silver+ Interest Breakdown Visualization -->
                                @if (isTier2OrAbove()) {
                                    <div class="mt-4 bg-black/20 rounded-xl p-3 border border-white/5">
                                        <div class="flex justify-between items-center mb-2">
                                            <h5 class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.InterestBreakdown' | translate }}</h5>
                                            <span class="text-[9px] text-slate-400 font-mono">{{ loanBreakdown().totalPaid | currency:'EUR':'symbol':'1.0-0' }} Total</span>
                                        </div>
                                        <!-- Graph Removed -->
                                        <div class="flex gap-4 mt-2">
                                            <div class="flex items-center gap-1.5">
                                                <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                <span class="text-[8px] text-slate-400 uppercase font-bold">{{ 'ROI.Principal' | translate }} ({{ loanBreakdown().principalPercent.toFixed(0) }}%)</span>
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                                <div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                <span class="text-[8px] text-slate-400 uppercase font-bold">{{ 'ROI.Interest' | translate }} ({{ loanBreakdown().interestPercent.toFixed(0) }}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </form>
                </div>
            </div>
            <!-- Section 2: Monthly Expenses -->
           <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
                <button (click)="toggleExpenses()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div>
                            <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.MonthlyExpenses' | translate }}</h3>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Fixed & Variable Costs</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-xs text-rose-400 font-mono bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">{{ totalExpenses() | currency:'EUR':'symbol':'1.0-0' }}/mo</span>
                        @if (expensesExpanded()) {
                            <span class="material-icons text-slate-500 transition-transform duration-300">expand_less</span>
                        } @else {
                            <span class="material-icons text-slate-500 transition-transform duration-300">expand_more</span>
                        }
                    </div>
                </button>

                <div class="p-5 pt-0 animate-fade-in" [class.hidden]="!expensesExpanded()">
                    <saas-feature-gating featureId="FIN_01_DETAILED_EXPENSES">
                        <form [formGroup]="form" class="space-y-3">
                             <!-- Advanced Expenses for Bronze+ -->
                             <div class="grid grid-cols-2 gap-3">
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Billshoa' | translate }}</label>
                                        <input type="number" formControlName="condo" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Insurance' | translate }}</label>
                                        <input type="number" formControlName="insurance" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Wifi' | translate }}</label>
                                        <input type="number" formControlName="wifi" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Electricity' | translate }}</label>
                                        <input type="number" formControlName="electricity" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Water' | translate }}</label>
                                        <input type="number" formControlName="water" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                                <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div class="flex-1">
                                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Other' | translate }}</label>
                                        <input type="number" formControlName="other" class="w-full bg-transparent border-none p-0 text-white text-xs font-bold outline-none" placeholder="0">
                                    </div>
                                    <span class="text-slate-600 font-bold text-[10px]">€</span>
                                </div>
                             </div>
                        </form>
                    </saas-feature-gating>
                </div>
           </div>

           <!-- Section 3: Seasonality Logic -->
           <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
                <button (click)="toggleSeasonality()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div>
                            <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.SeasonalityLogic' | translate }}</h3>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">{{ 'ROI.DemandDynamicPricing' | translate }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        @if (seasonalityExpanded()) {
                            <span class="material-icons text-slate-500 transition-transform duration-300">expand_less</span>
                        } @else {
                            <span class="material-icons text-slate-500 transition-transform duration-300">expand_more</span>
                        }
                    </div>
                </button>

                <div class="p-5 pt-0 animate-fade-in" [class.hidden]="!seasonalityExpanded()">
                    <div class="space-y-6">
                        <div class="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                            <div class="flex items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Occupancy' | translate }}</span>
                                        <span class="text-xs text-white font-mono font-bold">{{ baseOccupancy() }}%</span>
                                    </div>
                                    <input type="range" class="w-full h-1 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50" 
                                           min="0" max="100" [value]="baseOccupancy()" (input)="updateBaseOccupancy($event)" [disabled]="isTier0()"> 
                                    @if (isTier0()) {
                                        <p class="text-[9px] text-amber-400 mt-1 uppercase font-bold tracking-tighter">{{ 'ROI.FixedOccupancyFreemium' | translate }}</p>
                                    }
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Price' | translate }}</span>
                                        <span class="text-xs text-white font-mono font-bold">{{ basePrice() }}€</span>
                                    </div>
                                    <input type="range" class="w-full h-1 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                           min="0" max="1000" [value]="basePrice()" (input)="updateBasePrice($event)"> 
                                </div>
                            </div>
                        </div>

                        <!-- Formal Seasonality Table (Subtle Gating) -->
                        <div class="bg-black/60 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group/table-container">
                             <saas-feature-gating featureId="FIN_01_SEASONALITY_TABLE">
                                <div class="overflow-x-auto p-4">
                                    <table class="w-full min-w-[850px] border-collapse">
                                        <thead>
                                            <tr>
                                                <th class="w-24 text-left pb-3">
                                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Month</span>
                                                </th>
                                                @for (m of months; track m; let i = $index) {
                                                    <th class="pb-3 px-1">
                                                        <div class="flex flex-col items-center">
                                                            <span class="text-[10px] font-black text-white uppercase tracking-widest">{{m}}</span>
                                                        </div>
                                                    </th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Prop: Occupancy -->
                                            <tr class="group/row">
                                                <td class="py-2 border-t border-white/5">
                                                    <div class="flex items-center gap-1.5 pl-1">
                                                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                        <span class="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Occ %</span>
                                                    </div>
                                                </td>
                                                @for (m of months; track m; let i = $index) {
                                                    <td class="py-2 px-1 border-t border-white/5">
                                                        <input type="number" 
                                                               [value]="(seasonalityFactors()[i] * baseOccupancy()) | number:'1.0-0'" 
                                                               (input)="updateMonthlyOccupancy(i, $event)"
                                                               class="w-full bg-white/5 border border-white/10 rounded px-1 py-1.5 text-[11px] text-white text-center font-bold focus:border-emerald-500/50 focus:bg-emerald-500/10 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                               min="0" max="150">
                                                    </td>
                                                }
                                            </tr>
                                            <!-- Prop: Nightly Rate -->
                                            <tr class="group/row">
                                                <td class="py-2 border-t border-white/5">
                                                    <div class="flex items-center gap-1.5 pl-1">
                                                        <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                        <span class="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Price €</span>
                                                    </div>
                                                </td>
                                                @for (m of months; track m; let i = $index) {
                                                    <td class="py-2 px-1 border-t border-white/5">
                                                        <input type="number" 
                                                               [value]="(priceFactors()[i] * (formValues()?.rent || 0)) | number:'1.0-0'" 
                                                               (input)="updateMonthlyPrice(i, $event)"
                                                               class="w-full bg-white/5 border border-white/10 rounded px-1 py-1.5 text-[11px] text-white text-center font-bold focus:border-indigo-500/50 focus:bg-indigo-500/10 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                               min="0" max="5000">
                                                    </td>
                                                }
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                             </saas-feature-gating>
                        </div>
                    </div>
                </div>
           </div>
        </div>
 

 
        <!-- Results & Visuals -->
        <div class="flex flex-col gap-8 pt-8 border-t border-white/10">
             <!-- Top: Cashflow Waterfall -->
             <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden">
                 <div class="flex items-center justify-between relative z-10">
                    <div>
                        <p class="text-xs text-slate-400 uppercase tracking-widest mb-1">{{ 'ROI.NetAnnualCashflow' | translate }}</p>
                        <h2 class="text-4xl font-black text-white" [class.text-rose-400]="netCashflow() < 0" [class.text-emerald-400]="netCashflow() > 0">
                            {{ netCashflow() | currency:'EUR':'symbol':'1.0-0' }}
                        </h2>
                        <p class="text-xs mt-1" [class.text-rose-400]="netCashflow() < 0" [class.text-slate-500]="netCashflow() >= 0">
                            {{ netCashflow() < 0 ? 'Negative Carry Warning' : 'Positive Leverage' }}
                        </p>
                    </div>
                    <div class="h-16 w-16 rounded-full border-4 flex items-center justify-center text-xs font-bold bg-slate-800"
                        [class.border-rose-500]="netCashflow() < 0" [class.border-emerald-500]="netCashflow() > 0"
                        [class.text-rose-400]="netCashflow() < 0" [class.text-emerald-400]="netCashflow() > 0">
                        {{ (netCashflow() / (formValues()?.price || 1)) * 100 | number:'1.1-1' }}%
                    </div>
                 </div>


                 <!-- Tier 2+: Simplified P&L -->
                 @if (isTier2OrAbove() && pnlBreakdown(); as pnl) {
                    <div class="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                        <h4 class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Simplified P&L</h4>
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between text-slate-300">
                                <span>Gross Revenue</span>
                                <span class="font-mono">{{ pnl.grossRevenue | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                            <div class="flex justify-between text-rose-300/80">
                                <span>Operating Expenses</span>
                                <span class="font-mono">-{{ pnl.annualOpEx | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                            <div class="flex justify-between text-white font-bold pt-1 border-t border-white/5">
                                <span>NOI <span class="text-[9px] font-normal text-slate-500">(Net Operating Income)</span></span>
                                <span class="font-mono">{{ pnl.noi | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                            <div class="flex justify-between text-slate-400">
                                <span>Debt Service</span>
                                <span class="font-mono">-{{ pnl.annualDebtService | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                            
                            <!-- Tier 3: Tax Line -->
                            @if (isTier3() && pnl.estimatedTax > 0) {
                                <div class="flex justify-between text-rose-400 font-medium">
                                    <span>Estimated Tax</span>
                                    <span class="font-mono">-{{ pnl.estimatedTax | currency:'EUR':'symbol':'1.0-0' }}</span>
                                </div>
                            }

                            <div class="flex justify-between text-emerald-400 font-black pt-2 border-t border-white/10 mt-1">
                                <span>Net Cashflow</span>
                                <span class="font-mono">{{ pnl.cashflow | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tier 2+: 10-Year P&L Projection Graph -->
                    @if (pnlProjection(); as projection) {
                            <!-- 10-Year P&L Table (Graph Removed) -->
                            <div class="mt-6 pt-4 border-t border-white/10">
                                <h4 class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">10-Year P&L Evolution</h4>
                            
                            <!-- Detailed P&L Table (Aligned with Graph) -->
                            <div class="mt-4 pt-4 border-t border-white/5 overflow-x-auto">
                                <div class="min-w-[300px]">
                                    <!-- Header: Years -->
                                    <div class="flex gap-1 mb-1">
                                        <div class="w-16 shrink-0"></div> <!-- Row Label Column -->
                                        @for (year of projection; track year.year) {
                                            <div class="flex-1 text-center text-[9px] text-slate-500 font-bold uppercase">Y{{year.year}}</div>
                                        }
                                    </div>
                                    
                                    <!-- Row: Revenue -->
                                    <div class="flex gap-1 mb-1 items-center hover:bg-white/5 rounded px-0.5 py-1 transition-colors">
                                        <div class="w-16 shrink-0 text-[9px] font-bold text-slate-400 uppercase tracking-tight">Rev</div>
                                        @for (year of projection; track year.year) {
                                            <div class="flex-1 text-center text-[9px] font-mono text-emerald-400/80">{{ year.revenue | number:'1.0-0' }}</div>
                                        }
                                    </div>

                                    <!-- Row: OpEx -->
                                    <div class="flex gap-1 mb-1 items-center hover:bg-white/5 rounded px-0.5 py-1 transition-colors">
                                        <div class="w-16 shrink-0 text-[9px] font-bold text-slate-400 uppercase tracking-tight">OpEx</div>
                                        @for (year of projection; track year.year) {
                                            <div class="flex-1 text-center text-[9px] font-mono text-rose-400/60">-{{ year.expenses | number:'1.0-0' }}</div>
                                        }
                                    </div>

                                    <!-- Row: Loan -->
                                    <div class="flex gap-1 mb-1 items-center hover:bg-white/5 rounded px-0.5 py-1 transition-colors">
                                        <div class="w-16 shrink-0 text-[9px] font-bold text-slate-400 uppercase tracking-tight">Loan</div>
                                        @for (year of projection; track year.year) {
                                            <div class="flex-1 text-center text-[9px] font-mono text-rose-400/60">-{{ year.loanService | number:'1.0-0' }}</div>
                                        }
                                    </div>

                                    <!-- Row: Tax -->
                                    @if (isTier3()) {
                                        <div class="flex gap-1 mb-1 items-center hover:bg-white/5 rounded px-0.5 py-1 transition-colors">
                                            <div class="w-16 shrink-0 text-[9px] font-bold text-slate-400 uppercase tracking-tight">Tax</div>
                                            @for (year of projection; track year.year) {
                                                <div class="flex-1 text-center text-[9px] font-mono text-rose-400/80">-{{ year.tax | number:'1.0-0' }}</div>
                                            }
                                        </div>
                                    }

                                    <!-- Row: Cashflow -->
                                    <div class="flex gap-1 mt-1 pt-1 border-t border-white/5 items-center bg-emerald-500/10 rounded px-0.5 py-1">
                                        <div class="w-16 shrink-0 text-[9px] font-bold text-emerald-400 uppercase tracking-tight">Cash</div>
                                        @for (year of projection; track year.year) {
                                            <div class="flex-1 text-center text-[9px] font-mono font-bold text-emerald-400">{{ year.cashflow | number:'1.0-0' }}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                 }
                 
                 <!-- Tier 3: Tax Briefing Block -->
                 @if (isTier3() && taxData()) {
                     <div class="mt-2 pt-4 border-t border-white/5 flex items-center justify-between animate-fade-in">
                        <div>
                            <p class="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
                                {{ taxData().authority }} Estimate ({{ taxData().regime }})
                            </p>
                            <div class="text-sm font-bold text-rose-300">
                                -{{ taxData().estimatedTax | currency:'EUR':'symbol':'1.0-0' }} 
                                <span class="text-xs font-normal text-slate-400">@ {{ taxData().effectiveRate | number:'1.0-1' }}%</span>
                            </div>
                        </div>
                        <div class="text-xs text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5">
                            Compliant
                        </div>
                     </div>
                 }
             </div>




        <saas-feature-gating featureId="FIN_01_AI_REPORT">
            <div class="mb-4">
                <button (click)="generateReport()" [disabled]="isReportLoading()" class="w-full relative group overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10">
                    <div class="relative z-10 flex flex-col items-center text-center">
                        @if (isReportLoading()) {
                            <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h3 class="text-sm font-black text-slate-200 uppercase tracking-wider mb-2">Simulating Scenarios...</h3>
                            <p class="text-xs text-slate-500 max-w-xs">Our AI is crunching the numbers and analyzing local market risks for your report.</p>
                        } @else {
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-file-invoice-dollar text-xl"></i>
                            </div>
                            <h3 class="text-sm font-black text-slate-200 uppercase tracking-wider mb-2">Generate Final AI Report</h3>
                            <p class="text-xs text-slate-500 max-w-xs">Get a professional 360° diagnostic including market sentiment and risk profiling.</p>
                        }
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
 
                @if (aiReport()) {
                    <div class="mt-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-fade-in-up">
                        <div class="p-6 border-b border-white/5 bg-gradient-to-r from-amber-500/5 to-transparent flex justify-between items-center">
                            <div>
                                <h3 class="text-xs font-black text-slate-200 uppercase tracking-widest">{{ 'ROI.InvestmentDiagnostic' | translate }}</h3>
                                <p class="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{{ 'ROI.ScenarioRiskAnalysis' | translate }} (Phase 5 Analytics)</p>
                            </div>
                            <button (click)="resetReport()" class="text-slate-500 hover:text-white transition-colors">
                                <span class="material-icons text-sm">close</span>
                            </button>
                        </div>
                        
                        <div class="p-6 space-y-8">
                             <!-- Grid Summary Diagnostic -->
                             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- Strength Score -->
                                <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                    <div class="relative w-16 h-16 flex items-center justify-center mb-2">
                                        <svg class="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" class="text-white/5"/>
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="4" fill="transparent" 
                                                    class="text-emerald-500"
                                                    [attr.stroke-dasharray]="175.9"
                                                    [attr.stroke-dashoffset]="175.9 * (1 - (aiReport()?.global_score || 0) / 100)"/>
                                        </svg>
                                        <span class="absolute text-lg font-black text-white">{{ aiReport()?.global_score }}</span>
                                    </div>
                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Score</span>
                                </div>
                                <!-- Risk Level -->
                                <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                    <div class="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-2">
                                        <i class="fa-solid fa-triangle-exclamation text-lg"></i>
                                    </div>
                                    <span class="text-xs font-black text-white uppercase tracking-tighter">{{ aiReport()?.risk_level }}</span>
                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Profile</span>
                                </div>
                                <!-- Market Sentiment -->
                                <div class="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                                    <div class="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                                        <i class="fa-solid fa-chart-line text-lg"></i>
                                    </div>
                                    <span class="text-xs font-black text-white uppercase tracking-tighter">{{ aiReport()?.market_sentiment }}</span>
                                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sentiment</span>
                                </div>
                             </div>
 
                             <!-- Insights -->
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-3">
                                    <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Bullish Drivers
                                    </h4>
                                    <ul class="space-y-2">
                                        @for (point of aiReport()?.strengths; track point) {
                                            <li class="flex items-start gap-2 group/li">
                                                <span class="material-icons text-emerald-500 text-[14px] mt-0.5 group-hover/li:scale-125 transition-transform">check_circle</span>
                                                <p class="text-xs text-slate-300 leading-relaxed">{{ point }}</p>
                                            </li>
                                        }
                                    </ul>
                                </div>
 
                                <div class="space-y-3">
                                    <h4 class="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        Risk Factors
                                    </h4>
                                    <ul class="space-y-2">
                                        @for (point of aiReport()?.opportunities; track point) {
                                            <li class="flex items-start gap-2 group/li">
                                                <span class="material-icons text-rose-500 text-[14px] mt-0.5 group-hover/li:scale-125 transition-transform">warning</span>
                                                <p class="text-xs text-slate-300 leading-relaxed">{{ point }}</p>
                                            </li>
                                        }
                                    </ul>
                                </div>
                             </div>
 
                             <!-- Recommended Strategy -->
                             <div class="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20 mt-4">
                                <h4 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Strategic Verdict</h4>
                                <p class="text-sm text-slate-200 font-medium leading-relaxed italic">
                                    "{{ aiReport()?.comprehensive_verdict }}"
                                </p>
                             </div>
                        </div>
                    </div>
                }
            </div>
        </saas-feature-gating>
        </div>
      </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class RoiSimulatorComponent {
    protected readonly Infinity = Infinity;
    feature = input.required<Feature>();
    propertyDetails = input<any>();
    session = inject(SessionStore);
    gemini = inject(GeminiService);
    taxService = inject(TaxService);
    hostRepo = inject(HostRepository);
    translation = inject(TranslationService);

    // Collapsible Sections State
    propertyProfilerExpanded = signal(true);
    taxBriefingExpanded = signal(false);
    designExpanded = signal(true);
    expensesExpanded = signal(true);
    seasonalityExpanded = signal(true);

    taxBriefing = signal<string | null>(null);
    isTaxLoading = signal(false);

    aiReport = signal<any>(null);
    isReportLoading = signal(false);
    reportExpanded = signal(false);

    toggleProfiler() { this.propertyProfilerExpanded.set(!this.propertyProfilerExpanded()); }
    toggleReport() { this.reportExpanded.set(!this.reportExpanded()); }
    toggleDesign() { this.designExpanded.set(!this.designExpanded()); }
    toggleExpenses() { this.expensesExpanded.set(!this.expensesExpanded()); }
    toggleSeasonality() { this.seasonalityExpanded.set(!this.seasonalityExpanded()); }

    async generateReport() {
        console.log('[RoiSimulator] Generating Report...');
        // if (!this.isTier3()) return; // Removed redundant check, relying on template gating

        this.isReportLoading.set(true);
        this.reportExpanded.set(true);

        const reportData = {
            formValues: this.form.value,
            diagnostics: this.generateDiagnostic(),
            netCashflow: this.netCashflow(),
            breakdown: this.loanBreakdown(),
            baseOccupancy: this.baseOccupancy(),
            address: this.propertyDetails()?.address || 'Unknown',
            taxBriefing: this.taxBriefing()
        };

        try {
            const report = await this.gemini.generateFinalRoiReport(reportData);
            this.aiReport.set(report);
        } catch (error) {
            console.error('Failed to generate ROI report', error);
        } finally {
            this.isReportLoading.set(false);
        }
    }

    async getTaxBriefing() {
        if (!this.form.value.hostCountry || !this.form.value.propertyCountry) return;
        this.isTaxLoading.set(true);
        try {
            const brief = await this.gemini.generateTaxBriefing(
                this.form.value.hostCountry,
                this.form.value.propertyCountry
            );
            this.taxBriefing.set(brief);
        } catch (error) {
            console.error('Failed to get tax briefing', error);
        } finally {
            this.isTaxLoading.set(false);
        }
    }

    tier = computed(() => this.session.userProfile()?.plan || 'TIER_0');

    // Rank-based logic using SessionStore central source of truth
    userRank = computed(() => this.session.getTierRank(this.tier()));

    isTier0 = computed(() => this.userRank() === 0);
    isTier1 = computed(() => this.userRank() === 1);
    isTier1OrAbove = computed(() => this.userRank() >= 1);
    isTier2OrAbove = computed(() => this.userRank() >= 2);
    isTier3 = computed(() => this.userRank() >= 3);

    tierName = computed(() => {
        return this.translation.translate(this.session.getTierTranslationKey(this.tier()));
    });

    propertyAddress = computed(() => this.propertyDetails()?.address || 'Generic Model');
    propertyType = computed(() => this.propertyDetails()?.type || 'Investment Property');

    form: FormGroup;
    formValues;

    // AI & Tax Signals
    isAiLoading = signal(false);
    aiSummary = signal('');
    taxData = signal<any>(null);
    savedSimulations = signal<any[]>([]);
    isSaving = signal(false);



    simulationLimit = computed(() => {
        const t = this.tier();
        if (this.isTier0()) return 1;
        if (this.isTier1()) return 5;
        if (this.isTier2OrAbove() && !this.isTier3()) return 20;
        return Infinity;
    });

    canSaveMore = computed(() => this.savedSimulations().length < this.simulationLimit());

    // Seasonality Engine
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    baseOccupancy = signal(65);
    basePrice = computed(() => this.formValues()?.rent || 0);
    seasonalityFactors = signal([0.4, 0.5, 0.7, 0.8, 0.9, 1.0, 1.2, 1.3, 0.9, 0.7, 0.5, 0.8]);
    priceFactors = signal([1.0, 1.0, 1.0, 1.0, 1.2, 1.5, 1.8, 2.0, 1.2, 1.0, 0.9, 1.5]);

    simDropdownOpen = signal(false);
    toggleSimDropdown() { this.simDropdownOpen.set(!this.simDropdownOpen()); }

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            price: [250000, Validators.required],
            rent: [150, Validators.required],
            loan: [900, Validators.required],
            condo: [120],
            insurance: [30],
            // Loan Calculator (Bronze+)
            downPayment: [50000],
            loanYears: [20],
            interestRate: [3.5],
            // Advanced Expenses (Bronze+)
            wifi: [30],
            electricity: [60],
            water: [20],
            gas: [0],
            other: [0],
            // Tier 3 Property Profiler
            hostCountry: ['France'],
            propertyCountry: ['France'],
            propertyType: ['Apartment'], // 'Apartment' or 'House'
            rooms: [2],
            totalSize: [80], // m²
            gardenSize: [0],
            hasPool: [false],
            additionalDetails: ['']
        });
        this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

        // Automatic Taxation Briefing Effect
        effect(() => {
            const hc = this.formValues()?.hostCountry;
            const pc = this.formValues()?.propertyCountry;
            if (this.isTier3() && hc && pc && hc.length > 2 && pc.length > 2) {
                untracked(() => {
                    this.getTaxBriefing();
                });
            }
        });

        // Force Freemium 65% occupancy
        effect(() => {
            if (this.isTier0()) {
                untracked(() => {
                    this.baseOccupancy.set(65);
                    // Also reset factors for Freemium if needed, but slider is probably enough
                });
            }
        });

        // Tax & Wealth effect
        effect(() => {
            const pnl = this.pnlBreakdown(); // This relies on formValues() implicitly

            if (this.isTier3()) {
                untracked(() => {
                    // Need access to raw revenue, can't fully rely on pnlBreakdown if it returns null when not tier 3 (circular logic prevented by if check)
                    // But pnlBreakdown is computed.
                    // Let's recalculate simple gross here or rely on P&L being available for Tier 3.
                    // BETTER: Simply re-read the P&L signal which should be active for Tier 3.

                    if (pnl) {
                        this.updateTaxForecast(pnl.grossRevenue, pnl.annualOpEx);
                    } else {
                        // Fallback if pnl not ready (shouldn't happen for Tier 3)
                        const flow = this.netCashflow(); // Old buggy way as fallback? No, let's wait for P&L.
                    }
                });
            }
        });

        this.loadSimulations();
    }

    async loadSimulations() {
        try {
            const sims = await this.hostRepo.getSimulations();
            this.savedSimulations.set(sims);
        } catch (e) {
            console.error('Failed to load simulations', e);
        }
    }

    loadSimulation(sim: any) {
        if (!sim || !sim.inputs) return;
        console.log('[RoiSimulator] Loading simulation:', sim.name);

        // Patch form with saved inputs
        this.form.patchValue(sim.inputs, { emitEvent: true });
        this.simDropdownOpen.set(false); // Close dropdown after selection

        // If seasonality data was saved, restore it (assuming generic input structure for now)
        // If inputs contained specific arrays not in main form, handle here.
        // For now, we assume simple inputs restoration triggers the main calcs.
        // User asked to "Review but not change". The save button will save a NEW entry.
    }

    async saveSimulation() {
        if (!this.canSaveMore() || this.isSaving()) return;

        this.isSaving.set(true);
        try {
            const name = `Simulation ${this.savedSimulations().length + 1}`;
            const inputs = this.form.value;
            const results = {
                netCashflow: this.netCashflow(),
                totalExpenses: this.totalExpenses()
            };

            await this.hostRepo.saveSimulation(name, inputs, results);
            await this.loadSimulations();
        } catch (e) {
            console.error('Failed to save simulation', e);
        } finally {
            this.isSaving.set(false);
        }
    }

    async deleteSimulation(id: string) {
        try {
            await this.hostRepo.deleteSimulation(id);
            await this.loadSimulations();
        } catch (e) {
            console.error('Failed to delete simulation', e);
        }
    }

    updateBaseOccupancy(event: Event) {
        if (this.isTier0()) return;
        const val = (event.target as HTMLInputElement).value;
        this.baseOccupancy.set(parseInt(val, 10));
    }

    updateBasePrice(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.form.patchValue({ rent: parseInt(val, 10) }, { emitEvent: true });
    }

    adjustSeasonality(index: number) {
        if (!this.isTier2OrAbove()) return;
        const factors = [...this.seasonalityFactors()];
        factors[index] = (factors[index] + 0.1 > 1.5) ? 0.3 : factors[index] + 0.1;
        this.seasonalityFactors.set(factors);
    }

    updateMonthlyOccupancy(index: number, event: Event) {
        const newVal = parseInt((event.target as HTMLInputElement).value, 10);
        if (isNaN(newVal)) return;
        if (!this.isTier2OrAbove()) return;

        const currentBase = this.baseOccupancy();
        const actualOccs = this.seasonalityFactors().map(f => f * currentBase);
        actualOccs[index] = newVal;

        const newAverage = actualOccs.reduce((a, b) => a + b, 0) / 12;
        this.baseOccupancy.set(Math.round(newAverage));

        const newFactors = actualOccs.map(o => newAverage > 0 ? o / newAverage : 1);
        this.seasonalityFactors.set(newFactors);
    }

    updateMonthlyPrice(index: number, event: Event) {
        const newVal = parseInt((event.target as HTMLInputElement).value, 10);
        if (isNaN(newVal)) return;
        if (!this.isTier2OrAbove()) return;

        const currentBase = this.formValues()?.rent || 0;
        const actualPrices = this.priceFactors().map(f => f * currentBase);
        actualPrices[index] = newVal;

        const newAverage = actualPrices.reduce((a, b) => a + b, 0) / 12;
        this.form.patchValue({ rent: Math.round(newAverage) }, { emitEvent: true });

        const newFactors = actualPrices.map(p => newAverage > 0 ? p / newAverage : 1);
        this.priceFactors.set(newFactors);
    }

    // Internal Calculation: Variable Expenses correlate with Occupancy
    // High occupancy = More usage (Water/Electricity) = Higher Factor
    expenseFactors = computed(() => {
        const occFactors = this.seasonalityFactors();
        // Baseline: 1.0 factor at 1.0 (100% relative) occupancy? 
        // Or simpler: Factor = 0.5 + (0.5 * occupancyFactor)
        // If occFactor is 1.2 (Peak), Expense Factor = 1.1?
        // Let's assume expenses track occupancy but heavily damped (fixed costs exist elsewhere).
        // Actually, this 'factor' applies to VARIABLE costs only (elec/water) in the calculation.
        // So it should track occupancy almost linearly.
        return occFactors.map(f => {
            // f is around 0.4 to 1.3 usually.
            // If occupancy is 0 (f=0), visible expense should be low (standby mode), maybe 0.3
            // If occupancy is 100% (f=1.5ish scaled), expense is 1.5
            return Math.max(0.3, f);
        });
    });

    // Tier 1+: 10-Year Wealth Data
    wealthData = computed(() => {
        if (!this.isTier1OrAbove()) return [];
        const annualAppreciation = 0.03;
        const v = this.formValues();
        const price = v?.price || 0;
        const annualPrincipal = this.loanBreakdown().principal * 12; // Approximation logic

        return Array.from({ length: 10 }, (_, i) => {
            const year = i + 1;
            const appVal = price * (Math.pow(1 + annualAppreciation, year) - 1);
            const equityVal = annualPrincipal * year;
            const maxApp = price * (Math.pow(1 + annualAppreciation, 10) - 1);
            const maxEquity = annualPrincipal * 10;
            const totalMax = maxApp + maxEquity;
            const factor = totalMax > 0 ? 85 / totalMax : 0;

            return {
                year,
                appreciationHeight: Math.max(2, appVal * factor),
                equityHeight: Math.max(2, equityVal * factor)
            };
        });
    });

    generateDiagnostic = computed(() => {
        const flow = this.netCashflow();
        const price = this.formValues()?.price || 1;
        const yield_ = (flow / price) * 100;

        let status: 'Elite' | 'Healthy' | 'Conservative' | 'Warning' = 'Healthy';
        if (yield_ > 12) status = 'Elite';
        else if (yield_ > 7) status = 'Healthy';
        else if (yield_ > 3) status = 'Conservative';
        else status = 'Warning';

        return {
            yield: yield_,
            status,
            annualCashflow: flow
        };
    });

    calculatedMonthlyLoan = computed(() => {
        if (this.isTier0()) return this.formValues()?.loan || 0;

        const v = this.formValues();
        const principal = Math.max(0, (v?.price || 0) - (v?.downPayment || 0));
        const annualRate = v?.interestRate || 3.5;
        const monthlyRate = annualRate / 100 / 12;
        const months = (v?.loanYears || 20) * 12;

        if (monthlyRate === 0) return principal / (months || 1);
        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return isFinite(payment) ? payment : 0;
    });

    totalExpenses = computed(() => {
        const v = this.formValues();
        const baseExpenses = (v?.condo || 0) + (v?.insurance || 0);
        const loan = this.calculatedMonthlyLoan();

        if (this.isTier0()) {
            return loan + baseExpenses;
        }

        // Bronze+ Advanced Expenses
        const advanced = (v?.wifi || 0) + (v?.electricity || 0) + (v?.water || 0) + (v?.gas || 0) + (v?.other || 0);
        return loan + baseExpenses + advanced;
    });

    loanBreakdown = computed(() => {
        const v = this.formValues();
        const principal = Math.max(0, (v?.price || 0) - (v?.downPayment || 0));
        const payment = this.calculatedMonthlyLoan();
        const months = (v?.loanYears || 20) * 12;
        const totalPaid = payment * months;
        const totalInterest = Math.max(0, totalPaid - principal);

        const principalPercent = totalPaid > 0 ? (principal / totalPaid) * 100 : 0;
        const interestPercent = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;

        return {
            principal,
            totalInterest,
            totalPaid,
            principalPercent,
            interestPercent
        };
    });

    riskAnalysis = computed(() => {
        if (!this.isTier3()) return null;
        const flow = this.netCashflow();
        const breakdown = this.loanBreakdown();
        const occupancy = this.baseOccupancy();

        const risks: { level: 'High' | 'Medium' | 'Low', msg: string }[] = [];

        if (flow < 1200) risks.push({ level: 'High', msg: 'Thin annual margins (< €1,200/yr). High sensitivity to occupancy.' });
        if (breakdown.interestPercent > 40) risks.push({ level: 'Medium', msg: `Interest heavy (${breakdown.interestPercent.toFixed(0)}%). Consider higher down-payment.` });
        if (occupancy > 80) risks.push({ level: 'Medium', msg: `High occupancy model (${occupancy}%). Verify local market ceiling.` });

        return risks.length > 0 ? risks : [{ level: 'Low', msg: 'Balanced financial projection.' }];
    });

    netCashflow = computed(() => {
        const v = this.formValues();
        const baseNightly = v?.rent || 0;
        const baseOcc = this.baseOccupancy() / 100;

        let annualIncome = 0;
        const occFactors = this.seasonalityFactors();
        const pFactors = this.priceFactors();
        const eFactors = this.expenseFactors();

        for (let i = 0; i < 12; i++) {
            const monthlyOccupancy = Math.min(1, baseOcc * occFactors[i]);
            const monthlyPrice = baseNightly * pFactors[i];
            annualIncome += (monthlyPrice * 30.42 * monthlyOccupancy);
        }

        const baseMonthlyExpenses = this.totalExpenses();
        if (!this.isTier2OrAbove()) {
            return annualIncome - (baseMonthlyExpenses * 12);
        }

        // Silver+ Monthly variations for some expenses (Electricity, Gas, Water)
        let annualExpenses = 0;
        const loan = this.calculatedMonthlyLoan();
        const fixed = (v?.condo || 0) + (v?.insurance || 0) + (v?.wifi || 0) + (v?.other || 0);
        const variable = (v?.electricity || 0) + (v?.water || 0) + (v?.gas || 0);

        for (let i = 0; i < 12; i++) {
            annualExpenses += loan + fixed + (variable * eFactors[i]);
        }

        return annualIncome - annualExpenses;
    });

    // Tier 2+: 10-Year P&L Projection
    pnlProjection = computed(() => {
        if (!this.isTier2OrAbove()) return null;

        const pnl = this.pnlBreakdown();
        if (!pnl) return null;

        const inflation = 0.02; // 2% Expense Inflation
        const rentIncrease = 0.025; // 2.5% Revenue Growth

        return Array.from({ length: 10 }, (_, i) => {
            const year = i + 1;

            // Apply compounding growth
            const revenue = pnl.grossRevenue * Math.pow(1 + rentIncrease, i);
            const opex = pnl.annualOpEx * Math.pow(1 + inflation, i);
            const debt = pnl.annualDebtService; // Fixed Rate Loan

            // Tax: Assume generic rise with revenue, but tax brackets complicate this. 
            // Simplified: Scales with Revenue growth for estimation purposes
            const tax = pnl.estimatedTax * Math.pow(1 + rentIncrease, i);

            const cashflow = revenue - opex - debt - tax;

            return {
                year,
                revenue,
                expenses: opex,
                loanService: debt,
                tax,
                cashflow
            };
        });
    });

    // Tier 2+: Simplifed P&L (Tier 3 adds Tax)
    pnlBreakdown = computed(() => {
        if (!this.isTier2OrAbove()) return null;

        const v = this.formValues();
        const baseNightly = v?.rent || 0;
        const baseOcc = this.baseOccupancy() / 100;

        // 1. Gross Revenue
        let grossRevenue = 0;
        const occFactors = this.seasonalityFactors();
        const pFactors = this.priceFactors();

        for (let i = 0; i < 12; i++) {
            const monthlyOccupancy = Math.min(1, baseOcc * occFactors[i]);
            const monthlyPrice = baseNightly * pFactors[i];
            grossRevenue += (monthlyPrice * 30.42 * monthlyOccupancy);
        }

        // 2. Operating Expenses
        let annualOpEx = 0;
        const loanMonthly = this.calculatedMonthlyLoan();

        const fixed = (v?.condo || 0) + (v?.insurance || 0) + (v?.wifi || 0) + (v?.other || 0);
        const variable = (v?.electricity || 0) + (v?.water || 0) + (v?.gas || 0);
        const eFactors = this.expenseFactors();

        for (let i = 0; i < 12; i++) {
            annualOpEx += fixed + (variable * eFactors[i]);
        }

        const noi = grossRevenue - annualOpEx;
        const annualDebtService = loanMonthly * 12;

        // Tier 3: Tax Logic
        let estimatedTax = 0;
        if (this.isTier3() && this.taxData()) {
            estimatedTax = this.taxData().estimatedTax;
        }

        const cashflow = noi - annualDebtService - estimatedTax;

        return {
            grossRevenue,
            annualOpEx,
            noi,
            annualDebtService,
            estimatedTax,
            cashflow
        };
    });

    private async updateTaxForecast(grossRevenue: number, annualExpenses: number) {
        if (grossRevenue <= 0) {
            this.taxData.set(null);
            return;
        }
        try {
            const country = this.formValues()?.propertyCountry || 'France';
            const ownerCountry = this.formValues()?.hostCountry || 'France';

            const tax = await this.taxService.calculateTax({
                country,
                ownerCountry,
                revenue: grossRevenue,
                expenses: annualExpenses
            });
            this.taxData.set(tax);
        } catch (e) {
            console.error('Tax forecast failed', e);
        }
    }

    async autoFill() {
        this.isAiLoading.set(true);
        const activeProperty = this.propertyDetails();
        const address = activeProperty?.address || 'London, United Kingdom';
        const context = this.form.value;

        try {
            const analysis = await this.gemini.getMarketAnalysis(address, context);

            // Prefill with AI data
            this.form.patchValue({
                price: analysis.suggestedPrice || activeProperty?.purchase_price || 250000,
                rent: analysis.estimatedNightlyRate,
                interestRate: analysis.suggestedInterestRate || 3.5,
                wifi: analysis.suggestedVariableCosts?.wifi || 30,
                electricity: analysis.suggestedVariableCosts?.electricity || 60,
                water: analysis.suggestedVariableCosts?.water || 20,
                condo: 150, // Default or estimate could be added to AI
                insurance: 40
            });

            this.baseOccupancy.set(analysis.estimatedOccupancy);
            this.aiSummary.set(analysis.summary);

            // Prefill seasonality if provided (Tier 3)
            if (analysis.monthlySeasonality && analysis.monthlySeasonality.length === 12) {
                const avgOcc = analysis.monthlySeasonality.reduce((a, b) => a + b, 0) / 12;
                this.baseOccupancy.set(Math.round(avgOcc));
                const factors = analysis.monthlySeasonality.map(o => avgOcc > 0 ? o / avgOcc : 1);
                this.seasonalityFactors.set(factors);
            }

            if (analysis.monthlyNightlyPrices && analysis.monthlyNightlyPrices.length === 12) {
                const avgPrice = analysis.monthlyNightlyPrices.reduce((a, b) => a + b, 0) / 12;
                this.form.patchValue({ rent: Math.round(avgPrice) });
                const factors = analysis.monthlyNightlyPrices.map(p => avgPrice > 0 ? p / avgPrice : 1);
                this.priceFactors.set(factors);
            }

        } catch (error) {
            console.error('AI Autofill failed', error);
            // Minimal fallback
            this.baseOccupancy.set(72);
        } finally {
            this.isAiLoading.set(false);
        }
    }
}

import { Component, computed, effect, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';
import { SessionStore } from '../../../state/session.store';
import { FinancialCalculator } from '../../../services/financial-engine/engine';
import { FinancialInput, FinancialOutput, TierLevel, YearlyProjection } from '../../../services/financial-engine/types';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

// Chart.register(...registerables); // Moved to constructor

@Component({
  selector: 'saas-profitability-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="h-full flex flex-col space-y-6">
      <!-- Tier Selector Header -->
      <div class="bg-white/5 backdrop-blur-md rounded-xl p-2 flex space-x-2 border border-white/10 overflow-x-auto">
        <ng-container *ngFor="let t of tiers">
            <button *ngIf="!isHidden(t.level)"
                    (click)="selectTier(t.level)"
                    [disabled]="isLocked(t.level)"
                    class="flex-1 min-w-[120px] py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 relative overflow-hidden group"
                    [class]="activeTier() === t.level 
                      ? 'bg-gradient-to-br from-[#D4AF37] to-amber-600 text-slate-900 shadow-lg' 
                      : isLocked(t.level) 
                        ? 'bg-white/5 text-slate-500 opacity-50 cursor-not-allowed' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'">
              
              <span class="relative z-10">{{ t.label | translate }}</span>
              
              <!-- Lock Icon -->
              <svg *ngIf="isLocked(t.level)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" />
              </svg>
    
              <!-- Selection Indicator -->
              <div *ngIf="activeTier() === t.level" class="absolute inset-0 bg-white/20 blur-md"></div>
            </button>
        </ng-container>
      </div>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden min-h-0">
        
        <!-- INPUTS SECTION -->
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div class="p-4 border-b border-white/10 bg-black/20">
            <h3 class="font-bold text-white text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.5 2a1.5 1.5 0 0 0-1.5 1.5V5h-4V3.5A1.5 1.5 0 0 0 6.5 2H2v8h1.5v1.5a2.5 2.5 0 0 0 4 2h1.968a3 3 0 0 1-1.393 1.34L7.5 15.5H2.5v2h5a1 1 0 0 0 1-1v-1.166a2 2 0 0 1 1-1.783L17 12.5V3.5a1.5 1.5 0 0 0-1.5-1.5h-2Z" />
              </svg>
              {{ 'PROFITABILITY.FinancialData' | translate }}
            </h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <form [formGroup]="form" class="space-y-8">
              
              <!-- TIER 1: BASIC -->
              <div class="space-y-4">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">{{ 'PROFITABILITY.RevenueAndFixedCosts' | translate }}</h4>
                
                <div class="group">
                  <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.GrossMonthlyRevenue' | translate }} (€)</label>
                  <input type="number" formControlName="grossMonthlyRevenue" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all outline-none group-hover:border-white/20" [placeholder]="'PROFITABILITY.Placeholder.GrossRevenue' | translate">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.FixedCosts' | translate }} (€)</label>
                        <input type="number" formControlName="fixedCosts" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.FixedCosts' | translate">
                        <p class="text-[10px] text-slate-500 mt-1">{{ 'PROFITABILITY.FixedCostsNote' | translate }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.VariableCosts' | translate }} (€)</label>
                        <input type="number" formControlName="variableCosts" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.VariableCosts' | translate">
                        <p class="text-[10px] text-slate-500 mt-1">{{ 'PROFITABILITY.VariableCostsNote' | translate }}</p>
                    </div>
                </div>
              </div>

              <div *ngIf="showTier(TierLevel.LOW)" class="space-y-4 animate-fade-in-up">
                <h4 class="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2 mt-6">{{ 'PROFITABILITY.InitialInvestment' | translate }}</h4>
                
                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.Furniture' | translate }} (€)</label>
                        <input type="number" formControlName="furnitureCosts" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.Works' | translate }} (€)</label>
                        <input type="number" formControlName="worksCosts" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.Staging' | translate }} (€)</label>
                        <input type="number" formControlName="stagingCosts" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.NotaryFees' | translate }} (€)</label>
                        <input type="number" formControlName="notaryFees" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                     </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1 pointer-events-none opacity-50">{{ 'PROFITABILITY.OtherOptional' | translate }}</label>
                  <input type="number" formControlName="initialInvestment" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.OtherCosts' | translate">
                </div>
              </div>

              <!-- TIER 3: MEDIUM -->
              <div *ngIf="showTier(TierLevel.MEDIUM)" class="space-y-4 animate-fade-in-up">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 mt-6">{{ 'PROFITABILITY.KPIsAndPerformance' | translate }}</h4>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.BookedDays' | translate }}</label>
                    <input type="number" formControlName="totalBookedDays" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none">
                  </div>
                   <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.AvailableDays' | translate }}</label>
                    <input type="number" formControlName="totalAvailableDays" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.DaysAvailable' | translate">
                  </div>
                </div>
              </div>

              <!-- TIER 4: EXPERT -->
              <div *ngIf="showTier(TierLevel.EXPERT)" class="space-y-4 animate-fade-in-up">
                <h4 class="text-xs font-bold text-[#D4AF37] uppercase tracking-widest border-b border-white/5 pb-2 mt-6">{{ 'PROFITABILITY.ExpertAnalysisTitle' | translate }}</h4>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.PurchasePrice' | translate }} (€)</label>
                        <input type="number" formControlName="purchasePrice" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.DepreciationType' | translate }}</label>
                        <select formControlName="depreciationYearType" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none cursor-pointer">
                            <option value="RESIDENTIAL_27_5">{{ 'PROFITABILITY.Residential' | translate }}</option>
                            <option value="COMMERCIAL_39">{{ 'PROFITABILITY.Commercial' | translate }}</option>
                        </select>
                    </div>
                </div>

                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 mt-6">{{ 'PROFITABILITY.FinancingTitle' | translate }}</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.LoanAmount' | translate }} (€)</label>
                        <input type="number" formControlName="loanAmount" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.DownPayment' | translate }} (€)</label>
                        <input type="number" formControlName="downPayment" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.InterestRate' | translate }} (%)</label>
                        <input type="number" formControlName="interestRate" step="0.1" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.InterestRate' | translate">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1">{{ 'PROFITABILITY.Duration' | translate }}</label>
                        <input type="number" formControlName="loanTermYears" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none" [placeholder]="'PROFITABILITY.Placeholder.Duration' | translate">
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- RESULTS SECTION -->
        <div class="flex flex-col space-y-4 h-full overflow-y-auto custom-scrollbar pr-2">
          
          <!-- MAIN CARD -->
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group shrink-0">
            <div class="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#D4AF37]/20 transition-all duration-1000"></div>
            
            <h3 class="text-slate-400 uppercase text-xs font-bold tracking-widest mb-2 relative z-10">{{ 'PROFITABILITY.NetMonthlyCashFlow' | translate }}</h3>
            <div class="text-5xl font-bold text-white mb-2 relative z-10 font-mono tracking-tighter">
              {{ result()?.netMonthlyCashFlow | currency:'EUR':'symbol':'1.0-0' }}
            </div>
            <div class="flex items-center space-x-4 text-sm relative z-10">
               <span class="text-red-400 flex items-center">
                 <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                 {{ 'PROFITABILITY.Costs' | translate }}: {{ ((result()?.totalMonthlyFixedCosts || 0) + (result()?.totalMonthlyVariableCosts || 0)) | currency:'EUR':'symbol':'1.0-0' }}
               </span>
               <span class="text-slate-500">|</span>
               <span class="text-emerald-400">{{ 'PROFITABILITY.Gross' | translate }}: {{ form.get('grossMonthlyRevenue')?.value | currency:'EUR':'symbol':'1.0-0' }}</span>
            </div>
             <!-- Mortgage Mini-Summary for Basic view -->
              <div *ngIf="result()?.mortgage && !showTier(TierLevel.EXPERT)" class="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 flex justify-between">
                <span>{{ 'PROFITABILITY.Credit' | translate }}:</span>
                <span class="text-white font-mono">{{ result()?.mortgage?.monthlyPayment | currency:'EUR':'symbol':'1.0-0' }} /{{ 'PROFITABILITY.Unit.Month' | translate }}</span>
             </div>
          </div>

          <!-- TIER 1 VISUALIZATIONS (Always visible) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             <!-- Pocket Cash Gauge -->
            <div class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 class="text-slate-400 text-[10px] uppercase font-bold mb-4 text-center">{{ 'PROFITABILITY.Chart.PocketCashTitle' | translate }}</h4>
              <div class="relative h-48">
                <canvas #pocketCashGauge></canvas>
              </div>
            </div>

             <!-- Income vs Expenses Bar -->
            <div class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 class="text-slate-400 text-[10px] uppercase font-bold mb-4">{{ 'PROFITABILITY.Chart.IncomeExpensesTitle' | translate }}</h4>
              <div class="relative h-48">
                <canvas #incomeExpensesBar></canvas>
              </div>
            </div>
          </div>

          <!-- TIER 2 METRICS -->
          <div *ngIf="showTier(TierLevel.LOW)" class="grid grid-cols-2 gap-4 animate-fade-in-up shrink-0">
            <div class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 class="text-slate-400 text-[10px] uppercase font-bold mb-1">{{ 'PROFITABILITY.AnnualizedROI' | translate }}</h4>
              <div class="text-2xl font-bold text-[#D4AF37]">{{ result()?.annualizedROI | number:'1.1-1' }}%</div>
            </div>
             <div class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 class="text-slate-400 text-[10px] uppercase font-bold mb-1">{{ 'PROFITABILITY.ReturnOnInv' | translate }}</h4>
              <div class="text-2xl font-bold text-white">{{ result()?.paybackPeriodMonths | number:'1.1-1' }} <span class="text-sm font-normal text-slate-500">{{ 'PROFITABILITY.Unit.Month' | translate }}</span></div>
            </div>
          </div>

          <!-- TIER 3 METRICS -->
          <div *ngIf="showTier(TierLevel.MEDIUM)" class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 animate-fade-in-up shrink-0">
            <h4 class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">{{ 'PROFITABILITY.KPIs' | translate }}</h4>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-xl font-bold text-white">{{ result()?.occupancyRate | number:'1.0-0' }}%</div>
                <div class="text-[10px] text-slate-500 uppercase">{{ 'PROFITABILITY.OccupancyRate' | translate }}</div>
              </div>
              <div class="border-l border-white/10">
                <div class="text-xl font-bold text-white">{{ result()?.adr | currency:'EUR':'symbol':'1.0-0' }}</div>
                <div class="text-[10px] text-slate-500 uppercase">{{ 'PROFITABILITY.ADR' | translate }}</div>
              </div>
              <div class="border-l border-white/10">
                <div class="text-xl font-bold text-white">{{ result()?.revPAR | currency:'EUR':'symbol':'1.0-0' }}</div>
                <div class="text-[10px] text-slate-500 uppercase">{{ 'PROFITABILITY.RevPAR' | translate }}</div>
              </div>
            </div>
             <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span class="text-xs text-slate-400">{{ 'PROFITABILITY.SinkingFund' | translate }}</span>
                <span class="text-sm font-bold text-orange-400">{{ result()?.sinkingFundContribution | currency:'EUR' }} /{{ 'PROFITABILITY.Unit.Month' | translate }}</span>
            </div>
          </div>

          <!-- TIER 4 METRICS & DASHBOARD -->
          <div *ngIf="showTier(TierLevel.EXPERT)" class="space-y-4 animate-fade-in-up">
              <!-- Mortgage Detail -->
              <div *ngIf="result()?.mortgage" class="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{{ 'PROFITABILITY.MortgageDetailsTitle' | translate }}</h4>
                  <div class="flex justify-between items-center mb-2">
                       <span class="text-sm text-slate-300">{{ 'PROFITABILITY.MonthlyPayment' | translate }}</span>
                       <span class="text-lg font-bold text-white">{{ result()?.mortgage?.monthlyPayment | currency:'EUR':'symbol':'1.0-0' }}</span>
                  </div>
                   <div class="flex justify-between items-center">
                       <span class="text-sm text-slate-300">{{ 'PROFITABILITY.TotalCostCredit' | translate }}</span>
                       <span class="text-sm font-bold text-red-400">{{ result()?.mortgage?.totalInterest | currency:'EUR':'symbol':'1.0-0' }}</span>
                  </div>
              </div>

              <!-- Advanced KPIs -->
              <div class="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md p-6 rounded-xl border border-[#D4AF37]/30">
                 <h4 class="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    {{ 'PROFITABILITY.ExpertAnalysisTitle' | translate }}
                 </h4>
                 <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-slate-300">{{ 'PROFITABILITY.NOI' | translate }}</span>
                        <span class="text-lg font-bold text-white font-mono">{{ result()?.noi | currency:'EUR':'symbol':'1.0-0' }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-slate-300">{{ 'PROFITABILITY.CashOnCash' | translate }}</span>
                        <span class="text-lg font-bold text-[#D4AF37] font-mono">{{ result()?.cashOnCashReturn | number:'1.2-2' }}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-slate-300">{{ 'PROFITABILITY.CapRate' | translate }}</span>
                        <span class="text-md font-bold text-slate-400 font-mono">{{ result()?.capRate | number:'1.2-2' }}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-slate-300">{{ 'PROFITABILITY.Amortization' | translate }}</span>
                        <span class="text-lg font-bold text-slate-400 font-mono">{{ result()?.taxDepreciation | currency:'EUR':'symbol':'1.0-0' }}</span>
                    </div>
                 </div>
              </div>

              <!-- CHART -->
              <div class="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 h-64">
                   <h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ 'PROFITABILITY.ProjectionsTitle' | translate }}</h4>
                   <div class="relative w-full h-full">
                        <canvas #projectionChart></canvas>
                   </div>
              </div>
          </div>

          <!-- UPGRADE TEASER (If locked tier selected or general info) -->
          <div *ngIf="isNextTierLocked()" class="mt-auto bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between shrink-0">
            <div>
                <h4 class="text-white font-bold text-sm">{{ 'PROFITABILITY.UnlockMore' | translate }}</h4>
                <p class="text-[10px] text-purple-200">{{ 'PROFITABILITY.UnlockText' | translate }}</p>
            </div>
            <button class="px-3 py-1.5 bg-white text-purple-900 text-xs font-bold rounded shadow-lg hover:bg-purple-50 transition-colors">{{ 'PROFITABILITY.Upgrade' | translate }}</button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
  `]
})
export class ProfitabilityCalculatorComponent {
  store = inject(SessionStore);
  ts = inject(TranslationService);
  private fb = inject(FormBuilder);

  TierLevel = TierLevel; // For template access

  tiers = [
    { level: TierLevel.BASIC, label: 'PROFITABILITY.TierBasic', minPlan: 'Freemium' },
    { level: TierLevel.LOW, label: 'PROFITABILITY.TierLow', minPlan: 'Bronze' },
    { level: TierLevel.MEDIUM, label: 'PROFITABILITY.TierMedium', minPlan: 'Silver' },
    { level: TierLevel.EXPERT, label: 'PROFITABILITY.TierExpert', minPlan: 'Gold' }
  ];

  activeTier = signal<TierLevel>(TierLevel.BASIC);
  calculator = new FinancialCalculator();

  form: FormGroup = this.fb.group({
    // Tier 1
    grossMonthlyRevenue: [2500, [Validators.required, Validators.min(0)]],
    fixedCosts: [800, [Validators.required, Validators.min(0)]],
    variableCosts: [300, [Validators.required, Validators.min(0)]],

    // Tier 2
    initialInvestment: [0], // Keeping as generic/residual
    furnitureCosts: [0],
    worksCosts: [0],
    stagingCosts: [0],
    notaryFees: [0],

    // Tier 3
    totalBookedDays: [200],
    totalAvailableDays: [365],

    // Tier 4
    purchasePrice: [0],
    depreciationYearType: ['RESIDENTIAL_27_5'],

    // Financing (Expert)
    loanAmount: [0], // Principal
    downPayment: [0],
    interestRate: [5.5], // %
    loanTermYears: [25]
  });

  // Calculate Result Signal
  result = signal<FinancialOutput | null>(null);

  constructor() {
    Chart.register(...registerables);
    // Set default active tier based on user plan
    const plans = ['Freemium', 'Bronze', 'Silver', 'Gold'];
    const currentPlan = this.store.userProfile()?.plan || 'Freemium';
    const userPlanIndex = plans.indexOf(currentPlan);

    // Default to the highest unlocked tier (which corresponds to user plan index in our 1-to-1 mapping)
    if (userPlanIndex >= 0 && userPlanIndex < this.tiers.length) {
      this.activeTier.set(this.tiers[userPlanIndex].level);
    }

    // React to form changes
    this.form.valueChanges.subscribe(val => {
      this.calculate(val);
    });

    // Initial calc
    this.calculate(this.form.value);

    // Re-render chart when language changes
    effect(() => {
      this.ts.currentLang(); // Dependency
      const res = this.result();
      if (res && res.projections) {
        this.renderChart(res.projections);
      }
    });
  }

  isHidden(tier: TierLevel): boolean {
    // Hide tiers LOWER than the current user plan level
    const plans = ['Freemium', 'Bronze', 'Silver', 'Gold'];
    const currentPlan = this.store.userProfile()?.plan || 'Freemium';
    const userPlanIndex = plans.indexOf(currentPlan);

    // Find tier index
    const tierConfig = this.tiers.find(t => t.level === tier);
    if (!tierConfig) return false; // Should not happen

    const tierIndex = plans.indexOf(tierConfig.minPlan);

    // If Tier Level < User Level, it's lower -> Hide it as per user requirement "not see freemium" if bronze
    return tierIndex < userPlanIndex;
  }

  isLocked(tier: TierLevel): boolean {
    const tierConfig = this.tiers.find(t => t.level === tier);
    if (!tierConfig) return true;

    // Plan Levels: Freemium=0, Bronze=1, Silver=2, Gold=3
    const plans = ['Freemium', 'Bronze', 'Silver', 'Gold'];
    const currentPlan = this.store.userProfile()?.plan || 'Freemium';
    const userPlanIndex = plans.indexOf(currentPlan);
    const reqPlanIndex = plans.indexOf(tierConfig.minPlan);

    return userPlanIndex < reqPlanIndex;
  }

  selectTier(tier: TierLevel) {
    if (!this.isLocked(tier)) {
      this.activeTier.set(tier);
    }
  }

  showTier(tier: TierLevel): boolean {
    // Show tier inputs if active tier is >= this tier
    // But actually, we might want to stack inputs? 
    // The requirement is "expands as user levels up".
    // So if I am in Expert mode, I see all inputs.

    const levels = [TierLevel.BASIC, TierLevel.LOW, TierLevel.MEDIUM, TierLevel.EXPERT];
    const activeIdx = levels.indexOf(this.activeTier());
    const targetIdx = levels.indexOf(tier);

    return targetIdx <= activeIdx;
  }

  isNextTierLocked(): boolean {
    const levels = [TierLevel.BASIC, TierLevel.LOW, TierLevel.MEDIUM, TierLevel.EXPERT];
    const activeIdx = levels.indexOf(this.activeTier());
    if (activeIdx >= levels.length - 1) return false;

    const nextTier = levels[activeIdx + 1];
    return this.isLocked(nextTier);
  }

  calculate(val: any) {
    try {
      // RE-MAPPING for CENTS PRESICION:
      const toCents = (v: number) => Math.round(v * 100);
      const fromCents = (v: number) => v / 100;

      const safeInput: FinancialInput = {
        tier: this.activeTier(),
        grossMonthlyRevenue: toCents(val.grossMonthlyRevenue || 0),
        fixedCosts: [toCents(val.fixedCosts || 0)],
        variableCosts: [toCents(val.variableCosts || 0)],

        initialInvestment: toCents(val.initialInvestment || 0),
        furnitureCosts: toCents(val.furnitureCosts || 0),
        renovationCosts: toCents(val.worksCosts || 0), // Mapping 'worksCosts' form to 'renovationCosts' type
        stagingCosts: toCents(val.stagingCosts || 0),
        notaryFees: toCents(val.notaryFees || 0),

        totalBookedDays: val.totalBookedDays,
        totalAvailableDays: val.totalAvailableDays,
        purchasePrice: toCents(val.purchasePrice || 0),
        depreciationYearType: val.depreciationYearType,
        // Expert / Financing
        loanAmount: toCents(val.loanAmount || 0),
        downPayment: toCents(val.downPayment || 0),
        interestRate: val.interestRate,
        loanTermYears: val.loanTermYears
      };

      const centRes = this.calculator.calculate(safeInput);

      const finalRes = {
        ...centRes,
        netMonthlyCashFlow: fromCents(centRes.netMonthlyCashFlow),
        totalMonthlyFixedCosts: fromCents(centRes.totalMonthlyFixedCosts),
        totalMonthlyVariableCosts: fromCents(centRes.totalMonthlyVariableCosts),
        adr: centRes.adr ? fromCents(centRes.adr) : undefined,
        revPAR: centRes.revPAR ? fromCents(centRes.revPAR) : undefined,
        sinkingFundContribution: centRes.sinkingFundContribution ? fromCents(centRes.sinkingFundContribution) : undefined,
        noi: centRes.noi ? fromCents(centRes.noi) : undefined,
        taxDepreciation: centRes.taxDepreciation ? fromCents(centRes.taxDepreciation) : undefined,
        ebitda: centRes.ebitda ? fromCents(centRes.ebitda) : undefined,

        // Complex Objects need recursive conversion or specific handling
        mortgage: centRes.mortgage ? {
          monthlyPayment: fromCents(centRes.mortgage.monthlyPayment),
          totalInterest: fromCents(centRes.mortgage.totalInterest),
          yearlyAmortization: centRes.mortgage.yearlyAmortization.map(a => ({
            ...a,
            interest: fromCents(a.interest),
            principal: fromCents(a.principal),
            balance: fromCents(a.balance)
          }))
        } : undefined,

        projections: centRes.projections ? centRes.projections.map(p => ({
          ...p,
          revenue: fromCents(p.revenue),
          expenses: fromCents(p.expenses),
          noi: fromCents(p.noi),
          cashFlow: fromCents(p.cashFlow),
          equity: fromCents(p.equity)
        })) : undefined
      };

      this.result.set(finalRes);

      // Update Chart if projections exist
      if (finalRes.projections) {
        // We defer chart rendering to ensure potentially *ngIf-hidden DOM is ready.
        // We also check internally in renderChart if canvas exists.
        setTimeout(() => {
          if (this.chartCanvas) {
            this.renderChart(finalRes.projections!);
          } else {
            // Rerty once if specific scenario like rapid tab switching
            setTimeout(() => {
              if (this.chartCanvas && finalRes.projections) this.renderChart(finalRes.projections);
            }, 200);
          }
        }, 100);
      }

      // Update Tier 1 charts (always visible)
      setTimeout(() => {
        this.renderPocketCashGauge();
        this.renderIncomeExpensesBar();
      }, 150);

    } catch (e) {
      console.error(e);
    }
  }


  @ViewChild('projectionChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pocketCashGauge') pocketCashGaugeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('incomeExpensesBar') incomeExpensesBarCanvas!: ElementRef<HTMLCanvasElement>;

  chartInstance: Chart | null = null;
  gaugeChartInstance: Chart | null = null;
  barChartInstance: Chart | null = null;

  renderChart(projections: YearlyProjection[]) {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const yearLabel = this.ts.translate('PROFITABILITY.Unit.Year') || 'Year';
    const labels = projections.map(p => `${yearLabel} ${p.year}`);
    const cashFlowData = projections.map(p => p.cashFlow); // cents converted to euros in finalRes? Yes.
    const equityData = projections.map(p => p.equity);

    // Gradient for Equity
    const gradientEquity = ctx.createLinearGradient(0, 0, 0, 400);
    gradientEquity.addColorStop(0, 'rgba(212, 175, 55, 0.5)'); // Gold
    gradientEquity.addColorStop(1, 'rgba(212, 175, 55, 0.05)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.ts.translate('PROFITABILITY.Chart.CashFlow'),
            data: cashFlowData, // This is annual cash flow. Maybe we want cumulative? Or just annual bar?
            // Let's stick to annual bars for cash flow
            type: 'bar',
            backgroundColor: 'rgba(56, 189, 248, 0.6)', // Sky Blue
            borderColor: '#38bdf8',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: this.ts.translate('PROFITABILITY.Chart.Equity'),
            data: equityData,
            type: 'line',
            borderColor: '#D4AF37', // Gold
            backgroundColor: gradientEquity,
            fill: true,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: { color: '#94a3b8' }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' },
            title: { display: true, text: this.ts.translate('PROFITABILITY.Chart.AxisCashFlow'), color: '#38bdf8' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#D4AF37' },
            title: { display: true, text: this.ts.translate('PROFITABILITY.Chart.AxisEquity'), color: '#D4AF37' }
          }
        }
      }
    });
  }

  renderPocketCashGauge() {
    if (!this.pocketCashGaugeCanvas) return;

    const ctx = this.pocketCashGaugeCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.gaugeChartInstance) {
      this.gaugeChartInstance.destroy();
    }

    const netCashFlow = this.result()?.netMonthlyCashFlow || 0;
    const maxRange = 5000;
    const percentage = Math.min(Math.max((netCashFlow + maxRange) / (maxRange * 2) * 100, 0), 100);

    let gaugeColor = '#ef4444';
    if (percentage > 66) gaugeColor = '#10b981';
    else if (percentage > 33) gaugeColor = '#f59e0b';

    this.gaugeChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: [gaugeColor, 'rgba(255, 255, 255, 0.1)'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        cutout: '75%'
      }
    });
  }

  renderIncomeExpensesBar() {
    if (!this.incomeExpensesBarCanvas) return;

    const ctx = this.incomeExpensesBarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    const revenue = this.form.get('grossMonthlyRevenue')?.value || 0;
    const expenses = (this.result()?.totalMonthlyFixedCosts || 0) + (this.result()?.totalMonthlyVariableCosts || 0);

    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [this.ts.translate('PROFITABILITY.Chart.Monthly')],
        datasets: [
          {
            label: this.ts.translate('PROFITABILITY.Chart.Income'),
            data: [revenue],
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 1
          },
          {
            label: this.ts.translate('PROFITABILITY.Chart.Expenses'),
            data: [expenses],
            backgroundColor: '#f43f5e',
            borderColor: '#e11d48',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#94a3b8', font: { size: 10 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }
}

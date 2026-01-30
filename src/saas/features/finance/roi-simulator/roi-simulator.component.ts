import { Component, input, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { GeminiService } from '../../../../services/gemini.service';
import { HmrcService } from '../../../../services/hmrc.service';

@Component({
  selector: 'fin-01-roi-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    TranslatePipe
  ],
  template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
       <!-- Header -->
       <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ 'ROI.RoiCashflowArchitect' | translate }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ 'ROI.ProfessionalFinancialModelingEngineWith' | translate }}</p>
          
          @if (propertyDetails()) {
            <div class="mt-4 flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-fit">
               <span class="material-icons text-emerald-400 text-sm">home</span>
               <span class="text-white text-xs font-bold">{{ propertyDetails().name }}</span>
               <span class="text-slate-500 text-[10px]">{{ propertyDetails().address }}</span>
            </div>
          }
        </div>
         <div class="flex gap-2">
             <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono flex items-center gap-2">
                <span>💰</span>{{ 'ROI.Cashflow' | translate }}</div>
             <div class="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
                <span>📈</span> {{ 'ROI.10yForecast' | translate }}
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
        <!-- Left: Inputs & Seasonality -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col overflow-y-auto">
           <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">{{ 'ROI.FinancialDesign' | translate }}</h3>
                @if (isTier3()) {
                    <button (click)="autoFill()" [disabled]="isAiLoading()" class="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors flex items-center gap-1 disabled:opacity-50" data-debug-id="roi-autofill-btn">
                        <span>{{ isAiLoading() ? '...' : '✨' }}</span>
                        {{ isAiLoading() ? 'Analyzing Market...' : ('ROI.AiEstimate' | translate) }}
                    </button>
                }
           </div>
           
           <form [formGroup]="form" class="space-y-6">
              <!-- Core Numbers -->
              <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">{{ 'ROI.Price' | translate }}</label>
                    <input type="number" formControlName="price" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="roi-input-price">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">{{ 'ROI.AvgNightlyRate' | translate }}</label>
                    <input type="number" formControlName="rent" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono" data-debug-id="roi-input-rent">
                  </div>
              </div>

              <!-- Expenses -->
              <div>
                  <div class="flex justify-between mb-2">
                       <label class="block text-[10px] font-bold text-slate-400 uppercase">{{ 'ROI.MonthlyExpenses' | translate }}</label>
                       <span class="text-[10px] text-slate-500">{{ totalExpenses() | currency:'EUR':'symbol':'1.0-0' }}/mo</span>
                  </div>
                  <div class="space-y-2">
                      <div class="flex items-center gap-2">
                          <span class="text-xs text-slate-400 w-24">{{ 'ROI.Loan' | translate }}</span>
                          <input type="number" formControlName="loan" class="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs" placeholder="0">
                      </div>
                      <div class="flex items-center gap-2">
                          <span class="text-xs text-slate-400 w-24">{{ 'ROI.Billshoa' | translate }}</span>
                          <input type="number" formControlName="condo" class="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs" placeholder="0">
                      </div>
                  </div>
              </div>

              <!-- AI Market Summary (Gold Tier) -->
              @if (isTier3() && aiSummary()) {
                  <div class="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg animate-fade-in">
                      <h5 class="text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center gap-2">
                          <span class="material-icons text-[12px]">analytics</span> Market Analysis
                      </h5>
                      <p class="text-[10px] text-emerald-200/70 italic leading-relaxed">
                          "{{ aiSummary() }}"
                      </p>
                  </div>
              }

              <!-- Tier 2: Seasonality Engine -->
              <div [class.opacity-50]="!isTier2OrAbove()" [class.pointer-events-none]="!isTier2OrAbove()">
                   <div class="flex justify-between items-center mb-4 pt-4 border-t border-white/10">
                        <h4 class="text-sm font-bold text-white flex items-center gap-2">
                            <span class="material-icons text-sm text-cyan-400">ac_unit</span>{{ 'ROI.SeasonalityLogic' | translate }}</h4>
                        @if (!isTier2OrAbove()) { <span class="text-[10px] text-amber-400 border border-amber-400/30 px-1.5 rounded">SILVER +</span> }
                   </div>
                   
                   <div class="space-y-3">
                       <div class="flex items-center gap-4">
                           <span class="text-xs text-slate-400 w-16">{{ 'ROI.Occupancy' | translate }}</span>
                           <input type="range" class="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer" 
                                  min="0" max="100" [value]="baseOccupancy()" (input)="updateBaseOccupancy($event)"> 
                           <span class="text-xs text-white font-mono w-8">{{ baseOccupancy() }}%</span>
                       </div>
                        <div class="grid grid-cols-6 gap-1 mt-2">
                             <!-- Visual Heatmap of months -->
                           <div *ngFor="let m of months; let i = index" 
                                class="h-10 bg-black/20 rounded flex flex-col items-center justify-end pb-1 border border-white/5 relative group cursor-pointer hover:border-emerald-500/50"
                                (click)="adjustSeasonality(i)">
                               <div class="w-2 bg-emerald-500/50 rounded-t-sm transition-all duration-300" 
                                    [style.height.%]="seasonalityFactors()[i] * 100"></div>
                               <span class="text-[8px] text-slate-500">{{m}}</span>
                               <!-- Tooltip on hover -->
                               <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                   {{ (seasonalityFactors()[i] * baseOccupancy()) | number:'1.0-0' }}%
                               </div>
                           </div>
                        </div>
                   </div>
              </div>
           </form>
        </div>

        <!-- Right: Results & Visuals -->
        <div class="flex flex-col gap-6">
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

                 <!-- Tax Forecast Block (Tier 3 Only) -->
                 @if (isTier3() && taxData()) {
                     <div class="mt-2 pt-4 border-t border-white/5 flex items-center justify-between animate-fade-in">
                        <div>
                            <p class="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                <span class="material-icons text-[10px]">account_balance_wallet</span> 
                                HMRC Tax Estimate (UK FHL)
                            </p>
                            <div class="text-sm font-bold text-rose-300">
                                -{{ taxData().estimatedTax | currency:'GBP':'symbol':'1.0-0' }} 
                                <span class="text-[10px] font-normal text-slate-400">@ {{ taxData().effectiveRate | number:'1.0-1' }}%</span>
                            </div>
                        </div>
                        <div class="text-[9px] text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5">
                            MTD Compliant
                        </div>
                     </div>
                 }
             </div>

             <!-- Middle: 10-Year Wealth Chart -->
             <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 min-h-[250px] relative flex flex-col">
                 <h3 class="text-lg font-bold text-white mb-4">{{ 'ROI.10YearWealthAccumulation' | translate }}</h3>
                 
                 @if (isTier3()) {
                    <div class="flex-1 flex items-end gap-1 relative z-10 px-2">
                        <!-- Simulated Area Chart -->
                        @for (year of [1,2,3,4,5,6,7,8,9,10]; track year) {
                             <div class="flex-1 flex flex-col justify-end gap-0.5 group">
                                  <!-- Appreciation -->
                                  <div class="w-full bg-emerald-500/80 rounded-t-sm relative hover:bg-emerald-400 transition-colors" [style.height.%]="year * 4 + 10"></div>
                                  <!-- Principal Paydown -->
                                  <div class="w-full bg-blue-500/80 rounded-b-sm relative hover:bg-blue-400 transition-colors" [style.height.%]="year * 3 + 5"></div>
                                  
                                  <span class="text-[8px] text-slate-500 text-center mt-1">Y{{year}}</span>
                             </div>
                        }
                    </div>
                    
                    <div class="flex gap-4 justify-center mt-4 text-[10px]">
                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-emerald-500"></div>{{ 'ROI.AssetValue' | translate }}</div>
                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-blue-500"></div>{{ 'ROI.EquityBuilt' | translate }}</div>
                    </div>
                    
                    <button class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1" data-debug-id="roi-export-pdf">
                        <span class="material-icons text-xs">picture_as_pdf</span>{{ 'ROI.BankPdf' | translate }}</button>
                    
                 } @else {
                     <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
                         <span class="text-3xl mb-2">🔒</span>
                         <h4 class="text-white font-bold text-sm">{{ 'ROI.ProfessionalForecast' | translate }}</h4>
                         <p class="text-slate-400 text-xs mb-4 text-center px-8">{{ 'ROI.Unlock10yearEquityAnalysisAnd' | translate }}</p>
                     </div>
                 }
             </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; }`]
})
export class RoiSimulatorComponent {
  feature = input.required<Feature>();
  propertyDetails = input<any>();
  session = inject(SessionStore);
  gemini = inject(GeminiService);
  hmrc = inject(HmrcService);

  tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
  isTier0 = computed(() => this.tier() === 'Freemium' || this.tier() === 'TIER_0');
  isTier2OrAbove = computed(() => ['TIER_2', 'TIER_3', 'Silver', 'Gold'].includes(this.tier()));
  isTier3 = computed(() => this.tier() === 'Gold' || this.tier() === 'TIER_3');

  form: FormGroup;
  formValues;

  // AI & Tax Signals
  isAiLoading = signal(false);
  aiSummary = signal('');
  taxData = signal<any>(null);

  // Seasonality Engine
  months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  baseOccupancy = signal(65);
  seasonalityFactors = signal([0.4, 0.5, 0.7, 0.8, 0.9, 1.0, 1.2, 1.3, 0.9, 0.7, 0.5, 0.8]);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      price: [200000, Validators.required],
      rent: [150, Validators.required],
      loan: [900, Validators.required],
      condo: [120],
      insurance: [30]
    });
    this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  }

  updateBaseOccupancy(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.baseOccupancy.set(parseInt(val, 10));
  }

  adjustSeasonality(index: number) {
    if (!this.isTier2OrAbove()) return;
    const factors = [...this.seasonalityFactors()];
    factors[index] = (factors[index] + 0.1 > 1.5) ? 0.3 : factors[index] + 0.1;
    this.seasonalityFactors.set(factors);
  }

  totalExpenses = computed(() => {
    const v = this.formValues();
    return (v?.loan || 0) + (v?.condo || 0) + (v?.insurance || 0);
  });

  netCashflow = computed(() => {
    const v = this.formValues();
    const nightly = v?.rent || 0;
    const baseOcc = this.baseOccupancy() / 100;

    // Average monthly income across a year based on seasonality
    const avgFactor = this.seasonalityFactors().reduce((a, b) => a + b, 0) / 12;
    const effectiveOccupancy = Math.min(1, baseOcc * avgFactor);

    const monthlyIncome = nightly * 30.42 * effectiveOccupancy;
    const annualCashflow = (monthlyIncome - this.totalExpenses()) * 12;

    // Trigger Tax Calculation as side effect if in Tier 3
    if (this.isTier3()) {
      this.updateTaxForecast(annualCashflow, this.totalExpenses() * 12);
    }

    return annualCashflow;
  });

  private async updateTaxForecast(annualIncome: number, annualExpenses: number) {
    if (annualIncome <= 0) {
      this.taxData.set(null);
      return;
    }
    try {
      const tax = await this.hmrc.calculateTax(annualIncome, annualExpenses);
      this.taxData.set(tax);
    } catch (e) {
      console.error('Tax forecast failed', e);
    }
  }

  async autoFill() {
    this.isAiLoading.set(true);
    const activeProperty = this.propertyDetails();
    const address = activeProperty?.address || 'London, United Kingdom';

    try {
      const analysis = await this.gemini.getMarketAnalysis(address);

      this.form.patchValue({
        price: activeProperty?.purchase_price || 250000,
        rent: analysis.estimatedNightlyRate,
        loan: 1100, // Heuristic or based on interest
        condo: 150,
        insurance: 40
      });

      this.baseOccupancy.set(analysis.estimatedOccupancy);
      this.aiSummary.set(analysis.summary);

    } catch (error) {
      console.error('AI Autofill failed', error);
      // Fallback
      this.form.patchValue({
        price: 250000,
        rent: 140,
        loan: 1100,
        condo: 150,
        insurance: 40
      });
      this.baseOccupancy.set(72);
    } finally {
      this.isAiLoading.set(false);
    }
  }
}

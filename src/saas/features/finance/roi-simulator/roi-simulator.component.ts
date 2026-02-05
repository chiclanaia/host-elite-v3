import { Component, input, computed, inject, signal, OnInit, effect, untracked } from '@angular/core';
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
        <div class="flex flex-col gap-4 overflow-y-auto pr-1">
           <!-- Section 1: Financial Design -->
           <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
                <button (click)="toggleDesign()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div>
                            <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.FinancialDesign' | translate }}</h3>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Core Investment Metrics</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        @if (isTier3()) {
                            <button (click)="$event.stopPropagation(); autoFill()" [disabled]="isAiLoading()" 
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
                    <form [formGroup]="form" class="space-y-3">
                        <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                            <div class="flex-1">
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Loan' | translate }}</label>
                                <input type="number" formControlName="loan" class="w-full bg-transparent border-none p-0 text-white text-sm font-bold placeholder:text-slate-700 outline-none" placeholder="0.00">
                            </div>
                            <span class="text-slate-600 font-bold text-xs pr-2">€</span>
                        </div>
                        <div class="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                            <div class="flex-1">
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ 'ROI.Billshoa' | translate }}</label>
                                <input type="number" formControlName="condo" class="w-full bg-transparent border-none p-0 text-white text-sm font-bold placeholder:text-slate-700 outline-none" placeholder="0.00">
                            </div>
                            <span class="text-slate-600 font-bold text-xs pr-2">€</span>
                        </div>
                    </form>
                </div>
           </div>

           <!-- Section 3: Seasonality Logic -->
           <div class="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
                <button (click)="toggleSeasonality()" class="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div>
                            <h3 class="text-lg font-bold text-white leading-none">{{ 'ROI.SeasonalityLogic' | translate }}</h3>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Demand & Dynamic Pricing</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        @if (!isTier2OrAbove()) { <span class="text-[10px] font-black text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full bg-amber-400/10 uppercase tracking-tighter">Premium Access</span> }
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
                                    <input type="range" class="w-full h-1 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                                           min="0" max="100" [value]="baseOccupancy()" (input)="updateBaseOccupancy($event)"> 
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

                        <!-- Formal Seasonality Table -->
                        <div class="bg-black/60 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group/table-container">
                             <div class="overflow-x-auto p-4" [class.blur-[2px]]="!isTier2OrAbove()" [class.pointer-events-none]="!isTier2OrAbove()">
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

                             @if (!isTier2OrAbove()) {
                                <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover/table-container:bg-black/60">
                                    <div class="bg-black/60 border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm animate-fade-in-up">
                                        <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20">
                                            <span class="material-icons text-white text-3xl">lock</span>
                                        </div>
                                        <h4 class="text-white font-black text-lg mb-1 uppercase tracking-tight">{{ 'ROI.PremiumFeature' | translate }}</h4>
                                        <p class="text-slate-400 text-xs mb-6 px-4 font-medium leading-relaxed">
                                            {{ 'ROI.UpgradeToSilverToUnlockGranular' | translate }}
                                        </p>
                                        <button class="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                                            {{ 'ROI.UpgradeToSilver' | translate }}
                                        </button>
                                    </div>
                                </div>
                             }
                        </div>
                    </div>
                </div>
           </div>
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
                            <p class="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
                                HMRC Tax Estimate (UK FHL)
                            </p>
                            <div class="text-sm font-bold text-rose-300">
                                -{{ taxData().estimatedTax | currency:'GBP':'symbol':'1.0-0' }} 
                                <span class="text-xs font-normal text-slate-400">@ {{ taxData().effectiveRate | number:'1.0-1' }}%</span>
                            </div>
                        </div>
                        <div class="text-xs text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5">
                            MTD Compliant
                        </div>
                     </div>
                 }
             </div>

             <!-- Middle: 10-Year Wealth Chart -->
             <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 min-h-[250px] relative flex flex-col">
                 <h3 class="text-lg font-bold text-white mb-4">{{ 'ROI.10YearWealthAccumulation' | translate }}</h3>
                 
                 @if (isTier3()) {
                     <div class="flex-1 flex items-stretch gap-1 relative z-10 px-2 min-h-0">
                         <!-- Simulated Area Chart -->
                         @for (d of wealthData(); track d.year) {
                              <div class="flex-1 flex flex-col justify-end gap-0.5 group">
                                   <!-- Appreciation -->
                                   <div class="w-full bg-emerald-500/80 rounded-t-sm relative hover:bg-emerald-400 transition-all duration-500" 
                                        [style.height.%]="d.appreciationHeight"></div>
                                   <!-- Principal Paydown -->
                                   <div class="w-full bg-blue-500/80 rounded-b-sm relative hover:bg-blue-400 transition-all duration-500" 
                                        [style.height.%]="d.equityHeight"></div>
                                   
                                   <span class="text-xs text-white/50 text-center mt-1">Y{{d.year}}</span>
                              </div>
                         }
                     </div>
                    
                     <div class="flex gap-4 justify-center mt-4 text-[10px] text-white font-medium">
                         <div class="flex items-center gap-2"><div class="w-3 h-1.5 bg-emerald-500 rounded-full"></div>{{ 'ROI.AssetValue' | translate }}</div>
                         <div class="flex items-center gap-2"><div class="w-3 h-1.5 bg-blue-500 rounded-full"></div>{{ 'ROI.EquityBuilt' | translate }}</div>
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

  // Collapsible Sections State
  designExpanded = signal(true);
  expensesExpanded = signal(true);
  seasonalityExpanded = signal(true);

  toggleDesign() { this.designExpanded.set(!this.designExpanded()); }
  toggleExpenses() { this.expensesExpanded.set(!this.expensesExpanded()); }
  toggleSeasonality() { this.seasonalityExpanded.set(!this.seasonalityExpanded()); }

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
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  baseOccupancy = signal(65);
  basePrice = computed(() => this.formValues()?.rent || 0);
  seasonalityFactors = signal([0.4, 0.5, 0.7, 0.8, 0.9, 1.0, 1.2, 1.3, 0.9, 0.7, 0.5, 0.8]);
  priceFactors = signal([1.0, 1.0, 1.0, 1.0, 1.2, 1.5, 1.8, 2.0, 1.2, 1.0, 0.9, 1.5]);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      price: [200000, Validators.required],
      rent: [150, Validators.required],
      loan: [900, Validators.required],
      condo: [120],
      insurance: [30]
    });
    this.formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

    // Tax & Wealth effect
    effect(() => {
      const flow = this.netCashflow();
      if (this.isTier3()) {
        const annualExpenses = (this.formValues()?.loan || 0) * 12; // simplified
        untracked(() => {
          this.updateTaxForecast(flow, annualExpenses);
        });
      }
    });
  }

  updateBaseOccupancy(event: Event) {
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

  wealthData = computed(() => {
    const v = this.formValues();
    const price = v?.price || 200000;
    const loan = v?.loan || 900;
    const annualAppreciation = 0.04;
    const annualPrincipal = loan * 12 * 0.25;

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

  totalExpenses = computed(() => {
    const v = this.formValues();
    return (v?.loan || 0) + (v?.condo || 0) + (v?.insurance || 0);
  });

  netCashflow = computed(() => {
    const v = this.formValues();
    const baseNightly = v?.rent || 0;
    const baseOcc = this.baseOccupancy() / 100;

    let annualIncome = 0;
    const occFactors = this.seasonalityFactors();
    const pFactors = this.priceFactors();

    for (let i = 0; i < 12; i++) {
      const monthlyOccupancy = Math.min(1, baseOcc * occFactors[i]);
      const monthlyPrice = baseNightly * pFactors[i];
      annualIncome += (monthlyPrice * 30.42 * monthlyOccupancy);
    }

    return annualIncome - (this.totalExpenses() * 12);
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
        loan: 1100,
        condo: 150,
        insurance: 40
      });

      this.baseOccupancy.set(analysis.estimatedOccupancy);
      this.aiSummary.set(analysis.summary);

    } catch (error) {
      console.error('AI Autofill failed', error);
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

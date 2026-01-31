import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-04-police',
    standalone: true,
    imports: [CommonModule,
        TranslatePipe
    ],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/30 text-xs font-mono">
           👮 Regulatory
        </div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
                <h3 class="text-white font-bold mb-6">{{ 'POLICE_CON.GuestReporting' | translate }}</h3>
                
                <div class="bg-white/5 rounded-lg p-6 mb-4 border border-white/5 relative overflow-hidden group">
                    @if (reportingState() === 'reported') {
                        <div class="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center animate-fade-in z-10">
                            <span class="material-icons text-4xl text-emerald-400 mb-2">check_circle</span>
                            <span class="text-emerald-400 font-bold uppercase tracking-widest text-xs">{{ 'POLICE_CON.ReportSent' | translate }}</span>
                        </div>
                    }

                    <div class="flex justify-between items-center mb-3">
                        <span class="text-white font-bold">{{ 'POLICE_CON.Booking8392JohnDoe' | translate }}</span>
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded"
                              [class.bg-emerald-500/20]="reportingState() === 'reported'"
                              [class.text-emerald-400]="reportingState() === 'reported'"
                              [class.bg-red-500/20]="reportingState() !== 'reported'"
                              [class.text-red-400]="reportingState() !== 'reported'">
                            {{ (reportingState() === 'reported' ? 'POLICE_CON.Reported' : 'POLICE_CON.Unreported') | translate }}
                        </span>
                    </div>
                    <p class="text-xs text-slate-500 mb-6">{{ 'POLICE_CON.CheckinToday' | translate }}</p>
                    
                    @if (reportingState() === 'reporting') {
                        <div class="mb-4">
                            <div class="flex justify-between text-[10px] text-indigo-400 font-bold mb-1 uppercase tracking-wider">
                                <span>{{ 'POLICE_CON.SendingFiles' | translate }}</span>
                                <span>{{ reportingProgress() }}%</span>
                            </div>
                            <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div class="bg-indigo-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" [style.width.%]="reportingProgress()"></div>
                            </div>
                        </div>
                    }

                    <div class="flex gap-3">
                        <button class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 rounded-lg transition-colors border border-white/5">{{ 'POLICE_CON.ManualCsv' | translate }}</button>
                        <button (click)="reportToPolice()" 
                                [disabled]="reportingState() !== 'idle'"
                                class="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                            @if (reportingState() === 'reporting') {
                                <span class="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            }
                            {{ (reportingState() === 'reporting' ? 'POLICE_CON.Sending' : 'POLICE_CON.ScanSend') | translate }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                @if (reportingState() === 'scanning') {
                    <div class="absolute inset-0 bg-indigo-600/10 flex flex-col items-center justify-center animate-pulse z-10">
                        <div class="w-32 h-32 border-2 border-indigo-400 rounded-xl flex items-center justify-center relative">
                            <div class="absolute top-0 left-0 w-full h-0.5 bg-indigo-400 animate-scan"></div>
                        </div>
                        <span class="mt-4 text-indigo-400 font-bold animate-pulse">{{ 'POLICE_CON.ScanningID' | translate }}</span>
                    </div>
                }

                <div class="h-24 w-24 border-4 border-dashed border-white/10 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all duration-500">
                    <span class="material-icons text-4xl">qr_code_scanner</span>
                </div>
                <h3 class="text-white font-bold mb-2">{{ 'POLICE_CON.MobileScanner' | translate }}</h3>
                <p class="text-slate-400 text-sm max-w-xs leading-relaxed">{{ 'POLICE_CON.UseYourPhoneToScan' | translate }}</p>
                
                @if (tier() !== 'TIER_3') {
                    <button class="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-full border border-white/10 transition-all">
                        {{ 'POLICE_CON.UnlockOcrScannerTier3' | translate }}
                    </button>
                } @else {
                     <button (click)="scanId()" [disabled]="reportingState() !== 'idle'"
                             class="mt-6 px-6 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-full border border-indigo-600/30 transition-all">
                        {{ 'POLICE_CON.TestScanner' | translate }}
                    </button>
                }
            </div>
             
             <!-- Coach -->
             <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 lg:col-span-2 mt-auto">
                  <div class="flex items-start gap-3">
                     <span class="text-xl">⏱️</span>
                     <div>
                         <h4 class="font-bold text-indigo-300 text-sm">{{ 'POLICE_CON.The24hourRule' | translate }}</h4>
                         <p class="text-xs text-indigo-200/80 mt-1">{{ 'POLICE_CON.InMostJurisdictionsSpainItaly' | translate }}</p>
                     </div>
                 </div>
             </div>
        </div>
    </div>
  `,
    styles: [`
        :host { display: block; height: 100%; }
        @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
    `]
})
export class PoliceConnectionComponent {
    translate = inject(TranslationService);
    session = inject(SessionStore);

    feature = computed(() => ({
        id: 'OPS_04',
        name: this.translate.instant('POLICONN.Title'),
        description: this.translate.instant('POLICONN.Description'),
    } as any));

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    reportingState = signal<'idle' | 'scanning' | 'reporting' | 'reported'>('idle');
    reportingProgress = signal<number>(0);

    scanId() {
        if (this.tier() !== 'TIER_3') return;

        this.reportingState.set('scanning');
        this.reportingProgress.set(0);

        const interval = setInterval(() => {
            this.reportingProgress.update(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => this.reportingState.set('idle'), 500);
                    return 100;
                }
                return p + 10;
            });
        }, 150);
    }

    reportToPolice() {
        this.reportingState.set('reporting');
        this.reportingProgress.set(0);

        const interval = setInterval(() => {
            this.reportingProgress.update(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    this.reportingState.set('reported');
                    return 100;
                }
                return p + 5;
            });
        }, 100);
    }
}

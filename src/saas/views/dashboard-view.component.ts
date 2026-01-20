
import { ChangeDetectionStrategy, Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportData } from '../../types';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'saas-dashboard-view',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 class="text-4xl font-bold text-white tracking-tight drop-shadow-md">
                {{ 'DASHBOARD.Welcome' | translate }}, {{ userName() }}
            </h1>
            <p class="mt-2 text-slate-300 text-lg font-light">
                {{ 'DASHBOARD.Subtitle' | translate }}
            </p>
        </div>
        <!-- Date or Status Widget -->
        <div class="flex items-center gap-4">
            <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-slate-200 text-sm font-medium">
                {{ 'DASHBOARD.IADashboard' | translate }}
            </div>
        </div>
      </div>
      
      <!-- Strategic Recommendation -->
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-8 shadow-2xl group transition-all hover:border-[#D4AF37]/30">
          <!-- Decorative Glow -->
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37] rounded-full mix-blend-overlay filter blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
          
          <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                  <span class="flex h-3 w-3 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
                  </span>
                  <h3 class="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">{{ 'DASHBOARD.StrategicRecommendation' | translate }}</h3>
              </div>
              
              <h2 class="text-3xl font-bold text-white mb-4">
                  {{ 'DASHBOARD.GoalPlan' | translate }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">{{ reportData().recommendedPlan }}</span>
              </h2>
              
              <p class="text-slate-200 text-lg leading-relaxed max-w-3xl font-light">
                  {{ reportData().planJustification }}
              </p>
              
              <div class="mt-8 flex flex-wrap gap-4">
                  <div class="flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm">
                      <svg class="w-5 h-5 mr-2 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {{ 'DASHBOARD.FullAnalysis' | translate }}
                  </div>
                  <div class="flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm">
                      <svg class="w-5 h-5 mr-2 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {{ 'DASHBOARD.AIPlan' | translate }}
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Grid Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Strengths Card -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-xl hover:bg-white/10 transition-colors duration-300">
          <div class="flex items-center mb-6">
              <div class="p-2 bg-green-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white">{{ 'DASHBOARD.MajorAssets' | translate }}</h3>
          </div>
          <ul class="space-y-4">
            @for (strength of reportData().strengths; track $index) {
              <li class="flex items-start text-slate-300">
                  <span class="mr-3 text-green-400 mt-1">●</span>
                  <span class="leading-relaxed">{{ strength }}</span>
              </li>
            }
          </ul>
        </div>

        <!-- Opportunities Card -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-xl hover:bg-white/10 transition-colors duration-300">
          <div class="flex items-center mb-6">
              <div class="p-2 bg-yellow-500/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white">{{ 'DASHBOARD.GrowthOpportunities' | translate }}</h3>
          </div>
          <ul class="space-y-4">
            @for (opportunity of reportData().opportunities; track $index) {
              <li class="flex items-start text-slate-300">
                  <span class="mr-3 text-[#D4AF37] mt-1">↗</span>
                  <span class="leading-relaxed">{{ opportunity }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
    <style>
        .animate-fade-in {
            animation: fadeIn 0.7s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
  `,
})
export class DashboardViewComponent {
  userName = input.required<string>();
  reportData = input.required<ReportData>();
  private notifService = inject(NotificationService);
  testStatus = signal<string | null>(null);

  async testNotification() {
    try {
      this.testStatus.set('Envoi...');
      await this.notifService.postNotification({
        title: 'Action IA confirmée',
        message: 'Votre description marketing a été optimisée avec succès.',
        type: 'success'
      });
      this.testStatus.set('Succès !');
      setTimeout(() => this.testStatus.set(null), 3000);
    } catch (e) {
      this.testStatus.set('Erreur (Vérifiez la DB)');
      setTimeout(() => this.testStatus.set(null), 5000);
    }
  }
}

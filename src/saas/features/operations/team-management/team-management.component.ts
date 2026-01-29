import { TranslationService } from '../../../../services/translation.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../types';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'ops-06-team-management',
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
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/30 text-xs font-mono">
           👥 RBAC
        </div>
      </div>

       <div class="flex-1 bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
            <div class="flex justify-between items-center mb-6">
                 <h3 class="text-xl font-bold text-white">{{ 'TEAM.TeamMembers' | translate }}</h3>
                 <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2" data-debug-id="team-invite-btn">
                     <span class="material-icons text-sm">person_add</span>{{ 'TEAM.Invite' | translate }}</button>
            </div>

            <!-- Team List -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-slate-400 text-xs uppercase border-b border-white/10">
                            <th class="p-3 font-bold">{{ 'TEAM.User' | translate }}</th>
                            <th class="p-3 font-bold">{{ 'TEAM.Role' | translate }}</th>
                            <th class="p-3 font-bold">{{ 'TEAM.Permissions' | translate }}</th>
                            <th class="p-3 font-bold">{{ 'TEAM.LastActive' | translate }}</th>
                            <th class="p-3"></th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">JB</div>
                                    <div>
                                        <div class="text-white font-bold">{{ 'TEAM.JosBYou' | translate }}</div>
                                        <div class="text-slate-500 text-xs">jose@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3"><span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">{{ 'TEAM.Owner' | translate }}</span></td>
                            <td class="p-3 text-slate-400">{{ 'TEAM.FullAccess' | translate }}</td>
                            <td class="p-3 text-emerald-400">{{ 'TEAM.Now' | translate }}</td>
                            <td class="p-3"></td>
                        </tr>
                        
                        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td class="p-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">MA</div>
                                    <div>
                                        <div class="text-white font-bold">{{ 'TEAM.MarieAdjunct' | translate }}</div>
                                        <div class="text-slate-500 text-xs">marie@agency.com</div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-600/20 text-slate-300 text-xs font-bold border border-slate-600/30">{{ 'TEAM.Cohost' | translate }}</span></td>
                            <td class="p-3">
                                 @if (tier() === 'TIER_3') {
                                     <div class="flex gap-1">
                                         <span class="w-2 h-2 rounded-full bg-emerald-500" title="{{ \'TEAM.Messages\' | translate }}"></span>
                                         <span class="w-2 h-2 rounded-full bg-emerald-500" title="{{ \'TEAM.Calendar\' | translate }}"></span>
                                         <span class="w-2 h-2 rounded-full bg-red-500" title="{{ \'TEAM.FinanceBlocked\' | translate }}"></span>
                                     </div>
                                 } @else {
                                     <span class="text-slate-500 text-xs">{{ 'TEAM.StandardAccess' | translate }}</span>
                                 }
                            </td>
                            <td class="p-3 text-slate-500">2 hours ago</td>
                            <td class="p-3 text-right">
                                <button class="text-slate-500 hover:text-white" data-debug-id="team-row-actions-1"><span class="material-icons text-sm">more_vert</span></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            @if (tier() === 'TIER_3') {
                <div class="mt-8 p-4 bg-slate-900 rounded-lg border border-white/5 font-mono text-xs">
                    <h4 class="text-slate-400 uppercase font-bold mb-3">{{ 'TEAM.AuditLogRecentActivity' | translate }}</h4>
                    <div class="space-y-2 text-slate-500">
                        <div class="flex gap-4">
                            <span class="text-slate-600">10:00 AM</span>
                            <span><span class="text-indigo-400">{{ 'TEAM.MarieA' | translate }}</span> changed price for <span class="text-white">{{ 'TEAM.LoftMarais' | translate }}</span> to €150.</span>
                        </div>
                        <div class="flex gap-4">
                            <span class="text-slate-600">09:45 AM</span>
                            <span><span class="text-indigo-400">{{ 'TEAM.MarieA' | translate }}</span> responded to Guest <span class="text-white">{{ 'TEAM.JohnDoe' | translate }}</span>.</span>
                        </div>
                    </div>
                </div>
            }
       </div>
       
       <!-- Coach -->
       <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div class="flex items-start gap-3">
               <span class="text-xl">🔐</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">{{ 'TEAM.PrincipleOfLeastPrivilege' | translate }}</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">Never share your main password. Give staff their own restricted accounts (Tier 3) so you can audit *who* did *what*.</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class TeamManagementComponent {
    translate = inject(TranslationService);
    feature = computed(() => ({
        id: 'OPS_06',
        name: this.translate.instant('TEAMMANA.Title'),
        description: this.translate.instant('TEAMMANA.Description'),
    } as any));

    session = inject(SessionStore);
    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');
}

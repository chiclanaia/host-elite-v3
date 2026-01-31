import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { SessionStore } from '../../../../state/session.store';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
    selector: 'app-provider-app',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
    <div class="h-full flex flex-col gap-6 animate-fade-in-up">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ feature().name }}</h1>
          <p class="text-slate-400 mt-2 max-w-2xl">{{ feature().description }}</p>
        </div>
        <div class="px-4 py-2 bg-cyan-600/10 text-cyan-400 rounded-lg border border-cyan-600/30 text-xs font-mono">{{ 'PROVIDER_A.MobileTerminal' | translate }}</div>
      </div>

       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
            <!-- Mobile Preview -->
            <div class="relative mx-auto border-8 border-slate-900 bg-slate-800 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl overflow-hidden flex flex-col scale-90 lg:scale-100 origin-top">
                <div class="bg-indigo-600 p-4 text-white text-center font-bold">{{ 'PROVIDER_A.HousekeeperApp' | translate }}</div>
                
                <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    <!-- Task Card -->
                    <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-bold text-slate-900 text-sm">{{ 'PROVIDER_A.Cleaning' | translate }}</div>
                            <span class="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">{{ 'PROVIDER_A.Urgent' | translate }}</span>
                        </div>
                        <p class="text-slate-500 text-[10px] mb-3">{{ 'PROVIDER_A.Apt4bGuestsArriving3pm' | translate }}</p>
                        
                        <div class="space-y-3 border-t pt-3">
                            @for (task of tasks(); track task.id) {
                                <div (click)="toggleTask(task.id)" class="flex items-center gap-3 cursor-pointer group">
                                    <div class="h-5 w-5 rounded border-2 flex items-center justify-center transition-all"
                                         [class.border-indigo-600]="task.completed"
                                         [class.bg-indigo-600]="task.completed"
                                         [class.border-slate-300]="!task.completed">
                                        @if (task.completed) {
                                            <span class="material-icons text-white text-sm">check</span>
                                        }
                                    </div>
                                    <span class="text-xs transition-colors" 
                                          [class.text-slate-400]="task.completed"
                                          [class.line-through]="task.completed"
                                          [class.text-slate-700]="!task.completed">
                                        {{ (task.titleKey ? (task.titleKey | translate) : task.title) }}
                                    </span>
                                </div>
                            }
                        </div>
                        
                         @if (tier() === 'TIER_3') {
                            <div class="mt-4">
                                <button class="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded text-[10px] font-bold flex items-center justify-center gap-2 border border-slate-200 transition-colors">
                                    <span class="material-icons text-xs">camera_alt</span>{{ 'PROVIDER_A.UploadProof' | translate }}</button>
                            </div>
                        }
                    </div>
                </div>

                 <div class="bg-slate-900 p-4 flex justify-around text-slate-500">
                    <span class="material-icons text-indigo-500">list</span>
                    <span class="material-icons">history</span>
                    <span class="material-icons">person</span>
                </div>
            </div>

            <!-- Control Panel -->
            <div class="bg-slate-800 rounded-xl border border-white/10 p-6 flex flex-col">
                <h3 class="text-white font-bold mb-6">{{ 'PROVIDER_A.ProviderManagement' | translate }}</h3>
                
                <div class="bg-black/20 rounded-lg p-4 mb-6 border border-white/5">
                    <div class="flex justify-between items-center text-sm text-white mb-2">
                        <span class="font-bold">{{ 'PROVIDER_A.AliceCleaner' | translate }}</span>
                        <span class="flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {{ 'PROVIDER_A.Online' | translate }}
                        </span>
                    </div>
                    <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div class="w-3/4 bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <p class="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">{{ 'PROVIDER_A.CompletionRate98' | translate }}</p>
                </div>

                <div class="flex-1 p-6 rounded-xl border-2 border-dashed border-white/10 text-center flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/50 transition-all">
                    <div class="p-4 bg-indigo-500/10 rounded-full text-indigo-400 group-hover:scale-110 transition-transform">
                        <span class="material-icons text-3xl">mail</span>
                    </div>
                    
                    @if (invitationState().status === 'success') {
                        <div class="animate-bounce-in bg-emerald-500/10 text-emerald-400 p-3 rounded-lg border border-emerald-500/20 w-full text-xs font-bold">
                             ✓ Invitation sent to {{ invitationState().email }}
                        </div>
                    } @else {
                        <div class="w-full max-w-xs space-y-4">
                            <p class="text-slate-400 text-sm">{{ 'PROVIDER_A.SendAppInvitation' | translate }}</p>
                            <input #emailInv type="text" placeholder="housekeeper@example.com" (keyup.enter)="inviteProvider(emailInv)" class="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition-all">
                            <button (click)="inviteProvider(emailInv)" 
                                    [disabled]="invitationState().status === 'sending'"
                                    class="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20">
                                {{ invitationState().status === 'sending' ? 'SENDING...' : ('PROVIDER_A.InviteViaEmail' | translate) }}
                            </button>
                        </div>
                    }
                </div>
            </div>
       </div>
       
       <!-- Coach -->
       <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
            <div class="flex items-start gap-3">
               <span class="text-xl">📸</span>
               <div>
                   <h4 class="font-bold text-indigo-300 text-sm">{{ 'PROVIDER_A.EvidenceBasedReporting' | translate }}</h4>
                   <p class="text-xs text-indigo-200/80 mt-1">Always require 'After' photos from your team. If a guest claims "it was dirty", you win the dispute instantly with time-stamped proof.</p>
               </div>
           </div>
       </div>
    </div>
  `,
    styles: [`:host { display: block; height: 100%; }`]
})
export class ProviderAppComponent {
    translate = inject(TranslationService);
    session = inject(SessionStore);

    feature = computed(() => ({
        id: 'OPS_09',
        name: this.translate.instant('PROVAPP.Title'),
        description: this.translate.instant('PROVAPP.Description'),
    } as any));

    tier = computed(() => this.session.userProfile()?.plan || 'Freemium');

    tasks = signal([
        { id: '1', titleKey: 'PROVIDER_A.ChangeLinens', completed: false },
        { id: '2', titleKey: 'PROVIDER_A.RestockCoffee', completed: true },
        { id: '3', titleKey: 'PROVIDER_A.SanitizeSurfaces', completed: false }
    ]);

    invitationState = signal<{ status: 'idle' | 'sending' | 'success', email: string }>({ status: 'idle', email: '' });

    toggleTask(id: string) {
        this.tasks.update(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    }

    inviteProvider(emailInput: HTMLInputElement) {
        const email = emailInput.value;
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        this.invitationState.set({ status: 'sending', email });

        // Simulate API call
        setTimeout(() => {
            this.invitationState.set({ status: 'success', email });
            emailInput.value = '';
            setTimeout(() => this.invitationState.set({ status: 'idle', email: '' }), 3000);
        }, 1500);
    }
}

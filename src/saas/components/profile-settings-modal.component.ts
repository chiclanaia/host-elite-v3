
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionStore } from '../../state/session.store';
import { SupabaseService } from '../../services/supabase.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NotificationService } from '../../services/notification.service';
import { HostRepository } from '../../services/host-repository.service';
import { PlanConfig } from '../../types';

@Component({
  selector: 'saas-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
         (click)="onClose()">
      
      <!-- Modal Content -->
      <div class="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden animate-bounce-in"
           (click)="$event.stopPropagation()">
           
           <!-- Decorative top splash -->
           <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#D4AF37]/20 to-transparent"></div>
           
           <div class="relative p-6">
             
             <!-- MAIN VIEW: Profile Form -->
             <ng-container *ngIf="confirmationStep() === 'none'">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-[#D4AF37]/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-white">{{ 'PROFILE.SettingsTitle' | translate }}</h2>
                  </div>
                  <button (click)="onClose()" class="text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div *ngIf="errorMessage()" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {{ errorMessage() }}
                </div>

                <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="space-y-6">
                  <!-- Avatar Section -->
                  <div class="flex items-center gap-6">
                    <div class="relative group cursor-pointer">
                      <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-[#D4AF37] transition-colors relative">
                        <img *ngIf="avatarPreview() || profile()?.avatar_url" 
                              [src]="avatarPreview() || profile()?.avatar_url" 
                              class="w-full h-full object-cover">
                        <div *ngIf="!avatarPreview() && !profile()?.avatar_url" 
                              class="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-xs text-white font-medium">Modifier</span>
                        </div>
                      </div>
                      <input type="file" (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-slate-400 leading-relaxed">{{ 'PROFILE.AvatarHelp' | translate }}</p>
                    </div>
                  </div>

                  <!-- Form Fields -->
                  <div class="space-y-4">
                    
                    <!-- Email (Disabled) -->
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ 'PROFILE.Email' | translate }}</label>
                      <input [value]="profile()?.email" disabled
                              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed">
                    </div>

                    <!-- Full Name -->
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ 'PROFILE.FullName' | translate }}</label>
                      <input formControlName="full_name"
                              [placeholder]="'PROFILE.FullNamePlaceholder' | translate"
                              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all">
                    </div>

                    <!-- Plan & Stripe ID Row -->
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Plan -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ 'PROFILE.Plan' | translate }}</label>
                            <select [formControl]="planControl" (change)="onPlanChange($event)"
                                    class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none cursor-pointer">
                              <option *ngFor="let p of plans()" [value]="p.id">
                                {{ p.id }}
                              </option>
                            </select>
                        </div>

                        <!-- Stripe Customer ID -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ 'PROFILE.StripeId' | translate }}</label>
                            <input formControlName="stripe_customer_id"
                                  placeholder="cus_..."
                                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono text-sm">
                        </div>
                    </div>

                    <!-- Language -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ 'PROFILE.Language' | translate }}</label>
                            <span *ngIf="planControl.value !== 'Gold'" class="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                                </svg>
                                Gold Only
                            </span>
                        </div>
                        <div class="relative">
                            <select formControlName="language"
                                    [attr.disabled]="planControl.value !== 'Gold' ? true : null"
                                    class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none"
                                    [class.opacity-50]="planControl.value !== 'Gold'"
                                    [class.cursor-not-allowed]="planControl.value !== 'Gold'">
                              <option value="" disabled>{{ 'PROFILE.SelectLanguage' | translate }}</option>
                              <option value="en">English</option>
                              <option value="fr">Français</option>
                              <option value="es">Español</option>
                            </select>
                            <div *ngIf="planControl.value !== 'Gold'" class="absolute inset-0 z-10 cursor-not-allowed" title="Upgrade to Gold to change language"></div>
                        </div>
                    </div>

                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button type="button" (click)="onClose()" 
                            class="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                        {{ 'COMMON.Cancel' | translate }}
                    </button>
                    <button type="submit" [disabled]="profileForm.invalid || isSaving()"
                            class="px-6 py-2 bg-[#D4AF37] text-slate-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                      <span *ngIf="isSaving()" class="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                      {{ 'COMMON.Save' | translate }}
                    </button>
                  </div>
                </form>
             </ng-container>

             <!-- OVERLAY: UPGRADE CONFIRMATION -->
             <div *ngIf="confirmationStep() === 'upgrade'" class="text-center py-4 animate-bounce-in">
                <div class="mb-4 text-[#D4AF37]">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                   </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">{{ 'PROFILE.UpgradeTitle' | translate }}</h3>
                <p class="text-slate-300 mb-6">
                   {{ 'PROFILE.UpgradeMessage' | translate:{ plan: pendingPlan()?.id, price: pendingPlan()?.price } }}
                </p>
                <div class="flex justify-center gap-4">
                   <button (click)="cancelChange()" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                      {{ 'COMMON.Cancel' | translate }}
                   </button>
                   <button (click)="confirmChange()" class="px-6 py-2 bg-[#D4AF37] text-slate-900 font-bold rounded-lg hover:bg-yellow-500 shadow-lg shadow-yellow-500/20">
                      {{ 'COMMON.Confirm' | translate }}
                   </button>
                </div>
             </div>

             <!-- OVERLAY: DOWNGRADE WARNING -->
             <div *ngIf="confirmationStep() === 'downgrade_warning'" class="text-center py-4 animate-bounce-in">
                <div class="mb-4 text-red-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">{{ 'PROFILE.DowngradeWarningTitle' | translate }}</h3>
                <p class="text-slate-300 mb-6">
                   {{ 'PROFILE.DowngradeMessage' | translate }}
                </p>
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
                   <p class="text-red-400 text-sm font-bold mb-2">{{ 'PROFILE.FeaturesLost' | translate }}:</p>
                   <ul class="list-disc list-inside text-red-300 text-sm space-y-1">
                      <li>Access to premium AI models</li>
                      <li>Priority support</li>
                      <li>Advanced analytics</li>
                   </ul>
                </div>
                <div class="flex justify-center gap-4">
                   <button (click)="cancelChange()" class="px-4 py-2 text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                      {{ 'COMMON.KeepCurrentPlan' | translate }}
                   </button>
                   <button (click)="proceedToDoubleConfirm()" class="px-4 py-2 text-red-500 hover:text-red-400 transition-colors">
                      {{ 'PROFILE.ContinueDowngrade' | translate }}
                   </button>
                </div>
             </div>

             <!-- OVERLAY: DOWNGRADE DOUBLE CONFIRM -->
             <div *ngIf="confirmationStep() === 'downgrade_confirm'" class="text-center py-4 animate-bounce-in">
                <h3 class="text-2xl font-bold text-white mb-4">{{ 'COMMON.ReallySure' | translate }}</h3>
                <p class="text-slate-400 mb-8">{{ 'PROFILE.DowngradeFinalMessage' | translate }}</p>
                
                <div class="flex justify-center gap-4">
                   <button (click)="cancelChange()" class="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200">
                      {{ 'COMMON.NoCancel' | translate }}
                   </button>
                   <button (click)="confirmChange()" class="px-6 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                      {{ 'COMMON.YesImSure' | translate }}
                   </button>
                </div>
             </div>

           </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-bounce-in {
      animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.95) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ProfileModalComponent {
  private store = inject(SessionStore);
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private repository = inject(HostRepository);

  profile = this.store.userProfile;
  profileForm: FormGroup;
  planControl: FormControl;

  avatarPreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  // Plans Management
  plans = signal<PlanConfig[]>([]);
  pendingPlan = signal<PlanConfig | null>(null);
  confirmationStep = signal<'none' | 'upgrade' | 'downgrade_warning' | 'downgrade_confirm'>('none');

  constructor() {
    const user = this.profile();

    // Separate control for Plan to handle events manually
    this.planControl = new FormControl(user?.plan || 'Freemium');

    this.profileForm = this.fb.group({
      full_name: [user?.full_name || '', [Validators.required, Validators.minLength(2)]],
      stripe_customer_id: [user?.stripe_customer_id || ''],
      language: [user?.language || 'en']
    });

    this.loadPlans();
  }

  async loadPlans() {
    // Populate plans - usually from DB, here hardcoded fallback if empty + async fetch
    // We assume the repository has the right data or we mock it for the selector
    let availablePlans = await this.repository.getPlans();
    if (availablePlans.length === 0) {
      // Fallback for UI if DB is empty
      availablePlans = [
        { id: 'Freemium', price: 0, features: [] },
        { id: 'Bronze', price: 29, features: [] },
        { id: 'Silver', price: 49, features: [] },
        { id: 'Gold', price: 99, features: [] }
      ];
    }
    this.plans.set(availablePlans);
  }

  onPlanChange(event: any) {
    const newPlanId = event.target.value;
    const currentPlanId = this.profile()?.plan || 'Freemium';

    if (newPlanId === currentPlanId) return;

    const newPlan = this.plans().find(p => p.id === newPlanId);
    const currentPlan = this.plans().find(p => p.id === currentPlanId);

    if (!newPlan) return;

    // Validation: Require Stripe ID for paid plans
    if (newPlanId !== 'Freemium') {
      const stripeId = this.profileForm.get('stripe_customer_id')?.value;
      if (!stripeId || stripeId.trim() === '') {
        // Revert changes
        this.planControl.setValue(currentPlanId, { emitEvent: false });
        this.notificationService.postNotification({
          title: 'Payment Info Required',
          message: 'Please enter your Stripe Customer ID first to upgrade your plan.',
          type: 'warning'
        });
        // Focus the input
        const input = document.querySelector('input[formControlName="stripe_customer_id"]') as HTMLElement;
        input?.focus();
        return;
      }
    }

    this.pendingPlan.set(newPlan);

    // Simple pricing logic check
    const newPrice = newPlan.price || 0;
    const currentPrice = currentPlan?.price || 0;

    if (newPrice > currentPrice) {
      this.confirmationStep.set('upgrade');
    } else {
      this.confirmationStep.set('downgrade_warning');
    }
  }

  proceedToDoubleConfirm() {
    this.confirmationStep.set('downgrade_confirm');
  }

  cancelChange() {
    // Reset selection
    this.planControl.setValue(this.profile()?.plan || 'Freemium');
    this.confirmationStep.set('none');
    this.pendingPlan.set(null);
  }

  confirmChange() {
    // Commit the change to the form value concept (though we don't have it in the main group anymore)
    // We will handle it in onSave, but here we just exit the wizard state
    // Actually, we want to update the UI reflectively but essentially we just wait for the user to click "Save" 
    // OR, usually plan changes are immediate. The user request implies a modal pop *when deciding*, likely meaning immediate action?
    // "when the user decides to change his/her plan... confirm... notification"
    // Integrating it into the main Save action is safer for atomicity, but the prompt implies a specific flow for the plan.
    // Let's assume the confirmation MERESLY ACCEPTS the new value into the pending form state for the final "Save".
    // BUT the prompt says "notification to the user... in both case upgrade or downgrade accepted".
    // This implies immediate feedback. However, having a "Save" button on the modal suggests batch saving.
    // Compromise: We confirm the selection in the UI, show a toast "Plan selected: X", and then they hit Save to persist everything.
    // Or, better user experience: Changing plan is a significant action, maybe we persist it immediately? 
    // Let's stick to: Confirm -> Set Control Value -> Return to Form -> User clicks Save.
    // Wait, the Prompt says "confirm the upgrade... for the downgrade...".

    // Changing approach: The Confirmation Modal is strictly for the logical acceptance. 
    // We will treat the plan change as part of the overall "Save" payload. 
    // EXCEPT: If the plan change requires payment (stripe), usually it's immediate. 
    // Given the current scope (SaaS template), I will just confirm the UI selection and notify.

    this.notificationService.postNotification({
      title: 'Plan Selection Updated',
      message: `Plan changed to ${this.pendingPlan()?.id}. Don't forget to Save.`,
      type: 'info'
    });

    this.confirmationStep.set('none');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async onSave() {
    if (this.profileForm.invalid || this.isSaving()) return;

    // Final Validation: Require Stripe ID for paid plans
    const selectedPlan = this.planControl.value;
    const stripeId = this.profileForm.value.stripe_customer_id;

    if (selectedPlan !== 'Freemium' && (!stripeId || stripeId.trim() === '')) {
      this.notificationService.postNotification({
        title: 'Payment Info Required',
        message: 'You cannot save a paid plan without a valid Stripe Customer ID.',
        type: 'error'
      });
      // Focus the input
      const input = document.querySelector('input[formControlName="stripe_customer_id"]') as HTMLElement;
      input?.focus();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      let avatarUrl = this.profile()?.avatar_url;

      if (this.selectedFile()) {
        const { publicUrl, error } = await this.supabase.uploadAvatar(this.profile()!.id, this.selectedFile()!);
        if (error) throw error;
        avatarUrl = publicUrl || undefined;
      }

      await this.store.updateProfile({
        full_name: this.profileForm.value.full_name,
        plan: this.planControl.value, // Get from standalone control
        stripe_customer_id: this.profileForm.value.stripe_customer_id,
        language: this.profileForm.value.language,
        avatar_url: avatarUrl
      });

      this.notificationService.postNotification({
        title: 'Profile Updated',
        message: 'Your profile settings have been saved.',
        type: 'success'
      });

      this.onClose();
    } catch (e: any) {
      console.error("[ProfileSettings] Save Error:", e);
      this.errorMessage.set(e.message || "Error saving profile");
      this.notificationService.postNotification({
        title: 'Error',
        message: 'Failed to save profile settings.',
        type: 'error'
      });
    } finally {
      this.isSaving.set(false);
    }
  }

  onClose() {
    (window as any).closeProfileModal?.();
  }
}

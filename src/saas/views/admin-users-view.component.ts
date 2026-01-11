
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostRepository } from '../../services/host-repository.service';
import { SessionStore } from '../../state/session.store';
import { UserProfile, AppPlan, ApiKey, PlanConfig } from '../../types';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'saas-admin-users-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes bounceIn {
        0% { transform: scale(0.1); opacity: 0; }
        60% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); }
    }
    .animate-bounce-in {
        animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .toggle-checkbox:checked {
        right: 0;
        border-color: #68D391;
    }
    .toggle-checkbox {
        right: auto;
        left: 0;
        transition: all 0.3s;
    }
    .toggle-checkbox:checked {
        left: auto;
        right: 0;
    }
  `],
  templateUrl: './admin-users-view.component.html'
})
export class AdminUsersViewComponent implements OnInit {
  private repository = inject(HostRepository);
  private store = inject(SessionStore); // Inject Store for immediate updates
  private fb: FormBuilder = inject(FormBuilder);

  // Global Config (Linked to store for reading, but local signal for form state)
  showPlanBadges = signal(false);

  // Users State
  users = signal<UserProfile[]>([]);
  isUserModalOpen = signal(false);
  editingUserId = signal<string | null>(null);
  
  // API Keys State
  apiKeys = signal<ApiKey[]>([]);
  isKeyModalOpen = signal(false);
  processingKeyId = signal<string | null>(null); 
  
  // Plans State
  plans = signal<PlanConfig[]>([]);
  loadingPlans = signal(false);

  // General State
  successMessage = signal<string | null>(null);
  showSqlError = signal(false);
  
  userForm: FormGroup;
  apiKeyForm: FormGroup;

  // Dictionary of all possible features in the system
  readonly availableFeatures = [
      { id: 'wheel', label: 'Roue de l\'Hôte (Diag)' },
      { id: 'report', label: 'Rapport IA' },
      { id: 'microsite', label: 'Microsite Public' },
      { id: 'booklet', label: 'Livret d\'Accueil' },
      { id: 'checklists', label: 'Checklists Opér.' },
      { id: 'ical-sync', label: 'Synchro iCal' },
      { id: 'ai-assistant', label: 'Assistant IA (Msg)' },
      { id: 'ai-prompts', label: 'IA Générative (Remplissage)' },
      { id: 'vocal-concierge', label: 'Concierge Vocal' },
      { id: 'training', label: 'Académie' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'coaching', label: 'Coaching' }
  ];
  
  constructor() {
      this.userForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          fullName: ['', Validators.required],
          role: ['user', Validators.required],
          plan: ['Freemium', Validators.required],
          email_confirmed: [true]
      });

      this.apiKeyForm = this.fb.group({
          name: ['', Validators.required],
          key: ['', Validators.required]
      });
  }

  async ngOnInit() {
    this.refreshSettings();
    this.refreshUsers();
    this.refreshApiKeys();
    this.refreshPlans();
  }

  async refreshSettings() {
      try {
          const settings = await this.repository.getGlobalSettings();
          this.showPlanBadges.set(settings.show_plan_badges);
          // Sync store immediately to ensure sidebar reflects current DB state on load
          this.store.showPlanBadges.set(settings.show_plan_badges);
      } catch (e) {
          console.error("Error loading settings:", e);
      }
  }

  async refreshUsers() {
    try {
        const users = await this.repository.getAllUsers();
        this.users.set(users);
    } catch (e) {
        console.error("Error refreshing users:", e);
    }
  }

  async refreshApiKeys() {
      try {
          const keys = await this.repository.listApiKeys();
          this.apiKeys.set(keys);
      } catch (e: any) {
          console.error("Error fetching API keys:", e);
      }
  }

  async refreshPlans() {
      this.loadingPlans.set(true);
      try {
          const data = await this.repository.getPlans();
          // Ensure features is array
          const cleanData = data.map(p => ({
              ...p,
              features: Array.isArray(p.features) ? p.features : []
          }));
          this.plans.set(cleanData);
          // Update store plans too to ensure badge logic is up to date
          this.store.allPlans.set(cleanData);
      } catch(e) {
          console.error("Error fetching plans:", e);
      } finally {
          this.loadingPlans.set(false);
      }
  }

  // Helper to extract clean message from Error object or Supabase PostgREST error
  private getErrorMessage(e: any): string {
      console.log('Raw error object:', e); 
      if (!e) return "Erreur inconnue";
      
      if (typeof e === 'string') return e;
      if (e instanceof Error) return e.message;
      
      const code = e.code;
      let message = e.message || e.msg || e.error_description;

      if (typeof message === 'object' && message !== null) {
          try {
              message = JSON.stringify(message);
          } catch {
              message = "Détails illisibles";
          }
      }

      if (message && typeof message === 'string') {
          return code ? `Erreur (${code}): ${message}` : message;
      }
      
      if (code) {
          return `Erreur SQL ${code}: ${e.details || e.hint || 'Détails non disponibles'}`;
      }

      try {
          return JSON.stringify(e);
      } catch (err) {
          return "Erreur (Objet non affichable)";
      }
  }

  // New Helper for RLS Error Handling
  private handleDatabaseError(e: any) {
      console.error("DB Error:", e);
      const code = (e as any).code;

      if (code === "RLS_BLOCKED_PROFILE" || code === "RLS_BLOCKED_PLAN") {
          alert("Erreur de permission : La base de données a bloqué la modification (RLS). Veuillez vérifier les logs console pour le script SQL de correction.");
          console.warn(`
⚠️ SQL FIX SUGGESTION FOR RLS ⚠️
--------------------------------
-- 1. Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_plans ENABLE ROW LEVEL SECURITY;

-- 2. Policies pour PROFILS
DROP POLICY IF EXISTS "Read all profiles" ON profiles;
CREATE POLICY "Read all profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Update own profile" ON profiles;
CREATE POLICY "Update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin update all profiles" ON profiles;
CREATE POLICY "Admin update all profiles" ON profiles FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Policies pour PLANS
DROP POLICY IF EXISTS "Read plans" ON app_plans;
CREATE POLICY "Read plans" ON app_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update plans" ON app_plans;
CREATE POLICY "Admin update plans" ON app_plans FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
          `);
          return;
      }

      const err = this.getErrorMessage(e);
      alert(`Erreur: ${err}`);
  }

  // --- SETTINGS ACTIONS ---
  async toggleBadges(event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      
      // 1. Update Local UI State
      this.showPlanBadges.set(isChecked);
      
      // 2. Update Global Store (Instant feedback for Sidebar)
      this.store.showPlanBadges.set(isChecked);

      // 3. Persist to DB
      try {
          await this.repository.updateGlobalSettings({ show_plan_badges: isChecked });
          this.showSuccess("Paramètres globaux mis à jour.");
      } catch (e) {
          console.error(e);
          // Revert on error
          this.showPlanBadges.set(!isChecked);
          this.store.showPlanBadges.set(!isChecked);
          this.handleDatabaseError(e);
      }
  }

  // --- API KEY ACTIONS ---

  openAddKeyModal() {
      this.apiKeyForm.reset();
      this.isKeyModalOpen.set(true);
  }

  closeKeyModal() {
      this.isKeyModalOpen.set(false);
  }

  async submitApiKey() {
      if (this.apiKeyForm.valid) {
          const { name, key } = this.apiKeyForm.value;
          try {
              await this.repository.addApiKey(name, key);
              this.showSuccess("Clé API ajoutée et chiffrée avec succès !");
              this.closeKeyModal();
              await this.refreshApiKeys();
          } catch (e: any) {
              console.error(e);
              alert(`Erreur lors de l'ajout : ${this.getErrorMessage(e)}`);
          }
      }
  }

  async activateKey(key: ApiKey) {
      if (this.processingKeyId()) return; 
      
      this.processingKeyId.set(key.id);
      try {
          await this.repository.setActiveApiKey(key.id);
          this.showSuccess(`Clé "${key.name}" activée.`);
          await this.refreshApiKeys();
      } catch (e: any) {
          console.error("Activation failed:", e);
          const msg = this.getErrorMessage(e);
          const hint = (msg.includes('function') || (e && e.code === '42883')) 
            ? "\n\nAstuce: Vérifiez que la fonction SQL 'set_active_api_key' existe dans Supabase." 
            : "";
          
          alert(`Erreur lors de l'activation : ${msg}${hint}`);
      } finally {
          this.processingKeyId.set(null);
      }
  }

  async deleteApiKey(key: ApiKey) {
      if(confirm(`Supprimer la clé "${key.name}" ?`)) {
          this.processingKeyId.set(key.id);
          try {
              await this.repository.deleteApiKey(key.id);
              this.showSuccess("Clé supprimée.");
              await this.refreshApiKeys();
          } catch (e: any) {
              alert(`Erreur lors de la suppression : ${this.getErrorMessage(e)}`);
          } finally {
              this.processingKeyId.set(null);
          }
      }
  }

  // --- PLANS ACTIONS ---

  getPlanStyle(planId: string): { header: string, text: string, accent: string } {
      const id = planId.toLowerCase();
      if (id.includes('freemium')) return { header: 'bg-slate-900 text-white', text: 'text-slate-900', accent: 'accent-slate-900' };
      if (id.includes('bronze')) return { header: 'bg-amber-700 text-white', text: 'text-amber-800', accent: 'accent-amber-700' };
      if (id.includes('silver')) return { header: 'bg-slate-400 text-white', text: 'text-slate-600', accent: 'accent-slate-400' };
      if (id.includes('gold')) return { header: 'bg-yellow-500 text-white', text: 'text-yellow-600', accent: 'accent-yellow-500' };
      return { header: 'bg-indigo-600 text-white', text: 'text-indigo-900', accent: 'accent-indigo-600' };
  }

  isFeatureEnabled(plan: PlanConfig, featureId: string): boolean {
      return plan.features.includes(featureId);
  }

  toggleFeature(plan: PlanConfig, featureId: string, event: Event) {
      const checked = (event.target as HTMLInputElement).checked;
      let newFeatures = [...plan.features];
      
      if (checked) {
          if (!newFeatures.includes(featureId)) newFeatures.push(featureId);
      } else {
          newFeatures = newFeatures.filter(f => f !== featureId);
      }

      // Optimistic Update for UI responsiveness
      const updatedPlans = this.plans().map(p => p.id === plan.id ? { ...p, features: newFeatures } : p);
      this.plans.set(updatedPlans);
      
      // Update Store immediately so badges update in Sidebar
      this.store.allPlans.set(updatedPlans);
      
      // Auto-save logic
      this.savePlan({ ...plan, features: newFeatures });
  }

  updatePrice(plan: PlanConfig, event: Event) {
      const newPrice = Number((event.target as HTMLInputElement).value);
      this.plans.update(plans => plans.map(p => p.id === plan.id ? { ...p, price: newPrice } : p));
      this.savePlan({ ...plan, price: newPrice });
  }

  async savePlan(plan: PlanConfig) {
      try {
          await this.repository.updatePlanConfig(plan.id, plan.price, plan.features);
          this.showSuccess(`Offre ${plan.id} mise à jour !`);
          // Verify persistence
          await this.refreshPlans();
      } catch(e: any) {
          this.handleDatabaseError(e);
          this.refreshPlans(); // Revert
      }
  }

  // --- USER ACTIONS ---

  showSuccess(msg: string) {
      this.successMessage.set(msg);
      setTimeout(() => this.successMessage.set(null), 3000);
  }

  async updatePlan(user: UserProfile, newPlan: AppPlan) {
    try {
        await this.repository.updateUserProfile(user.id, { plan: newPlan });
        // Force refresh from DB to confirm persistence and remove any doubt
        await this.refreshUsers();
        this.showSuccess(`Plan de ${user.full_name} mis à jour vers ${newPlan} !`);
    } catch (e: any) {
        this.handleDatabaseError(e);
        // Refresh to revert UI to actual DB state
        await this.refreshUsers(); 
    }
  }

  async toggleEmailConfirmed(user: UserProfile, event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      try {
          this.users.update(users => users.map(u => u.id === user.id ? { ...u, email_confirmed: isChecked } : u));
          await this.repository.toggleUserConfirmation(user.id, isChecked);
          this.showSuccess('Accès utilisateur mis à jour (Sync Auth) !');
      } catch (e: any) {
          console.error("RPC Error details:", e);
          const errorStr = this.getErrorMessage(e);
          
          if (errorStr.includes('function') && (errorStr.includes('does not exist') || errorStr.includes('not found'))) {
              this.showSqlError.set(true);
              alert("Erreur SQL: Fonction manquante. Vérifiez les scripts Supabase.");
          } else {
              alert("Erreur: " + errorStr);
          }
          this.refreshUsers();
      }
  }

  async deleteUser(user: UserProfile) {
      if(confirm(`Êtes-vous sûr de vouloir supprimer ${user.full_name} ?`)) {
          try {
              await this.repository.deleteUser(user.id);
              this.showSuccess('Utilisateur supprimé !');
              this.refreshUsers();
          } catch (e) {
              alert("Erreur lors de la suppression.");
          }
      }
  }

  async resetPassword(user: UserProfile) {
      if(confirm(`Voulez-vous envoyer un email de réinitialisation de mot de passe à ${user.email} ?`)) {
          try {
              await this.repository.resetUserPassword(user.email);
              this.showSuccess('Email de réinitialisation envoyé !');
          } catch (e: any) {
              alert(`Erreur: ${this.getErrorMessage(e)}`);
          }
      }
  }

  openEditUserModal(user: UserProfile) {
      this.editingUserId.set(user.id);
      this.userForm.patchValue({
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          plan: user.plan,
          email_confirmed: user.email_confirmed
      });
      this.isUserModalOpen.set(true);
  }

  openAddUserModal() {
      this.editingUserId.set(null);
      this.userForm.reset({ role: 'user', plan: 'Freemium', email_confirmed: true });
      this.isUserModalOpen.set(true);
  }

  closeUserModal() {
      this.isUserModalOpen.set(false);
      this.editingUserId.set(null);
  }

  async submitUserForm() {
      if (this.userForm.valid) {
          const formData = this.userForm.value;
          const id = this.editingUserId();
          
          try {
              if (id) {
                  await this.repository.updateUserProfile(id, {
                      email: formData.email,
                      full_name: formData.fullName,
                      role: formData.role,
                      plan: formData.plan
                  });
                  try {
                      await this.repository.toggleUserConfirmation(id, formData.email_confirmed);
                  } catch (rpcError: any) {
                      // Handle potential RPC missing error silently if update succeeded
                  }
                  this.showSuccess('Utilisateur modifié avec succès !');
              } else {
                  await this.repository.createUser(formData);
                  this.showSuccess('Utilisateur créé avec succès !');
              }
              this.closeUserModal();
              this.refreshUsers();
          } catch (e) {
              this.handleDatabaseError(e);
          }
      }
  }
}


import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { DashboardViewComponent } from './views/dashboard-view.component';
import { HostWheelViewComponent } from './views/host-wheel-view.component';
import { AngleViewComponent } from './views/angle-view.component';
import { ContextData, ReportData, Scores, UserRole, View, Property } from '../types';
import { AnglesMenuComponent } from './angles-menu.component';
import { WelcomeBookletViewComponent } from './views/welcome-booklet-view.component';
import { WidgetLibraryViewComponent } from './views/widget-library-view.component';
import { VocalConciergeViewComponent } from './views/vocal-concierge-view.component';
import { GlobalDashboardViewComponent } from './views/global-dashboard-view.component';
import { TrainingViewComponent } from './views/training-view.component';
import { HostInfoViewComponent } from './views/host-info-view.component';
import { PropertyViewComponent } from './views/property-view.component';

import { AdminUsersViewComponent } from './views/admin-users-view.component';
import { AdminDebugViewComponent } from './views/admin-debug-view.component';
import { HostRepository } from '../services/host-repository.service';
import { SessionStore } from '../state/session.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { NotificationBellComponent } from './components/notification-bell.component';
import { NotificationCenterComponent } from './components/notification-center.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'saas-app',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    DashboardViewComponent,
    HostWheelViewComponent,
    AngleViewComponent,
    AnglesMenuComponent,
    WelcomeBookletViewComponent,
    WidgetLibraryViewComponent,
    VocalConciergeViewComponent,
    GlobalDashboardViewComponent,
    TrainingViewComponent,
    HostInfoViewComponent,
    PropertyViewComponent,

    AdminUsersViewComponent,
    AdminDebugViewComponent,
    TranslatePipe,
    NotificationBellComponent,
    NotificationCenterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './saas-app.component.html',
})
export class SaaSAppComponent implements OnInit {
  // Inputs from Global Store
  contextData = input.required<ContextData>();
  scores = input.required<Scores>();
  reportData = input.required<ReportData>();
  logout = output<void>();

  // Data Layer Injection
  private repository = inject(HostRepository);
  private store = inject(SessionStore);
  private fb: FormBuilder = inject(FormBuilder);
  translationService = inject(TranslationService);
  notifService = inject(NotificationService);

  // Local State
  initialView: View = { id: 'dashboard', title: 'Bienvenue', icon: 'home' };
  activeView = signal<View>(this.initialView);
  properties = signal<Property[]>([]);

  // Computed values
  userRole = computed<UserRole>(() => this.store.userProfile()?.role || 'user');
  userName = computed<string>(() => this.store.userProfile()?.full_name || 'Hôte');
  userPlan = computed<string>(() => this.store.userProfile()?.plan || this.reportData().recommendedPlan);

  private readonly angleIds = ['marketing', 'experience', 'operations', 'pricing', 'accomodation', 'legal', 'mindset'];
  isAngleView = computed(() => this.angleIds.includes(this.activeView().id));

  // Create Property Form
  createPropertyForm: FormGroup;
  isCreatingProperty = signal(false);

  constructor() {
    this.createPropertyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  async ngOnInit() {
    await this.refreshProperties();

    // Redirect admin to admin view immediately
    if (this.userRole() === 'admin') {
      this.activeView.set({ id: 'admin-users', title: 'Utilisateurs', icon: 'users' });
    }
  }

  async refreshProperties() {
    const props = await this.repository.getProperties();
    this.properties.set(props);
  }

  onViewChange(view: View): void {
    if (view.id === 'create-property') {
      this.createPropertyForm.reset();
      this.isCreatingProperty.set(true);
    } else {
      this.isCreatingProperty.set(false);
    }

    // UX Improvement: Preserve or Default property when switching angles/tabs
    let targetPropertyName = view.propertyName;

    // 1. If no specific property requested, try to keep the current one
    if (!targetPropertyName) {
      targetPropertyName = this.activeView().propertyName;
    }

    // 2. If still no property and we are going to an Angle view, try to pick the first one
    // This ensures components like 'Marketing Description' have a context to load data.
    if (!targetPropertyName && this.angleIds.includes(view.id)) {
      const props = this.properties();
      if (props.length > 0) {
        targetPropertyName = props[0].name;
      }
    }

    // 3. Update the view
    if (targetPropertyName && this.angleIds.includes(view.id)) {
      this.activeView.set({ ...view, propertyName: targetPropertyName });
    } else {
      this.activeView.set(view);
    }
  }

  goToPropertyHome(): void {
    const propertyName = this.activeView().propertyName;
    if (propertyName) {
      const property = this.properties().find(p => p.name === propertyName);
      if (property) {
        const manageView = property.subViews.find(v => v.id === 'manage-property') || property.subViews[0];
        this.onViewChange({ ...manageView, propertyName: property.name });
      }
    }
  }

  onLogout(): void {
    this.logout.emit();
  }

  async submitCreateProperty() {
    if (this.createPropertyForm.valid && this.store.userProfile()) {
      const name = this.createPropertyForm.value.name;
      try {
        await this.repository.createProperty(this.store.userProfile()!.id, name);
        await this.refreshProperties();

        // Switch to the new property
        const newProp = this.properties().find(p => p.name === name);
        if (newProp) {
          const manageView = newProp.subViews[0];
          this.onViewChange({ ...manageView, propertyName: newProp.name });
        }

      } catch (e) {
        alert("Erreur lors de la création de la propriété.");
        console.error(e);
      }
    }
  }
}
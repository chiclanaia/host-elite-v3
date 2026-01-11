
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HostRepository } from '../../services/host-repository.service';
import { GeminiService } from '../../services/gemini.service';
import { SessionStore } from '../../state/session.store';
import { View } from '../../types';

@Component({
  selector: 'saas-property-data-view',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-data-view.component.html',
})
export class PropertyDataViewComponent implements OnInit {
  view = input.required<View>(); // Used to get propertyName

  private repository = inject(HostRepository);
  private geminiService = inject(GeminiService);
  private store = inject(SessionStore);
  private fb: FormBuilder = inject(FormBuilder);

  propertyForm: FormGroup;
  propertyId = signal<string | null>(null);
  isLoading = signal(true);
  isGenerating = signal(false);
  saveMessage = signal<string | null>(null);

  equipments = [
    'Machine à café', 'Wi-Fi Rapide', 'Climatisation', 'Chauffage',
    'Cuisine équipée', 'Lave-linge', 'Sèche-linge', 'TV', 'Parking gratuit'
  ];

  // Check plan access
  hasAiAccess = computed(() => {
    const plan = this.store.userProfile()?.plan;
    return plan === 'Silver' || plan === 'Gold';
  });

  constructor() {
    const equipmentControls = this.equipments.map(() => this.fb.control(false));

    this.propertyForm = this.fb.group({
      marketing: this.fb.group({
        title: ['', Validators.required],
        description: [''],
        coverImageUrl: ['']
      }),
      operational: this.fb.group({
        address: [''],
        icalUrl: [''],
        cleaningContact: ['']
      }),
      experience: this.fb.group({
        wifiCode: [''],
        arrivalInstructions: [''],
        houseRules: [''],
        emergencyContact: ['']
      }),
      equipments: this.fb.group({
        checklist: this.fb.array(equipmentControls),
      })
    });
  }

  async ngOnInit() {
    await this.loadPropertyData();
  }

  async loadPropertyData() {
    this.isLoading.set(true);
    const propName = this.view().propertyName;

    if (propName) {
      const propData = await this.repository.getPropertyByName(propName);

      if (propData) {
        this.propertyId.set(propData.id);

        // Populate Form
        this.propertyForm.patchValue({
          marketing: {
            title: propData.listing_title || propData.name,
            description: propData.listing_description,
            coverImageUrl: propData.cover_image_url
          },
          operational: {
            address: propData.address,
            icalUrl: propData.ical_url,
            cleaningContact: propData.cleaning_contact_info
          },
          experience: {
            wifiCode: propData.wifi_code,
            arrivalInstructions: propData.arrival_instructions,
            houseRules: propData.house_rules_text,
            emergencyContact: propData.emergency_contact_info // Fixed naming consistency
          }
        });

        // Populate Equipments Checklist
        if (propData.property_equipments) {
          const existingNames = propData.property_equipments.map((e: any) => e.name);
          const checks = this.equipments.map(name => existingNames.includes(name));
          const formArray = this.equipmentsChecklist;
          checks.forEach((checked, i) => {
            if (formArray.at(i)) {
              formArray.at(i).setValue(checked);
            }
          });
        }
      }
    }
    this.isLoading.set(false);
  }

  get marketingForm() { return this.propertyForm.get('marketing') as FormGroup; }
  get operationalForm() { return this.propertyForm.get('operational') as FormGroup; }
  get experienceForm() { return this.propertyForm.get('experience') as FormGroup; }
  get equipmentsChecklist() { return this.propertyForm.get('equipments.checklist') as FormArray; }

  getBadge(featureId: string) {
    return this.store.getFeatureBadge(featureId);
  }

  async generateDescription() {
    if (!this.hasAiAccess()) return;

    const propName = this.view().propertyName;
    if (!propName) return;

    this.isGenerating.set(true);
    try {
      // Get full booklet data as context to make the description relevant
      const bookletData = await this.repository.getBooklet(propName);
      let context = `Nom propriété: ${propName}. `;
      if (bookletData) {
        context += JSON.stringify(bookletData);
      }
      // Add operational info from current form state
      const opData = this.propertyForm.get('operational')?.value;
      if (opData) context += ` Adresse: ${opData.address}`;

      const generated = await this.geminiService.generateMarketingDescription(context);

      // Update form control
      this.marketingForm.get('description')?.setValue(generated);
      this.marketingForm.markAsDirty();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération. Vérifiez votre connexion.");
    } finally {
      this.isGenerating.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.propertyForm.valid && this.propertyId()) {
      try {
        this.saveMessage.set(null);

        // Prepare payload with mapped equipments
        const formValue = this.propertyForm.value;

        let payload = { ...formValue };
        if (formValue.equipments?.checklist) {
          const mappedChecklist = formValue.equipments.checklist.map((checked: boolean, i: number) => ({
            name: this.equipments[i],
            checked: checked,
          }));
          payload.equipments = {
            checklist: mappedChecklist
          };
        }

        // Save main property data
        await this.repository.updatePropertyData(this.propertyId()!, payload);

        // Force Sync Description to Booklet Content
        const description = this.propertyForm.get('marketing.description')?.value;
        if (this.view().propertyName && description) {
          await this.repository.saveBooklet(this.view().propertyName!, {
            bienvenue: { messageBienvenue: description }
          });
        }

        this.saveMessage.set("Données enregistrées avec succès !");
        setTimeout(() => this.saveMessage.set(null), 3000);
      } catch (e) {
        console.error(e);
        alert("Erreur lors de la sauvegarde.");
      }
    } else if (!this.propertyId()) {
      alert("Erreur: Impossible de trouver l'ID de la propriété. Veuillez recharger la page.");
    }
  }
}
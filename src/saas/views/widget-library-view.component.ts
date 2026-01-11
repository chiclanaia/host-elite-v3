
import { ChangeDetectionStrategy, Component, input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostRepository } from '../../services/host-repository.service';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface WidgetGroup {
  title: string;
  widgets: Widget[];
}

@Component({
  selector: 'saas-widget-library-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widget-library-view.component.html',
})
export class WidgetLibraryViewComponent implements OnInit {
  propertyName = input.required<string>();
  
  private repository = inject(HostRepository);
  
  saveMessage = signal<string | null>(null);

  widgetGroups = signal<WidgetGroup[]>([
    {
      title: 'Météo & Environnement',
      widgets: [
        { id: 'weather', name: 'Météo', description: 'Affiche les conditions météo actuelles et la température.', icon: '☀️', enabled: true },
        { id: 'air-quality', name: 'Qualité de l\'Air', description: 'Indique l\'indice de qualité de l\'air (IQA) local.', icon: '💨', enabled: true },
        { id: 'uv-index', name: 'Indice UV', description: 'Informe sur le niveau de rayonnement ultraviolet.', icon: '😎', enabled: true },
        { id: 'tides', name: 'Marées', description: 'Donne les horaires des marées hautes et basses. (Zone côtière)', icon: '🌊', enabled: true },
        { id: 'avalanche-risk', name: 'Risque d\'Avalanche', description: 'Affiche le niveau de risque d\'avalanche. (Montagne)', icon: '🏔️', enabled: false },
      ]
    },
    {
      title: 'Informations Locales',
      widgets: [
        { id: 'pharmacy', name: 'Pharmacie de Garde', description: 'Affiche la pharmacie de garde la plus proche.', icon: '⚕️', enabled: true },
        { id: 'local-events', name: 'Événements Locaux', description: 'Informe sur les événements et marchés à proximité.', icon: '🎉', enabled: true },
        { id: 'public-transport', name: 'Transports en Commun', description: 'Infos sur les lignes de bus ou métro proches.', icon: '🚌', enabled: false },
        { id: 'currency-converter', name: 'Convertisseur de Devises', description: 'Affiche les taux de change pour les devises courantes.', icon: '💱', enabled: false },
      ]
    }
  ]);

  async ngOnInit() {
      await this.loadWidgets();
  }

  async loadWidgets() {
      try {
          const bookletData = await this.repository.getBooklet(this.propertyName());
          if (bookletData && bookletData.widgets) {
              const savedWidgets = bookletData.widgets;
              this.widgetGroups.update(groups => {
                  return groups.map(group => ({
                      ...group,
                      widgets: group.widgets.map(w => ({
                          ...w,
                          enabled: savedWidgets[w.id] !== undefined ? savedWidgets[w.id] : w.enabled
                      }))
                  }));
              });
          }
      } catch (e) {
          console.error("Error loading widgets", e);
      }
  }

  async toggleWidget(groupIdx: number, widgetIdx: number): Promise<void> {
    this.widgetGroups.update(groups => {
        const newGroups = JSON.parse(JSON.stringify(groups));
        const widget = newGroups[groupIdx].widgets[widgetIdx];
        widget.enabled = !widget.enabled;
        return newGroups;
    });
    
    await this.saveWidgets();
  }

  async saveWidgets() {
      // Flatten widgets to a simple key-value object { 'weather': true, 'tides': false }
      const widgetConfig: any = {};
      this.widgetGroups().forEach(group => {
          group.widgets.forEach(w => {
              widgetConfig[w.id] = w.enabled;
          });
      });

      try {
          // Saving to 'widgets' section in booklet_content
          await this.repository.saveBooklet(this.propertyName(), { widgets: widgetConfig });
          this.saveMessage.set("Préférences sauvegardées !");
          setTimeout(() => this.saveMessage.set(null), 2000);
      } catch (e) {
          console.error("Error saving widgets", e);
          this.saveMessage.set("Erreur de sauvegarde");
      }
  }
}

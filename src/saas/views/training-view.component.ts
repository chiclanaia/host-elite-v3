
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  status: 'locked' | 'active' | 'completed';
  type: 'video' | 'quiz' | 'doc';
}

@Component({
  selector: 'saas-training-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
        display: block;
        height: 100%;
        overflow: hidden;
    }
  `],
  template: `
    <!-- CONTENEUR PRINCIPAL -->
    <div class="flex flex-col h-full w-full gap-4">
      
      <!-- 1. HEADER -->
      <div class="shrink-0 flex items-center justify-between h-12 px-2">
        <h2 class="text-2xl font-bold text-white tracking-tight flex items-center">
            <span class="bg-gradient-to-br from-[#D4AF37] to-[#F39C12] text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg mr-3 shadow-lg">🎓</span>
            Académie Hôte d'Exception
        </h2>
        <div class="text-right">
            <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block">Progression</span>
            <span class="text-lg font-bold text-[#D4AF37]">32%</span>
        </div>
      </div>

      <!-- 2. ZONE DE CONTENU (Grille) -->
      <div class="flex-1 min-h-0 flex gap-6 pb-2">
        
        <!-- COLONNE GAUCHE : LECTEUR + DOCK -->
        <div class="flex-1 flex flex-col gap-4 min-w-0">
            
            <!-- A. ZONE LECTEUR (Prend toute la hauteur disponible moins le dock) -->
            <div class="flex-1 min-h-0 relative flex items-center justify-center bg-black/40 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden p-1">
                
                <!-- Cadre Vidéo 16:9 -->
                <!-- max-h-full : Ne dépasse pas la hauteur du conteneur -->
                <!-- max-w-full : Ne dépasse pas la largeur du conteneur -->
                <!-- w-auto : S'ajuste pour garder le ratio -->
                <!-- aspect-video : Force le 16/9 -->
                <div class="aspect-video h-full w-auto max-w-full relative group bg-black shadow-2xl overflow-hidden rounded-2xl mx-auto">
                    
                    <!-- Image de fond -->
                    <img src="https://filedn.eu/ly7XXkiJCqgYRqPEHDEShdQ/Pascal/host/background_app_hostweb.jpg" 
                         class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[60s] ease-linear" 
                         alt="Background">
                    
                    <!-- Overlay Sombre -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>

                    <!-- Contenu du Lecteur (Centré) -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                        @switch (activeMode()) {
                            @case ('masterclass') {
                                <div class="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 cursor-pointer hover:scale-110 hover:bg-[#D4AF37] hover:text-slate-900 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group/btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 ml-1"><path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" /></svg>
                                </div>
                                <h3 class="text-3xl md:text-4xl font-extrabold text-white drop-shadow-xl mb-2">L'Art de l'Accueil</h3>
                                <p class="text-slate-300 font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">Chapitre 3 • 12:45</p>
                            }
                            @case ('audio') {
                                <div class="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                                    <span class="text-5xl">🎧</span>
                                </div>
                                <h2 class="text-3xl font-bold text-white">Podcast : Mindset</h2>
                            }
                            @case ('flipbook') {
                                <div class="bg-white w-40 h-56 rounded-r-lg border-l-4 border-slate-300 shadow-2xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-all duration-500">
                                    <span class="text-4xl font-serif text-slate-800">PDF</span>
                                </div>
                            }
                            @case ('pratique') {
                                <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-[#F9D976] to-[#F39C12] flex items-center justify-center mb-6 shadow-lg animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-slate-900"><path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .914-.143Z" clip-rule="evenodd" /></svg>
                                </div>
                                <h2 class="text-3xl font-bold text-white">Cas Pratique</h2>
                            }
                        }
                    </div>
                </div>
            </div>

            <!-- B. DOCK (Aligné avec la colonne gauche) -->
            <div class="h-24 shrink-0 w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl px-4">
                <div class="flex items-center gap-4 w-full justify-around max-w-2xl">
                    @for (mode of learningModes; track mode.id) {
                        <button (click)="activeMode.set(mode.id)" 
                            class="flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 group relative overflow-hidden h-20"
                            [class]="activeMode() === mode.id ? 'bg-white shadow-lg transform -translate-y-2' : 'hover:bg-white/5'">
                            
                            <span class="text-2xl mb-1 relative z-10 transition-transform group-hover:scale-110" 
                                  [class]="activeMode() === mode.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'">
                                {{ mode.icon }}
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wider relative z-10" 
                                  [class]="activeMode() === mode.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'">
                                {{ mode.label }}
                            </span>
                        </button>
                    }
                </div>
            </div>

        </div>

        <!-- COLONNE DROITE : LISTE (Largeur Fixe) -->
        <div class="w-96 shrink-0 h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-xl">
            
            <!-- Header Liste -->
            <div class="h-16 shrink-0 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                <span class="text-xs font-bold text-white uppercase tracking-wider">Programme</span>
                <span class="text-[10px] text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20">32% Complété</span>
            </div>

            <!-- Liste Scrollable -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                @for (module of modules; track module.id) {
                    <div class="p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3"
                         [class]="module.status === 'active' ? 'bg-white/10 border-[#D4AF37]/50 shadow-lg' : 'border-transparent hover:bg-white/5 hover:border-white/10'">
                        
                        <div class="mt-1 shrink-0">
                            @if (module.status === 'completed') {
                                <div class="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" /></svg></div>
                            } @else if (module.status === 'active') {
                                <div class="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_10px_#D4AF37] animate-pulse"><svg class="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" /></svg></div>
                            } @else {
                                <div class="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center"><svg class="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" /></svg></div>
                            }
                        </div>

                        <div class="min-w-0">
                            <h4 class="text-sm font-semibold leading-tight mb-1" [class]="module.status === 'active' ? 'text-white' : 'text-slate-400'">{{ module.title }}</h4>
                            <p class="text-[10px] uppercase tracking-wide text-slate-500">{{ module.duration }} • {{ module.type }}</p>
                        </div>
                    </div>
                }
            </div>
        </div>

      </div>

    </div>

    <style>
    /* Scrollbar invisible mais fonctionnelle */
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
    </style>
  `
})
export class TrainingViewComponent {
    activeTab = signal<'formation' | 'tutos'>('formation');
    activeMode = signal<string>('masterclass');

    learningModes = [
        { id: 'flipbook', label: 'Flipbook', icon: '📖' },
        { id: 'masterclass', label: 'Masterclass', icon: '🎬' },
        { id: 'audio', label: 'Audio', icon: '🎧' },
        { id: 'pratique', label: 'Pratique', icon: '⚡' },
    ];

    modules: TrainingModule[] = [
        { id: '1', title: 'Fondamentaux de l\'Hospitalité', duration: '15 min', status: 'completed', type: 'video' },
        { id: '2', title: 'Optimisation de la Rentabilité', duration: '22 min', status: 'active', type: 'video' },
        { id: '3', title: 'Gestion des Ménages & Standards', duration: '18 min', status: 'locked', type: 'doc' },
        { id: '4', title: 'Communication Voyageur Pro', duration: '12 min', status: 'locked', type: 'video' },
        { id: '5', title: 'Maintenance Préventive Chalet', duration: '25 min', status: 'locked', type: 'video' },
        { id: '6', title: 'Stratégies de Pricing Avancées', duration: '30 min', status: 'locked', type: 'doc' },
        { id: '7', title: 'Aspects Légaux & Fiscaux', duration: '40 min', status: 'locked', type: 'video' },
        { id: '8', title: 'Superhost Mindset', duration: '10 min', status: 'locked', type: 'video' },
        { id: '9', title: 'Automatisation Totale', duration: '35 min', status: 'locked', type: 'video' },
    ];
}

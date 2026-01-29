#!/usr/bin/env python3
import os

TRANS_DIR = "./src/services/translations/"
LANGS = ['en', 'es', 'fr']

# Manual Mapping
# ID -> { 'en': '...', 'es': '...', 'fr': '...' }
MANUAL_MAP = {
    'FIN_00_CONSULT': { 'en': 'Profitability Suite', 'es': 'Suite de Rentabilidad', 'fr': 'Suite de Rentabilité' },
    'FIN_01': { 'en': 'ROI Simulator', 'es': 'Simulador ROI', 'fr': 'Simulateur ROI' },
    'FIN_02': { 'en': 'Renovation Budget', 'es': 'Presupuesto Renovación', 'fr': 'Budget Rénovation' },
    'FIN_03': { 'en': 'LMNP Tax Simulator', 'es': 'Simulador Fiscal LMNP', 'fr': 'Simulateur LMNP' },
    'FIN_04': { 'en': 'Section 24 Simulator', 'es': 'Simulador Sección 24', 'fr': 'Simulateur Section 24' },
    'FIN_05': { 'en': 'Occupancy Stats', 'es': 'Estadísticas Ocupación', 'fr': 'Stats d\'Occupation' },
    'FIN_06': { 'en': 'FEC Exporter', 'es': 'Exportar FEC', 'fr': 'Export FEC' },
    'FIN_07': { 'en': 'MTD Export', 'es': 'Exportar MTD', 'fr': 'Export MTD' },
    'FIN_08': { 'en': 'Commission Splitter', 'es': 'Divisor de Comisión', 'fr': 'Répartiteur de Commission' },
    'FIN_09': { 'en': 'Non-Resident Tax', 'es': 'Impuesto No Residente', 'fr': 'Impôt Non-Résident' },
    'FIN_10': { 'en': 'Double Tax Report', 'es': 'Informe Doble Imposición', 'fr': 'Rapport Double Imposition' },
    
    'EXP_03': { 'en': 'Welcome Book', 'es': 'Libro de Bienvenida', 'fr': 'Livret d\'Accueil' },
    'EXP_04': { 'en': 'Guest AI Chatbot', 'es': 'Chatbot IA Huéspedes', 'fr': 'Chatbot IA Invités' }
}

def append_keys(lang):
    path = os.path.join(TRANS_DIR, lang, "ui.ts")
    if not os.path.exists(path):
        print(f"Skipping {lang}, file not found.")
        return

    with open(path, 'r') as f:
        lines = f.readlines()
        content = "".join(lines)

    to_add = []
    for fid, names in MANUAL_MAP.items():
        key_t = f"FEATURE.{fid}.Title"
        key_d = f"FEATURE.{fid}.Desc"
        
        # Check specific lang
        label = names.get(lang, names['en']) # Fallback to EN
        
        # Check if key exists
        if f"'{key_t}'" not in content:
            to_add.append(f"    '{key_t}': '{label}',\n")
            
        if f"'{key_d}'" not in content:
            to_add.append(f"    '{key_d}': '{label} Description',\n") # Placeholder desc

    if not to_add:
        print(f"No new keys needed for {lang}")
        return

    # Insert before end
    insert_idx = -1
    for i in range(len(lines)-1, -1, -1):
        if '};' in lines[i]:
            insert_idx = i
            break
            
    lines[insert_idx:insert_idx] = to_add
    
    with open(path, 'w') as f:
        f.writelines(lines)
    print(f"Appended {len(to_add)} keys to {lang}")

def main():
    for l in LANGS:
        append_keys(l)

if __name__ == "__main__":
    main()

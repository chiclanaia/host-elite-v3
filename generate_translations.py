#!/usr/bin/env python3
"""
Phase 2: Generate Translations and Update Translation Files
Reads the extraction JSON and generates EN/FR/ES translation files.
"""

import json
import os
import re
from collections import OrderedDict

TRANSLATIONS_DIR = "/Users/josebermudez/Hote excellence/hote-exception-v2/src/services/translations"
EXTRACTION_FILE = "translation_extraction.json"

# Simple FR/ES translations for common terms
TRANSLATIONS_MAP = {
    # Financial terms
    'Price': {'fr': 'Prix', 'es': 'Precio'},
    'Budget': {'fr': 'Budget', 'es': 'Presupuesto'},
    'Expenses': {'fr': 'Dépenses', 'es': 'Gastos'},
    'Income': {'fr': 'Revenu', 'es': 'Ingresos'},
    'Revenue': {'fr': 'Chiffre d\'affaires', 'es': 'Ingresos'},
    'Cost': {'fr': 'Coût', 'es': 'Costo'},
    'Total': {'fr': 'Total', 'es': 'Total'},
    'Rate': {'fr': 'Tarif', 'es': 'Tarifa'},
    'Occupancy': {'fr': 'Occupation', 'es': 'Ocupación'},
    'Cashflow': {'fr': 'Flux de trésorerie', 'es': 'Flujo de caja'},
    'Forecast': {'fr': 'Prévision', 'es': 'Previsión'},
    'Profit': {'fr': 'Bénéfice', 'es': 'Beneficio'},
    'Tax': {'fr': 'Impôt', 'es': 'Impuesto'},
    'Loan': {'fr': 'Prêt', 'es': 'Préstamo'},
    'Equity': {'fr': 'Capital', 'es': 'Capital'},
    
    # UI terms
    'Active': {'fr': 'Actif', 'es': 'Activo'},
    'Inactive': {'fr': 'Inactif', 'es': 'Inactivo'},
    'Coming Soon': {'fr': 'Bientôt disponible', 'es': 'Próximamente'},
    'Beta': {'fr': 'Bêta', 'es': 'Beta'},
    'Coach Tip': {'fr': 'Conseil Coach', 'es': 'Consejo del Coach'},
    'Export': {'fr': 'Exporter', 'es': 'Exportar'},
    'Download': {'fr': 'Télécharger', 'es': 'Descargar'},
    'Upload': {'fr': 'Téléverser', 'es': 'Subir'},
    'Save': {'fr': 'Sauvegarder', 'es': 'Guardar'},
    'Edit': {'fr': 'Modifier', 'es': 'Editar'},
    'Delete': {'fr': 'Supprimer', 'es': 'Eliminar'},
    'Cancel': {'fr': 'Annuler', 'es': 'Cancelar'},
    'Confirm': {'fr': 'Confirmer', 'es': 'Confirmar'},
    'Loading': {'fr': 'Chargement', 'es': 'Cargando'},
    'Details': {'fr': 'Détails', 'es': 'Detalles'},
    'Status': {'fr': 'Statut', 'es': 'Estado'},
    'Settings': {'fr': 'Paramètres', 'es': 'Configuración'},
    'Configuration': {'fr': 'Configuration', 'es': 'Configuración'},
    'Pro': {'fr': 'Pro', 'es': 'Pro'},
    'Premium': {'fr': 'Premium', 'es': 'Premium'},
}

def simple_translate(text: str, lang: str) -> str:
    """Attempt simple translation using keyword mapping."""
    # Check if exact match
    if text in TRANSLATIONS_MAP:
        return TRANSLATIONS_MAP[text][lang]
    
    # Try to find keywords within the text
    translated = text
    for en, translations in TRANSLATIONS_MAP.items():
        if en.lower() in text.lower():
            if lang in translations:
                # Simple replacement (not perfect but better than nothing)
                translated = re.sub(re.escape(en), translations[lang], translated, flags=re.IGNORECASE)
    
    # If no translation found, prefix with language code for easy identification
    if translated == text:
        return f"[{lang.upper()}] {text}"
    
    return translated

def generate_translation_additions():
    """Generate translation additions for all languages."""
    # Load extraction data
    with open(EXTRACTION_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Organize by language
    translations = {'en': {}, 'fr': {}, 'es': {}}
    
    for comp_name, comp_data in data.items():
        for key, trans_data in comp_data['translations'].items():
            # EN isjust the original
            translations['en'][key] = trans_data['en']
            
            # FR/ES: use manual translation if available, otherwise simple translate
            if not trans_data['fr'].startswith('[FR]'):
                translations['fr'][key] = trans_data['fr']
            else:
                translations['fr'][key] = simple_translate(trans_data['en'], 'fr')
            
            if not trans_data['es'].startswith('[ES]'):
                translations['es'][key] = trans_data['es']
            else:
                translations['es'][key] = simple_translate(trans_data['en'], 'es')
    
    return translations

def format_typescript_object(translations: dict) -> str:
    """Format translations as TypeScript object entries."""
    lines = []
    for key, value in sorted(translations.items()):
        # Escape single quotes in value
        value_escaped = value.replace("'", "\\'")
        lines.append(f"    '{key}': '{value_escaped}',")
    return '\n'.join(lines)

def main():
    print("🌍 Translation Generation System")
    print("=" * 60)
    
    if not os.path.exists(EXTRACTION_FILE):
        print(f"❌ Error: {EXTRACTION_FILE} not found. Run translate_all_components.py first.")
        return
    
    print(f"\n📖 Reading {EXTRACTION_FILE}...")
    translations = generate_translation_additions()
    
    print(f"\n📊 Generated translations:")
    print(f"   - EN: {len(translations['en'])} keys")
    print(f"   - FR: {len(translations['fr'])} keys")
    print(f"   - ES: {len(translations['es'])} keys")
    
   # Save formatted output
    for lang in ['en', 'fr', 'es']:
        output_file = f"translations_additions_{lang}.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(format_typescript_object(translations[lang]))
        print(f"\n💾 Saved {lang.upper()} additions to: {output_file}")
        
        # Show first few
        items = list(translations[lang].items())[:3]
        for key, value in items:
            print(f"      '{key}': '{value}'")
        print(f"      ... and {len(translations[lang]) - 3} more")
    
    print(f"\n✅ Phase 2 Complete!")
    print("📝 Next: Review translations and run component update script.")

if __name__ == '__main__':
    main()

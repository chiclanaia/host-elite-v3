#!/usr/bin/env python3
"""
Automated Component Translation System
Extracts hardcoded strings, generates translation keys, and updates components.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple, Set

# Directories
FEATURES_DIR = "/Users/josebermudez/Hote excellence/hote-exception-v2/src/saas/features"
TRANSLATIONS_DIR = "/Users/josebermudez/Hote excellence/hote-exception-v2/src/services/translations"

# Component categories for key prefixes
COMPONENT_PREFIXES = {
    'roi-simulator': 'ROI',
    'profitability-suite': 'PROFIT',
    'renovation-budget': 'RENOV',
    'lmnp-tax-simulator': 'LMNP',
    'section-24-simulator': 'SEC24',
    'occupancy-stats': 'OCC',
    'commission-splitter': 'COMMISSION',
    'non-resident-tax': 'NRTAX',
    'double-tax-report': 'DTAX',
    'fec-exporter': 'FEC',
    'mtd-export': 'MTD',
    'smart-ledger': 'LEDGER',
    'ai-listing-writer': 'AILISTING',
    'listing-optimization': 'LISTOPT',
    'photo-guide': 'PHOTO',
    'direct-booking': 'DIRECT',
    'channel-manager': 'CHANNEL',
    'ical-sync': 'ICAL',
    'cleaning-checklist': 'CLEAN',
    'guest-chatbot': 'GCHAT',
    'house-manual': 'MANUAL',
    'inventory': 'INV',
    'team-management': 'TEAM',
    'compliance-checker': 'COMPLY',
    'cerfa-generator': 'CERFA',
    'vut-license': 'VUT',
    'regulatory-checklist': 'REGCHECK',
    'market-alerts': 'MALERT',
    'revpar-optimizer': 'REVPAR',
    'yield-setup': 'YIELD',
}

# Manual translations for common terms (to ensure consistency)
MANUAL_TRANSLATIONS = {
    'Coach Tip': {'fr': 'Conseil Coach', 'es': 'Consejo del Coach'},
    'Active': {'fr': 'Actif', 'es': 'Activo'},
    'Inactive': {'fr': 'Inactif', 'es': 'Inactivo'},
    'Coming Soon': {'fr': 'Bientôt Disponible', 'es': 'Próximamente'},
    'Beta': {'fr': 'Bêta', 'es': 'Beta'},
    'Save': {'fr': 'Sauvegarder', 'es': 'Guardar'},
    'Loading': {'fr': 'Chargement...', 'es': 'Cargando...'},
    'Export': {'fr': 'Exporter', 'es': 'Exportar'},
    'Upload': {'fr': 'Télécharger', 'es': 'Subir'},
    'Download': {'fr': 'Télécharger', 'es': 'Descargar'},
    'Edit': {'fr': 'Modifier', 'es': 'Editar'},
    'Delete': {'fr': 'Supprimer', 'es': 'Eliminar'},
    'Cancel': {'fr': 'Annuler', 'es': 'Cancelar'},
    'Confirm': {'fr': 'Confirmer', 'es': 'Confirmar'},
}

def extract_strings_from_template(template: str) -> List[str]:
    """Extract hardcoded English strings from template."""
    strings = []
    
    # Pattern 1: Text between HTML tags
    pattern1 = r'>([A-Z][^<>{}]{2,100}?)</[a-z]'
    strings.extend(re.findall(pattern1, template))
    
    # Pattern 2: Standalone text in simple tags
    pattern2 = r'>\s*([A-Z][A-Za-z0-9\s\-&(),.:!?€$%]+?)\s*<'
    strings.extend(re.findall(pattern2, template))
    
    # Pattern 3: Title/placeholder attributes
    pattern3 = r'(?:title|placeholder)="([^"]+)"'
    strings.extend(re.findall(pattern3, template))
    
    # Clean and filter
    cleaned = []
    for s in strings:
        s = s.strip()
        # Skip if too short, has template syntax, or is all caps (likely a constant)
        if (len(s) > 2 and 
            not s.startswith('{{') and 
            not s.startswith('[') and
            not s.isupper() and
            not re.match(r'^[0-9\s\-:/.]+$', s)):  # Skip pure numbers/dates
            cleaned.append(s)
    
    return list(set(cleaned))

def generate_key_name(text: str, prefix: str) -> str:
    """Generate a translation key from text."""
    # Remove special chars, convert to camelCase
    words = re.sub(r'[^A-Za-z0-9\s]', '', text).split()
    if not words:
        return f"{prefix}.Text"
    
    # Capitalize each word
    key_suffix = ''.join(w.capitalize() for w in words[:5])  # Max 5 words
    return f"{prefix}.{key_suffix}"

def process_component(filepath: str) -> Dict:
    """Process a single component file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract component name
    comp_name = Path(filepath).stem.replace('.component', '')
    
    # Get prefix or generate one
    prefix = COMPONENT_PREFIXES.get(comp_name, comp_name.upper().replace('-', '_')[:10])
    
    # Find template
    template_match = re.search(r'template:\s*`(.*?)`', content, re.DOTALL)
    if not template_match:
        return None
    
    template = template_match.group(1)
    strings = extract_strings_from_template(template)
    
    if not strings:
        return None
    
    # Generate translation mappings
    translations = {}
    for text in strings:
        key = generate_key_name(text, prefix)
        
        # Check if we have manual translation
        if text in MANUAL_TRANSLATIONS:
            translations[key] = {
                'en': text,
                'fr': MANUAL_TRANSLATIONS[text]['fr'],
                'es': MANUAL_TRANSLATIONS[text]['es'],
                'original': text
            }
        else:
            translations[key] = {
                'en': text,
                'fr': f'[FR] {text}',  # Placeholder - will translate later
                'es': f'[ES] {text}',  # Placeholder - will translate later
                'original': text
            }
    
    return {
        'component': comp_name,
        'filepath': filepath,
        'prefix': prefix,
        'translations': translations,
        'template': template
    }

def find_all_components() -> List[str]:
    """Find all component files."""
    components = []
    for root, dirs, files in os.walk(FEATURES_DIR):
        for file in files:
            if file.endswith('.component.ts'):
                components.append(os.path.join(root, file))
    return sorted(components)

def main():
    print("🚀 Automated Component Translation System")
    print("=" * 60)
    
    components = find_all_components()
    print(f"\n📁 Found {len(components)} component files\n")
    
    all_translations = {}
    processed_count = 0
    
    for comp_path in components:
        result = process_component(comp_path)
        if result:
            all_translations[result['component']] = result
            processed_count += 1
            print(f"✓ {result['component']:30} | {len(result['translations'])} strings | Prefix: {result['prefix']}")
    
    print(f"\n📊 Summary:")
    print(f"   - Processed: {processed_count} components")
    print(f"   - Total strings: {sum(len(c['translations']) for c in all_translations.values())}")
    
    # Save to JSON for review
    output_file = "translation_extraction.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_translations, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Saved extraction to: {output_file}")
    print("\n✅ Phase 1 Complete: String extraction done!")
    print("📝 Next: Review the JSON file, then run translation generation.")

if __name__ == '__main__':
    main()

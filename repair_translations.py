#!/usr/bin/env python3
import os
import re

# Paths
EN_FILE = "./src/services/translations/en/ui.ts"
FR_FILE = "./src/services/translations/fr/ui.ts"

# Translation Dictionary (Same as before)
DICTIONARY = {
    'fr': {
        'Regulatory Compliance Vault': 'Coffre-fort de Conformité Réglementaire',
        'Mandatory Documents': 'Documents Obligatoires',
        'ID Card / Passport': 'Carte d\'Identité / Passeport',
        'Property Insurance': 'Assurance Propriété',
        'Safety Certificate': 'Certificat de Sécurité',
        'Ai Bulk Scan': 'Scan IA en Masse',
        'Active Monitoring': 'Surveillance Active',
        'Jurisdiction Rules': 'Règles de Juridiction',
        'Next Audit': 'Prochain Audit',
        'Audit Ready': 'Prêt pour Audit',
        'The 4% Rule': 'La Règle du 4%',
        'Proof of identity for host registration.': 'Preuve d\'identité pour l\'enregistrement de l\'hôte.',
        'PNO (Propriétaire Non Occupant) coverage.': 'Couverture PNO (Propriétaire Non Occupant).',
        'Gas/Elec safety inspection report.': 'Rapport d\'inspection sécurité Gaz/Élec.',
        'Risk of fine: High': 'Risque d\'amende: Élevé',
        '3 Days': '3 Jours',
        'In regulated zones (Paris, NYC), audits happen to ~4% of listings annually. If your "Audit Ready" score is below 100%, you are gambling with your license.': 'Dans les zones réglementées (Paris, NYC), les audits touchent ~4% des annonces par an. Si votre score "Prêt pour Audit" est inférieur à 100%, vous jouez avec votre licence.'
    }
}

def parse_file_robust(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    items = {}
    # Robust regex for 'KEY': 'VALUE' ensuring we capture escaped quotes
    # Matches: 'KEY' : 'VALUE',?
    # Value group: ((?:[^'\\]|\\.)*)
    pattern = r"^\s*'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)',?"
    
    for line in content.split('\n'):
        match = re.search(pattern, line)
        if match:
            key = match.group(1)
            val = match.group(2)
            items[key] = val
    return items

def translate_text(text, lang_code):
    dct = DICTIONARY.get(lang_code, {})
    # Exact match
    if text in dct:
        return dct[text]
    # Check if text matches English key in dict (partial? No, exact)
    return text

def repair_fr_file(en_items):
    # 1. Clean the file (Remove the broken block)
    with open(FR_FILE, 'r') as f:
        content = f.read()
        
    # Look for the marker I added: "// Synced"
    marker = "// Synced"
    if marker in content:
        split_idx = content.find(marker)
        # Find the preceding newline to be clean
        clean_content = content[:split_idx]
        # Re-add the closing brace if it was removed/after the marker
        # Usually checking existing structure.
        # If I stripped the end, I need to check if "};" is present.
        if "};" not in clean_content:
             # Look for last brace in original content? 
             # Or just append it.
             # But marker was usually inside the object.
             # Wait, `sync_and_translate.py` implementation:
             # `new_content = parts[0] + "\n".join(lines_to_add) + "\n};" + parts[1]`
             # parts[1] was AFTER "};".
             # So clean_content needs to restore the suffix.
             
             # Let's read the file again and do it safely.
             # If I can't determine, just re-add "};"
             pass
    else:
        print("Marker not found, assuming clean or manually edited. Proceeding with caution.")
        clean_content = content
        if "};" in clean_content:
            clean_content = clean_content.rsplit("};", 1)[0]
    
    # 2. Re-Sync
    # Compare EN keys with what remains in FR
    fr_items = parse_file_robust(FR_FILE) # This reads dirty file!
    # Parse the CLEANED content? No, easy way:
    # Just parse content string using regex
    
    # Let's extract keys from clean_content
    existing_keys = set()
    pattern = r"^\s*'([^']+)'\s*:"
    for line in clean_content.split('\n'):
        m = re.search(pattern, line)
        if m:
            existing_keys.add(m.group(1))
            
    missing_keys = []
    for k, v in en_items.items():
        if k not in existing_keys:
            missing_keys.append((k, v))
            
    print(f"Re-Adding {len(missing_keys)} missing keys to FR")
    
    lines_to_add = []
    lines_to_add.append("\n    " + marker + " repaired")
    
    for k, v_en in missing_keys:
        v_trans = translate_text(v_en, 'fr')
        # Escape quotes correctly!
        # If v_trans has ', replace with \'
        # But wait, v_en might ALREADY have escaped quotes if it came from regex group(2)?
        # If regex captured `Don\'t`, then v_en is `Don\'t`.
        # If I write it back, I write `Don\'t`.
        # Correct.
        
        # What if v_trans came from dictionary? (Plain string `... d'identité ...`)
        # I need to escape apostrophes.
        if v_trans in DICTIONARY['fr'].values():
             v_trans = v_trans.replace("'", "\\'")
        elif v_trans == v_en:
             # If reusing English, ensure it's escaped.
             # If v_en was `Don\'t` (captured), it is already escaped.
             # If v_en was `Hello`, it is fine.
             pass
             
        lines_to_add.append(f"    '{k}': '{v_trans}',")
        
    new_content = clean_content.rstrip() + "\n" + "\n".join(lines_to_add) + "\n};"
    
    with open(FR_FILE, 'w') as f:
        f.write(new_content)

def main():
    en_items = parse_file_robust(EN_FILE)
    repair_fr_file(en_items)

if __name__ == "__main__":
    main()

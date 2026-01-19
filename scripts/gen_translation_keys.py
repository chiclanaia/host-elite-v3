
import os
import unicodedata

def normalize_text(text):
    return "".join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn').lower()

def get_keys(lang):
    file_path = f'audit_questions_{lang}.txt'
    keys = {}
    current_cat = None
    
    if not os.path.exists(file_path):
        return {}

    with open(file_path, 'r', encoding='utf-8') as f:
        # Skip header
        f.readline()
        f.readline()
        
        for line in f:
            line = line.strip()
            if line.startswith('---'):
                cat_raw = line.replace('---', '').strip().lower()
                cat_norm = normalize_text(cat_raw)
                
                if 'marketing' in cat_norm: current_cat = 'marketing'
                elif 'experience' in cat_norm: current_cat = 'experience'
                elif 'operation' in cat_norm: current_cat = 'operations'
                elif 'pricing' in cat_norm: current_cat = 'pricing'
                elif 'logement' in cat_norm or 'accommodation' in cat_norm or 'accomodation' in cat_norm or 'alojamiento' in cat_norm: 
                    current_cat = 'accomodation'
                elif 'legal' in cat_norm: 
                    current_cat = 'legal'
                else: 
                    current_cat = None
            elif line and line[0].isdigit() and '. ' in line and current_cat:
                parts = line.split('. ', 1)
                q_num = parts[0]
                q_text = parts[1].strip()
                keys[f"TRAINING.{current_cat}_q{q_num}_Title"] = q_text
    return keys

for lang in ['en', 'fr', 'es']:
    keys = get_keys(lang)
    with open(f'{lang}_keys_temp.txt', 'w', encoding='utf-8') as out:
        for k, v in keys.items():
            val = v.replace("'", "\\'")
            out.write(f"    '{k}': '{val}',\n")
    print(f"Generated {lang}_keys_temp.txt")

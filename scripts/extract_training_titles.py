import os
import unicodedata

def normalize_text(text):
    return "".join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn').lower()

def extract_titles(lang):
    """Extract just the first line (title) from each question"""
    file_path = f'audit_questions_{lang}.txt'
    titles = {}
    current_cat = None
    
    if not os.path.exists(file_path):
        return {}

    with open(file_path, 'r', encoding='utf-8') as f:
        f.readline()  # Skip header
        f.readline()  # Skip blank
        
        for line in f:
            line = line.strip()
            if line.startswith('---'):
                cat_raw = line.replace('---', '').strip().lower()
                cat_norm = normalize_text(cat_raw)
                
                if 'marketing' in cat_norm: current_cat = 'marketing'
                elif 'experience' in cat_norm or 'expérience' in cat_raw.lower() or 'experiencia' in cat_raw.lower(): 
                    current_cat = 'experience'
                elif 'operation' in cat_norm or 'opération' in cat_raw.lower(): 
                    current_cat = 'operations'
                elif 'pricing' in cat_norm or 'precio' in cat_raw.lower(): 
                    current_cat = 'pricing'
                elif 'logement' in cat_raw.lower() or 'accommodation' in cat_norm or 'accomodation' in cat_norm or 'alojamiento' in cat_raw.lower(): 
                    current_cat = 'accomodation'
                elif 'legal' in cat_norm or 'légal' in cat_raw.lower(): 
                    current_cat = 'legal'
            elif line and line[0].isdigit() and '. ' in line and current_cat:
                parts = line.split('. ', 1)
                q_num = parts[0]
                # Get just the question text, remove any sub-question info
                q_text = parts[1].strip()
                # Remove sub-question markers
                if '(Sub:' in q_text:
                    q_text = q_text.split('(Sub:')[0].strip()
                
                key = f"TRAINING.{current_cat}_q{q_num}_Title"
                titles[key] = q_text
    
    return titles

# Generate for all languages
for lang in ['en', 'fr', 'es']:
    titles = extract_titles(lang)
    output_file = f'{lang}_training_keys.txt'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for key in sorted(titles.keys()):
            value = titles[key].replace("'", "\\'")
            f.write(f"    '{key}': '{value}',\n")
    
    print(f"Generated {output_file} with {len(titles)} keys")

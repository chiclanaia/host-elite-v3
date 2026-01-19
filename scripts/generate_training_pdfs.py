import os
from fpdf import FPDF

# Configuration
LANGUAGES = ['en', 'fr', 'es']
CATEGORIES = ['marketing', 'experience', 'operations', 'pricing', 'accomodation', 'legal']
OUTPUT_DIR = 'public/training/pdfs'

# Level Mapping: q1-q2: Bronze, q3-q5: Silver, q6-q10: Gold
def get_level(q_num):
    if q_num <= 2:
        return "Bronze"
    elif q_num <= 5:
        return "Silver"
    else:
        return "Gold"

import unicodedata

def normalize_text(text):
    return "".join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn').lower()

# Translation helper (simplified from the files I generated earlier)
# I'll use the actual content from the audit_questions_[lang].txt files I just made
def get_questions(lang):
    file_path = f'audit_questions_{lang}.txt'
    questions = {}
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
                
                # Robust mapping using normalized text
                if 'marketing' in cat_norm: current_cat = 'marketing'
                elif 'experience' in cat_norm: current_cat = 'experience'
                elif 'operation' in cat_norm: current_cat = 'operations'
                elif 'pricing' in cat_norm: current_cat = 'pricing'
                elif 'logement' in cat_norm or 'accommodation' in cat_norm or 'accomodation' in cat_norm: 
                    current_cat = 'accomodation'
                elif 'legal' in cat_norm: 
                    current_cat = 'legal'
                else: 
                    current_cat = cat_norm
            elif line and line[0].isdigit() and '. ' in line:
                q_num = int(line.split('. ')[0])
                q_text = line.split('. ', 1)[1].strip()
                if current_cat:
                    key = f"{current_cat}_q{q_num}"
                    questions[key] = q_text
                    
    return questions

def generate_pdf(lang, question_key, question_text, level):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # PDF generation logic - 10 pages
    for page_num in range(1, 11):
        pdf.add_page()
        pdf.set_font("helvetica", "B", 16)
        
        # Title
        pdf.cell(0, 20, f"{question_text}", ln=True, align='C')
        
        pdf.ln(20)
        
        # Level
        pdf.set_font("helvetica", "", 14)
        pdf.cell(0, 10, f"Level: {level}", ln=True, align='C')
        
        # Page info
        pdf.ln(100)
        pdf.set_font("helvetica", "I", 8)
        pdf.cell(0, 10, f"Page {page_num} of 10 - Training Module: {question_key}", ln=True, align='C')

    # Ensure directory exists
    dir_path = os.path.join(OUTPUT_DIR, lang)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        
    file_name = f"{question_key}.pdf"
    file_name = file_name.replace(' ', '_').replace('&', 'and') # Extra safety although question_key should be clean
    full_path = os.path.join(dir_path, file_name)
    pdf.output(full_path)
    print(f"Generated: {full_path}")

def main():
    for lang in LANGUAGES:
        print(f"Processing language: {lang}")
        questions = get_questions(lang)
        
        for key, text in questions.items():
            # key format: marketing_q1
            q_num = int(key.split('_q')[1])
            level = get_level(q_num)
            generate_pdf(lang, key, text, level)

if __name__ == "__main__":
    main()

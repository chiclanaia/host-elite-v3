import re

with open('src/services/translation.service.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_lang = None
dicts = {}

print("Starting scan...")

for i, line in enumerate(lines):
    line_num = i + 1
    
    # Primitive dictionary detection
    if "'fr': {" in line: 
        current_lang = 'fr'
        dicts[current_lang] = {}
        print(f"Entering 'fr' dictionary at line {line_num}")
    elif "'en': {" in line: 
        current_lang = 'en'
        dicts[current_lang] = {}
        print(f"Entering 'en' dictionary at line {line_num}")
    elif "'es': {" in line: 
        current_lang = 'es'
        dicts[current_lang] = {}
        print(f"Entering 'es' dictionary at line {line_num}")
    
    if current_lang:
        # Check for key definition
        m = re.search(r"^\s*['\"](.+?)['\"]\s*:", line)
        if m:
            key = m.group(1)
            if key in dicts[current_lang]:
                print(f"DUPLICATE FOUND! Lang: {current_lang}, Key: '{key}', Original Line: {dicts[current_lang][key]}, Duplicate Line: {line_num}")
            else:
                dicts[current_lang][key] = line_num

print("Scan complete.")

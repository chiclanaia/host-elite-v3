import re

with open('src/services/translation.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find dictionaries
dicts = {}
for lang in ['fr', 'en', 'es']:
    match = re.search(fr"['\"]{lang}['\"]\s*:\s*\{{", content)
    if match:
        start = match.end()
        # Find matching closing brace
        brace_count = 1
        end = -1
        for i in range(start, len(content)):
            if content[i] == '{': brace_count += 1
            elif content[i] == '}': brace_count -= 1
            if brace_count == 0:
                end = i
                break
        if end != -1:
            dicts[lang] = content[start:end]

for lang, dict_content in dicts.items():
    print(f"--- Dictionary: {lang} ---")
    keys = {}
    lines = dict_content.split('\n')
    for i, line in enumerate(lines):
        m = re.search(r"^\s*['\"](.+?)['\"]\s*:", line)
        if m:
            key = m.group(1)
            if key in keys:
                print(f"DUPLICATE in {lang}: '{key}'")
            else:
                keys[key] = True

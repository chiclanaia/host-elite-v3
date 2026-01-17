import re

with open('src/services/translation.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r"'fr': \{([\s\S]+?)\},", content)
if match:
    dict_content = match.group(1)
    keys = []
    for line in dict_content.split('\n'):
        km = re.search(r"^\s*['\"](.+?)['\"]\s*:", line)
        if km:
            keys.append(km.group(1))
    
    from collections import Counter
    counts = Counter(keys)
    for k, c in counts.items():
        if c > 1:
            print(f"DUPLICATE KEY: {k} ({c} times)")
        else:
            # Just to confirm it's reading
            # print(f"KEY: {k}")
            pass
else:
    print("FR dictionary NOT FOUND")

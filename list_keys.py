import re

with open('src/services/translation.service.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

keys = []
for i, line in enumerate(lines):
    m = re.search(r"^\s*['\"](.+?)['\"]\s*:", line)
    if m:
        keys.append((i + 1, m.group(1)))

# Sort by key name
keys.sort(key=lambda x: x[1])

for line_num, key in keys:
    print(f"{line_num}: {key}")

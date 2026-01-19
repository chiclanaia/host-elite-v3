import re

# Read the generated keys
with open('en_training_keys.txt', 'r', encoding='utf-8') as f:
    en_keys = f.read()

with open('fr_training_keys.txt', 'r', encoding='utf-8') as f:
    fr_keys = f.read()

with open('es_training_keys.txt', 'r', encoding='utf-8') as f:
    es_keys = f.read()

# Update EN file
with open('src/services/translations/en.ts', 'r', encoding='utf-8') as f:
    en_content = f.read()

# Find the closing brace and insert before it
en_content = en_content.rstrip()
if en_content.endswith('};'):
    en_content = en_content[:-2]  # Remove closing };
    en_content += '\n    // Auto-generated training module titles\n'
    en_content += en_keys
    en_content += '};\n'

with open('src/services/translations/en.ts', 'w', encoding='utf-8') as f:
    f.write(en_content)

# Update FR file
with open('src/services/translations/fr.ts', 'r', encoding='utf-8') as f:
    fr_content = f.read()

fr_content = fr_content.rstrip()
if fr_content.endswith('};'):
    fr_content = fr_content[:-2]
    fr_content += '\n    // Auto-generated training module titles\n'
    fr_content += fr_keys
    fr_content += '};\n'

with open('src/services/translations/fr.ts', 'w', encoding='utf-8') as f:
    f.write(fr_content)

# Update ES file
with open('src/services/translations/es.ts', 'r', encoding='utf-8') as f:
    es_content = f.read()

es_content = es_content.rstrip()
if es_content.endswith('};'):
    es_content = es_content[:-2]
    es_content += '\n    // Auto-generated training module titles\n'
    es_content += es_keys
    es_content += '};\n'

with open('src/services/translations/es.ts', 'w', encoding='utf-8') as f:
    f.write(es_content)

print("✅ Successfully updated all translation files!")
print(f"   - EN: Added training module titles")
print(f"   - FR: Added training module titles")
print(f"   - ES: Added training module titles")

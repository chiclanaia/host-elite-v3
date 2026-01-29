#!/usr/bin/env python3
import os
import re

FILES = [
    "./src/services/translations/en/ui.ts",
    "./src/services/translations/es/ui.ts",
    "./src/services/translations/fr/ui.ts"
]

def clean_file(filepath):
    print(f"Cleaning {filepath}...")
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Extract existing keys/values
    # Maintain order? Python dicts do.
    items = {}
    
    # We want to capture 'KEY': 'VALUE'
    # And preserve lines that are NOT keys? (like comments?)
    # But files are mostly keys.
    # If I rewrite, I might lose comments inside the object.
    # But for translations, maintaining valid object syntax is priority.
    
    # Find start and end of object
    # usually `export const UI_XX = {` ... `};`
    
    start_match = re.search(r"export const \w+ = {", content)
    end_match = re.search(r"};\s*$", content)
    
    if not start_match:
        print(f"  Skipping {filepath}: Could not find start block")
        return

    prefix = content[:start_match.end()]
    suffix = "};"
    
    # Process inner content
    # I'll use regex to find all key-value pairs
    # Pattern: 'KEY': 'VALUE',?
    # Handle escaped quotes in value.
    pattern = r"^\s*'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'[\,\s]*$"
    
    lines = content.split('\n')
    
    new_lines = []
    seen_keys = set()
    
    # Parse everything into a list of (key, val) to write back?
    # Or just write as we go but skip duplicates?
    # We want to keep the LAST occurrence if duplicates? Or First?
    # Usually appending adds new keys at bottom. If duplicate, the bottom one overrides.
    # So if I keep key in a Set, and I encounter it again...
    # If I just want valid TS, I should remove previous occurrence?
    # Or just keep the last one.
    
    # Strategy: Read file into a list of (key, value, line_index).
    # Filter duplicates (keep last).
    # Write back.
    
    kv_pairs = []
    
    for line in lines:
        # Check if line matches key-value
        m = re.match(pattern, line)
        if m:
            key = m.group(1)
            val = m.group(2)
            kv_pairs.append({'key': key, 'val': val, 'line': line})
        else:
            # Maybe comment or garbage?
            # If inside object...
            pass
            
    # Deduplicate: Keep LAST.
    unique_map = {}
    for i, item in enumerate(kv_pairs):
        unique_map[item['key']] = item # This overwrites, so unique_map has the last one.
        
    # How to output?
    # Just output the values in `unique_map`?
    # Python 3.7+ dicts preserve insertion order.
    # So iterating `unique_map.values()` gives them in order of APPEARANCE (of the *last* update? No).
    # If I do `unique_map[key] = item`, the key position remains where it First was? 
    # No, Python dict updates value but keeps position.
    # Wait.
    # `d = {'a': 1}; d['a'] = 2`. keys() is ['a'].
    # `d = {'a': 1, 'b': 2}; d['a'] = 3`. keys() is ['a', 'b'].
    # So order matches FIRST occurrence.
    # But usually we want the NEW value.
    # So this is perfect: We keep the Last Value, at First Position.
    # UNLESS new keys were added at bottom and are duplicates of top keys?
    # Then we keep last value at top position.
    
    # If keys were added at bottom, they are duplicates.
    # e.g.
    # 'A': 'Old'
    # ...
    # 'A': 'New'
    
    # Result: 'A': 'New' (at top).
    # This is fine.
    
    output_lines = []
    output_lines.append(prefix)
    
    count = 0
    for key, item in unique_map.items():
        val = item['val']
        # Reconstruct line with comma
        output_lines.append(f"    '{key}': '{val}',")
        count += 1
        
    output_lines.append(suffix)
    
    with open(filepath, 'w') as f:
        f.write('\n'.join(output_lines))
        
    print(f"  Cleaned {filepath}: {count} unique keys.")

def main():
    for f in FILES:
        if os.path.exists(f):
            clean_file(f)
        else:
            print(f"File not found: {f}")

if __name__ == "__main__":
    main()

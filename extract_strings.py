#!/usr/bin/env python3
"""
Script to extract hardcoded strings from Angular component templates
and generate translation keys.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Base directory for features
FEATURES_DIR = "/Users/josebermudez/Hote excellence/hote-exception-v2/src/saas/features"

# String patterns to extract (simple strings in templates)
STRING_PATTERNS = [
    r'>([A-Z][^<>{}]{3,50})</[a-z]',  # Text between tags
    r'class="[^"]*">([A-Z][^<>{}]{3,40})</span',  # Span text
    r'>\s*([0-9]+[A-Za-z-\s]+)\s*<',  # Mixed alphanumeric
]

def find_components():
    """Find all component TypeScript files."""
    components = []
    for root, dirs, files in os.walk(FEATURES_DIR):
        for file in files:
            if file.endswith('.component.ts'):
                components.append(os.path.join(root, file))
    return sorted(components)

def extract_template_strings(filepath):
    """Extract hardcoded strings from component template."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find template content
    template_match = re.search(r'template:\s*`(.*?)`', content, re.DOTALL)
    if not template_match:
        return []
    
    template = template_match.group(1)
    
    # Extract strings
    strings = set()
    for pattern in STRING_PATTERNS:
        matches = re.findall(pattern, template)
        for match in matches:
            cleaned = match.strip()
            if len(cleaned) > 3 and not cleaned.startswith('{{') and not cleaned.startswith(' '):
                strings.add(cleaned)
    
    return sorted(strings)

def main():
    components = find_components()
    print(f"Found {len(components)} components\n")
    
    all_strings = defaultdict(list)
    
    for comp_path in components:
        comp_name = Path(comp_path).stem.replace('.component', '')
        strings = extract_template_strings(comp_path)
        
        if strings:
            all_strings[comp_name] = strings
            print(f"\n{comp_name} ({len(strings)} strings):")
            for s in strings[:5]:  # Show first 5
                print(f"  - {s}")
            if len(strings) > 5:
                print(f"  ... and {len(strings) - 5} more")
    
    print(f"\n\nTotal: {sum(len(v) for v in all_strings.values())} unique strings across {len(all_strings)} components")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Phase 3: Update Components with TranslatePipe
Updates all component templates to use the translation keys.
"""

import json
import os
import re
from pathlib import Path

EXTRACTION_FILE = "translation_extraction.json"

def update_component_imports(content: str) -> str:
    """Add TranslatePipe import if not present."""
    # Check if TranslatePipe is already imported
    if 'TranslatePipe' in content:
        return content
    
    # Find CommonModule import
    common_import_match = re.search(r"imports:\s*\[(.*?)\]", content, re.DOTALL)
    if common_import_match:
        imports = common_import_match.group(1)
        if 'TranslatePipe' not in imports:
            # Add TranslatePipe to imports
            updated_imports = imports.strip().rstrip(',') + ',\n    TranslatePipe'
            content = content.replace(
                f"imports: [{imports}]",
                f"imports: [{updated_imports}\n  ]"
            )
    
    # Add TranslatePipe import statement at top
    if 'TranslatePipe' not in content and "from '@angular/common'" in content:
        content = re.sub(
            r"(import { CommonModule }from '@angular/common';)",
            r"\1\nimport { TranslatePipe } from '../../../services/translation.service';",
            content
        )
    
    return content

def escape_for_regex(text: str) -> str:
    """Escape special regex characters."""
    return re.escape(text)

def update_template_with_keys(template: str, translations: dict) -> tuple:
    """Replace hardcoded strings with translation pipe calls."""
    updated_template = template
    replacements_made = 0
    
    for key, trans_data in translations.items():
        original_text = trans_data['original']
        
        # Skip very short strings
        if len(original_text) < 3:
            continue
        
        # Pattern 1: Text between tags (most common)
        pattern1 = f">{escape_for_regex(original_text)}<"
        replacement1 = f">{{{{ '{key}' | translate }}}}<"
        if re.search(pattern1, updated_template):
            updated_template = re.sub(pattern1, replacement1, updated_template)
            replacements_made += 1
        
        # Pattern 2: With surrounding whitespace
        pattern2 = f">\s*{escape_for_regex(original_text)}\s*<"
        replacement2 = f">{{{{ '{key}' | translate }}}}<"
        if re.search(pattern2, updated_template) and key not in updated_template:
            updated_template = re.sub(pattern2, replacement2, updated_template)
            replacements_made += 1
            
        # Pattern 3: In attributes (title, placeholder, etc.)
        pattern3 = f'((?:title|placeholder|aria-label))="{escape_for_regex(original_text)}"'
        replacement3 = rf'\1="{{{{ \'{key}\' | translate }}}}"'
        if re.search(pattern3, updated_template):
            updated_template = re.sub(pattern3, replacement3, updated_template)
            replacements_made += 1
    
    return updated_template, replacements_made

def update_component_file(filepath: str, comp_data: dict) -> bool:
    """Update a component file with translations."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and update template
    template_match = re.search(r'(template:\s*)`(.*?)`', content, re.DOTALL)
    if not template_match:
        return False
    
    old_template = template_match.group(2)
    new_template, replacements = update_template_with_keys(
        old_template,
        comp_data['translations']
    )
    
    if replacements == 0:
        return False
    
    # Replace template in content
    content = content.replace(
        f"template: `{old_template}`",
        f"template: `{new_template}`"
    )
    
    # Add TranslatePipe import
    content = update_component_imports(content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    print("🔄 Component Update System")
    print("=" * 60)
    
    if not os.path.exists(EXTRACTION_FILE):
        print(f"❌ Error: {EXTRACTION_FILE} not found.")
        return
    
    # Load extraction data
    with open(EXTRACTION_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n📝 Updating {len(data)} components...\n")
    
    updated_count = 0
    skipped_count = 0
    
    for comp_name, comp_data in data.items():
        filepath = comp_data['filepath']
        
        try:
            if update_component_file(filepath, comp_data):
                updated_count += 1
                print(f"✓ {comp_name:30} | Updated")
            else:
                skipped_count += 1
                print(f"○ {comp_name:30} | Skipped (no changes)")
        except Exception as e:
            print(f"✗ {comp_name:30} | Error: {e}")
    
    print(f"\n📊 Summary:")
    print(f"   - Updated: {updated_count} components")
    print(f"   - Skipped: {skipped_count} components")
    
    print(f"\n✅ Phase 3 Complete!")
    print("📝 Next: Add translations to ui.ts files and test the application.")

if __name__ == '__main__':
    main()

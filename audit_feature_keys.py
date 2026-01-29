#!/usr/bin/env python3
import os
import re

# Config
REGISTRY_FILE = "./src/saas/features/feature-registry.ts"
TRANS_DIR = "./src/services/translations/"
LANGS = ['en', 'es', 'fr']

def get_feature_ids():
    with open(REGISTRY_FILE, 'r') as f:
        content = f.read()
    
    ids = []
    # Find keys in FEATURE_COMPONENTS map
    # 'LEG_00': ...
    pattern = r"'([\w_]+)':\s*\w+"
    # We need to find the specific block
    start = content.find("export const FEATURE_COMPONENTS")
    block = content[start:]
    
    for m in re.finditer(pattern, block):
        ids.append(m.group(1))
    return ids

def check_keys(lang, ids):
    path = os.path.join(TRANS_DIR, lang, "ui.ts")
    with open(path, 'r') as f:
        content = f.read()
        
    missing = []
    for fid in ids:
        key = f"FEATURE.{fid}.Title"
        # Check for 'FEATURE.ID.Title': or "FEATURE.ID.Title":
        # Simple string check is usually enough if formatted consistently
        if f"'{key}'" not in content and f'"{key}"' not in content:
            missing.append(key)
    return missing

def main():
    ids = get_feature_ids()
    print(f"Found {len(ids)} feature IDs in registry.")
    
    all_good = True
    for lang in LANGS:
        missing = check_keys(lang, ids)
        if missing:
            all_good = False
            print(f"\nMissing in {lang.upper()} ({len(missing)}):")
            for k in missing:
                print(f"  - {k}")
        else:
            print(f"\n{lang.upper()}: 100% Covered.")
            
    if not all_good:
        print("\nFAIL: Some keys are missing.")
    else:
        print("\nSUCCESS: All feature keys present.")

if __name__ == "__main__":
    main()

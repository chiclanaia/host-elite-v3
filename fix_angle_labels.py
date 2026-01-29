#!/usr/bin/env python3
import os
import re

# Config
REGISTRY_FILE = "./src/saas/features/feature-registry.ts"
BASE_DIR = "./src/saas/features/"
TRANS_DIR = "./src/services/translations/"
LANGS = ['en', 'es', 'fr']

def parse_registry():
    """Parses feature-registry.ts to map FeatureID -> ComponentFilePath"""
    with open(REGISTRY_FILE, 'r') as f:
        content = f.read()

    # 1. Parse Imports to map ClassName -> FilePath
    # import { ComplianceCheckerComponent } from './legal/compliance-checker/compliance-checker.component';
    imports = {}
    import_pattern = r"import\s+{\s*(\w+)\s*}\s+from\s+'(.+)';"
    for m in re.finditer(import_pattern, content):
        cls_name = m.group(1)
        rel_path = m.group(2)
        # Registry is in src/saas/features/
        # Imports are relative to that.
        # But we want path relative to PROJECT ROOT?
        # BASE_DIR is ./src/saas/features/
        # rel_path is ./legal/...
        # So full path: src/saas/features/./legal/... -> src/saas/features/legal/...
        
        # specific fix for paths starting with ./
        if rel_path.startswith('./'):
            clean_path = rel_path[2:]
            full_path = os.path.join(BASE_DIR, clean_path) + ".ts"
        else:
            full_path = os.path.join(BASE_DIR, rel_path) + ".ts"
            
        imports[cls_name] = full_path

    # 2. Parse FEATURE_COMPONENTS map
    # 'LEG_00': ComplianceCheckerComponent,
    feature_map = {}
    map_start = content.find("export const FEATURE_COMPONENTS")
    if map_start == -1:
        print("Could not find FEATURE_COMPONENTS")
        return {}

    map_block = content[map_start:]
    # Simple regex to find 'KEY': ClassName
    entry_pattern = r"'([\w_]+)':\s*(\w+),"
    for m in re.finditer(entry_pattern, map_block):
        fid = m.group(1)
        cls_name = m.group(2)
        if cls_name in imports:
            feature_map[fid] = imports[cls_name]
        else:
            print(f"Warning: Class {cls_name} not found in imports for {fid}")

    return feature_map

def extract_translation_keys(component_path):
    """Extracts 'HASH.Title' and 'HASH.Description' (or Desc) keys from component"""
    if not os.path.exists(component_path):
        print(f"File not found: {component_path}")
        return None, None

    with open(component_path, 'r') as f:
        content = f.read()

    # Look for name: this.translate.instant('KEY')
    # and description: this.translate.instant('KEY')
    
    # Regex for name
    name_match = re.search(r"name:\s*this\.translate\.instant\('([^']+)'\)", content)
    
    # Regex for description (could be 'Description' or 'Desc')
    # component usually uses specific key.
    desc_match = re.search(r"description:\s*this\.translate\.instant\('([^']+)'\)", content)
    
    title_key = name_match.group(1) if name_match else None
    desc_key = desc_match.group(1) if desc_match else None
    
    return title_key, desc_key

def load_translations(lang):
    """Loads translations as a dict"""
    path = os.path.join(TRANS_DIR, lang, "ui.ts")
    with open(path, 'r') as f:
        content = f.read()
    
    trans = {}
    pattern = r"^\s*'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'[\,\s]*$"
    for line in content.split('\n'):
        m = re.match(pattern, line)
        if m:
            trans[m.group(1)] = m.group(2)
    return trans, content

def append_to_translation(lang, new_entries):
    """Appends new entries to translation file"""
    path = os.path.join(TRANS_DIR, lang, "ui.ts")
    with open(path, 'r') as f:
        lines = f.readlines()
        
    # Find last brace '};'
    insert_idx = -1
    for i in range(len(lines)-1, -1, -1):
        if '};' in lines[i]:
            insert_idx = i
            break
            
    if insert_idx == -1:
        print(f"Error: Could not find end of object in {path}")
        return

    # Prepare lines
    to_add = []
    for k, v in new_entries.items():
        # Escape quotes in value
        safe_v = v.replace("'", "\\'")
        to_add.append(f"    '{k}': '{safe_v}',\n")
        
    # Insert
    lines[insert_idx:insert_idx] = to_add
    
    with open(path, 'w') as f:
        f.writelines(lines)
    print(f"Appended {len(new_entries)} keys to {lang}/ui.ts")

def main():
    print("Mapping features...")
    feature_map = parse_registry()
    print(f"Found {len(feature_map)} features.")

    # 1. Resolve keys for each feature
    # ID -> {title_key: 'XYZ.Title', desc_key: 'XYZ.Desc'}
    resolved_keys = {} 
    
    for fid, path in feature_map.items():
        t_key, d_key = extract_translation_keys(path)
        if t_key:
            resolved_keys[fid] = {'t': t_key, 'd': d_key}
        else:
            print(f"Could not extract keys for {fid} in {path}")

    # 2. For each language, read values and generate new keys
    for lang in LANGS:
        print(f"Processing {lang}...")
        trans, _ = load_translations(lang)
        
        new_entries = {}
        
        for fid, keys in resolved_keys.items():
            # Title
            orig_t_key = keys['t']
            if orig_t_key in trans:
                new_key = f"FEATURE.{fid}.Title"
                if new_key not in trans: # Only add if missing
                    new_entries[new_key] = trans[orig_t_key]
            
            # Desc
            orig_d_key = keys['d']
            if orig_d_key and orig_d_key in trans:
                new_key = f"FEATURE.{fid}.Desc"
                if new_key not in trans:
                    new_entries[new_key] = trans[orig_d_key]
                    
        # Write back
        if new_entries:
            append_to_translation(lang, new_entries)
        else:
            print(f"No new entries for {lang}")

if __name__ == "__main__":
    main()

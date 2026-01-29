#!/usr/bin/env python3
import os
import re

TARGET_FILE = "./src/services/translations/fr/ui.ts"

def sanitize_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    # Regex to capture content between the outer quotes of the value
    # Assumes format: whitespace 'KEY': 'VALUE', (comma optional)
    pattern = r"^(\s*'[^']+'\s*:\s*)'((?:.*))'(,?[\r\n]*)$"
    
    count = 0
    for line in lines:
        match = re.match(pattern, line)
        if match:
            prefix = match.group(1)
            content = match.group(2)
            suffix = match.group(3)
            
            # Check content for unescaped quotes
            # We want to replace ' with \' BUT NOT if it is already \'
            # Regex lookbehind (?<!\\)'
            
            # Test if change needed
            if re.search(r"(?<!\\)'", content):
                new_content = re.sub(r"(?<!\\)'", r"\'", content)
                new_line = f"{prefix}'{new_content}'{suffix}"
                new_lines.append(new_line)
                count += 1
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print(f"Sanitized {count} lines in {filepath}")

if __name__ == "__main__":
    sanitize_file(TARGET_FILE)

const fs = require('fs');

const content = fs.readFileSync('src/services/translation.service.ts', 'utf8');

const dictionaries = ['fr', 'en', 'es'];

dictionaries.forEach(lang => {
    console.log(`Checking ${lang}...`);
    const startPattern = `'${lang}': {`;
    const startIndex = content.indexOf(startPattern);
    if (startIndex === -1) {
        console.log(`  Start of ${lang} dictionary not found.`);
        return;
    }

    // Find matching closing brace
    let braceCount = 1;
    let endIndex = -1;
    for (let i = startIndex + startPattern.length; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }

    if (endIndex === -1) {
        console.log(`  End of ${lang} dictionary not found.`);
        return;
    }

    const dictContent = content.substring(startIndex + startPattern.length, endIndex);
    const lines = dictContent.split('\n');
    const keys = new Map();

    lines.forEach((line, index) => {
        const match = line.match(/^\s*['"](.+?)['"]\s*:/);
        if (match) {
            const key = match[1];
            if (keys.has(key)) {
                console.log(`  Duplicate key found: "${key}" at lines ${keys.get(key)} and ${index + 1 + content.substring(0, startIndex).split('\n').length}`);
            } else {
                keys.set(key, index + 1 + content.substring(0, startIndex).split('\n').length);
            }
        }
    });
});

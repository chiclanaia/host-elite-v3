const fs = require('fs');

try {
    const csvContent = fs.readFileSync('specs.csv', 'utf-8');
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');

    // We expect headers on first line
    const headers = lines[0].split(',').map(h => h.trim());

    // Simple parser that handles quoted fields containing commas
    const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                result.push(current.trim());
                current = '';
                continue;
            }
            current += char;
        }
        result.push(current.trim());

        // Clean matching quotes at start/end if present
        return result.map(val => {
            val = val.trim();
            if (val.startsWith('"') && val.endsWith('"')) {
                // Unescape double quotes if CSV standard (usually "" -> " but here likely simple)
                return val.slice(1, -1).replace(/""/g, '"');
            }
            return val;
        });
    };

    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        const record = {};
        headers.forEach((h, index) => {
            record[h] = values[index];
        });
        records.push(record);
    }

    // Advanced Extraction Logic
    const recordsWithExtracted = records.map((r) => {
        const prompt = r.dev_prompt || '';
        const matrixMatch = prompt.match(/2\. Behavior Matrix:\s*(.*?)(?=\s*3\. User Journey|$)/s);
        let behaviorMatrix = matrixMatch ? matrixMatch[1].trim() : null;

        // Check if there is a separate behavior_matrix column in the manual map?
        // No, 'specs.csv' doesn't seem to have it, so we extract.

        return { ...r, behavior_matrix: behaviorMatrix };
    });

    let sql = '-- Update Features from specs.csv (Auto-generated)\n\n';

    for (const record of recordsWithExtracted) {
        if (!record.feature_id) continue;

        const safe = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

        sql += `
INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    ${safe(record.feature_id)},
    ${safe(record.parent_feature_id || null)},
    ${safe(record.dimension_id)},
    ${safe(record.phase_id)},
    ${safe(record.scope)},
    ${safe(record.name)},
    ${safe(record.description)},
    ${safe(record.detailed_description)},
    ${safe(record.dev_prompt)},
    ${safe(record.behavior_matrix)}
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    behavior_matrix = EXCLUDED.behavior_matrix;
`;
    }

    fs.writeFileSync('migrations/update_features_from_specs.sql', sql);
    console.log('Migration generated at migrations/update_features_from_specs.sql');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}

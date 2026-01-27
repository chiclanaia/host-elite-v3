import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'features.csv');
const outPath = path.join(__dirname, '../migrations/seed_features.sql');

const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Simple CSV parser that handles quoted fields containing commas
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let insideQuotes = false;

    // Normalize newlines to \n to simplify
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < normalizedText.length; i++) {
        const char = normalizedText[i];
        const nextChar = normalizedText[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentVal += '"';
                i++; // Skip escape quote
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentVal.trim()); // Trim whitespace around value
            currentVal = '';
        } else if (char === '\n' && !insideQuotes) {
            if (currentRow.length > 0 || currentVal.length > 0) {
                currentRow.push(currentVal.trim());
                rows.push(currentRow);
                currentRow = [];
                currentVal = '';
            }
        } else {
            currentVal += char;
        }
    }
    // Push last row if exists
    if (currentRow.length > 0 || currentVal.length > 0) {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
    }

    const headers = rows[0].map(h => h.trim());

    return rows.slice(1).map(values => {
        const row = {};
        headers.forEach((h, index) => {
            // Remove surrounding quotes if they were kept (my parser extracted content but logic above accumulates characters)
            // Wait, my logic above accumulates characters including quotes? 
            // - if char is " -> toggles insideQuotes. IT DOES NOT ADD TO currentVal (except escaped ones).
            // So currentVal is ALREADY unquoted content. 
            // BUT wait, looking at logic: 
            // } else { currentVal += char; }
            // So if I have "foo", char=" toggles. char=f adds f. char=o adds o. char=" toggles.
            // So content is foo. Correct.

            row[h] = values[index];
        });
        return row;
    });
}

const features = parseCSV(csvContent);

let sql = `-- Seed Features from CSV
-- Generated automatically

`;

features.forEach(f => {
    if (!f.feature_id) return;

    const parent = f.parent_feature_id ? `'${f.parent_feature_id}'` : 'NULL';
    const cleanDesc = (f.description || '').replace(/'/g, "''"); // Escape single quotes for SQL
    const cleanName = (f.name || '').replace(/'/g, "''");
    const cleanDetailed = (f.detailed_description || '').replace(/'/g, "''");
    const cleanPrompt = (f.dev_prompt || '').replace(/'/g, "''");
    const cleanScope = (f.scope || '').replace(/'/g, "''");

    // Wait, the CSV has 'Behavior Matrix' INSIDE 'detailed_description' or 'dev_prompt'?
    // Looking at the CSV structure: detailed_description column seems to contain the "1. Pedagogical... 2. Behavior Matrix..." text.
    // So we just map it as is.

    // Check if behavior_matrix logic is needed. The prompt allows storing the text.
    // I will store the whole 'detailed_description' into 'detailed_description'
    // AND 'dev_prompt' into 'dev_prompt'.

    let cleanMatrix = '';

    // Extract Behavior Matrix from dev_prompt if possible
    // Pattern: "2. Behavior Matrix: (content) 3."
    const matrixMatch = (f.dev_prompt || '').match(/2\.\s*Behavior Matrix:\s*([\s\S]*?)(?=\s*3\.\s*User Journey|$)/i);
    if (matrixMatch && matrixMatch[1]) {
        cleanMatrix = matrixMatch[1].trim().replace(/'/g, "''");
    }

    sql += `
INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, name, description, detailed_description, dev_prompt, scope, behavior_matrix)
VALUES (
    '${f.feature_id}',
    ${parent},
    '${f.dimension_id}',
    '${f.phase_id}',
    '${cleanName}',
    '${cleanDesc}',
    '${cleanDetailed}',
    '${cleanPrompt}',
    '${cleanScope}',
    '${cleanMatrix}'
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt,
    scope = EXCLUDED.scope,
    behavior_matrix = EXCLUDED.behavior_matrix;
`;
});

fs.writeFileSync(outPath, sql);
console.log(`Generated ${features.length} feature inserts / updates in ${outPath} `);

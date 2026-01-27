const fs = require('fs');
const { parse } = require('csv-parse/sync');

try {
    const csvContent = fs.readFileSync('specs.csv', 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    });

    // Advanced Extraction Logic
    const recordsWithExtracted = records.map((r) => {
        const prompt = r.dev_prompt || '';
        const matrixMatch = prompt.match(/2\. Behavior Matrix:\s*(.*?)(?=\s*3\. User Journey|$)/s);
        const behaviorMatrix = matrixMatch ? matrixMatch[1].trim() : null;
        return { ...r, behavior_matrix: behaviorMatrix };
    });

    let sql = '-- Update Features from specs.csv (Auto-generated)\n\n';

    for (const record of recordsWithExtracted) {
        const safe = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

        sql += `
INSERT INTO features (id, parent_feature_id, dimension_id, phase_id, scope, name, description, detailed_description, dev_prompt, behavior_matrix)
VALUES (
    ${safe(record.feature_id)},
    ${safe(record.parent_feature_id)},
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

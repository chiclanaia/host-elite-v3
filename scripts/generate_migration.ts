import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csvContent = fs.readFileSync('specs.csv', 'utf-8');
const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
});

let sql = '-- Update Features from specs.csv\n\n';

for (const record of records) {
    // Escape single quotes for SQL
    const safe = (str: string) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

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
    ${safe(record.behavior_matrix || '')} -- Mapping dev_prompt behavior parts if explicit column missing, but CSV has strict columns? Checking CSV again... CSV DOES NOT have behavior_matrix column in header.
    -- Wait, looking at specs.csv content again...
    -- Header: feature_id,parent_feature_id,dimension_id,phase_id,scope,name,description,detailed_description,dev_prompt
    -- The seed_features.sql DOES include behavior_matrix. 
    -- The CSV (lines 2, 3...) content for 'dev_prompt' seems to contain "Behavior Matrix: ..." text inside it. 
    -- BUT seed_features.sql has a separate column.
    
    -- Let's check if I can extract behavior_matrix from dev_prompt text?
    -- Example CSV dev_prompt: "1. Pedagogical Objective: ... 2. Behavior Matrix: TIER_0 ... 3. User Journey..."
    -- Example SQL behavior_matrix: "TIER_0: Dashboard Sandbox..."
    
    -- It seems I should extract it. Or maybe new specs don't need it separate?
    -- The SQL has explicit ON CONFLICT DO UPDATE.
)
ON CONFLICT (id) DO UPDATE SET
    parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    scope = EXCLUDED.scope,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    dev_prompt = EXCLUDED.dev_prompt;
    -- Note: If CSV doesn't have behavior_matrix column, I might start by NOT updating it or extracting it.
    -- Looking at the SQL I read earlier (lines 5-17), it inserts behavior_matrix.
    -- I will try to regex extract it from dev_prompt.
`;

}


// Advanced Extraction Logic
// The CSV puts everything in 'dev_prompt' and 'functional_specs'. The DB has a separate 'behavior_matrix' column.
// We concatenate functional_specs to dev_prompt to ensure full context is saved.

const recordsWithExtracted = records.map((r: any) => {
    let prompt = r.dev_prompt || '';
    if (r.functional_specs) {
        prompt += '\n\n' + r.functional_specs;
    }

    // Extract Behavior Matrix from the pedagogical prompt (usually in dev_prompt)
    const matrixMatch = prompt.match(/2\. Behavior Matrix:\s*(.*?)(?=\s*3\. User Journey|$)/s);
    const behaviorMatrix = matrixMatch ? matrixMatch[1].trim() : null;

    return { ...r, dev_prompt: prompt, behavior_matrix: behaviorMatrix };
});


// Re-generating SQL loop with extraction
sql = '-- Update Features from specs.csv (Auto-generated)\n\n';

for (const record of recordsWithExtracted) {
    const safe = (str: string) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

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

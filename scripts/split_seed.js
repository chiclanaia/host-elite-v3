import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '../migrations/seed_features.sql');
const outDir = path.join(__dirname, '../migrations/dist');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const sql = fs.readFileSync(seedPath, 'utf-8');
const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

const CHUNK_SIZE = 10;
let fileCount = 0;

for (let i = 0; i < statements.length; i += CHUNK_SIZE) {
    const chunk = statements.slice(i, i + CHUNK_SIZE).join(';\n\n') + ';';
    fileCount++;
    const outName = `seed_chunk_${fileCount}.sql`;
    fs.writeFileSync(path.join(outDir, outName), chunk);
    console.log(`Created ${outName} with ${Math.min(CHUNK_SIZE, statements.length - i)} statements.`);
}

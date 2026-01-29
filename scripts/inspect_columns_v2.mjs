
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcaarwmafbrqdmwbulpt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-M4hsMXU4AtkApvRMbB41g_HzRQTwY6';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkColumn(colName) {
    const { error } = await supabase.from('onboarding_questions').select(colName).limit(1);
    if (!error) {
        console.log(`[FOUND] Column '${colName}' exists!`);
        return true;
    } else {
        // console.log(`[MISSING] Column '${colName}' - ${error.message}`);
        return false;
    }
}

async function checkSchema() {
    console.log('Checking onboarding_questions columns...');

    const candidates = [
        'id', 'created_at',
        'angle', 'dimension', 'dim', 'dimension_id', 'dim_id',
        'category', 'section', 'phase', 'topic', 'group',
        'question_key', 'key',
        'level', 'tier',
        'order_index', 'order', 'idx',
        'has_sub_question', 'sub_question_config'
    ];

    for (const col of candidates) {
        await checkColumn(col);
    }
}

checkSchema();

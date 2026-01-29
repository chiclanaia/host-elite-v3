
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcaarwmafbrqdmwbulpt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-M4hsMXU4AtkApvRMbB41g_HzRQTwY6';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
    console.log('Checking onboarding_questions schema...');

    // Check questions
    const { data: qData, error: qError } = await supabase
        .from('onboarding_questions')
        .select('*')
        .limit(1);

    if (qError) {
        console.error('Error fetching questions:', qError);
    } else if (qData && qData.length > 0) {
        console.log('Question Columns:', Object.keys(qData[0]));
    } else {
        console.log('No questions found. Checking column existence via specific selects...');

        const { error: angleError } = await supabase.from('onboarding_questions').select('angle').limit(1);
        console.log('Column "angle" exists?', !angleError);

        const { error: dimError } = await supabase.from('onboarding_questions').select('dimension').limit(1);
        console.log('Column "dimension" exists?', !dimError);
    }
}

checkSchema();

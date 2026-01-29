
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
        console.log('No questions found. Trying to insert a dummy to check columns? No, dangerous.');
        // If empty, we can't easily check columns via select *
        // We can try to select specific columns and see if it errors.
        console.log('Checking specific columns...');
        const { error: angleError } = await supabase.from('onboarding_questions').select('angle').limit(1);
        console.log('Column "angle" exists?', !angleError);

        const { error: dimError } = await supabase.from('onboarding_questions').select('dimension').limit(1);
        console.log('Column "dimension" exists?', !dimError);
    }

    // Check answers
    console.log('\nChecking onboarding_answers schema...');
    const { data: aData, error: aError } = await supabase
        .from('onboarding_answers')
        .select('*')
        .limit(1);

    if (aError) {
        console.error('Error fetching answers:', aError);
    } else if (aData && aData.length > 0) {
        console.log('Answer Columns:', Object.keys(aData[0]));
    }
}

checkSchema();

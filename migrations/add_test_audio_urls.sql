-- Migration: Add test audio URL to all training materials
-- Description: Update all training_materials records to include a test audio URL

UPDATE public.training_materials
SET audio_url = 'https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_1MG.mp3'
WHERE audio_url IS NULL OR audio_url = '';

-- Verify the update
SELECT 
    tm.id,
    tm.module_id,
    tm.language,
    tm.audio_url,
    tmod.title_key
FROM public.training_materials tm
JOIN public.training_modules tmod ON tm.module_id = tmod.id
ORDER BY tmod.title_key, tm.language;

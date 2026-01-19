-- Migration: Create Training System Tables

-- 1. Training Modules (links to onboarding questions)
CREATE TABLE IF NOT EXISTS public.training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
    title_key TEXT NOT NULL,
    description_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Training Materials (multi-language URLs)
CREATE TABLE IF NOT EXISTS public.training_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    language TEXT NOT NULL, -- 'en', 'fr', 'es'
    pdf_url TEXT,
    flipbook_url TEXT,
    video_url TEXT,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(module_id, language)
);

-- 3. Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    title_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text_key TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Quiz Options
CREATE TABLE IF NOT EXISTS public.quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text_key TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. User Training Progress
CREATE TABLE IF NOT EXISTS public.user_training_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    last_score INT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, module_id)
);

-- RLS Policies
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;

-- Select policies (Public read for content)
CREATE POLICY "Allow public read for modules" ON public.training_modules FOR SELECT USING (true);
CREATE POLICY "Allow public read for materials" ON public.training_materials FOR SELECT USING (true);
CREATE POLICY "Allow public read for quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public read for quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow public read for quiz options" ON public.quiz_options FOR SELECT USING (true);

-- Progress policies (User specific)
CREATE POLICY "Users can view their own progress" ON public.user_training_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_training_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own progress" ON public.user_training_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime (optional but recommended for progress tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_training_progress;

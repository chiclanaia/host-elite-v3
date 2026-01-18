-- Migration: Create onboarding questions and answers tables
-- Description: Store audit questions with translation keys and track user answers per property

-- Create onboarding_questions table
CREATE TABLE IF NOT EXISTS public.onboarding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    angle TEXT NOT NULL CHECK (angle IN ('marketing', 'experience', 'operations', 'pricing', 'accomodation', 'legal')),
    question_key TEXT NOT NULL UNIQUE, -- e.g., 'AUDIT.marketing_q1'
    level TEXT NOT NULL CHECK (level IN ('Bronze', 'Silver', 'Gold')),
    order_index INTEGER NOT NULL,
    has_sub_question BOOLEAN DEFAULT FALSE,
    sub_question_config JSONB, -- {id: string, label_key: string, type: string, placeholder: string}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(angle, order_index)
);

-- Create index for faster queries by angle
CREATE INDEX idx_onboarding_questions_angle ON public.onboarding_questions(angle);
CREATE INDEX idx_onboarding_questions_level ON public.onboarding_questions(level);

-- Create onboarding_answers table
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
    answer BOOLEAN NOT NULL DEFAULT FALSE,
    sub_answer TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id, question_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_onboarding_answers_user_property ON public.onboarding_answers(user_id, property_id);
CREATE INDEX idx_onboarding_answers_question ON public.onboarding_answers(question_id);

-- Enable Row Level Security
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_questions (read-only for all authenticated users)
CREATE POLICY "Anyone can read questions"
    ON public.onboarding_questions
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policies for onboarding_answers (users can only access their own answers)
CREATE POLICY "Users can read their own answers"
    ON public.onboarding_answers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
    ON public.onboarding_answers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
    ON public.onboarding_answers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers"
    ON public.onboarding_answers
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE public.onboarding_questions IS 'Stores audit questions with translation keys for multi-language support';
COMMENT ON TABLE public.onboarding_answers IS 'Stores user answers to onboarding questions per property';

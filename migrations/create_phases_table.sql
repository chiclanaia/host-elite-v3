-- Migration: Create phases table and seed data
-- Description: Store project phases with their order and description
-- Create phases table
CREATE TABLE IF NOT EXISTS public.phases (
    id TEXT PRIMARY KEY,
    -- e.g., 'PH_1_INVEST'
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
-- RLS Policies for phases (read-only for all authenticated users)
CREATE POLICY "Anyone can read phases" ON public.phases FOR
SELECT TO authenticated USING (true);
-- Seed data
INSERT INTO public.phases (id, name, sort_order, description)
VALUES (
        'PH_1_INVEST',
        'Study & Acquisition',
        1,
        'Validating the project and buying the property'
    ),
    (
        'PH_2_DESIGN',
        'Design & Furnishing',
        2,
        'Renovating and setting up the unit'
    ),
    (
        'PH_3_LAUNCH',
        'Strategic Launch',
        3,
        'Marketing assets and initial setup'
    ),
    (
        'PH_4_OPS',
        'Operations Management',
        4,
        'Day-to-day management and automation'
    ),
    (
        'PH_5_ANALYZE',
        'Analysis & Performance',
        5,
        'Financial optimization and reviews'
    ),
    (
        'PH_6_SCALE',
        'Scaling & Optimization',
        6,
        'Growing the portfolio and structuring'
    ) ON CONFLICT (id) DO
UPDATE
SET name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    description = EXCLUDED.description;
-- Grant permissions (optional but good practice if roles are strict, though authenticated usually covers it for RLS)
GRANT SELECT ON public.phases TO authenticated;
GRANT SELECT ON public.phases TO anon;
-- Comments
COMMENT ON TABLE public.phases IS 'Project lifecycle phases';
COMMENT ON COLUMN public.phases.id IS 'Unique identifier for the phase (e.g., PH_1_INVEST)';
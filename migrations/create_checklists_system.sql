-- Migration: Create checklists system
-- Description: Tables for storing downloadable/printable checklists with tier-based access

-- Create checklists table (master templates)
CREATE TABLE IF NOT EXISTS public.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('cleaning', 'maintenance', 'checkin', 'checkout', 'turnover', 'emergency')),
    name_key TEXT NOT NULL, -- Translation key e.g., 'CHECKLIST.cleaning_deep'
    description_key TEXT, -- Translation key for description
    tier TEXT NOT NULL CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
    icon TEXT, -- Emoji or icon identifier
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, tier, order_index)
);

-- Create checklist_items table (individual items for each checklist)
CREATE TABLE IF NOT EXISTS public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    item_text_key TEXT NOT NULL, -- Translation key e.g., 'CHECKLIST.item_vacuum_floors'
    section TEXT, -- Optional grouping: 'kitchen', 'bathroom', 'bedroom', etc.
    order_index INTEGER NOT NULL,
    is_critical BOOLEAN DEFAULT FALSE, -- Mark critical/must-do items
    estimated_minutes INTEGER, -- Time estimate for this item
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(checklist_id, order_index)
);

-- Create indexes for better query performance
CREATE INDEX idx_checklists_category ON public.checklists(category);
CREATE INDEX idx_checklists_tier ON public.checklists(tier);
CREATE INDEX idx_checklists_active ON public.checklists(is_active);
CREATE INDEX idx_checklist_items_checklist ON public.checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_section ON public.checklist_items(section);

-- Enable Row Level Security
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can read active checklists
-- (Tier filtering will be done in the application layer for now)
CREATE POLICY "Authenticated users can read active checklists"
    ON public.checklists
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- RLS Policy: Users can read items for active checklists
CREATE POLICY "Authenticated users can read checklist items"
    ON public.checklist_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.checklists
            WHERE id = checklist_id
            AND is_active = true
        )
    );

-- Add comments for documentation
COMMENT ON TABLE public.checklists IS 'Master checklist templates organized by category and tier';
COMMENT ON TABLE public.checklist_items IS 'Individual items for each checklist template';
COMMENT ON COLUMN public.checklists.tier IS 'Bronze = basic (5-10 items), Silver = intermediate (10-20 items), Gold = comprehensive (20-30+ items)';
COMMENT ON COLUMN public.checklist_items.is_critical IS 'Mark as critical/must-do item (displayed with emphasis)';
COMMENT ON COLUMN public.checklist_items.estimated_minutes IS 'Estimated time to complete this item in minutes';

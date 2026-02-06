-- Create renovation_rooms table for Smart Capex Planner
-- This table stores room-by-room renovation budget planning data

CREATE TABLE IF NOT EXISTS public.renovation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    area NUMERIC NOT NULL,
    finish_level TEXT NOT NULL CHECK (finish_level IN ('Standard', 'Premium', 'Luxury')),
    budget_estimate NUMERIC NOT NULL DEFAULT 0,
    actual_spend NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying by property
CREATE INDEX IF NOT EXISTS idx_renovation_rooms_property_id ON public.renovation_rooms(property_id);

-- Enable Row Level Security
ALTER TABLE public.renovation_rooms ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own property's renovation rooms
CREATE POLICY "Users can view their own renovation rooms"
    ON public.renovation_rooms
    FOR SELECT
    USING (
        property_id IN (
            SELECT id FROM public.properties WHERE owner_id = auth.uid()
        )
    );

-- Policy: Users can insert renovation rooms for their own properties
CREATE POLICY "Users can insert renovation rooms for their own properties"
    ON public.renovation_rooms
    FOR INSERT
    WITH CHECK (
        property_id IN (
            SELECT id FROM public.properties WHERE owner_id = auth.uid()
        )
    );

-- Policy: Users can update their own renovation rooms
CREATE POLICY "Users can update their own renovation rooms"
    ON public.renovation_rooms
    FOR UPDATE
    USING (
        property_id IN (
            SELECT id FROM public.properties WHERE owner_id = auth.uid()
        )
    );

-- Policy: Users can delete their own renovation rooms
CREATE POLICY "Users can delete their own renovation rooms"
    ON public.renovation_rooms
    FOR DELETE
    USING (
        property_id IN (
            SELECT id FROM public.properties WHERE owner_id = auth.uid()
        )
    );

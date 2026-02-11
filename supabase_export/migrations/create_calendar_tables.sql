-- =====================================================
-- CALENDAR TOOL DATABASE SCHEMA
-- =====================================================
-- This migration creates the necessary tables for the Calendar Sync Tool
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dcaarwmafbrqdmwbulpt

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Calendar Sources Table
-- Stores both external iCal sources and internal calendar configurations
CREATE TABLE IF NOT EXISTS calendar_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT, -- NULL for internal calendars, required for external
    color TEXT NOT NULL DEFAULT '#3788d8', -- Hex color code
    type TEXT NOT NULL CHECK (type IN ('external', 'internal')),
    property_id UUID NOT NULL, -- Links to the property
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events Table
-- Stores manually created events (internal calendars)
-- External calendar events are fetched on-demand via Edge Function
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ, -- NULL for all-day or single-point events
    description TEXT,
    source_id UUID NOT NULL REFERENCES calendar_sources(id) ON DELETE CASCADE,
    property_id UUID NOT NULL, -- Denormalized for easier querying
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

-- Index for fast property-based queries
CREATE INDEX IF NOT EXISTS idx_calendar_sources_property_id 
    ON calendar_sources(property_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_property_id 
    ON calendar_events(property_id);

-- Index for fast source-based event queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_source_id 
    ON calendar_events(source_id);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_start 
    ON calendar_events(start);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE calendar_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- Calendar Sources Policies
-- Users can only see/modify calendar sources for their own properties

-- SELECT: Users can view sources for their properties
CREATE POLICY "Users can view their own calendar sources"
    ON calendar_sources
    FOR SELECT
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- INSERT: Users can create sources for their properties
CREATE POLICY "Users can create calendar sources for their properties"
    ON calendar_sources
    FOR INSERT
    WITH CHECK (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- UPDATE: Users can update sources for their properties
CREATE POLICY "Users can update their own calendar sources"
    ON calendar_sources
    FOR UPDATE
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- DELETE: Users can delete sources for their properties
CREATE POLICY "Users can delete their own calendar sources"
    ON calendar_sources
    FOR DELETE
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- Calendar Events Policies
-- Users can only see/modify events for their own properties

-- SELECT: Users can view events for their properties
CREATE POLICY "Users can view their own calendar events"
    ON calendar_events
    FOR SELECT
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- INSERT: Users can create events for their properties
CREATE POLICY "Users can create calendar events for their properties"
    ON calendar_events
    FOR INSERT
    WITH CHECK (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- UPDATE: Users can update events for their properties
CREATE POLICY "Users can update their own calendar events"
    ON calendar_events
    FOR UPDATE
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- DELETE: Users can delete events for their properties
CREATE POLICY "Users can delete their own calendar events"
    ON calendar_events
    FOR DELETE
    USING (
        property_id IN (
            SELECT id FROM properties 
            WHERE owner_id = auth.uid()
        )
    );

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================
-- Run these after the migration to verify everything is set up correctly

-- Check tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('calendar_sources', 'calendar_events');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('calendar_sources', 'calendar_events');

-- Check policies exist
-- SELECT tablename, policyname, cmd FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('calendar_sources', 'calendar_events')
-- ORDER BY tablename, cmd;

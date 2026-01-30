
-- Migration: Add ical_url to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS ical_url text;

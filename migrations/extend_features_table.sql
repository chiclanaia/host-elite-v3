-- Add new columns to features table to support rich metadata
ALTER TABLE features
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
    ADD COLUMN IF NOT EXISTS dev_prompt TEXT,
    ADD COLUMN IF NOT EXISTS scope TEXT,
    ADD COLUMN IF NOT EXISTS behavior_matrix TEXT;
-- Storing the raw text description of behavior per tier for reference
-- Allow nullable for now
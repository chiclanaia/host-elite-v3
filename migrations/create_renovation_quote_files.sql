-- Smart Capex Planner: Add renovation_quote_files table for PDF storage
-- This table stores metadata for uploaded quote PDFs

CREATE TABLE IF NOT EXISTS renovation_quote_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster property-based queries
CREATE INDEX IF NOT EXISTS idx_renovation_quote_files_property 
ON renovation_quote_files(property_id);

-- Add RLS policies
ALTER TABLE renovation_quote_files ENABLE ROW LEVEL SECURITY;

-- Users can view their own property quote files
CREATE POLICY "Users can view own property quote files"
ON renovation_quote_files FOR SELECT
USING (
  property_id IN (
    SELECT id FROM properties WHERE owner_id = auth.uid()
  )
);

-- Users can insert quote files for their own properties
CREATE POLICY "Users can insert own property quote files"
ON renovation_quote_files FOR INSERT
WITH CHECK (
  property_id IN (
    SELECT id FROM properties WHERE owner_id = auth.uid()
  )
);

-- Users can delete their own property quote files
CREATE POLICY "Users can delete own property quote files"
ON renovation_quote_files FOR DELETE
USING (
  property_id IN (
    SELECT id FROM properties WHERE owner_id = auth.uid()
  )
);

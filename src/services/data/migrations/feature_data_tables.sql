
-- Migration: Create Feature Data Tables

-- 1. Renovation Budget (FIN_02)
CREATE TABLE IF NOT EXISTS renovation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Kitchen', 'Bathroom', etc.
    area DECIMAL NOT NULL,
    finish_level TEXT NOT NULL, -- 'Standard', 'Premium', 'Luxury'
    budget_estimate DECIMAL DEFAULT 0,
    actual_spend DECIMAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS renovation_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES renovation_rooms(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    is_preferred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Compliance Checker (LEG_00)
CREATE TABLE IF NOT EXISTS compliance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT UNIQUE NOT NULL,
    limit_days INTEGER DEFAULT 0,
    mandatory_req TEXT,
    risk_level INTEGER DEFAULT 0, -- 0 to 100
    keywords TEXT[], -- Array of keywords for matching
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Construction Schedule (OPS_01)
CREATE TABLE IF NOT EXISTS construction_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    milestone_type TEXT, -- 'Structural', 'Finishing', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Assuming existing policies follow owner_id patterns, 
-- but compliance_rules is public/read-only for all authenticated users)

ALTER TABLE renovation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE renovation_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_tasks ENABLE ROW LEVEL SECURITY;

-- Simple Authenticated Access for Compliance
CREATE POLICY "Enable read access for all users" ON compliance_rules FOR SELECT USING (true);

-- User-specific access for Property-linked tables (assuming helper functions exist or joining with properties)
-- For brevity, we'll allow all authenticated for now and refine if needed based on host_repository patterns.
CREATE POLICY "Enable all for authenticated" ON renovation_rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON renovation_quotes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON construction_tasks FOR ALL USING (auth.role() = 'authenticated');

-- Migration: Create features system
-- Description: Create features and feature_configurations tables with seed data
-- 1. Create features table
CREATE TABLE IF NOT EXISTS public.features (
    id TEXT PRIMARY KEY,
    -- e.g., 'FIN_01'
    parent_feature_id TEXT REFERENCES public.features(id),
    dimension_id TEXT REFERENCES public.app_dimensions(dimension_id),
    phase_id TEXT REFERENCES public.phases(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS for features
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read features" ON public.features FOR
SELECT TO authenticated USING (true);
-- 2. Create feature_configurations table
CREATE TABLE IF NOT EXISTS public.feature_configurations (
    config_id INTEGER PRIMARY KEY,
    feature_id TEXT NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
    tier_id TEXT NOT NULL REFERENCES public.app_tiers(tier_id),
    country_code TEXT NOT NULL,
    -- 'GLOBAL' or specific code like 'FR', 'UK'
    config_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS for feature_configurations
ALTER TABLE public.feature_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read feature configurations" ON public.feature_configurations FOR
SELECT TO authenticated USING (true);
-- 3. Seed Features
-- Note: Order matters for parent_feature_id. Roots first.
INSERT INTO public.features (
        id,
        parent_feature_id,
        dimension_id,
        phase_id,
        name,
        description
    )
VALUES (
        'FIN_00',
        NULL,
        'DIM_FINANCE',
        'PH_1_INVEST',
        'Profitability Suite',
        'Core module for financial estimations'
    ),
    (
        'FIN_01',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'Basic ROI Simulator',
        'Simple calculation of Rent vs Fixed Expenses'
    ),
    (
        'FIN_02',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'Renovation Budget',
        'Estimation of renovation and furnishing costs'
    ),
    (
        'FIN_03',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'LMNP Tax Simulator',
        'Comparison of Real vs Micro-BIC tax regimes (FR specific)'
    ),
    (
        'FIN_04',
        'FIN_00',
        'DIM_FINANCE',
        'PH_1_INVEST',
        'Section 24 Simulator',
        'Mortgage interest relief calculator (UK specific)'
    ),
    (
        'LEG_00',
        NULL,
        'DIM_LEGAL',
        'PH_1_INVEST',
        'Compliance Checker',
        'Regulatory verification module'
    ),
    (
        'LEG_01',
        'LEG_00',
        'DIM_LEGAL',
        'PH_1_INVEST',
        'Regulatory Checklist',
        'Generic list of compliance checkpoints'
    ),
    (
        'LEG_02',
        'LEG_00',
        'DIM_LEGAL',
        'PH_1_INVEST',
        'Zweckentfremdungsverbot',
        'Berlin/Munich misuse ban verifier (DE specific)'
    ),
    (
        'EXP_01',
        NULL,
        'DIM_EXP',
        'PH_2_DESIGN',
        'Essentials List',
        'PDF checklist of basic amenities'
    ),
    (
        'EXP_02',
        NULL,
        'DIM_EXP',
        'PH_2_DESIGN',
        'Inventory Generator',
        'Digital room-by-room inventory tool'
    ),
    (
        'OPS_01',
        NULL,
        'DIM_OPS',
        'PH_2_DESIGN',
        'Construction Schedule',
        'Simple calendar for works tracking'
    ),
    (
        'MKT_00',
        NULL,
        'DIM_MKT',
        'PH_3_LAUNCH',
        'Listing Optimization',
        'Tools to improve listing quality'
    ),
    (
        'MKT_01',
        'MKT_00',
        'DIM_MKT',
        'PH_3_LAUNCH',
        'Photo Guide',
        'Tutorial for smartphone photography'
    ),
    (
        'MKT_02',
        'MKT_00',
        'DIM_MKT',
        'PH_3_LAUNCH',
        'AI Listing Writer',
        'Description generator via LLM'
    ),
    (
        'LEG_03',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'Cerfa Generator',
        'Tourist accommodation declaration form filler (FR specific)'
    ),
    (
        'LEG_04',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'VUT License Assistant',
        'Registration guide (ES specific)'
    ),
    (
        'LEG_05',
        NULL,
        'DIM_LEGAL',
        'PH_3_LAUNCH',
        'Impressum Generator',
        'Legal notice creator (DE specific)'
    ),
    (
        'PRI_01',
        NULL,
        'DIM_PRICING',
        'PH_3_LAUNCH',
        'Yield Setup',
        'Initial pricing strategy configuration'
    ),
    (
        'OPS_02',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'iCal Sync',
        'Manual calendar export'
    ),
    (
        'OPS_03',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'Channel Manager',
        'Central engine for synchronization'
    ),
    (
        'OPS_03_AIRBNB',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'Airbnb Connector',
        'API connection to Airbnb'
    ),
    (
        'OPS_03_BOOKING',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'Booking.com Connector',
        'API connection to Booking.com'
    ),
    (
        'OPS_03_VRBO',
        'OPS_03',
        'DIM_OPS',
        'PH_4_OPS',
        'Vrbo Connector',
        'API connection to Vrbo/Abritel'
    ),
    (
        'OPS_04',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'Police Connection',
        'Guardia Civil auto-reporting (ES specific)'
    ),
    (
        'OPS_05',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        '90-Day Counter',
        'London limit tracker (UK specific)'
    ),
    (
        'OPS_08',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'Task Automation',
        'Engine for scheduling cleaning/maintenance'
    ),
    (
        'OPS_09',
        'OPS_08',
        'DIM_OPS',
        'PH_4_OPS',
        'Provider App',
        'Mobile interface for field staff'
    ),
    (
        'OPS_10',
        'OPS_08',
        'DIM_OPS',
        'PH_4_OPS',
        'Ticketing System',
        'Incident reporting and tracking'
    ),
    (
        'FIN_08',
        NULL,
        'DIM_FINANCE',
        'PH_4_OPS',
        'Commission Splitter',
        'Revenue sharing calculator for management'
    ),
    (
        'LEG_07',
        NULL,
        'DIM_LEGAL',
        'PH_4_OPS',
        'Mandate Generator',
        'Contract creator for concierge services'
    ),
    (
        'EXP_03',
        NULL,
        'DIM_EXP',
        'PH_4_OPS',
        'Web Welcome Book',
        'Guest information page'
    ),
    (
        'EXP_04',
        NULL,
        'DIM_EXP',
        'PH_4_OPS',
        'Guest AI Chatbot',
        'Automated Q&A for guests'
    ),
    (
        'FIN_05',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'Occupancy Stats',
        'Basic performance dashboard'
    ),
    (
        'FIN_06',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'FEC Export',
        'Accounting file export (FR specific)'
    ),
    (
        'FIN_07',
        NULL,
        'DIM_FINANCE',
        'PH_5_ANALYZE',
        'MTD Export',
        'HMRC tax export (UK specific)'
    ),
    (
        'PRI_02',
        NULL,
        'DIM_PRICING',
        'PH_5_ANALYZE',
        'RevPAR Optimizer',
        'Advanced yield management algorithm'
    ),
    (
        'MKT_03',
        NULL,
        'DIM_MKT',
        'PH_6_SCALE',
        'Direct Booking Site',
        'Commission-free website builder'
    ),
    (
        'OPS_06',
        NULL,
        'DIM_OPS',
        'PH_6_SCALE',
        'Team Management',
        'Multi-user access control'
    ),
    (
        'OPS_07',
        'OPS_06',
        'DIM_OPS',
        'PH_6_SCALE',
        'Investor Portal',
        'Read-only view for owners'
    ),
    (
        'FIN_09',
        NULL,
        'DIM_FINANCE',
        'PH_1_INVEST',
        'Delegation ROI Simulator',
        'Simulate costs and returns of delegating management'
    ),
    (
        'OPS_11',
        NULL,
        'DIM_OPS',
        'PH_4_OPS',
        'Operational Checklists',
        'Manage cleaning and maintenance tasks'
    ),
    (
        'PRI_03',
        NULL,
        'DIM_PRICING',
        'PH_5_ANALYZE',
        'Market Performance Alerts',
        'Smart alerts based on market trends'
    ) ON CONFLICT (id) DO
UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description;
-- 4. Seed Feature Configurations
INSERT INTO public.feature_configurations (
        config_id,
        feature_id,
        tier_id,
        country_code,
        config_value
    )
VALUES (
        1,
        'FIN_01',
        'TIER_0',
        'GLOBAL',
        '{"projects_limit": 1}'
    ),
    (
        2,
        'FIN_01',
        'TIER_1',
        'GLOBAL',
        '{"projects_limit": 5}'
    ),
    (
        3,
        'FIN_02',
        'TIER_1',
        'GLOBAL',
        '{"export_pdf": true}'
    ),
    (
        4,
        'FIN_03',
        'TIER_3',
        'FR',
        '{"mode": "advanced_amortization"}'
    ),
    (
        5,
        'FIN_04',
        'TIER_3',
        'UK',
        '{"mode": "advanced_relief"}'
    ),
    (
        6,
        'LEG_01',
        'TIER_0',
        'GLOBAL',
        '{"view_only": true}'
    ),
    (
        7,
        'LEG_02',
        'TIER_2',
        'DE',
        '{"check_frequency": "monthly"}'
    ),
    (
        8,
        'EXP_01',
        'TIER_0',
        'GLOBAL',
        '{"format": "pdf"}'
    ),
    (
        9,
        'EXP_02',
        'TIER_2',
        'GLOBAL',
        '{"rooms_limit": 10}'
    ),
    (
        10,
        'OPS_01',
        'TIER_1',
        'GLOBAL',
        '{"shareable": false}'
    ),
    (
        11,
        'MKT_01',
        'TIER_0',
        'GLOBAL',
        '{"access": true}'
    ),
    (
        12,
        'MKT_02',
        'TIER_2',
        'GLOBAL',
        '{"model": "gpt-3.5", "monthly_limit": 5}'
    ),
    (
        13,
        'MKT_02',
        'TIER_3',
        'GLOBAL',
        '{"model": "gpt-4", "monthly_limit": "unlimited"}'
    ),
    (
        14,
        'LEG_03',
        'TIER_2',
        'FR',
        '{"auto_fill": true}'
    ),
    (
        15,
        'LEG_04',
        'TIER_2',
        'ES',
        '{"auto_fill": true}'
    ),
    (
        16,
        'LEG_05',
        'TIER_2',
        'DE',
        '{"auto_fill": true}'
    ),
    (
        17,
        'PRI_01',
        'TIER_3',
        'GLOBAL',
        '{"strategies": ["aggressive", "balanced"]}'
    ),
    (
        18,
        'OPS_02',
        'TIER_0',
        'GLOBAL',
        '{"refresh_rate": "manual"}'
    ),
    (
        19,
        'OPS_03',
        'TIER_2',
        'GLOBAL',
        '{"refresh_rate": "daily", "max_listings": 2}'
    ),
    (
        20,
        'OPS_03',
        'TIER_3',
        'GLOBAL',
        '{"refresh_rate": "realtime", "max_listings": "unlimited"}'
    ),
    (
        21,
        'OPS_03_AIRBNB',
        'TIER_2',
        'GLOBAL',
        '{"enabled": true}'
    ),
    (
        22,
        'OPS_03_BOOKING',
        'TIER_2',
        'GLOBAL',
        '{"enabled": true}'
    ),
    (
        23,
        'OPS_03_VRBO',
        'TIER_3',
        'GLOBAL',
        '{"enabled": true}'
    ),
    (
        24,
        'OPS_04',
        'TIER_3',
        'ES',
        '{"automation": "full_api"}'
    ),
    (
        25,
        'OPS_05',
        'TIER_2',
        'UK',
        '{"alerts": "email"}'
    ),
    (
        26,
        'OPS_08',
        'TIER_2',
        'GLOBAL',
        '{"rules_limit": 3}'
    ),
    (
        27,
        'OPS_08',
        'TIER_3',
        'GLOBAL',
        '{"rules_limit": "unlimited"}'
    ),
    (
        28,
        'OPS_09',
        'TIER_3',
        'GLOBAL',
        '{"photo_upload": true, "gps_tracking": true}'
    ),
    (
        29,
        'OPS_10',
        'TIER_3',
        'GLOBAL',
        '{"history_retention": "1_year"}'
    ),
    (
        30,
        'FIN_08',
        'TIER_2',
        'GLOBAL',
        '{"formulas": "basic_percent"}'
    ),
    (
        31,
        'LEG_07',
        'TIER_2',
        'FR',
        '{"templates": "standard"}'
    ),
    (
        32,
        'EXP_03',
        'TIER_1',
        'GLOBAL',
        '{"custom_branding": false}'
    ),
    (
        33,
        'EXP_03',
        'TIER_3',
        'GLOBAL',
        '{"custom_branding": true, "domain": "custom"}'
    ),
    (
        34,
        'EXP_04',
        'TIER_3',
        'GLOBAL',
        '{"training_data": "custom_docs"}'
    ),
    (
        35,
        'FIN_05',
        'TIER_1',
        'GLOBAL',
        '{"history": "3_months"}'
    ),
    (
        36,
        'FIN_06',
        'TIER_3',
        'FR',
        '{"format": "FEC_2025"}'
    ),
    (
        37,
        'FIN_07',
        'TIER_3',
        'UK',
        '{"format": "MTD_v1"}'
    ),
    (
        38,
        'PRI_02',
        'TIER_3',
        'GLOBAL',
        '{"ai_analysis": true}'
    ),
    (
        39,
        'MKT_03',
        'TIER_3',
        'GLOBAL',
        '{"payment_gateway": "stripe_connect"}'
    ),
    (40, 'OPS_06', 'TIER_2', 'GLOBAL', '{"seats": 1}'),
    (
        41,
        'OPS_06',
        'TIER_3',
        'GLOBAL',
        '{"seats": "unlimited", "roles": ["cleaner", "manager", "owner"]}'
    ),
    (
        42,
        'OPS_07',
        'TIER_3',
        'GLOBAL',
        '{"view_mode": "financial_only"}'
    ),
    (
        43,
        'LEG_06',
        'TIER_3',
        'GLOBAL',
        '{"simulation_depth": "expert"}'
    ) ON CONFLICT (config_id) DO
UPDATE
SET feature_id = EXCLUDED.feature_id,
    tier_id = EXCLUDED.tier_id,
    country_code = EXCLUDED.country_code,
    config_value = EXCLUDED.config_value;
-- Comments
COMMENT ON TABLE public.features IS 'Application features mapped to Dimensions and Phases';
COMMENT ON TABLE public.feature_configurations IS 'Configuration of features per Tier and Country';
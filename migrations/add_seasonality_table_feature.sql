-- Migration: Add Seasonality Table and Detailed Expenses features for Silver plan
-- Description: Add sub-features for the ROI Simulator that are available from TIER_2 (Silver) onwards

-- Add FIN_01_DETAILED_EXPENSES feature
INSERT INTO public.features (
    id,
    parent_feature_id,
    dimension_id,
    phase_id,
    name,
    description
)
VALUES (
    'FIN_01_DETAILED_EXPENSES',
    'FIN_01',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'Detailed Expenses Breakdown',
    'Advanced cost breakdown with wifi, electricity, water, gas and other expenses'
) ON CONFLICT (id) DO UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Add FIN_01_SEASONALITY_TABLE feature
INSERT INTO public.features (
    id,
    parent_feature_id,
    dimension_id,
    phase_id,
    name,
    description
)
VALUES (
    'FIN_01_SEASONALITY_TABLE',
    'FIN_01',
    'DIM_FINANCE',
    'PH_1_INVEST',
    'Seasonality Table',
    'Monthly occupancy and pricing adjustment table for seasonal variations'
) ON CONFLICT (id) DO UPDATE
SET parent_feature_id = EXCLUDED.parent_feature_id,
    dimension_id = EXCLUDED.dimension_id,
    phase_id = EXCLUDED.phase_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Add configurations for FIN_01_DETAILED_EXPENSES
-- Available from TIER_1 (Bronze) onwards
INSERT INTO public.feature_configurations (
    config_id,
    feature_id,
    tier_id,
    country_code,
    config_value
)
VALUES (
    100,
    'FIN_01_DETAILED_EXPENSES',
    'TIER_1',
    'GLOBAL',
    '{"enabled": true}'
) ON CONFLICT (config_id) DO UPDATE
SET feature_id = EXCLUDED.feature_id,
    tier_id = EXCLUDED.tier_id,
    country_code = EXCLUDED.country_code,
    config_value = EXCLUDED.config_value;

-- Add configurations for FIN_01_SEASONALITY_TABLE
-- Available from TIER_2 (Silver) onwards
INSERT INTO public.feature_configurations (
    config_id,
    feature_id,
    tier_id,
    country_code,
    config_value
)
VALUES (
    101,
    'FIN_01_SEASONALITY_TABLE',
    'TIER_2',
    'GLOBAL',
    '{"enabled": true, "monthly_inputs": true}'
) ON CONFLICT (config_id) DO UPDATE
SET feature_id = EXCLUDED.feature_id,
    tier_id = EXCLUDED.tier_id,
    country_code = EXCLUDED.country_code,
    config_value = EXCLUDED.config_value;

-- Also enable for TIER_3 (Gold)
INSERT INTO public.feature_configurations (
    config_id,
    feature_id,
    tier_id,
    country_code,
    config_value
)
VALUES (
    102,
    'FIN_01_SEASONALITY_TABLE',
    'TIER_3',
    'GLOBAL',
    '{"enabled": true, "monthly_inputs": true, "ai_prefill": true}'
) ON CONFLICT (config_id) DO UPDATE
SET feature_id = EXCLUDED.feature_id,
    tier_id = EXCLUDED.tier_id,
    country_code = EXCLUDED.country_code,
    config_value = EXCLUDED.config_value;

-- Migration: Update plan features to include seasonality table and detailed expenses
-- Description: Add FIN_01_SEASONALITY_TABLE and FIN_01_DETAILED_EXPENSES to appropriate plans

-- Helper function to safely add features to a plan
-- This ensures features are JSON arrays and prevents duplicates
DO $
DECLARE
    plan_record RECORD;
BEGIN
    -- Add FIN_01_DETAILED_EXPENSES to TIER_1 (Bronze) plans
    FOR plan_record IN 
        SELECT id, features FROM app_plans 
        WHERE id = 'TIER_1' OR id ILIKE '%BRONZE%'
    LOOP
        UPDATE app_plans
        SET features = (
            SELECT jsonb_agg(DISTINCT x)
            FROM jsonb_array_elements_text(
                COALESCE(plan_record.features, '[]'::jsonb) || '["FIN_01_DETAILED_EXPENSES"]'::jsonb
            ) AS x
        )
        WHERE id = plan_record.id;
    END LOOP;

    -- Add FIN_01_DETAILED_EXPENSES and FIN_01_SEASONALITY_TABLE to TIER_2 (Silver) plans
    FOR plan_record IN
        SELECT id, features FROM app_plans
        WHERE id = 'TIER_2' OR id ILIKE '%SILVER%'
    LOOP
        UPDATE app_plans
        SET features = (
            SELECT jsonb_agg(DISTINCT x)
            FROM jsonb_array_elements_text(
                COALESCE(plan_record.features, '[]'::jsonb) || '["FIN_01_DETAILED_EXPENSES", "FIN_01_SEASONALITY_TABLE"]'::jsonb
            ) AS x
        )
        WHERE id = plan_record.id;
    END LOOP;

    -- Add FIN_01_DETAILED_EXPENSES and FIN_01_SEASONALITY_TABLE to TIER_3 (Gold) plans
    FOR plan_record IN
        SELECT id, features FROM app_plans
        WHERE id = 'TIER_3' OR id ILIKE '%GOLD%'
    LOOP
        UPDATE app_plans
        SET features = (
            SELECT jsonb_agg(DISTINCT x)
            FROM jsonb_array_elements_text(
                COALESCE(plan_record.features, '[]'::jsonb) || '["FIN_01_DETAILED_EXPENSES", "FIN_01_SEASONALITY_TABLE"]'::jsonb
            ) AS x
        )
        WHERE id = plan_record.id;
    END LOOP;
END $;

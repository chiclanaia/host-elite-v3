-- Seed data for checklists system
-- Description: Sample checklists for each tier and category

-- ============================================
-- CLEANING CHECKLISTS
-- ============================================

-- Bronze: Basic Cleaning Checklist
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('cleaning', 'CHECKLIST.cleaning_basic', 'CHECKLIST.cleaning_basic_desc', 'Bronze', '🧹', 1);

-- Get the ID for Bronze cleaning checklist
DO $$
DECLARE
    bronze_cleaning_id UUID;
BEGIN
    SELECT id INTO bronze_cleaning_id FROM public.checklists 
    WHERE category = 'cleaning' AND tier = 'Bronze' LIMIT 1;
    
    -- Add items for Bronze cleaning
    INSERT INTO public.checklist_items (checklist_id, item_text_key, section, order_index, is_critical, estimated_minutes) VALUES
    (bronze_cleaning_id, 'CHECKLIST.item_remove_trash', 'general', 1, true, 5),
    (bronze_cleaning_id, 'CHECKLIST.item_change_linens', 'bedroom', 2, true, 15),
    (bronze_cleaning_id, 'CHECKLIST.item_vacuum_floors', 'general', 3, true, 20),
    (bronze_cleaning_id, 'CHECKLIST.item_clean_bathroom', 'bathroom', 4, true, 25),
    (bronze_cleaning_id, 'CHECKLIST.item_clean_kitchen', 'kitchen', 5, true, 20),
    (bronze_cleaning_id, 'CHECKLIST.item_dust_surfaces', 'general', 6, false, 15),
    (bronze_cleaning_id, 'CHECKLIST.item_restock_supplies', 'general', 7, true, 10);
END $$;

-- Silver: Deep Cleaning Checklist
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('cleaning', 'CHECKLIST.cleaning_deep', 'CHECKLIST.cleaning_deep_desc', 'Silver', '✨', 1);

-- Gold: Professional Cleaning Checklist
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('cleaning', 'CHECKLIST.cleaning_professional', 'CHECKLIST.cleaning_professional_desc', 'Gold', '⭐', 1);

-- ============================================
-- CHECK-IN CHECKLISTS
-- ============================================

-- Bronze: Basic Check-In
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('checkin', 'CHECKLIST.checkin_basic', 'CHECKLIST.checkin_basic_desc', 'Bronze', '🔑', 1);

DO $$
DECLARE
    bronze_checkin_id UUID;
BEGIN
    SELECT id INTO bronze_checkin_id FROM public.checklists 
    WHERE category = 'checkin' AND tier = 'Bronze' LIMIT 1;
    
    INSERT INTO public.checklist_items (checklist_id, item_text_key, section, order_index, is_critical, estimated_minutes) VALUES
    (bronze_checkin_id, 'CHECKLIST.item_verify_booking', 'preparation', 1, true, 5),
    (bronze_checkin_id, 'CHECKLIST.item_prepare_keys', 'preparation', 2, true, 5),
    (bronze_checkin_id, 'CHECKLIST.item_set_temperature', 'comfort', 3, true, 5),
    (bronze_checkin_id, 'CHECKLIST.item_turn_on_lights', 'ambiance', 4, false, 5),
    (bronze_checkin_id, 'CHECKLIST.item_check_wifi', 'tech', 5, true, 5);
END $$;

-- Silver: Enhanced Check-In
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('checkin', 'CHECKLIST.checkin_enhanced', 'CHECKLIST.checkin_enhanced_desc', 'Silver', '🌟', 1);

-- ============================================
-- CHECK-OUT CHECKLISTS
-- ============================================

-- Bronze: Basic Check-Out
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('checkout', 'CHECKLIST.checkout_basic', 'CHECKLIST.checkout_basic_desc', 'Bronze', '👋', 1);

DO $$
DECLARE
    bronze_checkout_id UUID;
BEGIN
    SELECT id INTO bronze_checkout_id FROM public.checklists 
    WHERE category = 'checkout' AND tier = 'Bronze' LIMIT 1;
    
    INSERT INTO public.checklist_items (checklist_id, item_text_key, section, order_index, is_critical, estimated_minutes) VALUES
    (bronze_checkout_id, 'CHECKLIST.item_inspect_damage', 'inspection', 1, true, 15),
    (bronze_checkout_id, 'CHECKLIST.item_collect_keys', 'keys', 2, true, 5),
    (bronze_checkout_id, 'CHECKLIST.item_check_inventory', 'inventory', 3, true, 10),
    (bronze_checkout_id, 'CHECKLIST.item_note_issues', 'documentation', 4, false, 10);
END $$;

-- ============================================
-- MAINTENANCE CHECKLISTS
-- ============================================

-- Silver: Monthly Maintenance
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('maintenance', 'CHECKLIST.maintenance_monthly', 'CHECKLIST.maintenance_monthly_desc', 'Silver', '🔧', 1);

DO $$
DECLARE
    silver_maintenance_id UUID;
BEGIN
    SELECT id INTO silver_maintenance_id FROM public.checklists 
    WHERE category = 'maintenance' AND tier = 'Silver' LIMIT 1;
    
    INSERT INTO public.checklist_items (checklist_id, item_text_key, section, order_index, is_critical, estimated_minutes) VALUES
    (silver_maintenance_id, 'CHECKLIST.item_test_smoke_detectors', 'safety', 1, true, 10),
    (silver_maintenance_id, 'CHECKLIST.item_check_hvac_filters', 'hvac', 2, true, 15),
    (silver_maintenance_id, 'CHECKLIST.item_inspect_plumbing', 'plumbing', 3, true, 20),
    (silver_maintenance_id, 'CHECKLIST.item_test_appliances', 'appliances', 4, true, 30),
    (silver_maintenance_id, 'CHECKLIST.item_check_locks', 'security', 5, true, 10),
    (silver_maintenance_id, 'CHECKLIST.item_inspect_exterior', 'exterior', 6, false, 20);
END $$;

-- Gold: Seasonal Maintenance
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('maintenance', 'CHECKLIST.maintenance_seasonal', 'CHECKLIST.maintenance_seasonal_desc', 'Gold', '🌿', 2);

-- ============================================
-- TURNOVER CHECKLISTS
-- ============================================

-- Silver: Quick Turnover
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('turnover', 'CHECKLIST.turnover_quick', 'CHECKLIST.turnover_quick_desc', 'Silver', '⚡', 1);

-- Gold: Same-Day Turnover
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('turnover', 'CHECKLIST.turnover_sameday', 'CHECKLIST.turnover_sameday_desc', 'Gold', '🚀', 2);

-- ============================================
-- EMERGENCY CHECKLISTS
-- ============================================

-- Gold: Emergency Procedures
INSERT INTO public.checklists (category, name_key, description_key, tier, icon, order_index) VALUES
('emergency', 'CHECKLIST.emergency_general', 'CHECKLIST.emergency_general_desc', 'Gold', '🚨', 1);

DO $$
DECLARE
    gold_emergency_id UUID;
BEGIN
    SELECT id INTO gold_emergency_id FROM public.checklists 
    WHERE category = 'emergency' AND tier = 'Gold' LIMIT 1;
    
    INSERT INTO public.checklist_items (checklist_id, item_text_key, section, order_index, is_critical, estimated_minutes) VALUES
    (gold_emergency_id, 'CHECKLIST.item_assess_situation', 'assessment', 1, true, 5),
    (gold_emergency_id, 'CHECKLIST.item_ensure_safety', 'safety', 2, true, 5),
    (gold_emergency_id, 'CHECKLIST.item_contact_emergency', 'communication', 3, true, 5),
    (gold_emergency_id, 'CHECKLIST.item_notify_guest', 'communication', 4, true, 10),
    (gold_emergency_id, 'CHECKLIST.item_document_incident', 'documentation', 5, true, 15),
    (gold_emergency_id, 'CHECKLIST.item_contact_insurance', 'insurance', 6, false, 20);
END $$;

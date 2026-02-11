-- =====================================================
-- HOUSEKEEPING ADMIN POLICIES
-- =====================================================
-- Allows users with 'admin' role to perform global cleanup regardless of ownership

-- 1. Calendar Events
-- Add policy to allow admins to delete any event
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'calendar_events' 
        AND policyname = 'Admins can delete any calendar event'
    ) THEN
        CREATE POLICY "Admins can delete any calendar event"
            ON calendar_events
            FOR DELETE
            USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;

-- 2. Notifications
-- Add policy to allow admins to delete any notification
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications' 
        AND policyname = 'Admins can delete any notification'
    ) THEN
        CREATE POLICY "Admins can delete any notification"
            ON notifications
            FOR DELETE
            USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;

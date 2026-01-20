-- =====================================================
-- NOTIFICATION SYSTEM DATABASE SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'event')),
    read_status BOOLEAN NOT NULL DEFAULT false,
    payload JSONB DEFAULT '{}'::jsonb, -- Store related IDs like property_id, event_id, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user-based queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- UPDATE: Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- DELETE: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
    ON notifications
    FOR DELETE
    USING (auth.uid() = user_id);

-- INSERT: Service role or trigger can insert (for production background tasks)
-- For now, allow auth users to post notifications themselves as requested (isolated posting)
CREATE POLICY "Users can post notifications"
    ON notifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

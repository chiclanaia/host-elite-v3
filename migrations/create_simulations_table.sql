-- Table for saving user profitability simulations (Tier 1+)
CREATE TABLE IF NOT EXISTS public.saved_simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    inputs JSONB NOT NULL,
    -- The FinancialInput object
    results JSONB NOT NULL,
    -- The FinancialOutput object
    created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS Policies
ALTER TABLE public.saved_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own simulations" ON public.saved_simulations FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own simulations" ON public.saved_simulations FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own simulations" ON public.saved_simulations FOR DELETE USING (auth.uid() = user_id);
-- Optional: Limit number of simulations per user is handled in Application Logic, 
-- but we could enforce it here with a Trigger if we wanted to be strict.
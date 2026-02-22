
-- Add tracking fields and user_id to orders
ALTER TABLE public.orders 
  ADD COLUMN tracking_number TEXT,
  ADD COLUMN tracking_url TEXT,
  ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Allow authenticated users to see their own orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

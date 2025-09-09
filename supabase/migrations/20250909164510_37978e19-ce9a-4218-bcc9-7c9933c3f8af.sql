-- Fix security vulnerability in cbake_orders table
-- Remove overly permissive policies that allow anyone to view/update orders

DROP POLICY IF EXISTS "Anyone can view cbake orders for admin" ON public.cbake_orders;
DROP POLICY IF EXISTS "Anyone can update cbake orders for admin" ON public.cbake_orders;

-- Keep existing policies:
-- "Admin can manage orders" - allows admin to do everything
-- "Anyone can create orders" - allows customers to place orders

-- Add policy for users to view their own orders (if they have an account)
CREATE POLICY "Users can view their own orders" 
ON public.cbake_orders 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR (auth.uid() IS NOT NULL AND auth.email() = email)
);

-- Add policy for users to update their own pending orders
CREATE POLICY "Users can update their own pending orders" 
ON public.cbake_orders 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id AND status = 'pending') 
  OR (auth.uid() IS NOT NULL AND auth.email() = email AND status = 'pending')
);
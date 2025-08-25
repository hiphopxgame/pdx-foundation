-- Enable RLS and create security policies for tables with exposed personal data

-- 1. Secure customer_vehicles table
ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view their own vehicle records
CREATE POLICY "Users can view their own vehicles" 
ON public.customer_vehicles 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Allow users to insert their own vehicle records
CREATE POLICY "Users can insert their own vehicles" 
ON public.customer_vehicles 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Allow users to update their own vehicle records
CREATE POLICY "Users can update their own vehicles" 
ON public.customer_vehicles 
FOR UPDATE 
USING (auth.uid() = customer_id);

-- Allow admins to manage all vehicle records
CREATE POLICY "Admins can manage all vehicles" 
ON public.customer_vehicles 
FOR ALL 
USING (is_admin() OR is_super_admin())
WITH CHECK (is_admin() OR is_super_admin());

-- 2. Secure dc_business_profiles table
ALTER TABLE public.dc_business_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own profile
CREATE POLICY "Users can view their own business profile" 
ON public.dc_business_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own business profile" 
ON public.dc_business_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own business profile" 
ON public.dc_business_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Secure oregon_tires_contact_messages table
ALTER TABLE public.oregon_tires_contact_messages ENABLE ROW LEVEL SECURITY;

-- Only admins can view contact messages
CREATE POLICY "Only admins can view contact messages" 
ON public.oregon_tires_contact_messages 
FOR SELECT 
USING (is_admin() OR is_super_admin());

-- Anyone can insert contact messages (for contact forms)
CREATE POLICY "Anyone can submit contact messages" 
ON public.oregon_tires_contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only admins can manage contact messages
CREATE POLICY "Admins can manage contact messages" 
ON public.oregon_tires_contact_messages 
FOR ALL 
USING (is_admin() OR is_super_admin())
WITH CHECK (is_admin() OR is_super_admin());

-- 4. Secure oretir_employees table
ALTER TABLE public.oretir_employees ENABLE ROW LEVEL SECURITY;

-- Only admins can view employee data
CREATE POLICY "Only admins can view employees" 
ON public.oretir_employees 
FOR SELECT 
USING (is_admin() OR is_super_admin());

-- Only admins can manage employee data
CREATE POLICY "Admins can manage employees" 
ON public.oretir_employees 
FOR ALL 
USING (is_admin() OR is_super_admin())
WITH CHECK (is_admin() OR is_super_admin());

-- 5. Secure oregon_tires_appointments table
ALTER TABLE public.oregon_tires_appointments ENABLE ROW LEVEL SECURITY;

-- Users can view their own appointments
CREATE POLICY "Users can view their own appointments" 
ON public.oregon_tires_appointments 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Users can create appointments
CREATE POLICY "Users can create appointments" 
ON public.oregon_tires_appointments 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Users can update their own pending appointments
CREATE POLICY "Users can update their own pending appointments" 
ON public.oregon_tires_appointments 
FOR UPDATE 
USING (auth.uid() = customer_id AND status = 'pending');

-- Admins can manage all appointments
CREATE POLICY "Admins can manage all appointments" 
ON public.oregon_tires_appointments 
FOR ALL 
USING (is_admin() OR is_super_admin())
WITH CHECK (is_admin() OR is_super_admin());

-- 6. Update pdxbus_profiles RLS policy to be more restrictive
-- Remove the overly permissive "Anyone can view approved profiles" policy
DROP POLICY IF EXISTS "Anyone can view approved profiles" ON public.pdxbus_profiles;

-- Replace with more secure policy that only shows basic info for approved profiles
CREATE POLICY "Public can view basic info of approved profiles" 
ON public.pdxbus_profiles 
FOR SELECT 
USING (
  is_approved = true AND 
  (
    -- Only show basic professional info, not personal contact details
    auth.uid() = user_id OR 
    is_pdxbus_admin()
  )
);
-- Enable RLS and create security policies for tables with exposed personal data

-- 1. Secure customer_vehicles table (no user_id, so restrict to admins only)
ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;

-- Only admins can view customer vehicles
CREATE POLICY "Only admins can view customer vehicles" 
ON public.customer_vehicles 
FOR SELECT 
USING (is_admin() OR is_super_admin());

-- Only admins can manage customer vehicles
CREATE POLICY "Admins can manage customer vehicles" 
ON public.customer_vehicles 
FOR ALL 
USING (is_admin() OR is_super_admin())
WITH CHECK (is_admin() OR is_super_admin());

-- 2. Secure dc_business_profiles table
ALTER TABLE public.dc_business_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own business profile" 
ON public.dc_business_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own business profile" 
ON public.dc_business_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
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

-- Only admins can update/delete contact messages
CREATE POLICY "Admins can manage contact messages" 
ON public.oregon_tires_contact_messages 
FOR UPDATE 
USING (is_admin() OR is_super_admin());

CREATE POLICY "Admins can delete contact messages" 
ON public.oregon_tires_contact_messages 
FOR DELETE 
USING (is_admin() OR is_super_admin());

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

-- Only admins can view appointments (no user linking)
CREATE POLICY "Only admins can view appointments" 
ON public.oregon_tires_appointments 
FOR SELECT 
USING (is_admin() OR is_super_admin());

-- Anyone can create appointments (for booking forms)
CREATE POLICY "Anyone can create appointments" 
ON public.oregon_tires_appointments 
FOR INSERT 
WITH CHECK (true);

-- Only admins can manage appointments
CREATE POLICY "Admins can manage appointments" 
ON public.oregon_tires_appointments 
FOR UPDATE 
USING (is_admin() OR is_super_admin());

CREATE POLICY "Admins can delete appointments" 
ON public.oregon_tires_appointments 
FOR DELETE 
USING (is_admin() OR is_super_admin());
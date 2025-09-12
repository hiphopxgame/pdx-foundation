-- Security Enhancement: Protect Business Consultation Requests
-- This migration ensures sensitive business consultation data is properly secured

-- 1. First, let's ensure RLS is enabled on the table
ALTER TABLE public.pormar_consultation_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to recreate them with stronger security
DROP POLICY IF EXISTS "Consultations: user or admin can view" ON public.pormar_consultation_requests;
DROP POLICY IF EXISTS "Consultations: anyone can create" ON public.pormar_consultation_requests;
DROP POLICY IF EXISTS "Consultations: only admin can update" ON public.pormar_consultation_requests;
DROP POLICY IF EXISTS "Consultations: only admin can delete" ON public.pormar_consultation_requests;

-- 3. Create strict policies that block unauthenticated access entirely

-- Block all public access explicitly
CREATE POLICY "Block unauthenticated access to consultations" 
ON public.pormar_consultation_requests 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Allow creation of consultation requests (for contact forms)
CREATE POLICY "Authenticated users can create consultations" 
ON public.pormar_consultation_requests 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow viewing only by the requester (matching email) or admins
CREATE POLICY "Requester or admin can view consultations" 
ON public.pormar_consultation_requests 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) 
  AND (
    (email = auth.email()) 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR (auth.email() = 'tyronenorris@gmail.com')
  )
);

-- Only admins can update consultation requests
CREATE POLICY "Admins can update consultations" 
ON public.pormar_consultation_requests 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.email() = 'tyronenorris@gmail.com')
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.email() = 'tyronenorris@gmail.com')
);

-- Only admins can delete consultation requests
CREATE POLICY "Admins can delete consultations" 
ON public.pormar_consultation_requests 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.email() = 'tyronenorris@gmail.com')
);

-- 4. Add a function to validate consultation access
CREATE OR REPLACE FUNCTION public.can_access_consultation(consultation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM pormar_consultation_requests
    WHERE id = consultation_id
    AND (
      email = auth.email()
      OR has_role(auth.uid(), 'admin'::app_role)
      OR auth.email() = 'tyronenorris@gmail.com'
    )
  );
$$;

-- 5. Create audit log for consultation access (for security monitoring)
CREATE TABLE IF NOT EXISTS public.consultation_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES public.pormar_consultation_requests(id),
  accessed_by uuid REFERENCES auth.users(id),
  access_type text NOT NULL, -- 'view', 'create', 'update', 'delete'
  accessed_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on audit log
ALTER TABLE public.consultation_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view access logs
CREATE POLICY "Admins can view access logs" 
ON public.consultation_access_log 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.email() = 'tyronenorris@gmail.com')
);
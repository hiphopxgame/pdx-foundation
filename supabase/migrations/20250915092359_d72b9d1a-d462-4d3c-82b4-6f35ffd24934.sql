-- Fix artist profiles visibility for unauthenticated users
-- Add policy to allow public viewing of artist profiles while protecting email privacy

-- First, drop the overly restrictive policy
DROP POLICY IF EXISTS "Block unauthenticated email access" ON public.artist_profiles;

-- Add a comprehensive policy for public viewing of artist profiles
CREATE POLICY "Public can view public artist profiles with email privacy" 
ON public.artist_profiles 
FOR SELECT 
USING (
  is_public = true 
  AND is_archived = false
  AND 
  CASE
    -- If user is not authenticated, hide email unless it's explicitly public
    WHEN auth.uid() IS NULL THEN 
      CASE
        WHEN is_email_public = true THEN true
        ELSE (email IS NULL OR email = '')
      END
    -- If user is authenticated, show based on email privacy setting
    ELSE 
      CASE
        WHEN is_email_public = true THEN true
        ELSE (email IS NULL OR email = '')
      END
  END
);
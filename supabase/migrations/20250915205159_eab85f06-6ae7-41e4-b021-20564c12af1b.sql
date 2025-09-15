-- Adjust RLS so public users can see all public, non-archived artists regardless of email privacy
-- This replaces restrictive policies that hid artists when email was set but not public

-- Drop restrictive SELECT policies
DROP POLICY IF EXISTS "Public can view public artist profiles with email privacy" ON public.artist_profiles;
DROP POLICY IF EXISTS "Authenticated users can view opted-in public emails only" ON public.artist_profiles;

-- Allow anyone to view public, non-archived artist profiles
CREATE POLICY "Public can view public artist profiles"
ON public.artist_profiles
FOR SELECT
USING (is_public = true AND is_archived = false);

-- Note: Existing policies remain:
-- - "Users can view their own complete profile" (SELECT)
-- - Admins manage all (ALL)
-- - Users manage their own profile (INSERT/UPDATE)
-- This change only affects public visibility of rows, not email exposure in UI.
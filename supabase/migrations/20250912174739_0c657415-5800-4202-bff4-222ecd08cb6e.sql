-- Security Enhancement: Protect Personal Information
-- This migration strengthens RLS policies to ensure personal data is never publicly accessible

-- 1. Ensure artist_profiles emails are protected by default
UPDATE public.artist_profiles 
SET is_email_public = false 
WHERE is_email_public IS NULL OR is_email_public = true;

-- 2. Add explicit policy to block unauthenticated access to artist emails
DROP POLICY IF EXISTS "Block unauthenticated email access" ON public.artist_profiles;
CREATE POLICY "Block unauthenticated email access" 
ON public.artist_profiles 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN email IS NULL OR email = ''
    ELSE true
  END
);

-- 3. Update existing policy to be more restrictive for email access
DROP POLICY IF EXISTS "Authenticated users can view public profiles with emails" ON public.artist_profiles;
CREATE POLICY "Authenticated users can view opted-in public emails only" 
ON public.artist_profiles 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) 
  AND (is_public = true) 
  AND (
    CASE 
      WHEN is_email_public = true THEN true
      ELSE email IS NULL OR email = ''
    END
  )
);

-- 4. Create a secure view for public artist data without emails
CREATE OR REPLACE VIEW public.public_artist_profiles AS
SELECT 
  id,
  created_at,
  updated_at,
  is_featured,
  display_order,
  name,
  bio,
  avatar_url,
  website_url,
  instagram_url,
  youtube_url,
  spotify_url,
  bandcamp_url,
  apple_music_url,
  soundcloud_url,
  tiktok_url,
  facebook_url,
  twitter_url,
  -- Only include email if explicitly opted in AND public
  CASE 
    WHEN is_public = true AND is_email_public = true THEN email
    ELSE NULL
  END as email
FROM public.artist_profiles
WHERE is_public = true AND is_archived = false;

-- 5. Set secure defaults for the table
ALTER TABLE public.artist_profiles 
ALTER COLUMN is_email_public SET DEFAULT false;

-- 6. Add constraint to ensure email privacy is respected
CREATE OR REPLACE FUNCTION check_email_privacy()
RETURNS TRIGGER AS $$
BEGIN
  -- If profile is not public, email should not be public
  IF NEW.is_public = false AND NEW.is_email_public = true THEN
    NEW.is_email_public = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_email_privacy ON public.artist_profiles;
CREATE TRIGGER enforce_email_privacy
  BEFORE INSERT OR UPDATE ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_email_privacy();
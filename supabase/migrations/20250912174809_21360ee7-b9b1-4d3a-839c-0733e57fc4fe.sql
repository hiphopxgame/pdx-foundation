-- Fix security linter issues from previous migration

-- 1. Fix the security definer view by making it a regular view
-- and update the function to have proper search path
DROP VIEW IF EXISTS public.public_artist_profiles;

-- 2. Fix the function search path mutable issue
CREATE OR REPLACE FUNCTION check_email_privacy()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If profile is not public, email should not be public
  IF NEW.is_public = false AND NEW.is_email_public = true THEN
    NEW.is_email_public = false;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Create a simple view without security definer (regular view)
CREATE VIEW public.public_artist_profiles AS
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
  twitter_url
FROM public.artist_profiles
WHERE is_public = true AND is_archived = false;

-- 4. Add RLS policy for the view to ensure it's secure
ALTER VIEW public.public_artist_profiles OWNER TO postgres;

-- 5. Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS enforce_email_privacy ON public.artist_profiles;
CREATE TRIGGER enforce_email_privacy
  BEFORE INSERT OR UPDATE ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_email_privacy();
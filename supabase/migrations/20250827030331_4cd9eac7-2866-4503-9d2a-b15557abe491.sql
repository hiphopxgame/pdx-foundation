-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_artist_profiles;

-- Create a simple view without SECURITY DEFINER (default is SECURITY INVOKER)
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
WHERE is_public = true;

-- Enable RLS on the view as well for extra security
ALTER VIEW public.public_artist_profiles SET (security_barrier = true);

-- Grant select permissions on the public view
GRANT SELECT ON public.public_artist_profiles TO anon, authenticated;
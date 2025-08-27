-- Fix artist_profiles security by restricting email access
-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view public artist profiles" ON public.artist_profiles;

-- Create secure policies for artist_profiles
-- 1. Artists can view their own full profile (including email)
CREATE POLICY "Artists can view their own profile" 
ON public.artist_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Admins can view all profiles (including emails)
CREATE POLICY "Admins can view all artist profiles" 
ON public.artist_profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR auth.email() = 'tyronenorris@gmail.com');

-- 3. Admins can manage all artist profiles
CREATE POLICY "Admins can manage all artist profiles" 
ON public.artist_profiles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR auth.email() = 'tyronenorris@gmail.com')
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.email() = 'tyronenorris@gmail.com');

-- Create a public view that excludes sensitive information
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
  twitter_url
FROM public.artist_profiles
WHERE is_public = true;

-- Grant select permissions on the public view
GRANT SELECT ON public.public_artist_profiles TO anon, authenticated;
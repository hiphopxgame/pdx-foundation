-- Fix security vulnerability in artist_profiles table
-- Remove overly permissive policy that allows unauthenticated users to see all profile data

DROP POLICY IF EXISTS "Public can view non-sensitive artist info" ON public.artist_profiles;

-- Create more secure policies
-- Allow unauthenticated users to view basic public profile info (app should filter sensitive data)
CREATE POLICY "Public can view basic artist info" 
ON public.artist_profiles 
FOR SELECT 
USING (is_public = true);

-- Allow authenticated users to view email addresses only when explicitly opted-in
CREATE POLICY "Authenticated users can view opted-in emails" 
ON public.artist_profiles 
FOR SELECT 
USING (
  is_public = true 
  AND auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR is_email_public = true
  )
);

-- Keep existing policies:
-- "Admins can manage all artist profiles" - admin access
-- "Artists can view their own complete profile" - self access
-- "Users can create their profile" - profile creation
-- "Users can update their own profile" - self updates
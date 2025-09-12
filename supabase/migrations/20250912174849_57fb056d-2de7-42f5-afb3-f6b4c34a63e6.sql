-- Final fix: Remove the problematic view entirely and rely on RLS policies

-- 1. Drop the view that's causing security issues
DROP VIEW IF EXISTS public.public_artist_profiles CASCADE;

-- 2. The existing RLS policies should handle all security needs:
-- - "Block unauthenticated email access" prevents unauthenticated users from seeing emails
-- - "Authenticated users can view opted-in public emails only" only shows emails to authenticated users when explicitly opted-in
-- - "Users can view their own complete profile" allows users to see their own data
-- - "Admins can manage all artist profiles" allows admin access

-- 3. Verify that all existing policies are working correctly
-- The application should query the artist_profiles table directly with RLS handling security
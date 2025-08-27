-- Remove the problematic view that may have security definer properties
DROP VIEW IF EXISTS public.public_artist_profiles CASCADE;

-- Check for any other security definer views
-- The public_por_eve_profiles might also be problematic
DROP VIEW IF EXISTS public.public_por_eve_profiles CASCADE;

-- Instead of using a view, we'll rely on RLS policies and proper queries from the client
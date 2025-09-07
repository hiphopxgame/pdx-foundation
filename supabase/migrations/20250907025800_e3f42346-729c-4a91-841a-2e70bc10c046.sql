-- Add archived field to artist_profiles table
ALTER TABLE public.artist_profiles ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- Add image positioning fields to artist_photos table
ALTER TABLE public.artist_photos ADD COLUMN IF NOT EXISTS position_x numeric DEFAULT 50;
ALTER TABLE public.artist_photos ADD COLUMN IF NOT EXISTS position_y numeric DEFAULT 50;
ALTER TABLE public.artist_photos ADD COLUMN IF NOT EXISTS scale numeric DEFAULT 1.0;
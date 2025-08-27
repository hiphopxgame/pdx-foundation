-- Ensure RLS and allow public inserts while keeping admin control
ALTER TABLE public.artist_photos ENABLE ROW LEVEL SECURITY;

-- Insert policy: allow anyone to add a photo if the artist exists
DROP POLICY IF EXISTS "Anyone can insert artist photos if artist exists" ON public.artist_photos;
CREATE POLICY "Anyone can insert artist photos if artist exists"
ON public.artist_photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.artist_profiles ap
    WHERE ap.id = artist_photos.artist_id
  )
);

-- Keep existing public SELECT and admin ALL policies (created earlier) as-is
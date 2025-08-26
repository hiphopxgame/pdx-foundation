-- Ensure permissive policies also exist for gallery-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow uploads/updates/deletes/selects in gallery-images (to match avatars behavior)
CREATE POLICY IF NOT EXISTS "Allow uploads to gallery-images bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Allow updates to gallery-images bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Allow deletes from gallery-images bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Allow public access to gallery-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');
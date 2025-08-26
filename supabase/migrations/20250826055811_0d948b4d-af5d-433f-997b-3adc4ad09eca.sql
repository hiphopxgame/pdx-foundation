-- Ensure gallery-images bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policies for gallery-images bucket (without IF NOT EXISTS which isn't supported)
CREATE POLICY "Allow uploads to gallery-images bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Allow updates to gallery-images bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow deletes from gallery-images bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow public access to gallery-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');
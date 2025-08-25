-- Drop the existing restrictive policies and create more permissive ones for admin functionality
DROP POLICY IF EXISTS "Allow authenticated users to upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete avatar images" ON storage.objects;

-- Create more permissive policies that allow admin functionality
CREATE POLICY "Allow uploads to avatars bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow updates to avatars bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars');

CREATE POLICY "Allow deletes from avatars bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars');
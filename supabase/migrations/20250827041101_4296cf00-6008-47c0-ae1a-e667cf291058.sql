-- Add RLS policies for existing artist_photos table
-- Enable RLS if not already enabled
ALTER TABLE public.artist_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can manage all artist photos" ON public.artist_photos;
DROP POLICY IF EXISTS "Anyone can view artist photos" ON public.artist_photos;

-- Create admin management policy
CREATE POLICY "Admins can manage all artist photos" 
ON public.artist_photos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR (auth.email() = 'tyronenorris@gmail.com'))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (auth.email() = 'tyronenorris@gmail.com'));

-- Create public viewing policy
CREATE POLICY "Anyone can view artist photos" 
ON public.artist_photos 
FOR SELECT 
USING (true);
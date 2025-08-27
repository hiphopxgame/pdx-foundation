-- Create artist_photos table for managing artist gallery photos
CREATE TABLE public.artist_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for artist_photos
CREATE POLICY "Admins can manage all artist photos" 
ON public.artist_photos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR (auth.email() = 'tyronenorris@gmail.com'::text))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (auth.email() = 'tyronenorris@gmail.com'::text));

CREATE POLICY "Anyone can view artist photos" 
ON public.artist_photos 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_artist_photos_updated_at
BEFORE UPDATE ON public.artist_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
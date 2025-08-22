-- Create artist profiles table for PDX Foundation
CREATE TABLE public.artist_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic info
  name TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  avatar_url TEXT,
  
  -- Social media links
  website_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  spotify_url TEXT,
  bandcamp_url TEXT,
  apple_music_url TEXT,
  soundcloud_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  
  -- Profile settings
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true
);

-- Create photos table for artist galleries
CREATE TABLE public.artist_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false
);

-- Create videos table for YouTube content
CREATE TABLE public.artist_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artist_profiles
CREATE POLICY "Anyone can view public artist profiles"
ON public.artist_profiles FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can create their profile"
ON public.artist_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.artist_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for artist_photos
CREATE POLICY "Anyone can view photos of public artists"
ON public.artist_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.artist_profiles 
    WHERE id = artist_photos.artist_id 
    AND is_public = true
  )
);

CREATE POLICY "Artists can manage their own photos"
ON public.artist_photos FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.artist_profiles 
    WHERE id = artist_photos.artist_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for artist_videos
CREATE POLICY "Anyone can view videos of public artists"
ON public.artist_videos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.artist_profiles 
    WHERE id = artist_videos.artist_id 
    AND is_public = true
  )
);

CREATE POLICY "Artists can manage their own videos"
ON public.artist_videos FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.artist_profiles 
    WHERE id = artist_videos.artist_id 
    AND user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_artist_profiles_display_order ON public.artist_profiles(display_order, is_public);
CREATE INDEX idx_artist_profiles_featured ON public.artist_profiles(is_featured, is_public);
CREATE INDEX idx_artist_photos_artist_id ON public.artist_photos(artist_id, display_order);
CREATE INDEX idx_artist_videos_artist_id ON public.artist_videos(artist_id, display_order);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_photos_updated_at
  BEFORE UPDATE ON public.artist_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_videos_updated_at
  BEFORE UPDATE ON public.artist_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
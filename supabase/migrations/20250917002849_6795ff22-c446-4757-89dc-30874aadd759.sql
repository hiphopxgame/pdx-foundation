-- Add slug column to artist_profiles table
ALTER TABLE public.artist_profiles 
ADD COLUMN slug text;

-- Create a function to generate URL-friendly slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s\-_]', '', 'g'),
          '\s+', '-', 'g'
        ),
        '\-+', '-', 'g'
      ),
      '-'
    )
  );
END;
$$;

-- Update existing artist profiles with generated slugs
UPDATE public.artist_profiles 
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Add unique constraint on slug
ALTER TABLE public.artist_profiles 
ADD CONSTRAINT artist_profiles_slug_unique UNIQUE (slug);

-- Add not null constraint on slug
ALTER TABLE public.artist_profiles 
ALTER COLUMN slug SET NOT NULL;

-- Create a trigger to automatically generate slugs for new artists
CREATE OR REPLACE FUNCTION set_artist_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Generate base slug from name
  base_slug := generate_slug(NEW.name);
  final_slug := base_slug;
  
  -- Handle duplicates by appending a number
  WHILE EXISTS (
    SELECT 1 FROM public.artist_profiles 
    WHERE slug = final_slug AND id != NEW.id
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;

-- Create trigger for new inserts and updates
CREATE TRIGGER artist_slug_trigger
  BEFORE INSERT OR UPDATE OF name ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_artist_slug();
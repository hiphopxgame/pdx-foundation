-- Fix security warning: Set search_path for functions
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION set_artist_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
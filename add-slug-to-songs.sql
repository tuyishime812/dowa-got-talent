-- Add slug column to songs table for SEO-friendly URLs
-- Run this in Supabase SQL Editor

-- Add slug column to songs
ALTER TABLE songs ADD COLUMN IF NOT EXISTS slug VARCHAR(500) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_songs_slug ON songs(slug);

-- Function to generate slug from title and artist
CREATE OR REPLACE FUNCTION generate_song_slug()
RETURNS TRIGGER AS $$
DECLARE
  artist_name TEXT;
  slug_text TEXT;
BEGIN
  -- Get artist name
  SELECT name INTO artist_name FROM artists WHERE id = NEW.artist_id;
  
  -- Generate slug: artist-title-lowercase-hyphenated
  slug_text := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        COALESCE(artist_name, 'unknown') || '-' || NEW.title,
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
  
  NEW.slug := slug_text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug on insert/update
DROP TRIGGER IF EXISTS generate_song_slug_trigger ON songs;
CREATE TRIGGER generate_song_slug_trigger
  BEFORE INSERT OR UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION generate_song_slug();

-- Update existing songs with slugs
UPDATE songs s
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      COALESCE(a.name, 'unknown') || '-' || s.title,
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
)
FROM artists a
WHERE s.artist_id = a.id AND s.slug IS NULL;

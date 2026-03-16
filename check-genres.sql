-- Check and Add Default Genres
-- Run this in Supabase SQL Editor to verify/add genres

-- Check existing genres
SELECT * FROM genres ORDER BY name;

-- Insert default genres if they don't exist
INSERT INTO genres (name) VALUES
  ('Afrobeats'),
  ('Hip Hop'),
  ('R&B'),
  ('Gospel'),
  ('Traditional'),
  ('Jazz'),
  ('Amapiano'),
  ('Afro-pop'),
  ('Dancehall'),
  ('Reggae'),
  ('Soul'),
  ('Funk'),
  ('Kwaito'),
  ('Bongo Flava'),
  ('Afrobeat')
ON CONFLICT (name) DO NOTHING;

-- Verify genres are added
SELECT COUNT(*) as total_genres FROM genres;

-- Pamodzi Music Platform - Production Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create storage buckets for uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('music', 'music', true),
  ('covers', 'covers', true);

-- Storage policies for music bucket
CREATE POLICY "Anyone can view music"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

CREATE POLICY "Authenticated users can upload music"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete music"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'music' AND auth.jwt() ->> 'role' = 'admin');

-- Storage policies for covers bucket
CREATE POLICY "Anyone can view covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- TABLES
-- ============================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  cover_url VARCHAR(500),
  release_date DATE,
  track_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  audio_url VARCHAR(500) NOT NULL,
  cover_url VARCHAR(500),
  duration INTEGER,
  file_size BIGINT,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  is_downloadable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  status VARCHAR(20) DEFAULT 'coming_soon',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Song-Genre relationship
CREATE TABLE IF NOT EXISTS song_genres (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

-- User profiles (extends Supabase auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  avatar_url VARCHAR(500),
  is_creator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Downloads tracking table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Plays tracking table
CREATE TABLE IF NOT EXISTS song_plays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_featured ON songs(featured);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_featured ON albums(featured);
CREATE INDEX IF NOT EXISTS idx_song_plays_song_id ON song_plays(song_id);
CREATE INDEX IF NOT EXISTS idx_song_plays_played_at ON song_plays(played_at);
CREATE INDEX IF NOT EXISTS idx_downloads_song_id ON downloads(song_id);
CREATE INDEX IF NOT EXISTS idx_likes_song_id ON likes(song_id);

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE songs;
ALTER PUBLICATION supabase_realtime ADD TABLE albums;
ALTER PUBLICATION supabase_realtime ADD TABLE artists;
ALTER PUBLICATION supabase_realtime ADD TABLE song_plays;
ALTER PUBLICATION supabase_realtime ADD TABLE downloads;

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update play count
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs SET play_count = play_count + 1 WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_song_play_count AFTER INSERT ON song_plays
  FOR EACH ROW EXECUTE FUNCTION increment_play_count();

-- Function to update download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs SET download_count = download_count + 1 WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_song_download_count AFTER INSERT ON downloads
  FOR EACH ROW EXECUTE FUNCTION increment_download_count();

-- Function to update album track count
CREATE OR REPLACE FUNCTION update_album_track_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE albums SET track_count = track_count + 1 WHERE id = NEW.album_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE albums SET track_count = track_count - 1 WHERE id = OLD.album_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_album_tracks_after_song_insert AFTER INSERT ON songs
  FOR EACH ROW WHEN (NEW.album_id IS NOT NULL)
  EXECUTE FUNCTION update_album_track_count();

CREATE TRIGGER update_album_tracks_after_song_delete AFTER DELETE ON songs
  FOR EACH ROW WHEN (OLD.album_id IS NOT NULL)
  EXECUTE FUNCTION update_album_track_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Songs policies
CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert songs"
  ON songs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update songs"
  ON songs FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete songs"
  ON songs FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Albums policies
CREATE POLICY "Anyone can view albums"
  ON albums FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert albums"
  ON albums FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update albums"
  ON albums FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete albums"
  ON albums FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Artists policies
CREATE POLICY "Anyone can view artists"
  ON artists FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert artists"
  ON artists FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update artists"
  ON artists FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete artists"
  ON artists FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.jwt() ->> 'role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default genres
INSERT INTO genres (name) VALUES 
  ('Afrobeats'), ('Hip Hop'), ('R&B'), ('Gospel'), 
  ('Traditional'), ('Jazz'), ('Amapiano'), ('Afro-pop'),
  ('Dancehall'), ('Reggae'), ('Soul'), ('Funk');

-- Insert default categories
INSERT INTO categories (name, description, icon, status) VALUES
  ('Music', 'Stream Africa''s hottest tracks', 'music', 'live'),
  ('TV & Movies', 'Premium African stories, films, series', 'tv', 'coming_soon'),
  ('Beats Marketplace', 'Buy/sell production-ready beats', 'headphones', 'coming_soon'),
  ('Events', 'Live concerts, festivals, virtual events', 'calendar', 'coming_soon'),
  ('Podcasts', 'Voices from across the continent', 'mic', 'coming_soon');

-- ============================================
-- ADMIN SETUP
-- ============================================

-- Note: After creating your Supabase auth user, run this to make them admin:
-- UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' WHERE email = 'your-admin@email.com';
-- Or insert into admin_users table

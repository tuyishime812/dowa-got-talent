-- Pamodzi Storage Buckets Setup
-- Run this in Supabase SQL Editor to create storage buckets

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Create music bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Create covers bucket for cover art
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR MUSIC BUCKET
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;

-- Anyone can view/download music files
CREATE POLICY "Anyone can view music"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

-- Authenticated users can upload music files
CREATE POLICY "Authenticated users can upload music"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

-- Admins can delete music files
CREATE POLICY "Admins can delete music"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'music' AND auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- STORAGE POLICIES FOR COVERS BUCKET
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;

-- Anyone can view cover images
CREATE POLICY "Anyone can view covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- Authenticated users can upload cover images
CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- Admins can delete cover images
CREATE POLICY "Admins can delete covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check buckets were created
SELECT id, name, public FROM storage.buckets WHERE id IN ('music', 'covers');

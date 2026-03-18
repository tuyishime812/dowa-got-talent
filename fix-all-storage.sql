-- Complete Storage Fix for DGT Sounds
-- Run this ENTIRE script in Supabase SQL Editor
-- This will fix buckets and policies for uploads

-- ============================================
-- 1. ENSURE BUCKETS EXIST
-- ============================================

-- Create/replace buckets (no need to delete objects first)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('music', 'music', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- 2. DROP ALL OLD POLICIES
-- ============================================

-- Drop all policies for storage.objects
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;
DROP POLICY IF EXISTS "Public upload and view music" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;
DROP POLICY IF EXISTS "Public upload and view covers" ON storage.objects;

-- Drop any other storage policies that might conflict
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete access for all users" ON storage.objects;

-- ============================================
-- 3. CREATE NEW SIMPLE POLICIES
-- ============================================

-- Music bucket: Allow ALL operations for authenticated users
CREATE POLICY "music_all_authenticated"
  ON storage.objects FOR ALL
  USING (bucket_id = 'music' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

-- Music bucket: Allow SELECT for public (anonymous users can download)
CREATE POLICY "music_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

-- Covers bucket: Allow ALL operations for authenticated users
CREATE POLICY "covers_all_authenticated"
  ON storage.objects FOR ALL
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- Covers bucket: Allow SELECT for public (anonymous users can view)
CREATE POLICY "covers_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

-- Grant all permissions on storage.objects to authenticated users
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check buckets
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('music', 'covers');

-- Check policies
SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname IN ('music_all_authenticated', 'music_select_public', 'covers_all_authenticated', 'covers_select_public');

-- Check current user role
SELECT auth.role() as current_role, auth.jwt() ->> 'role' as jwt_role;

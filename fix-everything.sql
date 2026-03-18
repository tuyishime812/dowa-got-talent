-- Complete Fix for Upload Issues
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. FIX ADMIN ROLE DETECTION
-- ============================================

-- Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_app_meta_data->>'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. FIX STORAGE BUCKETS
-- ============================================

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true),
       ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies
DROP POLICY IF EXISTS "music_all_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "music_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_all_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "covers_select_public" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;

-- Create new storage policies
CREATE POLICY "music_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

CREATE POLICY "music_upload_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "music_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'music' AND is_admin());

CREATE POLICY "covers_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "covers_upload_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "covers_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND is_admin());

-- ============================================
-- 3. FIX TABLE RLS POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can view songs" ON songs;
DROP POLICY IF EXISTS "Admins can insert songs" ON songs;
DROP POLICY IF EXISTS "Admins can update songs" ON songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON songs;
DROP POLICY IF EXISTS "Anyone can view albums" ON albums;
DROP POLICY IF EXISTS "Admins can insert albums" ON albums;
DROP POLICY IF EXISTS "Admins can update albums" ON albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON albums;
DROP POLICY IF EXISTS "Anyone can view artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;

-- Create new policies using is_admin() function
-- Songs
CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert songs"
  ON songs FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update songs"
  ON songs FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete songs"
  ON songs FOR DELETE
  USING (is_admin());

-- Albums
CREATE POLICY "Anyone can view albums"
  ON albums FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert albums"
  ON albums FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update albums"
  ON albums FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete albums"
  ON albums FOR DELETE
  USING (is_admin());

-- Artists
CREATE POLICY "Anyone can view artists"
  ON artists FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert artists"
  ON artists FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update artists"
  ON artists FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete artists"
  ON artists FOR DELETE
  USING (is_admin());

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================
-- 5. VERIFY SETUP
-- ============================================

-- Check buckets
SELECT id, name, public FROM storage.buckets;

-- Check current user is admin
SELECT 
  auth.uid() as user_id,
  auth.jwt()->>'email' as email,
  raw_app_meta_data->>'role' as role
FROM auth.users
WHERE id = auth.uid();

-- Check policies
SELECT policyname, cmd, tablename FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Complete Admin Setup for DGT Sounds (Fixed Version)
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE ADMIN_ROLES TABLE
-- ============================================

-- Create a dedicated admin_roles table for easier management
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_email ON public.admin_roles(email);

-- ============================================
-- 2. ADD YOUR USER AS ADMIN
-- ============================================

-- Insert your user into admin_roles
INSERT INTO public.admin_roles (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'jeterothako276@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT * FROM public.admin_roles WHERE email = 'jeterothako276@gmail.com';

-- ============================================
-- 3. CREATE IS_ADMIN() FUNCTION
-- ============================================

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. SETUP STORAGE BUCKETS
-- ============================================

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('music', 'music', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- 5. SETUP STORAGE POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "music_select_public" ON storage.objects;
DROP POLICY IF EXISTS "music_upload_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "music_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_upload_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "covers_delete_admin" ON storage.objects;
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
-- 6. SETUP TABLE RLS POLICIES
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

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

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
-- 7. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- 8. VERIFICATION
-- ============================================

-- Check admin_roles
SELECT * FROM public.admin_roles;

-- Check buckets
SELECT id, name, public FROM storage.buckets;

-- Check is_admin function
SELECT is_admin() as current_user_is_admin;

-- Check policies
SELECT policyname, cmd, tablename FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

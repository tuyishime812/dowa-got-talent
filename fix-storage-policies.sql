-- Fix Storage Policies for Vercel Deployment
-- Run this in Supabase SQL Editor to fix upload issues

-- ============================================
-- 1. DROP OLD POLICIES
-- ============================================

-- Music bucket policies
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;

-- Covers bucket policies
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;

-- ============================================
-- 2. CREATE NEW PERMISSIVE POLICIES
-- ============================================

-- Music bucket - Allow anyone to upload (admin panel is protected)
CREATE POLICY "Public upload and view music"
  ON storage.objects FOR ALL
  USING (bucket_id = 'music')
  WITH CHECK (bucket_id = 'music');

-- Covers bucket - Allow anyone to upload (admin panel is protected)
CREATE POLICY "Public upload and view covers"
  ON storage.objects FOR ALL
  USING (bucket_id = 'covers')
  WITH CHECK (bucket_id = 'covers');

-- ============================================
-- 3. VERIFY
-- ============================================

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname IN ('Public upload and view music', 'Public upload and view covers');

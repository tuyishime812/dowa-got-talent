-- Simple Storage Fix - Run each section separately
-- ============================================

-- STEP 1: Create buckets (run this first)
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true),
       ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- STEP 2: Drop old policies
DROP POLICY IF EXISTS "music_all_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "music_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_all_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "covers_select_public" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;

-- STEP 3: Create new policies for music bucket
CREATE POLICY "music_all_authenticated"
  ON storage.objects FOR ALL
  USING (bucket_id = 'music' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "music_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

-- STEP 4: Create new policies for covers bucket
CREATE POLICY "covers_all_authenticated"
  ON storage.objects FOR ALL
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "covers_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- STEP 5: Verify buckets exist
SELECT id, name, public FROM storage.buckets WHERE id IN ('music', 'covers');

-- STEP 6: Verify policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects';

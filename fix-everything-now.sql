-- COMPLETE FIX - Corrected Version
-- Run this ALL at once in Supabase SQL Editor

-- 1. Create admin_roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add you as admin
INSERT INTO public.admin_roles (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'jeterothako276@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- 3. Create is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true), ('covers', 'covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Drop old storage policies
DROP POLICY IF EXISTS "music_all" ON storage.objects;
DROP POLICY IF EXISTS "covers_all" ON storage.objects;
DROP POLICY IF EXISTS "music_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_public" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;
DROP POLICY IF EXISTS "music_select_public" ON storage.objects;
DROP POLICY IF EXISTS "music_upload_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "music_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_upload_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "covers_delete_admin" ON storage.objects;

-- 6. Create new storage policies (corrected syntax)
CREATE POLICY "music_all" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'music');

CREATE POLICY "music_all_check" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'music');

CREATE POLICY "covers_all" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'covers');

CREATE POLICY "covers_all_check" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "music_public" ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'music');

CREATE POLICY "covers_public" ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'covers');

-- 7. Drop old table policies
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

-- 8. Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- 9. Create table policies (separate USING and WITH CHECK)
CREATE POLICY "songs_view" ON songs FOR SELECT USING (true);

CREATE POLICY "songs_insert" ON songs FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "songs_update" ON songs FOR UPDATE USING (public.is_admin());

CREATE POLICY "songs_delete" ON songs FOR DELETE USING (public.is_admin());

CREATE POLICY "albums_view" ON albums FOR SELECT USING (true);

CREATE POLICY "albums_insert" ON albums FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "albums_update" ON albums FOR UPDATE USING (public.is_admin());

CREATE POLICY "albums_delete" ON albums FOR DELETE USING (public.is_admin());

CREATE POLICY "artists_view" ON artists FOR SELECT USING (true);

CREATE POLICY "artists_insert" ON artists FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "artists_update" ON artists FOR UPDATE USING (public.is_admin());

CREATE POLICY "artists_delete" ON artists FOR DELETE USING (public.is_admin());

-- 10. Grant permissions
GRANT ALL ON public.admin_roles TO authenticated;
GRANT ALL ON public.songs TO authenticated;
GRANT ALL ON public.albums TO authenticated;
GRANT ALL ON public.artists TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 11. Verification
SELECT '=== ADMIN ROLES ===' as info;
SELECT * FROM public.admin_roles;

SELECT '=== IS ADMIN? ===' as info;
SELECT public.is_admin() as am_i_admin;

SELECT '=== BUCKETS ===' as info;
SELECT id, name, public FROM storage.buckets;

SELECT '=== COMPLETE ===' as info;

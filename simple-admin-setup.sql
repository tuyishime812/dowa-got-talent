-- SIMPLE ADMIN SETUP - GUARANTEED TO WORK
-- Run each section one at a time

-- ============================================
-- STEP 1: Create admin_roles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check it was created
SELECT 'admin_roles table created' as status;

-- ============================================
-- STEP 2: Get your user ID and add as admin
-- ============================================
-- First, find your user ID
DO $$
DECLARE
  my_user_id UUID;
BEGIN
  SELECT id INTO my_user_id FROM auth.users WHERE email = 'jeterothako276@gmail.com';
  
  IF my_user_id IS NOT NULL THEN
    INSERT INTO public.admin_roles (user_id, email)
    VALUES (my_user_id, 'jeterothako276@gmail.com')
    ON CONFLICT (user_id) DO UPDATE SET email = 'jeterothako276@gmail.com';
    
    RAISE NOTICE 'Admin added successfully!';
  ELSE
    RAISE NOTICE 'User not found! Check your email.';
  END IF;
END $$;

-- Verify
SELECT * FROM public.admin_roles;

-- ============================================
-- STEP 3: Create is_admin function
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test it
SELECT public.is_admin() as am_i_admin;

-- ============================================
-- STEP 4: Fix storage buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true), ('covers', 'covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

SELECT id, name, public FROM storage.buckets;

-- ============================================
-- STEP 5: Create storage policies
-- ============================================
-- Drop first
DROP POLICY IF EXISTS "music_all" ON storage.objects;
DROP POLICY IF EXISTS "covers_all" ON storage.objects;

-- Create simple policies
CREATE POLICY "music_all" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'music')
WITH CHECK (bucket_id = 'music');

CREATE POLICY "covers_all" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'covers')
WITH CHECK (bucket_id = 'covers');

-- Allow public read
CREATE POLICY "music_public" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'music');

CREATE POLICY "covers_public" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'covers');

SELECT 'Storage policies created' as status;

-- ============================================
-- STEP 6: Final verification
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM public.admin_roles) as admin_count,
  public.is_admin() as am_i_admin,
  (SELECT COUNT(*) FROM storage.buckets) as bucket_count;

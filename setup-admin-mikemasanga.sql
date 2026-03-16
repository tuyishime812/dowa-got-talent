-- ============================================
-- PAMODZI - Complete Setup for mikemasanga@gmail.com
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CREATE HELPER FUNCTION
-- ============================================

-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users
    WHERE id = auth.uid()
    AND (raw_app_meta_data->>'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 2: DROP OLD POLICIES
-- ============================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can view artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;

DROP POLICY IF EXISTS "Anyone can view albums" ON albums;
DROP POLICY IF EXISTS "Admins can insert albums" ON albums;
DROP POLICY IF EXISTS "Admins can update albums" ON albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON albums;

DROP POLICY IF EXISTS "Anyone can view songs" ON songs;
DROP POLICY IF EXISTS "Admins can insert songs" ON songs;
DROP POLICY IF EXISTS "Admins can update songs" ON songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON songs;

-- ============================================
-- STEP 3: CREATE NEW POLICIES
-- ============================================

-- Artists policies
CREATE POLICY "Anyone can view artists"
  ON artists FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert artists"
  ON artists FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update artists"
  ON artists FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete artists"
  ON artists FOR DELETE
  USING (is_admin_user());

-- Albums policies
CREATE POLICY "Anyone can view albums"
  ON albums FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert albums"
  ON albums FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update albums"
  ON albums FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete albums"
  ON albums FOR DELETE
  USING (is_admin_user());

-- Songs policies
CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert songs"
  ON songs FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update songs"
  ON songs FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete songs"
  ON songs FOR DELETE
  USING (is_admin_user());

-- ============================================
-- STEP 4: SETUP ADMIN USER
-- ============================================

-- Make mikemasanga@gmail.com an admin
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
WHERE email = 'mikemasanga@gmail.com';

-- ============================================
-- STEP 5: VERIFY SETUP
-- ============================================

-- Check if admin user is set up correctly
SELECT 
  email, 
  raw_app_meta_data->>'role' as role,
  CASE 
    WHEN (raw_app_meta_data->>'role') = 'admin' THEN '✅ Is Admin'
    ELSE '❌ Not Admin'
  END as status
FROM auth.users 
WHERE email = 'mikemasanga@gmail.com';

-- ============================================
-- DONE! 
-- ============================================
-- You should see "✅ Is Admin" in the results
-- Now logout and login again to test

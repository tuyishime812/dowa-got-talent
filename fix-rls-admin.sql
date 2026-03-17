-- Fix RLS Policies for Admin Operations
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Create helper function to check admin status
-- ============================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS is_admin_user();

-- Create function that checks if current user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  is_admin BOOLEAN;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user exists in admin_users table
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = current_user_id
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Update RLS policies to use the helper function
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;

DROP POLICY IF EXISTS "Admins can insert albums" ON albums;
DROP POLICY IF EXISTS "Admins can update albums" ON albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON albums;

DROP POLICY IF EXISTS "Admins can insert songs" ON songs;
DROP POLICY IF EXISTS "Admins can update songs" ON songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON songs;

-- Create new policies using is_admin_user() function
-- Artists policies
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
-- 3. Verify your admin status
-- ============================================

-- Check if your user is in admin_users table
SELECT 
  au.id, 
  au.email, 
  au.raw_app_meta_data,
  adu.id as admin_user_id
FROM auth.users au
LEFT JOIN admin_users adu ON au.id = adu.id
WHERE au.email = 'jeterothako276@gmail.com';

-- If admin_user_id is NULL, you need to add yourself to admin_users table
-- Run this if needed:
-- INSERT INTO admin_users (id, email) 
-- VALUES ((SELECT id FROM auth.users WHERE email = 'jeterothako276@gmail.com'), 'jeterothako276@gmail.com');

-- Fix RLS Policies for Admin Operations
-- Run this in your Supabase SQL Editor

-- ============================================
-- CREATE HELPER FUNCTION TO CHECK ADMIN ROLE
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
-- DROP EXISTING POLICIES
-- ============================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert albums" ON albums;
DROP POLICY IF EXISTS "Admins can update albums" ON albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON albums;
DROP POLICY IF EXISTS "Admins can insert songs" ON songs;
DROP POLICY IF EXISTS "Admins can update songs" ON songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON songs;

-- ============================================
-- CREATE NEW POLICIES USING HELPER FUNCTION
-- ============================================

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
-- VERIFY ADMIN USER SETUP
-- ============================================

-- Check current admin users
SELECT email, raw_app_meta_data->>'role' as role 
FROM auth.users 
WHERE (raw_app_meta_data->>'role') = 'admin';

-- ============================================
-- INSTRUCTIONS TO MAKE A USER ADMIN
-- ============================================
-- Run this query to make a user admin (replace with your email):
-- UPDATE auth.users 
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
-- WHERE email = 'your-admin-email@example.com';

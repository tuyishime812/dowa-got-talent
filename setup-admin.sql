-- Complete Admin Setup for shift04@gmail.com
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- STEP 1: Set Admin Role in Auth Metadata
-- ============================================
-- This is the PRIMARY method - stores role in JWT token
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'shift04@gmail.com';

-- ============================================
-- STEP 2: Create Admin User Record
-- ============================================
-- This is the BACKUP method - checked if JWT doesn't have role
INSERT INTO admin_users (email, is_super_admin)
VALUES ('shift04@gmail.com', TRUE)
ON CONFLICT (email) DO UPDATE SET is_super_admin = TRUE;

-- ============================================
-- STEP 3: Verify Setup
-- ============================================
-- Check auth metadata
SELECT 
  id,
  email,
  raw_app_meta_data,
  raw_app_meta_data->>'role' as jwt_role
FROM auth.users 
WHERE email = 'shift04@gmail.com';

-- Check admin_users table
SELECT * FROM admin_users WHERE email = 'shift04@gmail.com';

-- ============================================
-- STEP 4: Test Query (should return admin)
-- ============================================
-- This simulates what the app checks
SELECT 
  u.email,
  u.raw_app_meta_data->>'role' as jwt_role,
  a.is_super_admin as db_admin
FROM auth.users u
LEFT JOIN admin_users a ON u.email = a.email
WHERE u.email = 'shift04@gmail.com';

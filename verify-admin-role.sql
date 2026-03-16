-- Verify and Fix Admin Role for shift04@gmail.com
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CHECK CURRENT USER ROLE
-- ============================================
SELECT 
  id,
  email,
  raw_app_meta_data,
  raw_app_meta_data->>'role' as current_role
FROM auth.users 
WHERE email = 'shift04@gmail.com';

-- ============================================
-- 2. SET ADMIN ROLE (if not set)
-- ============================================
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'shift04@gmail.com';

-- ============================================
-- 3. VERIFY THE UPDATE WORKED
-- ============================================
SELECT 
  id,
  email,
  raw_app_meta_data,
  raw_app_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'shift04@gmail.com';

-- ============================================
-- 4. ALTERNATIVE: Set role using JSON operator
-- ============================================
-- If the above doesn't work, try this:
-- UPDATE auth.users
-- SET raw_app_meta_data = jsonb_set(
--   COALESCE(raw_app_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'
-- )
-- WHERE email = 'shift04@gmail.com';

-- ============================================
-- 5. CHECK ALL USERS WITH ROLES
-- ============================================
SELECT 
  email,
  raw_app_meta_data->>'role' as role
FROM auth.users
WHERE raw_app_meta_data->>'role' IS NOT NULL;

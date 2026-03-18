-- Step 1: Make Your User Admin FIRST
-- Run this FIRST before anything else

-- Update your user to have admin role
UPDATE auth.users
SET 
  raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb,
  raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'jeterothako276@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  raw_app_meta_data->>'role' as app_role,
  raw_user_meta_data->>'role' as user_role
FROM auth.users
WHERE email = 'jeterothako276@gmail.com';

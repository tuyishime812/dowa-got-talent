-- Quick Admin Setup Script
-- Run this in Supabase SQL Editor to add yourself as admin

-- Step 1: Find your user ID
-- Replace with your email address
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 2: Copy your user ID and run this
-- Replace 'YOUR-USER-ID-HERE' with the UUID from step 1
INSERT INTO admin_roles (user_id, email)
VALUES ('YOUR-USER-ID-HERE', 'your-email@example.com')
ON CONFLICT (user_id) DO NOTHING;

-- Alternative: Add admin by email directly (if you know the email)
-- This will find the user and add them as admin
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = 'your-email@example.com';
  
  -- Add to admin_roles if found
  IF user_record.id IS NOT NULL THEN
    INSERT INTO admin_roles (user_id, email)
    VALUES (user_record.id, user_record.email)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Admin role added for: %', user_record.email;
  ELSE
    RAISE NOTICE 'User not found. Please sign up first.';
  END IF;
END $$;

-- Step 3: Verify admin setup
SELECT ar.id, ar.user_id, ar.email, ar.created_at, u.email as auth_email
FROM admin_roles ar
JOIN auth.users u ON u.id = ar.user_id
ORDER BY ar.created_at DESC;

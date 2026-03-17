-- SQL Script to Add Admin User
-- Run this in your Supabase SQL Editor
-- Note: Make sure you've already run supabase-schema.sql first

-- Step 1: Find your user ID (replace with your email)
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Set admin role for your user
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
WHERE email = 'your-email@example.com';

-- Step 3: Verify you're now an admin
SELECT id, email, raw_app_meta_data FROM auth.users WHERE email = 'your-email@example.com';

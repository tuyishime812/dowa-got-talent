-- Diagnostic: Check what's happening
-- Run this and share the output

-- 1. Check if admin_roles table exists
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_roles';

-- 2. Check if your user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'jeterothako276@gmail.com';

-- 3. Check if admin_roles has any data
SELECT * FROM public.admin_roles;

-- 4. Check if is_admin function exists
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'is_admin';

-- 5. Try calling is_admin
SELECT is_admin() as result;

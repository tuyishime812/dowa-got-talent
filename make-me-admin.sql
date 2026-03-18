-- Make yourself admin - Run this ONLY

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add you as admin
INSERT INTO public.admin_roles (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'jeterothako276@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- 3. Verify
SELECT * FROM public.admin_roles;

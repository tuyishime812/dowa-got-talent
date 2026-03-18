-- MANUAL FIX - Run each query separately and check output

-- 1. First check if your user exists
SELECT id, email FROM auth.users WHERE email = 'jeterothako276@gmail.com';
-- Copy the ID from the result

-- 2. Create the table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Manually insert YOUR user ID (replace the UUID below with your actual user ID from step 1)
-- Example: INSERT INTO admin_roles (user_id, email) VALUES ('12345678-1234-1234-1234-123456789012', 'jeterothako276@gmail.com');

-- For now, let's insert using a subquery
INSERT INTO public.admin_roles (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'jeterothako276@gmail.com';

-- 4. Check it was inserted
SELECT * FROM public.admin_roles;

-- 5. Create the function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Test the function
SELECT public.is_admin() as am_i_admin;

-- 7. Grant permissions
GRANT ALL ON public.admin_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

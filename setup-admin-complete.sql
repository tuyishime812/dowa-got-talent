-- =====================================================
-- COMPLETE ADMIN SETUP FOR PAMODZI
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- 1. Create admin_roles table
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON admin_roles;

-- Allow authenticated users to view their own admin status
CREATE POLICY "Admins can view all admin roles"
  ON admin_roles
  FOR SELECT
  USING (true);

-- Allow inserts only via service role (security)
CREATE POLICY "Service role can manage admin roles"
  ON admin_roles
  FOR ALL
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_email ON admin_roles(email);

-- 2. Create function to add admin
-- =====================================================
CREATE OR REPLACE FUNCTION add_admin_role(user_uuid UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_roles (user_id, email)
  VALUES (user_uuid, user_email)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Grant permissions
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON admin_roles TO authenticated;

-- 5. Add current admin users
-- =====================================================
-- Add admin@pamodzi.com if exists
DO $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = 'admin@pamodzi.com';

  IF user_record.id IS NOT NULL THEN
    INSERT INTO admin_roles (user_id, email)
    VALUES (user_record.id, user_record.email)
    ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE 'Added admin@pamodzi.com as admin';
  END IF;
END $$;

-- Add mikemasanga@gmail.com if exists
DO $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = 'mikemasanga@gmail.com';
  
  IF user_record.id IS NOT NULL THEN
    INSERT INTO admin_roles (user_id, email)
    VALUES (user_record.id, user_record.email)
    ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE 'Added mikemasanga@gmail.com as admin';
  END IF;
END $$;

-- 6. Verification query
-- =====================================================
-- Run this to see all admins
SELECT 
  ar.id,
  ar.user_id,
  ar.email,
  ar.created_at,
  u.created_at as user_created_at
FROM admin_roles ar
LEFT JOIN auth.users u ON u.id = ar.user_id
ORDER BY ar.created_at DESC;

-- 7. Success message
-- =====================================================
SELECT '✅ Admin setup complete! Check the results above to see current admins.' as status;

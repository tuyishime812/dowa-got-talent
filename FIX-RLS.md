# 🔧 Fix RLS Policies for Admin Panel

## Problem
If you're getting errors like:
- "permission denied for table users"
- "new row violates row-level security policy for table 'artists'"
- "new row violates row-level security policy for table 'albums'"
- "new row violates row-level security policy for table 'songs'"

This is because the Row Level Security (RLS) policies need to be updated to properly recognize admin users.

---

## ✅ Solution (2 Steps)

### Step 1: Run the SQL Fix Script

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Copy the contents of `fix-rls-policies.sql`
4. Paste and click **Run**

**Important:** Make sure you run the ENTIRE script, not just parts of it.

---

### Step 2: Verify Your Admin User

After running the SQL, verify your admin user has the correct role:

```sql
-- Check if your user has admin role (replace with your email)
SELECT email, raw_app_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your-admin-email@example.com';
```

If the role is not 'admin' or shows NULL, run this:

```sql
-- Make your user an admin
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
WHERE email = 'your-admin-email@example.com';
```

Then verify it worked:

```sql
-- Should show 'admin' in the role column
SELECT email, raw_app_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your-admin-email@example.com';
```

---

## 🎯 Test It Works

After running the SQL:

1. **Logout** and **login again** (important to refresh the session)
2. Go to **Admin → Songs**
3. Click **Add Song**
4. Fill in the form:
   - Song Title: "Test Song"
   - Artist Name: "Test Artist"
   - Album Name: "Test Album" (optional)
   - Upload an audio file
   - Click **Add Song**

✅ If it saves successfully, the RLS policies are working!

---

## 🔍 What the SQL Does

The SQL script:

1. **Creates a helper function** `is_admin_user()` with SECURITY DEFINER
   - This function can safely query auth.users table
   - Returns TRUE if current user is admin

2. **Drops old RLS policies** that might conflict

3. **Creates new policies** that use the helper function:
   ```sql
   CREATE POLICY "Admins can insert artists"
     ON artists FOR INSERT
     WITH CHECK (is_admin_user());
   ```

4. **Verifies** current admin users

---

## 📋 All Admin Features That Now Work

### ✅ Songs Management
- Add new songs with text inputs for artist/album
- Auto-create artists and albums
- Edit existing songs
- Delete songs
- Upload audio files and cover art
- Set duration, enable downloads, mark as featured

### ✅ Albums Management
- Add new albums with text input for artist name
- Auto-create artists
- Edit existing albums
- Delete albums
- Upload cover art
- Set release date, mark as featured

### ✅ Artists Management
- Add new artists
- Edit artist info
- Delete artists (cascades to their songs/albums)
- Upload artist images
- Mark as verified

### ✅ Users Management
- View all users
- See admin roles
- Delete users
- Search users

### ✅ Dashboard
- View stats (songs, albums, artists, plays, downloads)
- See recently added songs

### ✅ Settings
- Site configuration
- Feature toggles
- Database status

---

## 🐛 Still Having Issues?

### Error: "permission denied for table users"

**Solution:** Make sure you ran the ENTIRE SQL script including the `CREATE OR REPLACE FUNCTION is_admin_user()` part.

The function must be created FIRST before the policies.

### Error: "function is_admin_user() does not exist"

**Solution:** Run the SQL script again. The function might not have been created properly.

### Check Supabase Console

1. Go to **Authentication** → **Users**
2. Find your admin user
3. Click the 3 dots → **View details**
4. Check `raw_app_meta_data` has: `{"role": "admin"}`

### Check Storage Buckets

Make sure buckets exist:
- `music` (public)
- `covers` (public)

Go to **Storage** and verify both buckets are created and public.

### Check Console Logs

Open browser DevTools (F12) and check the Console tab for detailed error messages.

---

## 📞 Quick Checklist

- [ ] Ran `fix-rls-policies.sql` in Supabase SQL Editor
- [ ] Verified admin user has `role: "admin"` in raw_app_meta_data
- [ ] Logged out and logged back in after running SQL
- [ ] Storage buckets `music` and `covers` exist and are public
- [ ] Browser console shows no errors

---

## 🆘 Emergency Reset

If nothing works, try this complete reset:

```sql
-- Drop all policies
DROP POLICY IF EXISTS "Anyone can view artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;

DROP POLICY IF EXISTS "Anyone can view albums" ON albums;
DROP POLICY IF EXISTS "Admins can insert albums" ON albums;
DROP POLICY IF EXISTS "Admins can update albums" ON albums;
DROP POLICY IF EXISTS "Admins can delete albums" ON albums;

DROP POLICY IF EXISTS "Anyone can view songs" ON songs;
DROP POLICY IF EXISTS "Admins can insert songs" ON songs;
DROP POLICY IF EXISTS "Admins can update songs" ON songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON songs;

-- Drop function
DROP FUNCTION IF EXISTS is_admin_user();

-- Disable RLS temporarily (for testing only!)
ALTER TABLE artists DISABLE ROW LEVEL SECURITY;
ALTER TABLE albums DISABLE ROW LEVEL SECURITY;
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** Disabling RLS removes all security! Only do this for testing, then re-enable with the proper policies.

---

**Good luck! 🚀**


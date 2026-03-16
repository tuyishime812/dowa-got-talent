# 🎵 Pamodzi - Admin Setup Guide

## Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Access the app at **http://localhost:5173**

### 2. Access Admin Panel
Navigate to **http://localhost:5173/admin**

### 3. Login
- If you're not logged in, you'll be redirected to `/login`
- Use your Supabase authentication credentials

---

## Admin Access Configuration

### Option 1: Using Admin Emails (Automatic)
The following emails automatically get admin access:
- `admin@pamodzi.com`
- `mikemasanga@gmail.com`

### Option 2: Database Setup (Recommended for Production)

#### Step 1: Run the Admin Roles SQL
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL from `setup-admin-roles.sql`

#### Step 2: Add Yourself as Admin
After running the SQL, add your user as admin:

```sql
-- Replace with your user's UUID from auth.users
SELECT add_admin_role(
  'your-user-uuid-here',
  'your-email@example.com'
);
```

To find your user UUID:
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

---

## Troubleshooting

### "/admin" shows 404 or redirects to login

**Cause:** You're not logged in or don't have admin access

**Solution:**
1. Go to `/login` and sign in
2. Ensure your email is in the admin list or you have a record in `admin_roles` table
3. Check browser console (F12) for logs

### "Not Authorized" message

**Cause:** You're logged in but don't have admin role

**Solution:**
1. Run the SQL in `setup-admin-roles.sql`
2. Add your user to the `admin_roles` table

### Console Logs to Check

Open browser console (F12) and look for:
- `✅ Admin email detected: your-email@example.com` - You have admin access via email
- `✅ User has admin role: your-email@example.com` - You have admin role in database
- `⚠️ User does not have admin role: your-email@example.com` - You need admin access

---

## Admin Features

Once logged in as admin, you can:

### Dashboard (`/admin`)
- View total songs, albums, artists, plays, and downloads
- See recently added songs

### Songs Management (`/admin/songs`)
- Add new songs with audio and cover uploads
- Edit existing songs
- Delete songs
- Mark songs as featured

### Albums Management (`/admin/albums`)
- Create and manage albums
- Upload album covers
- Associate with artists

### Artists Management (`/admin/artists`)
- Add new artists
- Write artist bios
- Upload artist images
- Verify artists

### Users Management (`/admin/users`)
- View all registered users
- Search users by email
- Delete users (if needed)

### Settings (`/admin/settings`)
- Configure site settings
- Manage features
- Update site information

---

## Security Notes

- Admin routes are protected by `ProtectedRoute` component
- Only users with admin role can access admin pages
- RLS (Row Level Security) policies protect database tables
- Admin credentials should be kept secure

---

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.jsx      # Admin sidebar layout
│   │   └── Admin.css
│   ├── ProtectedRoute.jsx       # Route protection
│   └── ErrorBoundary.jsx        # Error handling
├── context/
│   └── AuthContext.jsx          # Authentication & admin check
├── pages/
│   └── admin/
│       ├── Dashboard.jsx        # Admin dashboard
│       ├── Songs.jsx            # Songs management
│       ├── Albums.jsx           # Albums management
│       ├── Artists.jsx          # Artists management
│       ├── Users.jsx            # Users management
│       └── Settings.jsx         # Site settings
└── ...
```

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Ensure database tables are created
4. Check admin role configuration

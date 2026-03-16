# Pamodzi - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project" or "Sign In"
3. Create account (free tier is perfect)

### Step 2: Create New Project
1. Click "New Project"
2. Choose organization
3. Enter project name: `pamodzi`
4. Set database password (save it!)
5. Choose region (closest to you)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

### Step 3: Run Database Schema
1. In your Supabase project dashboard
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Open `supabase-schema.sql` from project folder
5. Copy ALL content
6. Paste into SQL Editor
7. Click **Run** or press Ctrl+Enter
8. Wait for success message

### Step 4: Get API Credentials
1. Click **Settings** (gear icon) in sidebar
2. Click **API**
3. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (long string under "Project API keys")

### Step 5: Create .env File
1. In project folder `pamodzi/`
2. Create file named `.env` (no extension)
3. Add this content:
```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
4. Replace with YOUR actual values
5. Save file

### Step 6: Create Admin User
1. In Supabase dashboard
2. Click **Authentication** > **Users**
3. Click **Add User** button
4. Click **Create new user**
5. Enter:
   - Email: `admin@pamodzi.com` (or your email)
   - Password: `admin123` (change later!)
6. Click **Create user**
7. Now click **SQL Editor** again
8. Create new query with this (replace email):
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE email = 'admin@pamodzi.com';
```
9. Click **Run**

### Step 7: Start the App
1. Open terminal/command prompt
2. Navigate to project:
   ```bash
   cd C:\Users\Student.LAPTOP-46MOQA5A\Desktop\projects\pamodzi\pamodzi
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. Open browser: http://localhost:5173

---

## 🎯 First Steps After Setup

### Add Your First Content

1. **Login as Admin**
   - Go to: http://localhost:5173/login
   - Email: `admin@pamodzi.com`
   - Password: `admin123`

2. **Add Artist First**
   - Click **Artists** in admin sidebar
   - Click **Add Artist**
   - Enter name: e.g., "Test Artist"
   - Add bio (optional)
   - Upload image (optional)
   - Click **Add Artist**

3. **Add Album**
   - Click **Albums** in sidebar
   - Click **Add Album**
   - Enter title: e.g., "First Album"
   - Select artist you just created
   - Upload cover (optional)
   - Click **Add Album**

4. **Add Song**
   - Click **Songs** in sidebar
   - Click **Add Song**
   - Enter title: e.g., "Test Song"
   - Select artist
   - Select album (optional)
   - **Upload audio file** (required) - use any MP3
   - Upload cover (optional)
   - Set duration in seconds (e.g., 180)
   - Check "Allow Downloads"
   - Click **Add Song**

5. **View on Website**
   - Go to homepage: http://localhost:5173
   - You'll see your song in "Curated Singles"
   - Click **Music** to see full list
   - Click play button to test
   - Click download to test download

---

## 📁 File Upload Tips

### Audio Files
- Supported: MP3, WAV, OGG, M4A
- Max size: 50MB (default Supabase limit)
- Location: Stored in `music` bucket
- Tip: Use MP3 for smaller file sizes

### Cover Images
- Supported: JPG, PNG, WEBP
- Recommended size: 500x500px or larger
- Max size: 5MB
- Location: Stored in `covers` bucket

---

## 🔧 Common Issues

### "Not Authorized" Error
**Solution:** Run the admin UPDATE SQL query again

### Can't Upload Files
**Check:**
1. Storage buckets exist (`music` and `covers`)
2. Buckets are set to **public**
3. You're logged in as admin

### No Music Showing on Homepage
**Solution:**
1. Make sure you added content via admin panel
2. Check if songs have audio_url set
3. Refresh the page

### Build Errors
**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## 📝 Important URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:5173 |
| Music Page | http://localhost:5173/music |
| Admin Login | http://localhost:5173/login |
| Admin Dashboard | http://localhost:5173/admin |
| Songs Management | http://localhost:5173/admin/songs |
| Albums Management | http://localhost:5173/admin/albums |
| Artists Management | http://localhost:5173/admin/artists |

---

## 🔐 Security Notes

### Change Admin Password
After first login:
1. Go to Supabase > Authentication > Users
2. Click three dots next to your user
3. Click "Edit user"
4. Change password

### Production Checklist
Before going live:
- [ ] Change all default passwords
- [ ] Enable email confirmation (optional)
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Add rate limiting (via Supabase)
- [ ] Set up backups

---

## 📊 Database Overview

The schema creates these tables automatically:
- `admin_users` - Admin accounts
- `artists` - Artist profiles
- `albums` - Album information
- `songs` - Song tracks
- `genres` - Music categories
- `user_profiles` - User accounts
- `likes` - Song likes
- `downloads` - Download tracking
- `song_plays` - Play count

Storage buckets:
- `music` - Audio files
- `covers` - Cover images

---

## 🎨 Customization

### Change Site Name
Edit these files:
- `src/components/Header.jsx` - Logo text
- `src/components/Footer.jsx` - Footer branding
- `src/pages/Hero.jsx` - Hero section text

### Change Colors
Edit `src/index.css`:
```css
:root {
  --accent-orange: #ff6b35;  /* Main accent color */
  --primary-purple: #2d1f4e; /* Dark purple */
  /* ... */
}
```

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema installed
- [ ] .env file configured
- [ ] Admin user created with admin role
- [ ] Development server running
- [ ] Can login to admin panel
- [ ] Added at least 1 artist
- [ ] Added at least 1 album
- [ ] Added at least 1 song with audio
- [ ] Can play music on website
- [ ] Can download songs

---

**Need Help?** Check the main README.md for detailed documentation.

**Ready to Go Live?** See "Production Deployment" section in README.md

# Pamodzi - Professional Music Streaming Platform

A production-ready music streaming platform with admin panel, built with React and Supabase.

## Features

### Public Features
- 🎵 **Music Streaming** - Stream high-quality African music
- 💿 **Albums & Artists** - Browse curated collections
- 🔍 **Search** - Find songs and artists instantly
- 📥 **Downloads** - Download songs (when enabled by admin)
- 🎨 **Modern UI** - Dark theme with purple/violet accents
- 📱 **Responsive** - Works on all devices

### Admin Features
- 🔐 **Authentication** - Secure login/signup
- 📊 **Dashboard** - View stats and analytics
- 🎵 **Song Management** - Upload, edit, delete songs
- 💿 **Album Management** - Manage albums and track counts
- 🎤 **Artist Management** - Add and verify artists
- 📁 **File Upload** - Upload audio files and cover art
- 📈 **Analytics** - Track plays and downloads

---

## Quick Start

### 1. Install Dependencies
```bash
cd pamodzi
npm install
```

### 2. Set Up Supabase

#### a. Create Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for project to initialize

#### b. Run Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL

#### c. Create Storage Buckets
The SQL creates buckets automatically, but verify:
1. Go to **Storage** in Supabase
2. Ensure `music` and `covers` buckets exist
3. Both should be **public**

#### d. Get Credentials
1. Go to **Settings** > **API**
2. Copy:
   - Project URL
   - anon/public key

#### e. Create .env File
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Admin User

#### Option A: Via Supabase Dashboard
1. Go to **Authentication** > **Users**
2. Click **Add User** > **Create new user**
3. Enter admin email and password
4. After creation, go to **SQL Editor** and run:
```sql
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
WHERE email = 'your-admin@email.com';
```

#### Option B: Via Signup Page
1. Start the app
2. Go to `/signup` and create account
3. Run the SQL above to make them admin

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:5173

---

## Usage

### For Admins

1. **Login**: Go to `/login` with admin credentials
2. **Dashboard**: View stats at `/admin`
3. **Add Artists**: Go to `/admin/artists` - Add artists first
4. **Add Albums**: Go to `/admin/albums` - Create albums
5. **Add Songs**: Go to `/admin/songs` - Upload songs with audio files

### Song Upload Process
1. Click **Add Song**
2. Enter song title
3. Select artist (must exist)
4. Select album (optional)
5. Upload audio file (MP3, WAV, etc.)
6. Upload cover image (optional)
7. Set duration (auto-detected if available)
8. Enable/disable downloads
9. Mark as featured (optional)
10. Click **Add Song**

### For Users
- Browse music at home page
- Click **Music** to see all songs
- Search for artists/songs
- Click play button to stream
- Click download icon to download (if enabled)

---

## Project Structure

```
pamodzi/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx      # Admin dashboard layout
│   │   │   └── Admin.css
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── PlatformFeatures.jsx
│   │   ├── Carousel.jsx
│   │   ├── AlbumCard.jsx
│   │   ├── SongCard.jsx
│   │   └── MusicPlayer.jsx
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── lib/
│   │   └── supabase.js              # Supabase client
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx        # Admin dashboard
│   │   │   ├── Songs.jsx            # Song CRUD
│   │   │   ├── Albums.jsx           # Album CRUD
│   │   │   └── Artists.jsx          # Artist CRUD
│   │   ├── Home.jsx
│   │   ├── MusicPage.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase-schema.sql              # Database schema
├── .env.example
└── README.md
```

---

## Database Tables

| Table | Description |
|-------|-------------|
| `admin_users` | Admin user records |
| `artists` | Artist information |
| `albums` | Album details |
| `songs` | Song tracks with audio URLs |
| `genres` | Music genres |
| `song_genres` | Song-genre relationships |
| `user_profiles` | User profiles |
| `likes` | User song likes |
| `downloads` | Download tracking |
| `song_plays` | Play count tracking |

---

## Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `music` | Audio files | Public read, Auth upload |
| `covers` | Cover images | Public read, Auth upload |

---

## API Routes (Supabase)

All data is fetched via Supabase client directly. No separate backend needed.

### Key Operations:
- `supabase.from('songs').select('*')` - Get songs
- `supabase.from('songs').insert(data)` - Add song
- `supabase.from('songs').update(data).eq('id', id)` - Update song
- `supabase.from('songs').delete().eq('id', id)` - Delete song

---

## Customization

### Colors
Edit `src/index.css`:
```css
:root {
  --primary-dark: #1a0f2e;
  --primary-purple: #2d1f4e;
  --accent-orange: #ff6b35;
  /* ... */
}
```

### Site Info
- Update logo in `Header.jsx`
- Change footer info in `Footer.jsx`
- Modify hero text in `Hero.jsx`

---

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

#### Netlify
1. Push to GitHub
2. Connect repo in Netlify
3. Set build command: `npm run build`
4. Add environment variables

#### Self-hosted
1. Run `npm run build`
2. Upload `dist/` folder to web server
3. Configure server to serve `index.html` for all routes

---

## Security

### Row Level Security (RLS)
- Songs, albums, artists: Public read, admin write
- Downloads, plays: Authenticated users can create

### Storage Policies
- Music bucket: Public read, authenticated upload
- Covers bucket: Public read, authenticated upload

### Admin Protection
- Admin role stored in JWT metadata
- Protected routes check admin status
- RLS policies enforce admin-only writes

---

## Troubleshooting

### "Not Authorized" in Admin Panel
- Ensure user has admin role in auth.users
- Run the UPDATE SQL query above

### File Upload Fails
- Check storage buckets exist
- Verify bucket policies allow uploads
- Check file size limits (default 50MB)

### No Music Showing
- Add artists first, then albums, then songs
- Check Supabase connection in .env
- Verify tables have data

### Build Errors
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check all imports are correct

---

## License

MIT License - Free to use for personal and commercial projects.

---

## Support

For issues or questions, create an issue in the repository.

**Built with ❤️ for African Music**

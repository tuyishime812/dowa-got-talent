# Deploy to Render - Complete Guide

## Option 1: Using Render Blueprint (Recommended)

### Step 1: Go to Render
1. Visit https://render.com
2. Sign in to your account

### Step 2: Create New from Blueprint
1. Click **"New +"**
2. Select **"Blueprint"**
3. Connect your GitHub account
4. Select this repository: `tuyishime812/dowa-got-talent`
5. Click **"Apply"**

### Step 3: Configure Environment Variables
Render will prompt you to set these values:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxzacrigqqykmmkefphz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your full Supabase anon key |
| `VITE_SITE_URL` | `https://dgt-sounds.onrender.com` |

### Step 4: Deploy
- Click **"Apply"** to deploy
- Wait 5-10 minutes for first build
- Your site will be live at: `https://dgt-sounds.onrender.com`

---

## Option 2: Manual Setup

### Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo: `tuyishime812/dowa-got-talent`

### Settings
```
Name: dgt-sounds
Region: Oregon (or closest to you)
Branch: main
Root Directory: (leave blank)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npx serve -s dist -p $PORT
Instance Type: Free
```

### Environment Variables
Add these:
```
NODE_VERSION = 20.x
VITE_SUPABASE_URL = https://xxzacrigqqykmmkefphz.supabase.co
VITE_SUPABASE_ANON_KEY = (your full key)
VITE_SITE_URL = https://dgt-sounds.onrender.com
```

---

## After Deploy

### 1. Wait for Build
- First build takes 5-10 minutes
- Check logs in Render dashboard

### 2. Test the Site
- Visit: `https://dgt-sounds.onrender.com`
- Sign in with your account
- Go to `/admin/songs`

### 3. Test Uploads
- Try uploading a song (MP3, max 50MB)
- Try uploading a cover image (JPG/PNG, max 10MB)

---

## Troubleshooting

### Build Fails
- Check Render logs for errors
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### 404 on Refresh
- This is normal for SPA, refresh on home page

### Upload Fails
- Run `fix-everything-now.sql` in Supabase SQL Editor
- Sign out and sign back in

### Site is Slow
- Free tier spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds

---

## Supabase Setup (Required Before Upload Works)

Run this in Supabase SQL Editor:

```sql
-- Make yourself admin
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email VARCHAR(255) NOT NULL
);

INSERT INTO public.admin_roles (user_id, email)
SELECT id, email FROM auth.users 
WHERE email = 'jeterothako276@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
```

Then sign out and sign back in.

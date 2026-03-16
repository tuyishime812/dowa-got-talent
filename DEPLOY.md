# 🚀 Deploy Pamodzi on Render

## ✅ Quick Deploy Guide

### ⚠️ IMPORTANT: Choose STATIC SITE Not Web Service!

When creating your service on Render:
- **DO NOT** choose "Web Service"
- **DO** choose "Static Site"

This is the key to making it work!

---

### Option 1: One-Click Deploy (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tuyishime812/pamodzi)

1. Click the button above
2. Connect your GitHub account
3. **Make sure it's set to Static Site**
4. Render will auto-configure everything!

---

### Option 2: Manual Setup

#### Step 1: Go to Render
- Visit: **https://render.com**
- Sign up/Login with GitHub

#### Step 2: Create Static Site (NOT Web Service!)
1. Click **New +** → **Static Site**
2. Connect your repository: **tuyishime812/pamodzi**

#### Step 3: Configure Settings

```
Name: pamodzi
Region: Choose closest to your users
Branch: main
Root Directory: (leave blank)
Build Command: npm install && npm run build
Publish Directory: dist
```

⚠️ **Important:**
- Choose **Static Site** NOT Web Service
- No start command needed for Static Site
- Do NOT use `npm run dev`

#### Step 4: Add Environment Variables

Click **Advanced** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://mamfqbbgdccmchsllyue.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbWZxYmJnZGNjbWNoc2xseXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjMwMTMsImV4cCI6MjA4ODE5OTAxM30.El_ukwWRFuDdXZTYdh7XTwihmPNGOw7aLS6pKt2_S8Y` |

#### Step 5: Deploy
- Click **Create Web Service**
- Wait 5-10 minutes for build
- Your app will be live at: `https://pamodzi.onrender.com`

---

## 📋 render.yaml Configuration

The `render.yaml` file is already configured with:
- ✅ Static site settings
- ✅ Build commands
- ✅ Security headers
- ✅ Environment variables

---

## 🔧 Troubleshooting

### Build Fails
1. Check if all dependencies are in package.json
2. Verify `npm run build` works locally
3. Check Render logs for specific errors

### App Shows Blank Page
1. Verify environment variables are set correctly
2. Check browser console for errors
3. Ensure Supabase credentials are correct

### 404 on Page Refresh
- This is handled by the static site configuration
- Make sure `staticPublishPath: ./dist` is in render.yaml

---

## 🎯 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Music plays correctly
- [ ] Admin login works
- [ ] File uploads work
- [ ] All pages load
- [ ] Mobile responsive
- [ ] Supabase connection working

---

## 🔗 Your Deployed App

Once deployed, your app will be available at:
- **Production URL**: `https://pamodzi.onrender.com`
- **Admin Panel**: `https://pamodzi.onrender.com/login`

---

## 💡 Tips

1. **Free Tier**: Render free tier spins down after 15 minutes of inactivity
   - First load after idle may take 30-60 seconds
   - Subsequent loads are fast

2. **Custom Domain**:
   - Go to Render Dashboard → Settings → Custom Domain
   - Add your domain (e.g., pamodzi.com)

3. **Auto-Deploy**:
   - Every push to `main` branch auto-deploys
   - No manual deployment needed!

4. **Monitor Logs**:
   - Render Dashboard → Logs
   - View real-time application logs

---

## 📞 Support

If you need help:
1. Check Render logs
2. Verify environment variables
3. Test Supabase connection
4. Review Render documentation: https://render.com/docs

---

**Good luck with your deployment! 🚀**

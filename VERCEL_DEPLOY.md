# DGT Sounds - Vercel Deployment Guide

## Environment Variables Required

Before deploying on Vercel, you MUST add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables:
- `VITE_SUPABASE_URL` = `https://mamfqbbgdccmchsllyue.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbWZxYmJnZGNjbWNoc2xseXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjMwMTMsImV4cCI6MjA4ODE5OTAxM30.El_ukwWRFuDdXZTYdh7XTwihmPNGOw7aLS6pKt2_S8Y`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Import your Git repository
5. **IMPORTANT**: Add the environment variables above in the Environment Variables section
6. Click **Deploy**

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Deploy
vercel --prod
```

## Build Settings

Vercel should auto-detect these settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Troubleshooting

### Error: "Environment variables not defined"
- Make sure you added the environment variables in Vercel dashboard
- Redeploy after adding variables

### Error: "Build failed"
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Try running `npm run build` locally first

### App shows "No Music Yet"
- This is normal if your Supabase database is empty
- Add music through the admin panel (`/admin`)

### 404 on page refresh
- The vercel.json file handles this with rewrites
- Make sure vercel.json is in your project root

## Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Build completes successfully
- [ ] Homepage loads
- [ ] Music page loads
- [ ] Admin panel is accessible
- [ ] Supabase connection works
- [ ] Downloads work correctly

## Support

If you continue to experience issues:
1. Check Vercel deployment logs
2. Verify Supabase credentials
3. Ensure RLS policies are configured in Supabase

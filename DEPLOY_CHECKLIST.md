# Vercel Deployment Checklist

Follow these steps in order to deploy your MediSync app to Vercel.

## Pre-Deployment ✓

- [x] Express backend set up with routes
- [x] MongoDB database created and connection string ready
- [x] React frontend with Vite
- [x] API endpoint detection configured
- [x] CORS configured for Vercel
- [x] Serverless function entry point created (`/api/index.ts`)
- [x] Environment variables documented

## Step 1: MongoDB Setup (If Not Done)

If you haven't already:

1. Go to https://cloud.mongodb.com
2. Log in to your MongoDB Atlas account
3. Click on "Network Access" (or "Security" → "Network Access")
4. Click "Add IP Address"
5. Select `0.0.0.0/0` to allow all IPs
6. Click "Confirm"

⏱️ **Wait 1-2 minutes** for the change to take effect.

**Your MongoDB Connection String:**
```
mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0
```

## Step 2: GitHub Repository (If Not Done)

Make sure your code is on GitHub:

```bash
cd /path/to/your/project
git status
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

Verify at https://github.com/YOUR_USERNAME/YOUR_REPO

## Step 3: Go to Vercel

1. Open https://vercel.com in your browser
2. Click "Log In" (or "Sign Up" if you don't have an account)
3. Choose "GitHub" to sign in with GitHub
4. Authorize Vercel to access your GitHub account

## Step 4: Create New Project

1. Click "Add New" → "Project"
2. You'll see your GitHub repositories listed
3. Find **your MediSync project** in the list
4. Click "Import"

## Step 5: Configure Project Settings

On the "Configure Project" page:

### Build & Output Settings
- **Build Command:** Keep as `npm run build`
- **Output Directory:** Keep as `dist`
- **Install Command:** Keep as `npm install`
- **Root Directory:** Leave blank (or select `.` if shown)

## Step 6: Add Environment Variables ⭐ IMPORTANT

1. Scroll down to "Environment Variables" section
2. Click "Add New"
3. Add these variables one by one:

### Variable 1:
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`
- Click "Add"

### Variable 2:
- **Name:** `MONGODB_DB`
- **Value:** `demo1`
- Click "Add"

### Verify:
You should see:
```
✓ MONGODB_URI = mongodb+srv://Rumisha:rumisha1125@cluster0.hv...
✓ MONGODB_DB = demo1
```

## Step 7: Deploy! 🚀

1. Click the "Deploy" button at the bottom right
2. Wait for deployment to complete (2-3 minutes)
3. You'll see a screen with your live URL

**Your app is now live!** The URL will look like:
```
https://your-project-name.vercel.app
```

## Step 8: Test Your App

1. Click "Visit" to go to your live app
2. Or copy the URL from the Vercel dashboard
3. Try to **Login** with your test credentials
4. Test the different pages

### Test Checklist:
- [ ] Login page loads
- [ ] Can enter email and password
- [ ] "Open my health hub" button works
- [ ] Dashboard page shows
- [ ] Can navigate to different sections
- [ ] File upload works
- [ ] QR code shows

## Step 9: If Something Goes Wrong

### Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Click the latest deployment
5. Click "Logs"
6. Look for error messages

### Common Error Messages & Fixes

**"MONGODB_URI is not set"**
- Go back to Step 6
- Make sure environment variables are added
- Redeploy

**"MongoDB connection failed"**
- MongoDB IP whitelist: Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0`
- Wait 2 minutes
- Redeploy

**"Cannot find module 'express'"**
- Make sure all code is committed to GitHub
- Make sure git push succeeded
- Trigger manual redeploy from Vercel dashboard

**"CORS error"**
- The CORS should be auto-configured
- Check Vercel logs for specific error
- Check that your domain is in Network tab

## Step 10: Get Your Domain (Optional)

To use a custom domain instead of `vercel.app`:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Type your domain (e.g., `medisync.com`)
4. Follow the DNS configuration steps
5. Done!

## After Successful Deployment

Congratulations! 🎉

Your app is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Auto-deployed on every git push
- ✅ Running on Vercel's fast edge network
- ✅ Backed by MongoDB Atlas

### Keep It Updated

To push new changes:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel will automatically redeploy! ⚡

## Support

If you need help:

1. Check Vercel logs (easiest)
2. Read `VERCEL_DEPLOY_NOW.md`
3. Read `VERCEL_FULL_STACK_DEPLOYMENT.md`
4. Check MongoDB docs: https://docs.mongodb.com
5. Check Vercel docs: https://vercel.com/docs

## Quick Reference

**Your Resources:**
- Live App: `https://your-project.vercel.app`
- Vercel Dashboard: `https://vercel.com/dashboard`
- MongoDB: `https://cloud.mongodb.com`
- GitHub: `https://github.com/YOUR_USERNAME/YOUR_REPO`

**Environment Variables:**
- `MONGODB_URI` = `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`
- `MONGODB_DB` = `demo1`

You're all set! Good luck! 🚀

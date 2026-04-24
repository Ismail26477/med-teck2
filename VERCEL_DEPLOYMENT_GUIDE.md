# MediSync - Vercel Deployment Guide

## Overview
This guide walks you through deploying your MediSync application to Vercel. This is a full-stack application with:
- **Frontend**: React + TypeScript
- **Backend**: Node.js/Express API
- **Database**: MongoDB Atlas

## Prerequisites
Before you start, make sure you have:
1. A [GitHub account](https://github.com)
2. A [Vercel account](https://vercel.com) (free)
3. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier available)
4. Git installed on your computer

---

## Step 1: Prepare Your MongoDB Database

### If you don't have MongoDB Atlas set up:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose free tier)
4. Wait for cluster to deploy (5-10 minutes)
5. Click "Connect" and choose "Connect your application"
6. Copy the connection string - it will look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```
7. Replace `<password>` and `<dbname>` with your values

**Important**: Save this connection string - you'll need it in Vercel environment variables.

---

## Step 2: Push Your Project to GitHub

### If you haven't already:

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (name: `medisync`)
3. Don't initialize with README (we have one)
4. Copy the commands GitHub shows and run them in your project folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial MediSync deployment"

# Add remote (replace USERNAME with your GitHub username)
git branch -M main
git remote add origin https://github.com/USERNAME/medisync.git

# Push to GitHub
git push -u origin main
```

Now your code is on GitHub!

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **medisync** repository from GitHub
5. Click **"Import"**

### Configuration Settings:
- **Framework Preset**: Other (we're using Vite)
- **Root Directory**: `./` (leave as is)
- **Build Command**: 
  ```
  npm run build
  ```
- **Output Directory**: 
  ```
  dist
  ```
- **Install Command**: 
  ```
  npm install
  ```

---

## Step 4: Add Environment Variables

### In Vercel Dashboard:

1. On the import screen, scroll down to **"Environment Variables"**
2. Add these variables (based on your `.env` file):

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string from Step 1 |
| `VITE_API_URL` | Leave empty or set to your Vercel domain |
| `NODE_ENV` | `production` |

**Example MongoDB URI**:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/medisync?retryWrites=true&w=majority
```

3. Click **"Deploy"**

Vercel will now build and deploy your application!

---

## Step 5: Wait for Deployment

Deployment typically takes 3-5 minutes:
- ✅ You'll see the build logs
- ✅ When complete, you get a domain like: `medisync-xxxxx.vercel.app`
- ✅ Check the **"Deployments"** tab for status

---

## Step 6: Verify Your Deployment

1. Visit your Vercel domain
2. Test these features:
   - ✅ Sign up / Login
   - ✅ Add medications, allergies, conditions
   - ✅ Generate QR code
   - ✅ Test doctor view with share token
   - ✅ Scan QR code functionality

---

## Step 7: Configure Custom Domain (Optional)

To use your own domain (e.g., `medisync.com`):

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **"Add"** and enter your domain
3. Follow instructions to update DNS records with your domain registrar
4. DNS can take 24-48 hours to propagate

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify MongoDB URI is correct

### Database Connection Errors
- Verify MONGODB_URI is correct in Vercel environment variables
- Check MongoDB Atlas IP whitelist: Settings → Network Access
- Add **0.0.0.0/0** to allow all IPs (for development)

### API 500 Errors
- Check Vercel function logs in Deployment → Functions
- Verify MongoDB is accessible from your IP
- Check environment variables are spelled correctly

### QR Code Not Working
- Verify VITE_API_URL is correctly set
- Check browser console for CORS errors
- Ensure backend API is responding

---

## Performance Tips

1. **Enable Caching**: In Vercel Settings → Caching, use default settings
2. **Monitor Usage**: Vercel Dashboard → Usage to track bandwidth
3. **Set Up Alerts**: Vercel → Settings → Notifications for build failures

---

## Monitoring & Logs

### View Logs:
1. Vercel Dashboard → Deployments
2. Click your latest deployment
3. Click **"Functions"** to see API logs
4. Check browser DevTools Console for frontend errors

### Monitor Errors:
- Set up error tracking with [Sentry](https://sentry.io) (optional)
- Enable Vercel Analytics for performance monitoring

---

## Next Steps After Deployment

- [ ] Share your app URL with users
- [ ] Collect feedback
- [ ] Monitor logs for errors
- [ ] Update your domain DNS (if using custom domain)
- [ ] Set up automated deployments (auto-deploys on GitHub push)
- [ ] Consider adding Sentry for error tracking

---

## Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Connection Issues**: https://docs.mongodb.com/guides/cloud/connectionstring/
- **GitHub Issues**: https://github.com (search for similar problems)

Your MediSync app is now live! 🚀

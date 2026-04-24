# Deploy Your Backend to Render.com

This guide shows you how to deploy your Express backend to Render (free tier available).

## Step 1: Create Render Account

1. Go to https://render.com
2. Click "Sign Up"
3. Use GitHub or email to create account
4. Verify your email

## Step 2: Push Code to GitHub

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 3: Create Render Web Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Click "Connect a repository" → Select your GitHub repo
3. Fill in these settings:

   | Setting | Value |
   |---------|-------|
   | Name | `medisync-api` |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm run server` |
   | Instance Type | `Free` |

4. Click "Advanced" and add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`
   - `MONGODB_DB`: `demo1`
   - `NODE_ENV`: `production`
   - `PORT`: `3001`

5. Click "Create Web Service"

**Wait 5-10 minutes for deployment to complete**

## Step 4: Get Your API URL

Once deployed:
1. Go to Render Dashboard
2. Click on your `medisync-api` service
3. Copy the URL (e.g., `https://medisync-api-xyz123.onrender.com`)

## Step 5: Update Vercel

1. Go to https://vercel.com
2. Select your `med-tech3` project
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render URL (e.g., `https://medisync-api-xyz123.onrender.com`)
5. Click "Save"

## Step 6: Redeploy Frontend on Vercel

1. Go to Vercel Project Deployments
2. Click "Redeploy" on the latest deployment
3. Click "Redeploy" again to confirm
4. Wait for deployment

## Step 7: Test Your App

1. Go to https://med-tech3.vercel.app/login
2. Try logging in with:
   - Email: `test2@gmail.com`
   - Password: `password`
3. Should work now!

## Troubleshooting

### "Cannot reach API"
- Check Render service is running (green status)
- Verify `VITE_API_URL` is set correctly in Vercel
- Check MongoDB URI is correct

### "API responds slowly"
- Render free tier sleeps after inactivity
- First request will be slow (up to 30 seconds)
- This is normal on free tier

### "CORS error"
- Your backend CORS is already configured for production
- Should work automatically

## Free Tier Limitations

Render free tier:
- ✅ Unlimited deployments
- ✅ Free SSL certificate
- ✅ Sleep after 15 minutes of inactivity (wakes up on request)
- ⚠️ First request after sleep takes 30 seconds

This is perfect for development/testing. Upgrade to paid tier when you go live.

## Keep Your Services Running

To prevent your Render service from sleeping:
1. Use an uptime monitor (e.g., Uptimerobot.com - free tier)
2. Ping your API every 15 minutes
3. This keeps the free service running 24/7

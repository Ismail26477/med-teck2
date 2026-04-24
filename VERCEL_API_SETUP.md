# Vercel API Setup - Fix the Backend Connection Issue

## Problem
Your Vite frontend is deployed on Vercel, but your Express backend server isn't running. The frontend is trying to call `/api` routes that don't exist on the Vercel deployment.

## Solution: Two Options

### Option 1: Deploy Backend Separately (Recommended for Now)

Deploy your Express backend to a platform like Render.com (free tier available):

1. **Create a Render account**: https://render.com
2. **Connect your GitHub repository**
3. **Create a new Web Service** with:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB`: demo1
     - `NODE_ENV`: production
4. **Get your Render URL** (e.g., `https://medisync-api.onrender.com`)

Then, set this in your Vercel project:
- Go to Vercel Project Settings → Environment Variables
- Add: `VITE_API_URL` = `https://medisync-api.onrender.com`
- Redeploy your frontend

### Option 2: Use Vercel Serverless Functions (Advanced)

This requires restructuring your backend to use Vercel's `/api` serverless functions instead of a standalone Express server. This is more complex but keeps everything on Vercel.

## Quick Fix for Testing

For now, you can:
1. Run your backend locally: `npm run server` (in terminal)
2. Test the frontend on Vercel - it will fail because the backend isn't accessible from the internet
3. Then implement Option 1 (Deploy backend to Render)

## Commands

**Start backend locally**:
```bash
npm run server
```

**Start frontend locally**:
```bash
npm run dev
```

## Next Steps

1. Choose Option 1 (recommended) - Deploy backend to Render
2. Set `VITE_API_URL` environment variable in Vercel
3. Redeploy your frontend on Vercel
4. Test the login page

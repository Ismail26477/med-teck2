# Deploy Frontend + Backend on Vercel (Full-Stack)

This guide will help you deploy your entire MediSync application (frontend + backend) on Vercel in one place.

## Why This Approach is Better

✅ Everything in one place (no need for Render or separate services)
✅ Automatic deployment on git push
✅ Built-in environment variables
✅ Free tier available
✅ Better performance (same domain)
✅ Easier to maintain

## How It Works

Vercel will:
1. Deploy your React frontend to Vercel's edge network
2. Convert your Express routes to serverless functions in the `/api` folder
3. Route all `/api/*` requests to your serverless functions
4. Everything runs under the same domain

## Step-by-Step Setup

### Step 1: Create API Routes Directory

The `/api` directory already exists or will be created. Vercel converts files in `/api` to serverless functions automatically.

### Step 2: Verify vercel.json Configuration

Your `vercel.json` is already configured correctly to handle this setup.

### Step 3: Push to GitHub

Make sure your project is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel full-stack deployment"
git push origin main
```

### Step 4: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Import"
5. In "Configure Project":
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Environment Variables" (or "Vars" section)
7. Add these environment variables:
   - `MONGODB_URI` = `mongodb+srv://Rumisha:rumisha1125@cluster0.hv4zzlu.mongodb.net/?appName=Cluster0`
   - `MONGODB_DB` = `demo1`
   - `NODE_ENV` = `production`
   - `PORT` = `3001` (optional, for local development)

8. Click "Deploy"

### Step 5: Wait for Deployment

Vercel will:
- Install dependencies
- Build your Vite frontend
- Deploy everything
- Give you a live URL

### Step 6: Test Your API

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/auth/login`
- `https://your-project.vercel.app/api/medications`
- etc.

The frontend automatically detects it's in production and uses `/api` endpoints.

## Understanding the URL Routing

Your `src/lib/api.ts` now automatically detects the environment:

```
Local Development:  http://localhost:3001/api/...
Vercel Production:  https://your-project.vercel.app/api/...
```

This happens automatically based on the hostname - no configuration needed!

## MongoDB Whitelist Settings

For Vercel deployment, your MongoDB Atlas IP whitelist needs to allow Vercel IPs:

**Option 1 (Simple, but less secure):**
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allows all IPs)

**Option 2 (More secure):**
- Go to MongoDB Atlas → Network Access
- Add Vercel IP range: `76.223.0.0/16`

We recommend Option 1 for now since it's a development project.

## Troubleshooting

### Error: "Cannot find module 'express'"
- Make sure all dependencies are in `package.json`
- Run `npm install` locally first
- Push changes to GitHub
- Redeploy on Vercel

### Error: "ERR_CONNECTION_REFUSED"
- Check that `MONGODB_URI` environment variable is set
- Verify MongoDB whitelist allows Vercel IPs
- Check the Vercel logs in the dashboard

### Error: "CORS error"
- The CORS is configured to accept Vercel domains automatically
- Make sure `server/index.ts` has VERCEL_URL detection

### Seeing "api not found"
- Clear browser cache
- Wait a few minutes for full deployment
- Trigger a manual redeploy in Vercel dashboard

## Viewing Logs

1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click the latest deployment
5. Click "Logs" to see detailed error messages

## Next Steps

1. Deploy to Vercel following the steps above
2. Test the login page at `https://your-project.vercel.app/login`
3. Your app is now live!

## Custom Domain (Optional)

To add your own domain:
1. In Vercel dashboard, go to Settings → Domains
2. Add your domain
3. Follow the DNS configuration steps

## Production Checklist

- [ ] MongoDB URI set correctly
- [ ] Environment variables added to Vercel
- [ ] Code pushed to GitHub
- [ ] Deployed on Vercel
- [ ] Tested login functionality
- [ ] Tested file upload
- [ ] Tested QR code sharing

Your full-stack application is now ready to go live! 🚀

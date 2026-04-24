# 🚀 MediSync - Deploy in 5 Minutes

## Quick Summary
You have a full-stack medical app with React frontend and Express backend. Follow these simple steps to deploy to Vercel.

---

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create a cluster (free tier)
4. Click "Connect" → "Drivers"
5. Copy the connection string (looks like: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname`)
6. **Save this string** - you'll need it in Vercel

---

## Step 2: Push Code to GitHub

```bash
# In your project folder:
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/medisync.git
git push -u origin main
```

---

## Step 3: Deploy on Vercel

### Option 1: Dashboard (Easiest)
1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your "medisync" repository
4. Click "Import"
5. Fill in Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
6. Click "Deploy" - Done! ✅

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow the prompts
```

---

## Step 4: Verify Deployment

Visit your Vercel domain (like `medisync-xxxxx.vercel.app`) and test:
- ✅ Sign up
- ✅ Add medications
- ✅ Generate QR code
- ✅ Scan QR (doctor view)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Vercel logs, ensure dependencies are correct |
| Database error | Verify MONGODB_URI in Vercel environment variables |
| 404 on API calls | Check that backend is running in Vercel |
| CORS errors | API URL configuration may be wrong |

---

## Environment Variables Needed

```
MONGODB_URI = Your MongoDB connection string
MONGODB_DB = medisync
NODE_ENV = production
```

---

## Need More Help?

Read the full guide: `VERCEL_DEPLOYMENT_GUIDE.md`

---

Your app is now live! Share the URL with your users. 🎉

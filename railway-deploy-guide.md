# Railway Deployment Guide for VIBELY Backend

## Step-by-Step Deployment

### 1. Sign Up for Railway
- Go to [railway.app](https://railway.app)
- Click "Login with GitHub"
- Authorize Railway

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `roshan-1205/VIBELY`

### 3. Configure Service
- Click on the deployed service
- Go to "Settings" tab
- Set "Root Directory" to: `backend`
- Click "Update"

### 4. Add MongoDB Database
- In project dashboard, click "New"
- Select "Database" → "Add MongoDB"
- This creates `MONGODB_URI` automatically

### 5. Set Environment Variables
Go to "Variables" tab and add:

```
NODE_ENV=production
JWT_SECRET=vibely-jwt-secret-2024-change-this-random-string-production
SESSION_SECRET=vibely-session-secret-2024-change-this-random-string-production
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
GOOGLE_CLIENT_ID=405006892967-83r5mvq1kk31j86tm2hedmgac9pan9ce.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 6. Deploy & Test
- Railway auto-deploys after variable changes
- Test: `https://your-railway-url.railway.app/api/health`
- Should return: `{"status":"OK","message":"Vibely API is running"}`

### 7. Get Your Backend URL
- Copy the Railway URL (e.g., `https://vibely-backend-production-xxxx.up.railway.app`)
- You'll need this for frontend configuration

## Next Steps After Deployment
1. Update Vercel frontend with Railway backend URL
2. Update Railway backend with Vercel frontend URL
3. Test authentication and API endpoints
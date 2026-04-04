# Deploy to Render (Alternative to Railway)

## Quick Render Deployment

### 1. Sign up for Render
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect GitHub: `roshan-1205/VIBELY`
- Root Directory: `backend`

### 3. Build Settings
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: `Node`

### 4. Environment Variables
```
NODE_ENV=production
JWT_SECRET=vibely-jwt-secret-2024-change-this-random-string-production
SESSION_SECRET=vibely-session-secret-2024-change-this-random-string-production
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
GOOGLE_CLIENT_ID=405006892967-83r5mvq1kk31j86tm2hedmgac9pan9ce.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibely
```

### 5. Database Options
- **MongoDB Atlas** (recommended): Free 512MB
- **Render PostgreSQL**: If you want to switch to PostgreSQL

## MongoDB Atlas Setup (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0
5. Get connection string
6. Use as MONGODB_URI
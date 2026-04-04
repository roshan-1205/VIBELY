# Quick Deploy Commands

## If you prefer CLI deployment to Railway:

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Deploy Backend**
```bash
cd VIBELY/backend
railway init
railway up
```

4. **Add Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-jwt-secret-here
railway variables set SESSION_SECRET=your-session-secret-here
railway variables set FRONTEND_URL=https://your-vercel-url.vercel.app
railway variables set GOOGLE_CLIENT_ID=405006892967-83r5mvq1kk31j86tm2hedmgac9pan9ce.apps.googleusercontent.com
railway variables set GOOGLE_CLIENT_SECRET=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
```

5. **Add MongoDB**
```bash
railway add mongodb
```

## Alternative: One-Click Deploy Button

I can create a one-click deploy button for Railway if you prefer that approach.
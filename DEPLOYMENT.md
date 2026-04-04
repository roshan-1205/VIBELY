# VIBELY Deployment Guide

## Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended)

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import from GitHub: `roshan-1205/VIBELY`
   - Select the `frontend` folder as root directory

3. **Configure Environment Variables**
   - Add environment variable: `NEXT_PUBLIC_API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Netlify

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account

2. **New Site from Git**
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select `roshan-1205/VIBELY`

3. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`

4. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add: `NEXT_PUBLIC_API_URL` with your backend URL

### Option 3: GitHub Pages (Static Export)

1. **Configure Next.js for Static Export**
   - Update `next.config.js` with `output: 'export'`
   - Add `trailingSlash: true`

2. **GitHub Actions Workflow**
   - Create `.github/workflows/deploy.yml`
   - Configure automatic deployment on push

## Backend Deployment

### Option 1: Railway (Recommended - Easy & Fast)

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `roshan-1205/VIBELY`
   - Select the `backend` folder

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibely
   JWT_SECRET=your-super-secure-jwt-secret
   SESSION_SECRET=your-session-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Database Setup**
   - Add MongoDB plugin in Railway
   - Or use MongoDB Atlas (recommended)

### Option 2: Render (Free Tier Available)

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repo: `roshan-1205/VIBELY`
   - Root Directory: `backend`

3. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables** (same as Railway)

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # Windows (using chocolatey)
   choco install heroku-cli
   ```

2. **Deploy via CLI**
   ```bash
   cd VIBELY/backend
   heroku login
   heroku create vibely-backend-app
   git subtree push --prefix=backend heroku main
   ```

3. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

3. **Whitelist IP Addresses**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow all - for production, be more specific)

### Environment Variables Needed:
- `NODE_ENV=production`
- `PORT=5000` (or platform default)
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - JWT signing secret (generate random string)
- `SESSION_SECRET` - Session secret (generate random string)
- `FRONTEND_URL` - Your deployed frontend URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID (optional)
- `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth client secret (optional)

## Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` in frontend env
- [ ] Update `FRONTEND_URL` in backend env
- [ ] Configure CORS for your frontend domain
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Verify real-time features work
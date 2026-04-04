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

### Recommended Platforms:
- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **Heroku** - Popular choice
- **DigitalOcean App Platform**

### Environment Variables Needed:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SESSION_SECRET` - Session secret
- `FRONTEND_URL` - Your deployed frontend URL
- OAuth credentials (Google, Microsoft)

## Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` in frontend env
- [ ] Update `FRONTEND_URL` in backend env
- [ ] Configure CORS for your frontend domain
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Verify real-time features work
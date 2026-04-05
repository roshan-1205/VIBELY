# VIBELY Backend Deployment Guide

## Option 1: MongoDB Atlas + Render (Recommended)

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and new cluster
3. Choose AWS, free tier (M0)
4. Create a database user with read/write permissions
5. Add your IP address to the IP Access List (or use 0.0.0.0/0 for all IPs)
6. Get your connection string from "Connect" → "Connect your application"

### Step 2: Deploy to Render
1. Go to [Render](https://render.com) and sign up
2. Connect your GitHub account
3. Create a new Web Service
4. Connect your repository: `your-username/your-repo-name`
5. Configure the service:
   - **Name**: `vibely-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `VIBELY/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables in Render
Go to your service → Environment and add these variables:

```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=https://vibely-1205.web.app
SESSION_SECRET=your-session-secret-at-least-32-characters-long
```

### Step 4: Update Frontend API URL
Update your frontend's API URL to point to your Render service:
- Your Render service URL will be: `https://vibely-backend.onrender.com`

---

## Option 2: PostgreSQL with Supabase + Render

### Step 1: Set up Supabase
1. Go to [Supabase](https://supabase.com)
2. Create new project: `vibely-database`
3. Get your connection details from Settings → Database
4. Note down the connection string

### Step 2: Database Migration
This requires converting Mongoose models to PostgreSQL schema.
See the migration files in the `/migrations` folder.

### Step 3: Update Backend Code
Replace Mongoose with a PostgreSQL client like `pg` or use an ORM like Prisma.

---

## Environment Variables Reference

### Required Variables:
- `NODE_ENV`: Set to "production"
- `MONGODB_URI` or `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Secret key for JWT tokens (min 32 characters)
- `FRONTEND_URL`: Your frontend URL (Firebase hosting URL)

### Optional Variables:
- `JWT_EXPIRE`: Token expiration time (default: 7d)
- `SESSION_SECRET`: Session secret for OAuth
- `PORT`: Port number (automatically set by Render)

### OAuth Variables (if using):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`

### Email Variables (if using):
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`

---

## Deployment Checklist

- [ ] Database set up (MongoDB Atlas or Supabase)
- [ ] Render service created and configured
- [ ] Environment variables set in Render
- [ ] Repository connected to Render
- [ ] Build and start commands configured
- [ ] Frontend updated with new API URL
- [ ] CORS configured for production domains
- [ ] SSL/HTTPS enabled (automatic with Render)
- [ ] File uploads configured (if using local storage, consider cloud storage)

---

## Post-Deployment

1. Test all API endpoints
2. Verify database connections
3. Test authentication flows
4. Check file upload functionality
5. Monitor logs for any errors
6. Set up monitoring and alerts

---

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version compatibility
2. **Database connection fails**: Verify connection string and IP whitelist
3. **CORS errors**: Update CORS configuration with production URLs
4. **File uploads fail**: Consider using cloud storage (AWS S3, Cloudinary)
5. **Environment variables not loaded**: Check variable names and values in Render dashboard

### Logs:
- View logs in Render dashboard under "Logs" tab
- Use `console.log` for debugging (visible in Render logs)
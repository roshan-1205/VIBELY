# 🚀 VIBELY Complete Deployment Guide

## Overview
This guide will help you deploy:
- **Frontend**: Already deployed to Firebase Hosting ✅
- **Backend**: Deploy to Render
- **Database**: MongoDB Atlas (recommended) or Supabase PostgreSQL

---

## 🗄️ Step 1: Database Setup

### Option A: MongoDB Atlas (Recommended - Easier)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new project: "Vibely"

2. **Create Database Cluster**
   - Click "Create" → "Shared" (Free tier)
   - Choose AWS, region closest to you
   - Cluster name: "vibely-cluster"
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Username: `vibely-admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (Allow access from anywhere)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://vibely-admin:yourpassword@vibely-cluster.xxxxx.mongodb.net/vibely?retryWrites=true&w=majority`

### Option B: Supabase PostgreSQL

1. **Create Supabase Project**
   - Go to [Supabase](https://supabase.com)
   - Create new project: "vibely-database"
   - Choose region, set strong password

2. **Set up Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the SQL from `backend/migrations/supabase-schema.sql`

3. **Get Connection Details**
   - Go to Settings → Database
   - Copy the connection string (URI format)

---

## 🖥️ Step 2: Backend Deployment to Render

### 2.1 Prepare Repository

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

### 2.2 Deploy to Render

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up and connect your GitHub account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure service:
     - **Name**: `vibely-backend`
     - **Environment**: `Node`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `VIBELY/backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (for testing)

3. **Set Environment Variables**
   Go to your service → Environment tab and add:

   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=d185fa3b343998bd617cb95b782537727f325841f72031963ee83af4a19c0fdd1f8181c1a434b11e248add6634c9b6370a93f6e5658d9bcf3d99fbea07b99642
   SESSION_SECRET=9a9a717c9ebb183cf4693659cfc62eed4a6cd037aab2d7312e0ffb8005529e88a663fedb5a6c7f89dd57e90cda696c3d85dde17e34988d10f8acf401d923a516
   FRONTEND_URL=https://vibely-1205.web.app
   ```

   **Important**: Replace the MongoDB URI with your actual connection string!

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be available at: `https://vibely-backend.onrender.com`

---

## 🌐 Step 3: Update Frontend API Configuration

Update your frontend to use the new backend URL:

1. **Update API Base URL**
   - Edit `VIBELY/frontend/services/api.ts`
   - Change the API_BASE_URL to your Render service URL

2. **Update Environment Variables**
   - Edit `VIBELY/frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://vibely-backend.onrender.com/api
   ```

3. **Rebuild and Redeploy Frontend**
   ```bash
   cd VIBELY/frontend
   npm run build
   npx firebase-tools deploy --only hosting
   ```

---

## 🧪 Step 4: Testing

### 4.1 Test Backend
1. Visit: `https://vibely-backend.onrender.com`
2. Should see API welcome message
3. Test health endpoint: `https://vibely-backend.onrender.com/api/health`

### 4.2 Test Full Application
1. Visit your frontend: `https://vibely-1205.web.app`
2. Try signing up/signing in
3. Test creating posts
4. Test social features

---

## 🔧 Step 5: Production Optimizations

### 5.1 Database Optimizations
- Set up database indexes (already included in schema)
- Configure connection pooling
- Set up database monitoring

### 5.2 Backend Optimizations
- Enable rate limiting (uncomment in server.js)
- Set up proper logging
- Configure file upload to cloud storage (AWS S3, Cloudinary)

### 5.3 Security
- Review CORS settings
- Set up proper authentication
- Enable HTTPS (automatic with Render)
- Set up monitoring and alerts

---

## 📊 Step 6: Monitoring and Maintenance

### 6.1 Render Monitoring
- Check service logs in Render dashboard
- Set up uptime monitoring
- Configure auto-deploy on git push

### 6.2 Database Monitoring
- Monitor database performance
- Set up automated backups
- Track usage and scaling needs

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails on Render**
   - Check Node.js version compatibility
   - Verify package.json scripts
   - Check build logs for specific errors

2. **Database Connection Fails**
   - Verify connection string format
   - Check IP whitelist settings
   - Ensure database user has correct permissions

3. **CORS Errors**
   - Update CORS configuration in server.js
   - Add production URLs to allowed origins

4. **Environment Variables Not Working**
   - Check variable names (case-sensitive)
   - Verify values are set correctly in Render
   - Restart service after changing variables

5. **File Uploads Not Working**
   - Consider using cloud storage instead of local storage
   - Check file size limits
   - Verify upload directory permissions

### Getting Help:
- Check Render service logs
- Review database connection logs
- Test API endpoints individually
- Use browser developer tools for frontend debugging

---

## 🎉 Deployment Complete!

Your VIBELY application should now be fully deployed:

- **Frontend**: https://vibely-1205.web.app
- **Backend**: https://vibely-backend.onrender.com
- **Database**: MongoDB Atlas or Supabase

**Next Steps:**
1. Test all functionality
2. Set up monitoring
3. Configure domain name (optional)
4. Set up CI/CD pipeline
5. Plan for scaling as your app grows

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs in Render dashboard
3. Test individual components
4. Check database connectivity

Remember to keep your environment variables secure and never commit them to version control!
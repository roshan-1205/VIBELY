# 🚀 VIBELY Final Deployment Steps

## Current Status ✅
- ✅ **Frontend**: Deployed to Firebase Hosting at https://vibely-1205.web.app
- ✅ **Supabase**: Project created with ID `xmziootltbhwxmigvqhv`
- ✅ **Backend**: Configured for Supabase PostgreSQL
- ✅ **Environment**: All variables configured
- ✅ **Supabase Integration**: Frontend utilities and services ready

---

## 🎯 STEP 1: Create Database Schema in Supabase

### 1.1 Go to Supabase SQL Editor
Visit: https://supabase.com/dashboard/project/xmziootltbhwxmigvqhv/sql

### 1.2 Run the Database Schema
Copy and paste this SQL script and click "Run":

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    avatar TEXT,
    bio TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    coordinates JSONB,
    website VARCHAR(255),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[],
    media_type VARCHAR(20) DEFAULT 'text',
    location VARCHAR(255),
    coordinates JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows table
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    target_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    target_id UUID,
    target_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
```

---

## 🎯 STEP 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Find repository: `roshan-1205/VIBELY`
3. Click "Connect"

### 2.3 Configure Service Settings
```
Name: vibely-backend
Environment: Node
Region: Singapore (or closest to you)
Branch: main
Root Directory: VIBELY/backend
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 2.4 Set Environment Variables
Click "Advanced" and add these environment variables:

```
NODE_ENV=production
DATABASE_TYPE=supabase
DATABASE_URL=postgresql://postgres.xmziootltbhwxmigvqhv:Rs%409826348254@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xmziootltbhwxmigvqhv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtemlvb3RsdGJod3htaWd2cWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzU4ODMsImV4cCI6MjA5MDk1MTg4M30.L6HwLL3Av-Ugp5-b7rtfj6fSXQQxIP4I1_NHJYsrw6U
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtemlvb3RsdGJod3htaWd2cWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM3NTg4MywiZXhwIjoyMDkwOTUxODgzfQ.zCHVpmyxtznA3GOcMWj_4kv3uhTBH9OX6bFaNIoZ-l4
JWT_SECRET=d185fa3b343998bd617cb95b782537727f325841f72031963ee83af4a19c0fdd1f8181c1a434b11e248add6634c9b6370a93f6e5658d9bcf3d99fbea07b99642
JWT_EXPIRE=7d
FRONTEND_URL=https://vibely-1205.web.app
SESSION_SECRET=9a9a717c9ebb183cf4693659cfc62eed4a6cd037aab2d7312e0ffb8005529e88a663fedb5a6c7f89dd57e90cda696c3d85dde17e34988d10f8acf401d923a516
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://vibely-backend.onrender.com`

---

## 🎯 STEP 3: Test Backend Deployment

### 3.1 Test Health Endpoint
Visit: `https://vibely-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Vibely API is running",
  "timestamp": "2024-01-XX...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 3.2 Test API Info
Visit: `https://vibely-backend.onrender.com/`

Should show API endpoints and status.

---

## 🎯 STEP 4: Update and Redeploy Frontend

The frontend is already configured with the correct backend URL and Supabase settings. If you need to redeploy:

### 4.1 Redeploy Frontend (if needed)
```bash
cd VIBELY/frontend
npm run build
npx firebase-tools deploy --only hosting
```

---

## 🎯 STEP 5: Test Complete Application

### 5.1 Test Frontend
1. Visit: https://vibely-1205.web.app
2. Try signing up with a test account
3. Test creating posts
4. Test social features (like, follow)

### 5.2 Test Integration
- Frontend should communicate with backend
- Authentication should work
- Database operations should work through Supabase

---

## 📋 Quick Reference

### Your Deployment URLs:
- **Frontend**: https://vibely-1205.web.app
- **Backend**: https://vibely-backend.onrender.com
- **API**: https://vibely-backend.onrender.com/api
- **Supabase Dashboard**: https://supabase.com/dashboard/project/xmziootltbhwxmigvqhv

### Your Database:
- **Type**: Supabase PostgreSQL
- **Project ID**: xmziootltbhwxmigvqhv
- **Region**: Mumbai (ap-south-1)
- **Password**: Rs@9826348254

---

## 🚨 Important Notes

1. **Database Schema**: Must be created manually in Supabase dashboard (Step 1)
2. **Environment Variables**: Must be set exactly as shown in Render dashboard
3. **First Deploy**: May take 10-15 minutes for Render to build and deploy
4. **Free Tier**: Render free tier may sleep after 15 minutes of inactivity

---

## 🎉 You're Ready!

Follow these steps in order:
1. ✅ Create database schema in Supabase
2. ✅ Deploy backend to Render
3. ✅ Test backend endpoints
4. ✅ Test complete application

Your VIBELY social media app will be fully deployed and ready to use!
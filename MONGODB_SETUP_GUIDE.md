# 🍃 MongoDB Atlas Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with Google/GitHub or email
4. Choose "Build a database"

### Step 2: Create Free Cluster
1. **Choose**: "M0 Sandbox" (FREE)
2. **Provider**: AWS
3. **Region**: Choose closest to you (e.g., Mumbai, Singapore)
4. **Cluster Name**: `vibely-cluster`
5. Click "Create"

### Step 3: Create Database User
1. **Username**: `vibely-admin`
2. **Password**: `Rs@9826348254`
3. Click "Create User"

### Step 4: Add IP Address
1. Click "Add IP Address"
2. Choose "Allow access from anywhere" (0.0.0.0/0)
3. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. **Driver**: Node.js
4. **Version**: 4.1 or later
5. Copy the connection string
6. Replace `<password>` with `Rs@9826348254`
7. Add `/vibely` at the end for database name

**Your connection string should look like:**
```
mongodb+srv://vibely-admin:Rs@9826348254@vibely-cluster.abc123.mongodb.net/vibely?retryWrites=true&w=majority
```

## 🔧 Update Render Environment Variables

Go to **Render dashboard → vibely-backend → Environment** and update:

### Remove These Variables:
- `DATABASE_TYPE` → Change to `mongodb`
- `DATABASE_URL` → Remove this
- `SUPABASE_URL` → Remove this
- `SUPABASE_ANON_KEY` → Remove this
- `SUPABASE_SERVICE_KEY` → Remove this

### Add This Variable:
- **Key**: `MONGODB_URI`
- **Value**: Your connection string from Step 5

### Keep These Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://vibely-admin:Rs@9826348254@vibely-cluster.YOUR_CLUSTER_ID.mongodb.net/vibely?retryWrites=true&w=majority
JWT_SECRET=d185fa3b343998bd617cb95b782537727f325841f72031963ee83af4a19c0fdd1f8181c1a434b11e248add6634c9b6370a93f6e5658d9bcf3d99fbea07b99642
JWT_EXPIRE=7d
FRONTEND_URL=https://vibely-1205.web.app
SESSION_SECRET=9a9a717c9ebb183cf4693659cfc62eed4a6cd037aab2d7312e0ffb8005529e88a663fedb5a6c7f89dd57e90cda696c3d85dde17e34988d10f8acf401d923a516
```

## 🚀 Deploy

1. **Save changes** in Render
2. **Service will auto-redeploy**
3. **Check logs** for: `✅ Connected to MongoDB`
4. **Test**: `https://vibely-backend.onrender.com/api/health`

## ✅ Why MongoDB is Better for This:

- **Easier setup**: No connection pooler issues
- **Better compatibility**: Works perfectly with Render
- **Familiar**: Your backend already has MongoDB models
- **Reliable**: Fewer network/SSL issues
- **Free tier**: 512MB storage, perfect for development

## 🎉 That's It!

MongoDB Atlas is much simpler than Supabase for this deployment. Once you get the connection string, everything should work smoothly!
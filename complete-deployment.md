# 🚀 VIBELY Complete Deployment - Step by Step

## Current Status
✅ **Frontend**: Deployed to Firebase Hosting  
🔄 **Backend**: Ready to deploy to Render  
🔄 **Database**: Ready to set up on MongoDB Atlas  

---

## **STEP 1: Complete MongoDB Atlas Setup**

### 1.1 Get Your Cluster Connection String
You need to get the exact cluster identifier from MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your `vibely-cluster`
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. It should look like: `mongodb+srv://vibely-admin:<password>@vibely-cluster.abc123.mongodb.net/?retryWrites=true&w=majority`

### 1.2 Your Final Connection String
Replace `<password>` with `Rs%409826348254` and add `/vibely` database name:
```
mongodb+srv://vibely-admin:Rs%409826348254@vibely-cluster.YOUR_CLUSTER_ID.mongodb.net/vibely?retryWrites=true&w=majority
```

**⚠️ Important**: Replace `YOUR_CLUSTER_ID` with the actual cluster ID from MongoDB Atlas.

---

## **STEP 2: Deploy Backend to Render**

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Find repository: `roshan-1205/VIBELY`
3. Click "Connect"

### 2.3 Configure Service
```
Name: vibely-backend
Environment: Node
Region: Singapore
Branch: main
Root Directory: VIBELY/backend
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 2.4 Set Environment Variables
Click "Advanced" and add these variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://vibely-admin:Rs%409826348254@vibely-cluster.YOUR_CLUSTER_ID.mongodb.net/vibely?retryWrites=true&w=majority
JWT_SECRET=d185fa3b343998bd617cb95b782537727f325841f72031963ee83af4a19c0fdd1f8181c1a434b11e248add6634c9b6370a93f6e5658d9bcf3d99fbea07b99642
SESSION_SECRET=9a9a717c9ebb183cf4693659cfc62eed4a6cd037aab2d7312e0ffb8005529e88a663fedb5a6c7f89dd57e90cda696c3d85dde17e34988d10f8acf401d923a516
FRONTEND_URL=https://vibely-1205.web.app
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://vibely-backend.onrender.com`

---

## **STEP 3: Update and Redeploy Frontend**

After your backend is deployed, update the frontend:

### 3.1 Test Backend
Visit: `https://vibely-backend.onrender.com/api/health`
Should return: `{"status":"OK","message":"Vibely API is running",...}`

### 3.2 Update Frontend Environment
The frontend is already configured to use: `https://vibely-backend.onrender.com/api`

### 3.3 Redeploy Frontend
Run these commands in your terminal:
```bash
cd VIBELY/frontend
npm run build
npx firebase-tools deploy --only hosting
```

---

## **STEP 4: Test Complete Application**

### 4.1 Test Backend Endpoints
- Health: `https://vibely-backend.onrender.com/api/health`
- API Info: `https://vibely-backend.onrender.com/`

### 4.2 Test Frontend
- Visit: `https://vibely-1205.web.app`
- Try signing up with a test account
- Test creating posts
- Test social features

---

## **Quick Reference**

### Your URLs:
- **Frontend**: https://vibely-1205.web.app
- **Backend**: https://vibely-backend.onrender.com
- **API**: https://vibely-backend.onrender.com/api

### Your Credentials:
- **MongoDB User**: vibely-admin
- **MongoDB Password**: Rs@9826348254
- **Database Name**: vibely

### Environment Variables for Render:
```
NODE_ENV=production
MONGODB_URI=[Your MongoDB connection string]
JWT_SECRET=d185fa3b343998bd617cb95b782537727f325841f72031963ee83af4a19c0fdd1f8181c1a434b11e248add6634c9b6370a93f6e5658d9bcf3d99fbea07b99642
SESSION_SECRET=9a9a717c9ebb183cf4693659cfc62eed4a6cd037aab2d7312e0ffb8005529e88a663fedb5a6c7f89dd57e90cda696c3d85dde17e34988d10f8acf401d923a516
FRONTEND_URL=https://vibely-1205.web.app
```

---

## **Next Steps**

1. **Complete MongoDB Atlas setup** and get your connection string
2. **Deploy to Render** using the configuration above
3. **Test the backend** deployment
4. **Redeploy frontend** if needed
5. **Test the complete application**

---

## **Need Help?**

If you encounter any issues:
1. Check Render service logs
2. Verify MongoDB connection string
3. Test individual API endpoints
4. Check browser console for frontend errors

**Ready to deploy!** Start with Step 1 and let me know when you have your MongoDB connection string.
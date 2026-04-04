# MongoDB Atlas Setup for Render Deployment

## Step-by-Step MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Sign up with Google/GitHub or email
- Choose "Build a database" → "M0 Sandbox" (Free)

### 2. Create Cluster
- Choose cloud provider: **AWS**
- Region: Choose closest to your Render region
- Cluster Name: `vibely-cluster` (or any name)
- Click "Create Cluster"

### 3. Create Database User
- Go to "Database Access" in left sidebar
- Click "Add New Database User"
- Authentication Method: **Password**
- Username: `vibely-user`
- Password: Generate secure password (save it!)
- Database User Privileges: **Read and write to any database**
- Click "Add User"

### 4. Configure Network Access
- Go to "Network Access" in left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database" in left sidebar
- Click "Connect" on your cluster
- Choose "Connect your application"
- Driver: **Node.js**, Version: **4.1 or later**
- Copy the connection string

### 6. Format Connection String
Your connection string will look like:
```
mongodb+srv://vibely-user:<password>@vibely-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `<password>` with your actual password and add database name:
```
mongodb+srv://vibely-user:your-actual-password@vibely-cluster.xxxxx.mongodb.net/vibely?retryWrites=true&w=majority
```

### 7. Add to Render Environment Variables
- In Render dashboard, go to your service
- Environment tab → Add Environment Variable
- Key: `MONGODB_URI`
- Value: Your formatted connection string
- Click "Save Changes"

## Testing Connection
After adding the MongoDB URI, your backend should connect automatically. Check the logs in Render for:
```
✅ Connected to MongoDB
```
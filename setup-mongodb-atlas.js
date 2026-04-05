const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MongoDB Atlas Automated Setup');
console.log('=====================================\n');

console.log('⚠️  MongoDB Atlas CLI setup requires manual steps because:');
console.log('1. Atlas CLI needs to be downloaded from MongoDB website');
console.log('2. API keys need to be generated from Atlas dashboard');
console.log('3. Authentication requires browser-based OAuth\n');

console.log('🔧 Alternative: Let me create a simplified setup guide for you:\n');

// Create a step-by-step guide
const setupSteps = `
📋 MONGODB ATLAS SETUP - SIMPLIFIED STEPS
==========================================

1. 🌐 Open Browser and go to: https://cloud.mongodb.com

2. 📧 Sign up with email: roshankumarsingh021@gmail.com

3. 🏗️  Create New Project:
   - Project Name: "VIBELY"
   - Click "Create Project"

4. 🗄️  Create Database Cluster:
   - Click "Create" button
   - Choose "M0 Sandbox" (FREE)
   - Provider: AWS
   - Region: Mumbai (ap-south-1)
   - Cluster Name: vibely-cluster
   - Click "Create Cluster"

5. 👤 Create Database User:
   - Go to "Database Access" → "Add New Database User"
   - Username: vibely-admin
   - Password: Rs@9826348254
   - Privileges: "Read and write to any database"
   - Click "Add User"

6. 🌍 Configure Network Access:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

7. 🔗 Get Connection String:
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace <password> with: Rs%409826348254
   - Add /vibely before the ?

Your final connection string will look like:
mongodb+srv://vibely-admin:Rs%409826348254@vibely-cluster.xxxxx.mongodb.net/vibely?retryWrites=true&w=majority

⏱️  Total time: 5-10 minutes
`;

console.log(setupSteps);

// Create a connection string template
const connectionTemplate = `
🔗 CONNECTION STRING TEMPLATE
============================

Original: mongodb+srv://vibely-admin:<password>@vibely-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

Replace: mongodb+srv://vibely-admin:Rs%409826348254@vibely-cluster.xxxxx.mongodb.net/vibely?retryWrites=true&w=majority

⚠️  Replace 'xxxxx' with your actual cluster ID from Atlas dashboard
`;

console.log(connectionTemplate);

rl.question('\n✅ Have you completed the MongoDB Atlas setup? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    rl.question('📝 Please paste your MongoDB connection string: ', (connectionString) => {
      console.log('\n🎉 Great! Your connection string is:');
      console.log(connectionString);
      
      console.log('\n📋 Next Steps:');
      console.log('1. Copy this connection string');
      console.log('2. We will use it in Render deployment');
      console.log('3. Let me know when you are ready for Render setup');
      
      rl.close();
    });
  } else {
    console.log('\n💡 Please complete the MongoDB Atlas setup first using the steps above.');
    console.log('Once done, run this script again.');
    rl.close();
  }
});
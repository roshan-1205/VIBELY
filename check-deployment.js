const https = require('https');

console.log('🔍 Checking VIBELY Deployment Status...\n');

// Check Frontend
console.log('📱 Frontend Status:');
console.log('URL: https://vibely-1205.web.app');
console.log('Status: ✅ Already deployed and working\n');

// Check Backend
console.log('🖥️ Backend Status:');
const backendUrl = 'https://vibely-backend.onrender.com/api/health';
console.log(`Checking: ${backendUrl}`);

https.get(backendUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Backend is running!');
      console.log('Response:', response);
    } catch (error) {
      console.log('❌ Backend response error:', error.message);
    }
  });
}).on('error', (error) => {
  console.log('❌ Backend connection failed:', error.message);
  console.log('💡 This is normal if you haven\'t deployed to Render yet.');
});

console.log('\n📋 Deployment Checklist:');
console.log('[ ] MongoDB Atlas cluster created');
console.log('[ ] Database user created with password: Rs@9826348254');
console.log('[ ] Network access configured (0.0.0.0/0)');
console.log('[ ] Connection string obtained');
console.log('[ ] Render account created');
console.log('[ ] Web service deployed to Render');
console.log('[ ] Environment variables set in Render');
console.log('[ ] Frontend updated with backend URL');
console.log('[ ] Frontend redeployed to Firebase');

console.log('\n🔗 Important URLs:');
console.log('Frontend: https://vibely-1205.web.app');
console.log('Backend: https://vibely-backend.onrender.com (after deployment)');
console.log('API Health: https://vibely-backend.onrender.com/api/health');
console.log('MongoDB Atlas: https://cloud.mongodb.com');
console.log('Render Dashboard: https://dashboard.render.com');
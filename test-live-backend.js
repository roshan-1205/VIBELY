// Test the live backend with multiple attempts
const https = require('https');

console.log('🧪 Testing VIBELY backend endpoints...\n');

const endpoints = [
  '/',
  '/api/health',
  '/api/auth/login'
];

function testEndpoint(path) {
  return new Promise((resolve) => {
    console.log(`Testing: https://vibely-backend.onrender.com${path}`);
    
    const options = {
      hostname: 'vibely-backend.onrender.com',
      port: 443,
      path: path,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'VIBELY-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        console.log(`✅ ${path}: Status ${res.statusCode}`);
        if (data) {
          try {
            const json = JSON.parse(data);
            console.log(`   Response:`, json);
          } catch (e) {
            console.log(`   Response:`, data.substring(0, 100) + '...');
          }
        }
        resolve({ path, status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}: ${error.message}`);
      resolve({ path, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${path}: Timeout`);
      req.destroy();
      resolve({ path, error: 'timeout' });
    });

    req.end();
  });
}

async function testAll() {
  console.log('Starting comprehensive backend test...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log(''); // Empty line for readability
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between tests
  }
  
  console.log('🎯 Test Summary:');
  console.log('If you see ✅ responses above, your backend is working!');
  console.log('If you see ❌ or ⏰, there might still be deployment issues.');
  console.log('\n🔗 Try these URLs in your browser:');
  console.log('- https://vibely-backend.onrender.com/');
  console.log('- https://vibely-backend.onrender.com/api/health');
  console.log('\n🌐 Then test login at: https://vibely-1205.web.app/signin');
}

testAll();
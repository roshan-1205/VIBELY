// Test local backend
const http = require('http');

console.log('🧪 Testing local VIBELY backend...\n');

function testLocalEndpoint(path) {
  return new Promise((resolve) => {
    console.log(`Testing: http://localhost:5001${path}`);
    
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        console.log(`✅ ${path}: Status ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log(`   Response:`, json);
        } catch (e) {
          console.log(`   Response:`, data.substring(0, 200));
        }
        console.log('');
        resolve({ path, status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}: ${error.message}\n`);
      resolve({ path, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${path}: Timeout\n`);
      req.destroy();
      resolve({ path, error: 'timeout' });
    });

    req.end();
  });
}

async function testLocal() {
  const endpoints = ['/', '/api/health'];
  
  for (const endpoint of endpoints) {
    await testLocalEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 Local backend test complete!');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('🔧 Backend: http://localhost:5001');
  console.log('✅ Try logging in at: http://localhost:3000/signin');
}

testLocal();
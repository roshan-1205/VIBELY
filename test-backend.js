// Simple test script to check backend status
const https = require('https');

console.log('Testing VIBELY backend...');

// Test health endpoint
const options = {
  hostname: 'vibely-backend.onrender.com',
  port: 443,
  path: '/api/health',
  method: 'GET',
  timeout: 10000
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Backend is working!');
    } else {
      console.log('❌ Backend has issues');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  
  if (error.code === 'ENOTFOUND') {
    console.log('🔍 DNS resolution failed - backend might not be deployed');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('🔍 Connection refused - backend might be down');
  } else if (error.code === 'TIMEOUT') {
    console.log('🔍 Request timeout - backend might be sleeping (Render free tier)');
  }
});

req.on('timeout', () => {
  console.log('⏰ Request timed out - backend might be sleeping');
  req.destroy();
});

req.end();

// Also test the root endpoint
setTimeout(() => {
  console.log('\nTesting root endpoint...');
  
  const rootOptions = {
    hostname: 'vibely-backend.onrender.com',
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 10000
  };
  
  const rootReq = https.request(rootOptions, (res) => {
    console.log(`Root Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Root Response:', data);
    });
  });
  
  rootReq.on('error', (error) => {
    console.error('❌ Root request failed:', error.message);
  });
  
  rootReq.end();
}, 2000);
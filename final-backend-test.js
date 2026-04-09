// Final test with longer timeout for newly started service
const https = require('https');

console.log('🎯 Final backend test - Backend should be ready now!\n');

function testWithLongTimeout() {
  console.log('Testing: https://vibely-backend.onrender.com/api/health');
  console.log('⏰ Using 30-second timeout for newly started service...\n');
  
  const options = {
    hostname: 'vibely-backend.onrender.com',
    port: 443,
    path: '/api/health',
    method: 'GET',
    timeout: 30000, // 30 seconds
    headers: {
      'User-Agent': 'VIBELY-Final-Test/1.0',
      'Accept': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`🎉 SUCCESS! Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    
    res.on('end', () => {
      console.log('\n📋 Response:');
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
        
        if (json.status === 'OK') {
          console.log('\n🎉 BACKEND IS WORKING PERFECTLY!');
          console.log('✅ Your login should now work at: https://vibely-1205.web.app/signin');
          console.log('✅ Try creating an account at: https://vibely-1205.web.app/signup');
        }
      } catch (e) {
        console.log(data);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ Still having issues: ${error.message}`);
    console.log('\n🔍 This might mean:');
    console.log('1. Service is still starting up (wait 2-3 more minutes)');
    console.log('2. There might be a deployment configuration issue');
    console.log('3. Check Render dashboard for any error messages');
  });

  req.on('timeout', () => {
    console.log('⏰ Still timing out after 30 seconds');
    console.log('\n🤔 The service might need more time to fully start');
    console.log('💡 Try visiting https://vibely-backend.onrender.com/api/health in your browser');
    req.destroy();
  });

  req.end();
}

testWithLongTimeout();
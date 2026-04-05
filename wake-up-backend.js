// Script to wake up the Render backend service
const https = require('https');

console.log('🚀 Attempting to wake up VIBELY backend...');
console.log('⏰ This may take 30-60 seconds for Render free tier...\n');

let attempts = 0;
const maxAttempts = 6;
const delay = 10000; // 10 seconds between attempts

function testBackend() {
  attempts++;
  console.log(`Attempt ${attempts}/${maxAttempts}: Pinging backend...`);
  
  const options = {
    hostname: 'vibely-backend.onrender.com',
    port: 443,
    path: '/api/health',
    method: 'GET',
    timeout: 15000 // 15 second timeout
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Response received! Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('🎉 Backend is awake and working!');
        console.log('Response:', data);
        console.log('\n✅ You can now try logging in at: https://vibely-1205.web.app/signin');
        process.exit(0);
      } else {
        console.log('⚠️ Backend responded but with error status');
        console.log('Response:', data);
        retryOrExit();
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ Attempt ${attempts} failed: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🔍 Backend URL not found - check deployment');
      process.exit(1);
    }
    
    retryOrExit();
  });

  req.on('timeout', () => {
    console.log(`⏰ Attempt ${attempts} timed out (backend still waking up...)`);
    req.destroy();
    retryOrExit();
  });

  req.end();
}

function retryOrExit() {
  if (attempts >= maxAttempts) {
    console.log('\n❌ Backend failed to wake up after multiple attempts');
    console.log('\n🛠️ Next steps:');
    console.log('1. Go to Render dashboard: https://render.com/dashboard');
    console.log('2. Click on "vibely-backend" service');
    console.log('3. Check the "Logs" tab for errors');
    console.log('4. Try "Manual Deploy" → "Deploy latest commit"');
    console.log('5. Wait 3-5 minutes and try again');
    process.exit(1);
  }
  
  console.log(`⏳ Waiting ${delay/1000} seconds before next attempt...\n`);
  setTimeout(testBackend, delay);
}

// Start the wake-up process
testBackend();
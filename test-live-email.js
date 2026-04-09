#!/usr/bin/env node

/**
 * Live Email Test Script
 * Tests email functionality with the running backend server
 */

const https = require('https');
const http = require('http');

console.log('🧪 Testing Live Email Functionality...\n');

// Test registration endpoint to trigger welcome email
async function testRegistrationEmail() {
  return new Promise((resolve, reject) => {
    const testUser = {
      firstName: 'EmailTest',
      lastName: 'User',
      email: 'roshankumarsingh021@gmail.com',
      password: 'TestPassword123'
    };

    const postData = JSON.stringify(testUser);

    const options = {
      hostname: 'localhost',
      port: 5001, // Using port 5001 as per .env
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📧 Testing registration email...');
    console.log('🔗 POST http://localhost:5001/api/auth/register');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 201 || res.statusCode === 400) {
            if (response.success) {
              console.log('✅ Registration successful - Welcome email should be sent');
              console.log('📧 Check inbox for welcome email');
            } else if (response.message && response.message.includes('already exists')) {
              console.log('ℹ️  User already exists - this is expected for testing');
              console.log('📧 Testing login instead...');
              testLoginEmail().then(resolve).catch(reject);
              return;
            } else {
              console.log('⚠️  Registration response:', response.message);
            }
          } else {
            console.log('❌ Registration failed:', res.statusCode, response);
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Response parsing error:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      console.log('💡 Make sure backend server is running on port 5001');
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test login endpoint to trigger login alert email
async function testLoginEmail() {
  return new Promise((resolve, reject) => {
    const loginData = {
      email: 'roshankumarsingh021@gmail.com',
      password: 'TestPassword123'
    };

    const postData = JSON.stringify(loginData);

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('🔐 Testing login alert email...');
    console.log('🔗 POST http://localhost:5001/api/auth/login');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Login successful - Login alert email should be sent');
            console.log('📧 Check inbox for login alert email');
          } else {
            console.log('⚠️  Login response:', response.message);
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Response parsing error:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Check if backend is running
async function checkBackendStatus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };

    console.log('🔍 Checking backend server status...');
    console.log('🔗 GET http://localhost:5001/api/health');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend server is running');
          resolve(true);
        } else {
          console.log('⚠️  Backend server responded with status:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Backend server is not running:', error.message);
      console.log('💡 Start backend with: cd backend && npm run dev');
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Backend server timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main test function
async function runLiveEmailTest() {
  try {
    const backendRunning = await checkBackendStatus();
    
    if (!backendRunning) {
      console.log('\n❌ Cannot test emails - backend server not running');
      console.log('🚀 Start backend server first:');
      console.log('   cd backend && npm run dev');
      return;
    }

    console.log('\n📧 Testing live email functionality...\n');

    // Test registration (which triggers welcome email)
    await testRegistrationEmail();

    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Live Email Test Summary:');
    console.log('===========================');
    console.log('✅ Backend server is running');
    console.log('✅ Email endpoints are accessible');
    console.log('📧 Emails should be sent to: roshankumarsingh021@gmail.com');
    
    console.log('\n📬 Check your email inbox for:');
    console.log('1. Welcome email (if registration was successful)');
    console.log('2. Login alert email (if login was successful)');
    
    console.log('\n💡 Next Steps:');
    console.log('==============');
    console.log('1. Check email inbox and spam folder');
    console.log('2. Try registering a new user via frontend');
    console.log('3. Test login to see security alerts');
    console.log('4. Monitor backend console for email logs');

  } catch (error) {
    console.error('❌ Live email test failed:', error.message);
  }
}

// Run the test
runLiveEmailTest();
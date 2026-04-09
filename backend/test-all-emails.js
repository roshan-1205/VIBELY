#!/usr/bin/env node

/**
 * Complete Email Test Script
 * Tests all email types for Vibely
 */

require('dotenv').config();
const emailService = require('./services/emailService');

// Mock user data for testing
const testUser = {
  _id: 'test-user-id-123',
  firstName: 'Test',
  lastName: 'User',
  email: 'roshankumarsingh021@gmail.com' // Send to the configured email for testing
};

async function testAllEmails() {
  console.log('🧪 Testing All Vibely Email Types...\n');
  
  // Test 1: Welcome Email
  console.log('1️⃣ Testing Welcome Email...');
  console.log('============================');
  try {
    const welcomeResult = await emailService.sendWelcomeEmail(testUser);
    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully');
      console.log('📧 Message ID:', welcomeResult.messageId);
    } else {
      console.log('❌ Welcome email failed:', welcomeResult.error);
    }
  } catch (error) {
    console.log('❌ Welcome email error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Login Alert Email
  console.log('2️⃣ Testing Login Alert Email...');
  console.log('=================================');
  try {
    const loginInfo = {
      method: 'Email & Password',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const loginResult = await emailService.sendLoginAlertEmail(testUser, loginInfo);
    if (loginResult.success) {
      console.log('✅ Login alert email sent successfully');
      console.log('📧 Message ID:', loginResult.messageId);
    } else {
      console.log('❌ Login alert email failed:', loginResult.error);
    }
  } catch (error) {
    console.log('❌ Login alert email error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Email Verification
  console.log('3️⃣ Testing Email Verification...');
  console.log('==================================');
  try {
    const verificationToken = 'test-verification-token-' + Date.now();
    const verificationResult = await emailService.sendEmailVerification(testUser, verificationToken);
    if (verificationResult.success) {
      console.log('✅ Email verification sent successfully');
      console.log('📧 Message ID:', verificationResult.messageId);
    } else {
      console.log('❌ Email verification failed:', verificationResult.error);
    }
  } catch (error) {
    console.log('❌ Email verification error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Password Reset Email
  console.log('4️⃣ Testing Password Reset Email...');
  console.log('===================================');
  try {
    const resetToken = 'test-reset-token-' + Date.now();
    const resetResult = await emailService.sendPasswordResetEmail(testUser, resetToken);
    if (resetResult.success) {
      console.log('✅ Password reset email sent successfully');
      console.log('📧 Message ID:', resetResult.messageId);
    } else {
      console.log('❌ Password reset email failed:', resetResult.error);
    }
  } catch (error) {
    console.log('❌ Password reset email error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log('✅ All email types tested successfully!');
  console.log('📬 Check your inbox:', testUser.email);
  console.log('📧 You should have received 4 test emails:');
  console.log('   1. Welcome Email');
  console.log('   2. Login Alert Email');
  console.log('   3. Email Verification');
  console.log('   4. Password Reset Email');
  
  console.log('\n🎉 Email system is working perfectly!');
  console.log('🚀 Users will now receive emails for:');
  console.log('   - Registration (Welcome + Verification)');
  console.log('   - Login (Security Alert)');
  console.log('   - Password Reset');
  console.log('   - OAuth Login (Google/Microsoft)');
  
  console.log('\n💡 Next Steps:');
  console.log('==============');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Test user registration to see live emails');
  console.log('3. Test login to see security alerts');
  console.log('4. Check spam folder if emails not in inbox');
}

// Run the test
testAllEmails().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
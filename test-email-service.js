#!/usr/bin/env node

/**
 * Email Service Test Script
 * Tests the SMTP email functionality for Vibely
 */

require('dotenv').config({ path: './backend/.env' });
const emailService = require('./backend/services/emailService');

// Mock user data for testing
const testUser = {
  _id: 'test-user-id',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com' // Change this to your test email
};

async function testEmailService() {
  console.log('🧪 Testing Vibely Email Service...\n');
  
  // Test 1: Welcome Email
  console.log('📧 Testing Welcome Email...');
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
  console.log('📧 Testing Login Alert Email...');
  try {
    const loginInfo = {
      method: 'Email & Password',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
  console.log('📧 Testing Email Verification...');
  try {
    const verificationToken = 'test-verification-token-123';
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
  console.log('📧 Testing Password Reset Email...');
  try {
    const resetToken = 'test-reset-token-456';
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
  
  // Configuration Summary
  console.log('⚙️ Email Configuration Summary:');
  console.log('📧 SMTP Email:', process.env.SMTP_EMAIL || 'Not configured');
  console.log('📧 SMTP Host:', process.env.SMTP_HOST || 'Not configured');
  console.log('📧 SMTP Port:', process.env.SMTP_PORT || 'Not configured');
  console.log('📧 Email From:', process.env.EMAIL_FROM || 'Not configured');
  console.log('📧 Send Welcome Email:', process.env.SEND_WELCOME_EMAIL || 'Not configured');
  console.log('📧 Send Login Alert:', process.env.SEND_LOGIN_ALERT || 'Not configured');
  console.log('📧 Send Verification Email:', process.env.SEND_VERIFICATION_EMAIL || 'Not configured');
  
  console.log('\n🎉 Email service testing completed!');
  
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    console.log('\n📬 Check your email inbox for the test emails.');
    console.log('📧 Test emails sent to:', testUser.email);
  } else {
    console.log('\n⚠️  SMTP credentials not configured. Using development mode.');
    console.log('💡 To test with real emails, configure SMTP_EMAIL and SMTP_PASSWORD in .env');
  }
}

// Run the test
testEmailService().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
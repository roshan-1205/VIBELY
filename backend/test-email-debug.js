#!/usr/bin/env node

/**
 * Email Service Debug Script
 * Diagnoses email sending issues for Vibely
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Diagnosing Email Service Issues...\n');

// Step 1: Check Environment Variables
console.log('📋 Environment Variables Check:');
console.log('================================');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL ? '✅ Set' : '❌ Missing');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Not set');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not set');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
console.log('SEND_WELCOME_EMAIL:', process.env.SEND_WELCOME_EMAIL || 'Not set');
console.log('SEND_LOGIN_ALERT:', process.env.SEND_LOGIN_ALERT || 'Not set');

console.log('\n🔧 SMTP Configuration Test:');
console.log('============================');

// Step 2: Test SMTP Connection
async function testSMTPConnection() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    return transporter;
  } catch (error) {
    console.log('❌ SMTP connection failed:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('Invalid login')) {
      console.log('\n🔑 Gmail Authentication Issue:');
      console.log('- Make sure 2-factor authentication is enabled on Gmail');
      console.log('- Use App Password instead of regular password');
      console.log('- Generate new App Password: https://myaccount.google.com/apppasswords');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🌐 Network/DNS Issue:');
      console.log('- Check internet connection');
      console.log('- Verify firewall settings');
      console.log('- Try different network if possible');
    }
    
    return null;
  }
}

// Step 3: Test Email Sending
async function testEmailSending(transporter) {
  if (!transporter) {
    console.log('❌ Cannot test email sending - SMTP connection failed');
    return;
  }

  try {
    console.log('\n📧 Testing email sending...');
    
    const testEmail = {
      from: process.env.EMAIL_FROM || '"Vibely Test" <noreply@vibely.com>',
      to: process.env.SMTP_EMAIL, // Send test email to yourself
      subject: '🧪 Vibely Email Test - ' + new Date().toLocaleString(),
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>This is a test email from Vibely to verify SMTP functionality.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
        <p><strong>SMTP Email:</strong> ${process.env.SMTP_EMAIL}</p>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
      `,
      text: `
        Email Test Successful!
        
        This is a test email from Vibely to verify SMTP functionality.
        Time: ${new Date().toLocaleString()}
        From: ${process.env.EMAIL_FROM}
        SMTP Email: ${process.env.SMTP_EMAIL}
        
        If you received this email, your SMTP configuration is working correctly!
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your inbox:', process.env.SMTP_EMAIL);
    
  } catch (error) {
    console.log('❌ Email sending failed:', error.message);
    
    if (error.message.includes('Daily sending quota exceeded')) {
      console.log('\n📊 Gmail Quota Issue:');
      console.log('- Gmail has daily sending limits');
      console.log('- Wait 24 hours or use different email service');
    }
    
    if (error.message.includes('Message rejected')) {
      console.log('\n🚫 Message Rejected:');
      console.log('- Check email content for spam triggers');
      console.log('- Verify sender reputation');
    }
  }
}

// Step 4: Test Email Service Class
async function testEmailServiceClass() {
  try {
    console.log('\n🔧 Testing Email Service Class:');
    console.log('===============================');
    
    const emailService = require('./services/emailService');
    
    // Test with mock user
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: process.env.SMTP_EMAIL // Send to yourself for testing
    };
    
    console.log('📧 Testing welcome email...');
    const result = await emailService.sendWelcomeEmail(testUser);
    
    if (result.success) {
      console.log('✅ Welcome email test successful!');
      console.log('📧 Message ID:', result.messageId);
    } else {
      console.log('❌ Welcome email test failed:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Email Service Class error:', error.message);
  }
}

// Run all tests
async function runDiagnostics() {
  const transporter = await testSMTPConnection();
  await testEmailSending(transporter);
  await testEmailServiceClass();
  
  console.log('\n🎯 Diagnosis Summary:');
  console.log('=====================');
  
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    console.log('✅ SMTP credentials are configured');
  } else {
    console.log('❌ SMTP credentials missing in .env file');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('==============');
  console.log('1. Check your email inbox for test messages');
  console.log('2. If no emails received, check spam folder');
  console.log('3. Verify Gmail app password is correct');
  console.log('4. Try registering a new user to test live emails');
  console.log('5. Check backend console logs during registration/login');
  
  console.log('\n🔧 Quick Fixes:');
  console.log('===============');
  console.log('- Restart backend server: npm run dev');
  console.log('- Check .env file has correct SMTP credentials');
  console.log('- Verify Gmail 2FA and app password setup');
  console.log('- Test with different email address');
}

runDiagnostics().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});
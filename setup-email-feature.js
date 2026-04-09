#!/usr/bin/env node

/**
 * Email Feature Setup Script for Vibely
 * Configures and tests the SMTP email functionality
 */

const fs = require('fs');
const path = require('path');

console.log('📧 Vibely Email Feature Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Read current .env configuration
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('\n📋 Current Email Configuration:');
console.log('================================');

// Extract email-related variables
const emailVars = [
  'EMAIL_SERVICE',
  'SMTP_HOST', 
  'SMTP_PORT',
  'SMTP_EMAIL',
  'SMTP_PASSWORD',
  'EMAIL_FROM',
  'SEND_WELCOME_EMAIL',
  'SEND_LOGIN_ALERT',
  'SEND_VERIFICATION_EMAIL'
];

emailVars.forEach(varName => {
  const match = envContent.match(new RegExp(`^${varName}=(.*)$`, 'm'));
  const value = match ? match[1] : 'Not configured';
  
  if (varName === 'SMTP_PASSWORD' && value !== 'Not configured') {
    console.log(`${varName}=${'*'.repeat(value.length)}`);
  } else {
    console.log(`${varName}=${value}`);
  }
});

console.log('\n🔧 Email Feature Status:');
console.log('========================');

// Check if SMTP is configured
const smtpEmail = envContent.match(/^SMTP_EMAIL=(.*)$/m);
const smtpPassword = envContent.match(/^SMTP_PASSWORD=(.*)$/m);

if (smtpEmail && smtpPassword && smtpEmail[1] && smtpPassword[1]) {
  console.log('✅ SMTP credentials configured');
  console.log('✅ Ready to send real emails');
  
  console.log('\n📧 Configured Email Types:');
  const welcomeEnabled = envContent.includes('SEND_WELCOME_EMAIL=true');
  const loginEnabled = envContent.includes('SEND_LOGIN_ALERT=true');
  const verificationEnabled = envContent.includes('SEND_VERIFICATION_EMAIL=true');
  
  console.log(`📩 Welcome Email: ${welcomeEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`🔐 Login Alert: ${loginEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`✨ Email Verification: ${verificationEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  
} else {
  console.log('⚠️  SMTP credentials not fully configured');
  console.log('📧 Will use development mode (Ethereal Email)');
}

console.log('\n🧪 Testing Email Service:');
console.log('=========================');

// Test the email service
try {
  require('dotenv').config({ path: envPath });
  const emailService = require('./backend/services/emailService');
  
  console.log('✅ Email service loaded successfully');
  
  // Test configuration
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    console.log('✅ SMTP configuration detected');
    console.log('📧 Email service will use Gmail SMTP');
  } else {
    console.log('⚠️  Using development mode');
    console.log('📧 Email service will use Ethereal Email for testing');
  }
  
} catch (error) {
  console.log('❌ Error loading email service:', error.message);
}

console.log('\n🚀 Next Steps:');
console.log('==============');

if (!smtpEmail || !smtpPassword || !smtpEmail[1] || !smtpPassword[1]) {
  console.log('1. 📧 Configure SMTP credentials in backend/.env:');
  console.log('   SMTP_EMAIL=your-email@gmail.com');
  console.log('   SMTP_PASSWORD=your-app-password');
  console.log('');
  console.log('2. 🔐 For Gmail, create an app password:');
  console.log('   - Enable 2-factor authentication');
  console.log('   - Generate app-specific password');
  console.log('   - Use app password (not regular password)');
  console.log('');
}

console.log('3. 🧪 Test the email functionality:');
console.log('   node test-email-service.js');
console.log('');
console.log('4. 🚀 Start the application:');
console.log('   cd backend && npm run dev');
console.log('   cd frontend && npm run dev');
console.log('');
console.log('5. 📝 Test user registration and login to see emails in action');

console.log('\n📚 Documentation:');
console.log('=================');
console.log('📖 Full documentation: EMAIL_FEATURE_DOCUMENTATION.md');
console.log('🔧 Configuration guide: backend/.env.example');
console.log('🧪 Test script: test-email-service.js');

console.log('\n✨ Email feature setup completed!');

// Check if nodemailer is installed
try {
  require('nodemailer');
  console.log('✅ Nodemailer dependency is installed');
} catch (error) {
  console.log('❌ Nodemailer not found. Install with: npm install nodemailer');
}
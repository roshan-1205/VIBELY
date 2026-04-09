const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Check if SMTP credentials are provided
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        console.log('📧 Initializing SMTP email service...');
        
        this.transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true' || false,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // Verify SMTP connection
        this.verifyConnection();
        console.log('✅ SMTP email service initialized successfully');
      } else {
        // Fallback to development mode with Ethereal Email
        console.log('📧 SMTP credentials not found, using development mode...');
        this.createTestAccount();
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.transporter = null;
    }
  }

  async verifyConnection() {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        console.log('✅ SMTP connection verified successfully');
      }
    } catch (error) {
      console.error('❌ SMTP connection verification failed:', error);
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      console.log('📧 Email service initialized with test account');
      console.log('📧 Test email credentials:', {
        user: testAccount.user,
        pass: testAccount.pass
      });
    } catch (error) {
      console.error('❌ Failed to create test email account:', error);
      this.transporter = null;
    }
  }

  async sendEmail(options) {
    try {
      if (!this.transporter) {
        console.log('📧 Email would be sent:', options);
        return { success: true, messageId: 'console-log' };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vibely" <noreply@vibely.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully to:', options.to);
      console.log('📧 Subject:', options.subject);
      
      if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_EMAIL) {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    if (process.env.SEND_WELCOME_EMAIL !== 'true') {
      console.log('📧 Welcome email disabled in configuration');
      return { success: true, messageId: 'disabled' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Vibely!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .feature-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature-item { margin: 10px 0; padding: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Vibely!</h1>
            <p>Your social journey starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Welcome to the Vibely community! We're thrilled to have you join our platform where connections come alive.</p>
            
            <div class="feature-list">
              <h3>🚀 What you can do on Vibely:</h3>
              <div class="feature-item">📝 <strong>Create Posts:</strong> Share your thoughts, photos, and videos</div>
              <div class="feature-item">👥 <strong>Connect:</strong> Follow friends and discover new people</div>
              <div class="feature-item">🔔 <strong>Stay Updated:</strong> Get real-time notifications</div>
              <div class="feature-item">💬 <strong>Chat:</strong> Send private messages to your connections</div>
              <div class="feature-item">🎨 <strong>Personalize:</strong> Customize your profile and express yourself</div>
            </div>
            
            <p>Ready to get started? Click the button below to explore Vibely:</p>
            <a href="${process.env.FRONTEND_URL}/hero" class="button">Start Your Journey</a>
            
            <p>If you have any questions or need help, our support team is always here to assist you.</p>
            <p>Happy connecting! 🌟</p>
          </div>
          <div class="footer">
            <p>© 2026 Vibely. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to Vibely!
      
      Hello ${user.firstName}!
      
      Welcome to the Vibely community! We're thrilled to have you join our platform where connections come alive.
      
      What you can do on Vibely:
      - Create Posts: Share your thoughts, photos, and videos
      - Connect: Follow friends and discover new people  
      - Stay Updated: Get real-time notifications
      - Chat: Send private messages to your connections
      - Personalize: Customize your profile and express yourself
      
      Ready to get started? Visit: ${process.env.FRONTEND_URL}/hero
      
      If you have any questions or need help, our support team is always here to assist you.
      
      Happy connecting!
      
      © 2026 Vibely. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🎉 Welcome to Vibely - Your Social Journey Begins!',
      html,
      text
    });
  }

  async sendLoginAlertEmail(user, loginInfo = {}) {
    if (process.env.SEND_LOGIN_ALERT !== 'true') {
      console.log('📧 Login alert email disabled in configuration');
      return { success: true, messageId: 'disabled' };
    }

    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Login Alert - Vibely</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .login-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          .security-note { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Login Alert</h1>
            <p>Account access notification</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We're writing to let you know that your Vibely account was accessed.</p>
            
            <div class="login-info">
              <h3>📋 Login Details:</h3>
              <p><strong>Time:</strong> ${loginTime}</p>
              <p><strong>Account:</strong> ${user.email}</p>
              <p><strong>Login Method:</strong> ${loginInfo.method || 'Email & Password'}</p>
              ${loginInfo.ipAddress ? `<p><strong>IP Address:</strong> ${loginInfo.ipAddress}</p>` : ''}
              ${loginInfo.userAgent ? `<p><strong>Device:</strong> ${loginInfo.userAgent}</p>` : ''}
            </div>
            
            <div class="security-note">
              <h3>🛡️ Security Notice:</h3>
              <p>If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.</p>
            </div>
            
            <p><strong>Was this you?</strong></p>
            <p>✅ If yes, you can safely ignore this email.</p>
            <p>❌ If no, please take action immediately:</p>
            <ul>
              <li>Change your password right away</li>
              <li>Review your account activity</li>
              <li>Contact our support team if needed</li>
            </ul>
            
            <a href="${process.env.FRONTEND_URL}/profile/security" class="button">Secure My Account</a>
            
            <p>Stay safe and keep your account secure! 🔒</p>
          </div>
          <div class="footer">
            <p>© 2026 Vibely. All rights reserved.</p>
            <p>This security alert was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Login Alert - Vibely
      
      Hello ${user.firstName}!
      
      We're writing to let you know that your Vibely account was accessed.
      
      Login Details:
      - Time: ${loginTime}
      - Account: ${user.email}
      - Login Method: ${loginInfo.method || 'Email & Password'}
      ${loginInfo.ipAddress ? `- IP Address: ${loginInfo.ipAddress}` : ''}
      
      Security Notice:
      If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.
      
      Was this you?
      ✅ If yes, you can safely ignore this email.
      ❌ If no, please take action immediately:
      - Change your password right away
      - Review your account activity  
      - Contact our support team if needed
      
      Secure your account: ${process.env.FRONTEND_URL}/profile/security
      
      Stay safe and keep your account secure!
      
      © 2026 Vibely. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🔐 Login Alert - Vibely Account Access',
      html,
      text
    });
  }

  async sendEmailVerification(user, verificationToken) {
    if (process.env.SEND_VERIFICATION_EMAIL !== 'true') {
      console.log('📧 Email verification disabled in configuration');
      return { success: true, messageId: 'disabled' };
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - Vibely</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .verification-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Almost There!</h1>
            <p>Just one more step to join Vibely</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Thank you for signing up for Vibely! We're excited to have you join our community.</p>
            
            <div class="verification-box">
              <h3>📧 Verify Your Email Address</h3>
              <p>To complete your registration and start using all of Vibely's features, please verify your email address by clicking the button below:</p>
            </div>
            
            <a href="${verificationUrl}" class="button">Verify My Email</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-family: monospace;">${verificationUrl}</p>
            
            <p><strong>⏰ This verification link will expire in 24 hours.</strong></p>
            
            <p>Once verified, you'll have full access to:</p>
            <ul>
              <li>✅ Create and share posts</li>
              <li>✅ Connect with friends</li>
              <li>✅ Real-time messaging</li>
              <li>✅ Personalized notifications</li>
              <li>✅ And much more!</li>
            </ul>
            
            <p>Welcome to the Vibely family! 🎉</p>
          </div>
          <div class="footer">
            <p>© 2026 Vibely. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Verify Your Email - Vibely
      
      Hello ${user.firstName}!
      
      Thank you for signing up for Vibely! We're excited to have you join our community.
      
      To complete your registration and start using all of Vibely's features, please verify your email address:
      ${verificationUrl}
      
      This verification link will expire in 24 hours.
      
      Once verified, you'll have full access to:
      - Create and share posts
      - Connect with friends
      - Real-time messaging
      - Personalized notifications
      - And much more!
      
      Welcome to the Vibely family!
      
      © 2026 Vibely. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: '✨ Verify Your Email - Welcome to Vibely!',
      html,
      text
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Vibely</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .security-note { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Secure your Vibely account</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We received a request to reset your password for your Vibely account.</p>
            
            <div class="security-note">
              <h3>🛡️ Security Notice:</h3>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <p>To reset your password, click the button below:</p>
            <a href="${resetUrl}" class="button">Reset My Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-family: monospace;">${resetUrl}</p>
            
            <p><strong>⏰ This link will expire in 10 minutes for security reasons.</strong></p>
            
            <p>After resetting your password, you'll be automatically logged in to your account.</p>
            
            <p>Stay secure! 🔒</p>
          </div>
          <div class="footer">
            <p>© 2026 Vibely. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Reset Your Password - Vibely
      
      Hello ${user.firstName}!
      
      We received a request to reset your password for your Vibely account.
      
      Security Notice:
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      
      To reset your password, visit:
      ${resetUrl}
      
      This link will expire in 10 minutes for security reasons.
      
      After resetting your password, you'll be automatically logged in to your account.
      
      Stay secure!
      
      © 2026 Vibely. All rights reserved.
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🔐 Reset Your Vibely Password',
      html,
      text
    });
  }
}

module.exports = new EmailService();
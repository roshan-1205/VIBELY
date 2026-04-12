# Deployment Guide

This guide will help you deploy the Vibely application to production.

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database Configuration
MONGODB_URI=your-mongodb-atlas-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-session-secret-change-in-production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration (SMTP)
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Your App Name <your-email@gmail.com>"

# Email Features
SEND_WELCOME_EMAIL=true
SEND_LOGIN_ALERT=true
SEND_VERIFICATION_EMAIL=true

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Production Deployment

### Backend (Render/Railway/Heroku)

1. **Connect your GitHub repository**
2. **Set environment variables** in your hosting platform dashboard
3. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`

### Frontend (Vercel/Netlify)

1. **Connect your GitHub repository**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `out` (for static export) or `.next` (for server-side)
   - Root Directory: `frontend`
3. **Set environment variables** in your hosting platform

## Security Checklist

- [ ] All `.env` files are excluded from Git
- [ ] Strong JWT secrets are used (32+ characters)
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] OAuth redirect URIs are updated for production

## Database Setup

### MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your server IP addresses
4. Get the connection string and add it to `MONGODB_URI`

## Email Service Setup

### Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `SMTP_PASSWORD`

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-backend-domain.com/api/auth/google/callback`
6. Copy Client ID and Secret to your environment variables

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Configure redirect URIs
4. Copy Application ID and Secret to your environment variables

## Post-Deployment

1. **Test all authentication flows**
2. **Verify email sending works**
3. **Test file uploads**
4. **Check real-time features**
5. **Monitor logs for errors**

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `FRONTEND_URL` in backend environment
2. **Database Connection**: Verify MongoDB URI and IP whitelist
3. **Email Not Sending**: Check SMTP credentials and Gmail settings
4. **OAuth Errors**: Verify redirect URIs and client credentials
5. **File Upload Issues**: Ensure upload directories exist and have proper permissions

### Monitoring

- Set up error logging (Sentry, LogRocket)
- Monitor database performance
- Set up uptime monitoring
- Configure backup strategies
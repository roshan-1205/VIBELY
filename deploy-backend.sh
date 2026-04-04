#!/bin/bash

echo "🚀 VIBELY Backend Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the VIBELY root directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Dependencies installed successfully!"
echo ""
echo "🌐 Deployment Options:"
echo "1. Railway: https://railway.app"
echo "2. Render: https://render.com"
echo "3. Heroku: Use 'git subtree push --prefix=backend heroku main'"
echo ""
echo "📋 Don't forget to set environment variables:"
echo "- NODE_ENV=production"
echo "- MONGODB_URI=your-mongodb-connection-string"
echo "- JWT_SECRET=your-jwt-secret"
echo "- SESSION_SECRET=your-session-secret"
echo "- FRONTEND_URL=your-frontend-url"
echo ""
echo "✅ Backend is ready for deployment!"
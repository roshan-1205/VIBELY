#!/bin/bash

# VIBELY Backend Deployment Script
echo "🚀 Starting VIBELY Backend Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Deployment Checklist:${NC}"
echo "1. Database setup (MongoDB Atlas or Supabase)"
echo "2. Render account setup"
echo "3. Environment variables configuration"
echo "4. Repository connection"
echo "5. Frontend API URL update"
echo ""

# Check if required files exist
echo -e "${YELLOW}🔍 Checking required files...${NC}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ server.js not found${NC}"
    exit 1
fi

if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ .env.example not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files found${NC}"

# Generate secrets
echo -e "${YELLOW}🔐 Generating production secrets...${NC}"
node generate-secrets.js

echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Set up your database:"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - OR Supabase: https://supabase.com"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to: VIBELY/backend"
echo "   - Build command: npm install"
echo "   - Start command: npm start"
echo ""
echo "3. Set these environment variables in Render:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=your-database-connection-string"
echo "   JWT_SECRET=<use generated secret above>"
echo "   SESSION_SECRET=<use generated secret above>"
echo "   FRONTEND_URL=https://vibely-1205.web.app"
echo ""
echo "4. Update frontend API URL to your Render service URL"
echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
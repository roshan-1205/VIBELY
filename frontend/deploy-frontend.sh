#!/bin/bash

# VIBELY Frontend Deployment Script
echo "🚀 Deploying VIBELY Frontend to Firebase..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Building production version...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    
    echo -e "${YELLOW}🚀 Deploying to Firebase Hosting...${NC}"
    npx firebase-tools deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo -e "${BLUE}Your app is live at: https://vibely-1205.web.app${NC}"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
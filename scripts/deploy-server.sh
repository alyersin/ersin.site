#!/bin/bash

# Server-side deployment script
# This script is executed on the server via SSH from GitHub Actions
# It can also be run manually: bash scripts/deploy-server.sh

set -e  # Exit on error

echo "🚀 Starting deployment on server..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /var/www/ersin-site || { 
    echo -e "${RED}❌ Directory /var/www/ersin-site not found${NC}"
    exit 1
}

echo -e "${YELLOW}📦 Pulling latest changes from GitHub...${NC}"
git fetch origin
git reset --hard origin/main

echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm ci --production

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 application...${NC}"
pm2 restart ersin-site || pm2 start ecosystem.config.js

echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 3

echo -e "${YELLOW}✅ Checking application status...${NC}"
pm2 status

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Application logs:"
pm2 logs ersin-site --lines 20 --nostream


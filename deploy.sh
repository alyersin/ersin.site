#!/bin/bash

# Deployment script for ersin.home.ro
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root${NC}"
   exit 1
fi

# Navigate to project directory
cd /var/www/ersin-site || { echo -e "${RED}Directory /var/www/ersin-site not found${NC}"; exit 1; }

echo -e "${YELLOW}📦 Pulling latest changes...${NC}"
git pull origin main || echo "Warning: Git pull failed, continuing..."

echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install --production

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
pm2 restart ersin-site || pm2 start ecosystem.config.js

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs ersin-site"


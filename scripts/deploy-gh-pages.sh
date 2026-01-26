#!/bin/bash

# Deploy to GitHub Pages script
# This script builds and deploys the app to GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== GitHub Pages Deployment Script ===${NC}"

# Get the repository name from git remote or use default
REPO_NAME=$(basename -s .git $(git config --get remote.origin.url) 2>/dev/null || echo "case-strategy")
echo -e "Repository name: ${GREEN}${REPO_NAME}${NC}"

# Set the base path
export NEXT_PUBLIC_BASE_PATH="/${REPO_NAME}"
echo -e "Base path: ${GREEN}${NEXT_PUBLIC_BASE_PATH}${NC}"

# Clean previous build
echo -e "\n${YELLOW}Cleaning previous build...${NC}"
rm -rf .next out

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build the application
echo -e "\n${YELLOW}Building application...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}Build failed: 'out' directory not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}Build successful!${NC}"
echo -e "Static files are in the ${GREEN}out/${NC} directory"

# Ask user if they want to deploy
echo -e "\n${YELLOW}Deployment Options:${NC}"
echo "1. The GitHub Actions workflow will automatically deploy when you push to main"
echo "2. Or manually deploy using: npx gh-pages -d out --dotfiles"
echo ""
echo -e "${GREEN}To enable GitHub Pages:${NC}"
echo "1. Go to your repository on GitHub"
echo "2. Navigate to Settings > Pages"
echo "3. Under 'Build and deployment', select 'GitHub Actions'"
echo ""
echo -e "Your site will be available at: ${GREEN}https://oshikryu.github.io/${REPO_NAME}/${NC}"

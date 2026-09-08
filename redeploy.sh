#!/bin/bash
# ==============================================================================
# Quick Zero-Downtime Redeploy Script for WoexStore_V2 on Ubuntu EC2
# ==============================================================================

set -e

echo "🔄 [1/4] Pulling latest code from Git repository..."
git pull origin main

echo "⚡ [2/4] Updating & Reloading Backend..."
cd backend
npm install --production=false
pm2 reload woexstore-backend

echo "📦 [3/4] Rebuilding Frontend..."
cd ../frontend
npm install
npm run build

echo "♻️ [4/4] Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ WoexStore_V2 updated successfully!"

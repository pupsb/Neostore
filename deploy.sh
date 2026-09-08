#!/bin/bash
# ==============================================================================
# Automated Production Deployment Script for WoexStore_V2 on Ubuntu 24.04 EC2
# ==============================================================================
# Target Domain: neostoreofficial.store
# Elastic IP: 13.205.126.70
# Backend Port: 8080
# ==============================================================================

set -e

echo "🚀 [1/6] Updating Ubuntu packages & installing dependencies..."
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx build-essential

echo "📦 [2/6] Installing Node.js 20 LTS & PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
sudo npm install -g pm2

echo "⚙️ [3/6] Setting up WoexStore Backend..."
APP_DIR="$(pwd)"
CD_BACKEND="$APP_DIR/backend"
CD_FRONTEND="$APP_DIR/frontend"

if [ -d "$CD_BACKEND" ]; then
    cd "$CD_BACKEND"
    echo "Installing backend dependencies..."
    npm install --production=false
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️ WARNING: .env file not found in backend directory!"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo "Copied .env.example to .env. Please update your secret keys!"
        fi
    fi

    echo "Starting backend process with PM2..."
    pm2 stop woexstore-backend || true
    pm2 start index.js --name "woexstore-backend"
    pm2 save
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true
else
    echo "❌ Error: Backend folder not found at $CD_BACKEND"
    exit 1
fi

echo "🎨 [4/6] Building WoexStore Frontend..."
if [ -d "$CD_FRONTEND" ]; then
    cd "$CD_FRONTEND"
    echo "Installing frontend dependencies..."
    npm install
    echo "Building production frontend assets..."
    npm run build
else
    echo "❌ Error: Frontend folder not found at $CD_FRONTEND"
    exit 1
fi

echo "🌐 [5/6] Configuring Nginx Web Server..."
NGINX_CONF="/etc/nginx/sites-available/neostore"

sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name neostoreofficial.store www.neostoreofficial.store 13.205.126.70;

    # Client body size limit for file uploads (e.g. products, images)
    client_max_body_size 20M;

    # Frontend Single Page App (SPA) setup
    location / {
        root /home/ubuntu/WoexStore_V2/WoexStore_V2/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Node Express Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve backend uploads directly if needed
    location /uploads/ {
        alias /home/ubuntu/WoexStore_V2/WoexStore_V2/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Unlink default and link new site configuration
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/neostore

echo "Testing Nginx configuration..."
sudo nginx -t
sudo systemctl restart nginx

echo "🔒 [6/6] Requesting SSL Certificate via Certbot..."
echo "Do you want to run SSL setup now for neostoreofficial.store? (y/n)"
read -r -p "Run Certbot SSL? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    sudo certbot --nginx -d neostoreofficial.store -d www.neostoreofficial.store --non-interactive --agree-tos --redirect -m neostoreofficials@gmail.com
fi

echo "=============================================================================="
echo "✅ WoexStore_V2 Deployment Completed Successfully!"
echo "Backend Running: PM2 (Port 8080)"
echo "Frontend Serving: Nginx (/dist)"
echo "Public Access: http://13.205.126.70 or https://neostoreofficial.store"
echo "=============================================================================="

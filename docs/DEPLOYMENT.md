# Complete Deployment Guide: Git Push to SSL Certificate

Complete step-by-step guide from pushing code to having a fully working HTTPS site.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Linux server (Ubuntu/Debian recommended)
- [ ] SSH access to your server
- [ ] Sudo/root access on server
- [ ] Domain `ersin.home.ro` DNS A record pointing to your server IP
- [ ] GitHub repository: `alyersin/ersin.site`
- [ ] Router access (for port forwarding)

---

## Part 1: Initial Server Setup (One-Time)

### Step 1.1: Update System

```bash
ssh your-username@your-server-ip

# Update system packages
sudo apt update && sudo apt upgrade -y
```

### Step 1.2: Install Required Software

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx

# Install UFW firewall
sudo apt install -y ufw
```

### Step 1.3: Verify Installations

```bash
node --version   # Should show v18.x or higher
npm --version
pm2 --version
git --version
nginx -v
certbot --version
```

### Step 1.4: Configure Firewall

**CRITICAL: Open these ports:**

```bash
# Allow SSH (IMPORTANT - do this first or you'll lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP (port 80) - Required for Certbot SSL validation
sudo ufw allow 80/tcp

# Allow HTTPS (port 443) - Required for secure connections
sudo ufw allow 443/tcp

# Allow your app port (3045) - Optional, only if you want direct access
sudo ufw allow 3045/tcp

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status
# Should show: 22, 80, 443, 3045 as ALLOW
```

**Port Reference:**
- **Port 22:** SSH access
- **Port 80:** HTTP (required for SSL certificate validation)
- **Port 443:** HTTPS (secure connections)
- **Port 3045:** Your Next.js app (internal, behind Nginx)

### Step 1.5: Create Application Directory

```bash
# Create directory in home folder (no sudo needed)
mkdir -p ~/web-apps/ersin-site
mkdir -p ~/.pm2/logs

# Verify
ls -la ~/web-apps
```

---

## Part 2: Configure Router Port Forwarding

**IMPORTANT:** If your server is behind a router, you MUST forward ports 80 and 443.

### Step 2.1: Find Server's Local IP

On your server:

```bash
# Get server's local IP address
ip addr show | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.200/24

# Or simpler
hostname -I | awk '{print $1}'
# Example: 192.168.1.200
```

**Write down this IP address** - you'll need it for port forwarding.

### Step 2.2: Configure Router

1. **Open router admin panel:**
   - Open browser
   - Go to: `http://192.168.1.1` (or your router's IP)
   - Login with admin credentials

2. **Find Port Forwarding section:**
   - Look for: **Port Forwarding**, **Virtual Server**, **NAT Forwarding**, or **Applications & Gaming**

3. **Add HTTP port forward:**
   - **Service Name:** `HTTP`
   - **External Port:** `80`
   - **Internal IP:** Your server's local IP (e.g., `192.168.1.200`)
   - **Internal Port:** `80`
   - **Protocol:** `TCP`
   - Click **Save** or **Apply**

4. **Add HTTPS port forward:**
   - **Service Name:** `HTTPS`
   - **External Port:** `443`
   - **Internal IP:** Same server IP
   - **Internal Port:** `443`
   - **Protocol:** `TCP`
   - Click **Save** or **Apply**

### Step 2.3: Verify Port Forwarding

From your local machine (not server):

```bash
# Test HTTP
curl http://ersin.home.ro
# Should return HTML (or connection if DNS not ready)

# If connection works, port forwarding is correct
```

---

## Part 3: Setup GitHub Secrets for CI/CD

### Step 3.1: Generate SSH Key (if needed)

On your local machine:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions"
# Press Enter to accept default location
# Press Enter for no passphrase (or set one)

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy this entire output
```

### Step 3.2: Add SSH Key to Server

On your server:

```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key to authorized_keys
nano ~/.ssh/authorized_keys
# Paste your public key, save and exit (Ctrl+X, Y, Enter)

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
```

### Step 3.3: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/alyersin/ersin.site`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   **Secret 1: SERVER_HOST**
   - Name: `SERVER_HOST`
   - Value: `5.14.42.24` (your server's public IP)

   **Secret 2: SERVER_USER**
   - Name: `SERVER_USER`
   - Value: `hurmuzache` (your SSH username)

   **Secret 3: SERVER_SSH_KEY**
   - Name: `SERVER_SSH_KEY`
   - Value: Your **private** SSH key (the entire content of `~/.ssh/id_ed25519`)

   **Secret 4: SERVER_PORT** (optional)
   - Name: `SERVER_PORT`
   - Value: `22` (default SSH port)

### Step 3.4: Test SSH Connection

From your local machine:

```bash
# Test SSH connection
ssh your-username@your-server-ip
# Should connect without password prompt
```

---

## Part 4: First Deployment

### Step 4.1: Clone Repository on Server

On your server:

```bash
cd ~/web-apps/ersin-site

# Clone repository
git clone https://github.com/alyersin/ersin.site.git .

# Verify files
ls -la
# Should show: package.json, src/, etc.
```

### Step 4.2: Install Dependencies

```bash
cd ~/web-apps/ersin-site

# Install all dependencies (needed for build)
npm install

# Verify Next.js is installed
ls -la node_modules/.bin/next
```

### Step 4.3: Create Environment File

```bash
cd ~/web-apps/ersin-site

# Create .env.production
nano .env.production
```

Add this content:

```env
NODE_ENV=production
PORT=3045
HOSTNAME=0.0.0.0
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

**Save and exit** (Ctrl+X, Y, Enter)

**Note:** For Gmail, use an App Password, not your regular password. Generate at: https://myaccount.google.com/apppasswords

### Step 4.4: Build Application

```bash
cd ~/web-apps/ersin-site

# Build the application
npm run build

# Verify .next directory was created
ls -la .next
# Should show directories: static/, server/, BUILD_ID, etc.
```

### Step 4.5: Start with PM2

```bash
cd ~/web-apps/ersin-site

# Set environment variables
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Load .env.production
set -a
source .env.production
set +a

# Verify PORT is set
echo "PORT is: $PORT"
# Should show: PORT is: 3045

# Start PM2
pm2 start ecosystem.config.js --update-env

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually: sudo env PATH=... pm2 startup systemd -u your-username --hp /home/your-username)

# Verify PM2 is running
pm2 status
# Should show: ersin-site | online

# Check logs
pm2 logs ersin-site --lines 10
# Should show: Local: http://localhost:3045
```

### Step 4.6: Verify App is Running

```bash
# Check if port 3045 is listening
sudo netstat -tlnp | grep 3045
# Should show: tcp ... 0.0.0.0:3045 ... node

# Test locally
curl http://localhost:3045
# Should return HTML content
```

---

## Part 5: Configure Nginx

### Step 5.1: Create Nginx Configuration

On your server:

```bash
cd ~/web-apps/ersin-site

# Get your username
USERNAME=$(whoami)
echo "Using username: $USERNAME"

# Create HTTP-only config (before SSL)
sudo nano /etc/nginx/sites-available/ersin.home.ro
```

Paste this configuration (replace `YOUR_USERNAME` with your actual username):

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream Next.js server
upstream nextjs_backend {
    server 127.0.0.1:3045;
    keepalive 64;
}

# HTTP server (before SSL)
server {
    listen 80;
    listen [::]:80;
    server_name ersin.home.ro www.ersin.home.ro;

    access_log /var/log/nginx/ersin.home.ro.access.log;
    error_log /var/log/nginx/ersin.home.ro.error.log;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Static files (UPDATE YOUR_USERNAME!)
    location /_next/static/ {
        alias /home/YOUR_USERNAME/web-apps/ersin-site/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        alias /home/YOUR_USERNAME/web-apps/ersin-site/public/assets/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API routes
    location /api/ {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # All other requests
    location / {
        limit_req zone=general_limit burst=20 nodelay;
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Save and exit** (Ctrl+X, Y, Enter)

### Step 5.2: Update Static File Paths

```bash
# Replace YOUR_USERNAME automatically
USERNAME=$(whoami)
sudo sed -i "s|/home/YOUR_USERNAME/web-apps/ersin-site|/home/$USERNAME/web-apps/ersin-site|g" /etc/nginx/sites-available/ersin.home.ro

# Verify the change
sudo grep -A 1 "_next/static" /etc/nginx/sites-available/ersin.home.ro
# Should show your actual username, not YOUR_USERNAME
```

### Step 5.3: Enable Nginx Site

```bash
# Create symlink to enable site
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
# Should show: configuration file /etc/nginx/nginx.conf test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5.4: Fix File Permissions

**CRITICAL:** Nginx needs proper permissions to read static files.

```bash
cd ~/web-apps/ersin-site

# Fix parent directory permissions (CRITICAL!)
# Nginx needs execute permission on ALL parent directories to traverse the path
chmod 755 ~
chmod 755 ~/web-apps
chmod 755 ~/web-apps/ersin-site

# Fix .next and public directory permissions
# Directories need 755 (readable and executable)
find .next -type d -exec chmod 755 {} \;
find public -type d -exec chmod 755 {} \;

# Files need 644 (readable)
find .next -type f -exec chmod 644 {} \;
find public -type f -exec chmod 644 {} \;

# Verify
ls -ld ~ ~/web-apps ~/web-apps/ersin-site
# All should show: drwxr-xr-x (755)

# Reload Nginx
sudo systemctl reload nginx
```

**Permission Reference:**
- **Directories:** `755` = `rwxr-xr-x` (owner can read/write/execute, others can read/execute)
- **Files:** `644` = `rw-r--r--` (owner can read/write, others can read)

### Step 5.5: Test HTTP Access

```bash
# Test from server
curl -I http://ersin.home.ro
# Should return: HTTP/1.1 200 OK

# Test from your local machine
curl http://ersin.home.ro
# Should return HTML content
```

**Verify in browser:** Open `http://ersin.home.ro` - site should load correctly!

---

## Part 6: Get SSL Certificate

### Step 6.1: Install Certbot (if not already installed)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### Step 6.2: Get SSL Certificate

```bash
# Get certificate for root domain (skip www if DNS not configured)
sudo certbot --nginx -d ersin.home.ro
```

**Follow the prompts:**

1. **Email address:** Enter your email (e.g., `alyersin@yahoo.com`)
   - Used for renewal and security notices
   - Press Enter

2. **Terms of Service:** 
   - Type `A` and press Enter to agree

3. **Share email with EFF:**
   - Type `Y` or `N` (your choice)
   - Press Enter

4. **Redirect HTTP to HTTPS:**
   - Type `2` and press Enter (recommended)
   - This automatically redirects all HTTP traffic to HTTPS

Certbot will:
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Automatically update your Nginx config for HTTPS
- ✅ Set up automatic renewal

### Step 6.3: Verify SSL Certificate

```bash
# Check certificate status
sudo certbot certificates
# Should show: Certificate Name: ersin.home.ro, Expiry Date, etc.

# Test auto-renewal
sudo certbot renew --dry-run
# Should show: The dry run was successful

# Check certbot timer is active
sudo systemctl status certbot.timer
# Should show: active (running)
```

### Step 6.4: Test HTTPS

```bash
# Test from server
curl -I https://ersin.home.ro
# Should return: HTTP/2 200

# Test from your local machine
curl -I https://ersin.home.ro
# Should return: HTTP/2 200
```

### Step 6.5: Verify in Browser

1. **Open HTTPS:** `https://ersin.home.ro`
   - ✅ Should show green padlock (🔒)
   - ✅ Site loads correctly
   - ✅ URL shows `https://`

2. **Test HTTP redirect:** `http://ersin.home.ro`
   - ✅ Should automatically redirect to `https://ersin.home.ro`

**Note:** You're using **TLS 1.2 and TLS 1.3** (modern, secure), not SSL. See [SSL_VS_TLS_EXPLAINED.md](./SSL_VS_TLS_EXPLAINED.md) for details.

---

## Part 7: Future Deployments (CI/CD)

After the first deployment, all future updates are automatic!

### Step 7.1: Make Changes Locally

```bash
# On your local machine
cd your-project-folder

# Make your code changes
# Edit files, add features, etc.

# Commit changes
git add .
git commit -m "Your commit message"
```

### Step 7.2: Push to GitHub

```bash
# Push to main branch
git push origin main
```

### Step 7.3: Automatic Deployment

GitHub Actions will automatically:
1. ✅ Build your application
2. ✅ Deploy to server via SSH
3. ✅ Install dependencies
4. ✅ Build the app
5. ✅ Restart PM2
6. ✅ Verify deployment

**Monitor deployment:**
- Go to: `https://github.com/alyersin/ersin.site/actions`
- Click on the latest workflow run
- Watch it deploy automatically!

### Step 7.4: Verify Deployment

After CI/CD completes:

```bash
# SSH into server
ssh your-username@your-server-ip

# Check PM2 status
pm2 status
# Should show: ersin-site | online

# Check logs
pm2 logs ersin-site --lines 10

# Test site
curl https://ersin.home.ro
```

---

## 📋 Complete Checklist

### Initial Setup
- [ ] Server updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Node.js 18.x installed
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] Firewall configured (ports 22, 80, 443, 3045)
- [ ] Router port forwarding configured (80 → server, 443 → server)

### GitHub Setup
- [ ] SSH key generated
- [ ] SSH key added to server
- [ ] GitHub Secrets configured (SERVER_HOST, SERVER_USER, SERVER_SSH_KEY)

### First Deployment
- [ ] Repository cloned on server
- [ ] Dependencies installed: `npm install`
- [ ] `.env.production` created with correct values
- [ ] Application built: `npm run build`
- [ ] PM2 started and running: `pm2 status`
- [ ] App listening on port 3045: `netstat -tlnp | grep 3045`

### Nginx Setup
- [ ] Nginx config created at `/etc/nginx/sites-available/ersin.home.ro`
- [ ] Static file paths updated with correct username
- [ ] Site enabled: symlink created
- [ ] Nginx config tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] File permissions fixed (parent dirs: 755, files: 644)
- [ ] HTTP works: `curl http://ersin.home.ro`

### SSL Certificate
- [ ] Certbot installed
- [ ] SSL certificate obtained: `sudo certbot --nginx -d ersin.home.ro`
- [ ] Certificate verified: `sudo certbot certificates`
- [ ] Auto-renewal tested: `sudo certbot renew --dry-run`
- [ ] HTTPS works: `curl https://ersin.home.ro`
- [ ] Browser shows green padlock
- [ ] HTTP redirects to HTTPS

---

## 🎉 You're Done!

Your site is now:
- ✅ Deployed and running on PM2
- ✅ Accessible via domain: `https://ersin.home.ro`
- ✅ Secured with TLS 1.2/1.3
- ✅ Auto-deploying on every git push
- ✅ Auto-renewing SSL certificate

---

## 🔧 Quick Reference Commands

### PM2
```bash
pm2 status              # Check status
pm2 logs ersin-site     # View logs
pm2 restart ersin-site  # Restart app
pm2 stop ersin-site     # Stop app
pm2 delete ersin-site   # Remove from PM2
pm2 save                # Save current PM2 config
```

### Nginx
```bash
sudo nginx -t                    # Test config
sudo systemctl reload nginx      # Reload (no downtime)
sudo systemctl restart nginx     # Restart
sudo tail -f /var/log/nginx/ersin.home.ro.error.log  # View errors
sudo tail -f /var/log/nginx/ersin.home.ro.access.log # View access logs
```

### SSL/Certbot
```bash
sudo certbot certificates        # List certificates
sudo certbot renew              # Renew manually
sudo certbot renew --dry-run    # Test renewal
sudo systemctl status certbot.timer  # Check auto-renewal status
```

### Firewall
```bash
sudo ufw status                  # Check firewall status
sudo ufw allow 80/tcp           # Allow HTTP
sudo ufw allow 443/tcp          # Allow HTTPS
sudo ufw reload                 # Reload firewall
```

### Ports
```bash
sudo netstat -tlnp | grep 3045  # Check if app port is listening
sudo netstat -tlnp | grep :80    # Check if HTTP port is listening
sudo netstat -tlnp | grep :443   # Check if HTTPS port is listening
```

### Deployment
```bash
# Manual deployment (if CI/CD fails)
cd ~/web-apps/ersin-site
git pull
npm install
npm run build
pm2 restart ersin-site
```

---

## 🆘 Troubleshooting

If something goes wrong, check:
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and fixes

---

**Congratulations! Your site is live and secure! 🎉**

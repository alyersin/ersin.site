# Deployment Guide for ersin.home.ro

Complete step-by-step guide to deploy your Next.js site on your Linux server.

## 🚀 Quick Start (TL;DR)

If you're experienced and want to deploy quickly, here's the fast track:

```bash
# 1. Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git ufw
sudo npm install -g pm2

# 2. Setup firewall
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable

# 3. Create app directory
sudo mkdir -p /var/www/ersin-site /var/log/pm2
sudo chown -R $USER:$USER /var/www/ersin-site /var/log/pm2

# 4. Clone and setup
cd /var/www/ersin-site
git clone https://github.com/alyersin/ersin.site.git .
npm install --production
npm run build

# 5. Create .env.production
nano .env.production
# Add: NODE_ENV=production, PORT=3000, EMAIL_USER=..., EMAIL_PASS=...

# 6. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the command it outputs

# 7. Setup Nginx
sudo cp nginx/ersin.home.ro.conf /etc/nginx/sites-available/ersin.home.ro
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 8. Get SSL certificate
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro

# Done! Visit https://ersin.home.ro
```

**Pre-deployment checklist:**
- [ ] Domain `ersin.home.ro` DNS A record points to your server IP
- [ ] You have SSH access to your server
- [ ] You have sudo/root access
- [ ] Gmail App Password generated (for contact form)
- [ ] Server has at least 1GB RAM and 10GB disk space

**For detailed explanations, continue reading below ↓**

---

## Prerequisites

- Linux server (Ubuntu/Debian recommended)
- Domain `ersin.home.ro` pointing to your server's IP
- SSH access to your server
- Root or sudo access

---

## Step 1: Server Initial Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Software
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install Git (if not already installed)
sudo apt install -y git

# Install UFW firewall
sudo apt install -y ufw
```

### 1.3 Verify Installations
```bash
node --version  # Should show v18.x or higher
npm --version
pm2 --version
nginx -v
certbot --version
```

---

## Step 2: Configure Firewall

```bash
# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 3: Domain DNS Configuration

Ensure your domain `ersin.home.ro` has these DNS records:

**A Record:**
```
ersin.home.ro    A    YOUR_SERVER_IP
```

**Optional - WWW subdomain:**
```
www.ersin.home.ro    A    YOUR_SERVER_IP
```

**Verify DNS propagation:**
```bash
dig ersin.home.ro +short
# Should return your server IP
```

---

## Step 4: Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/ersin-site
sudo chown -R $USER:$USER /var/www/ersin-site

# Create log directories
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

---

## Step 5: Deploy Your Application

### 5.1 Clone Repository
```bash
cd /var/www/ersin-site
git clone https://github.com/alyersin/ersin.site.git .

# Or if you prefer to upload files manually:
# Use scp, rsync, or SFTP to upload your project files
```

### 5.2 Install Dependencies
```bash
cd /var/www/ersin-site
npm install --production
```

### 5.3 Build Application
```bash
npm run build
```

### 5.4 Create Environment File
```bash
nano /var/www/ersin-site/.env.production
```

Add these variables:
```env
NODE_ENV=production
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

**Save and exit** (Ctrl+X, then Y, then Enter)

---

## Step 6: Configure PM2

### 6.1 Copy PM2 Config
```bash
# Copy ecosystem.config.js to server (if not already there)
# Or create it manually:
sudo nano /var/www/ersin-site/ecosystem.config.js
```

### 6.2 Start Application with PM2
```bash
cd /var/www/ersin-site
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the command it outputs (usually involves sudo)
```

### 6.3 Verify PM2 Status
```bash
pm2 status
pm2 logs ersin-site
# Press Ctrl+C to exit logs
```

---

## Step 7: Configure Nginx

### 7.1 Copy Nginx Configuration
```bash
# Copy nginx/ersin.home.ro.conf to server
sudo cp nginx/ersin.home.ro.conf /etc/nginx/sites-available/ersin.home.ro

# Or create it manually:
sudo nano /etc/nginx/sites-available/ersin.home.ro
# Paste the configuration from nginx/ersin.home.ro.conf
```

### 7.2 Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 8: Setup SSL Certificate

### 8.1 Obtain SSL Certificate
```bash
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro
```

**Follow the prompts:**
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)
- Certbot will automatically configure Nginx

### 8.2 Test Auto-Renewal
```bash
# Test renewal process
sudo certbot renew --dry-run

# Certbot automatically renews certificates, but verify:
sudo systemctl status certbot.timer
```

---

## Step 9: Verify Deployment

### 9.1 Check Services
```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check if app is running on port 3000
curl http://localhost:3000
```

### 9.2 Test Website
- Open browser: `https://ersin.home.ro`
- Test contact form
- Check browser console for errors
- Verify SSL certificate (green padlock)

---

## Step 10: Security Hardening

### 10.1 Setup Fail2Ban (Optional but Recommended)
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 10.2 Configure SSH Security
```bash
sudo nano /etc/ssh/sshd_config
```

**Recommended settings:**
```
PermitRootLogin no
PasswordAuthentication no  # If using SSH keys
PubkeyAuthentication yes
```

```bash
sudo systemctl restart sshd
```

### 10.3 Setup Automatic Security Updates
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Step 11: Monitoring & Maintenance

### 11.1 PM2 Monitoring
```bash
# View logs
pm2 logs ersin-site

# Monitor resources
pm2 monit

# Restart app
pm2 restart ersin-site

# Stop app
pm2 stop ersin-site
```

### 11.2 Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/ersin.home.ro.access.log

# Error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

---

## Updating Your Application

When you make changes:

```bash
cd /var/www/ersin-site

# Pull latest changes
git pull

# Install new dependencies (if any)
npm install --production

# Rebuild
npm run build

# Restart PM2
pm2 restart ersin-site

# Check status
pm2 logs ersin-site --lines 50
```

---

## Troubleshooting

### App not starting
```bash
pm2 logs ersin-site
# Check for errors in logs
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000

# Restart app
pm2 restart ersin-site
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew manually if needed
sudo certbot renew
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/ersin-site
sudo chown -R $USER:$USER /var/log/pm2
```

---

## Quick Reference Commands

```bash
# PM2
pm2 status
pm2 restart ersin-site
pm2 logs ersin-site
pm2 stop ersin-site
pm2 start ersin-site

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# SSL
sudo certbot renew
sudo certbot certificates

# Logs
pm2 logs ersin-site
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH secured (key-based auth, root login disabled)
- [ ] SSL certificate installed and auto-renewing
- [ ] Environment variables set (not in git)
- [ ] PM2 auto-start configured
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled
- [ ] Fail2Ban installed (optional)
- [ ] Automatic security updates enabled
- [ ] Regular backups configured (recommended)

---

## CI/CD Setup (Optional but Recommended)

For automatic deployments when you push to GitHub, see **[CI_CD_SETUP.md](./CI_CD_SETUP.md)**.

This will set up GitHub Actions to automatically:
- Build your application
- Deploy to your server on every push to `main`
- Restart PM2
- Verify deployment

**Benefits:**
- ✅ Push code → Auto-deploy (no manual SSH needed)
- ✅ Consistent deployments
- ✅ Deployment history in GitHub
- ✅ Easy rollback

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs ersin-site`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/ersin.home.ro.error.log`
3. Verify DNS: `dig ersin.home.ro`
4. Test locally: `curl http://localhost:3000`
5. For CI/CD issues, see [CI_CD_SETUP.md](./CI_CD_SETUP.md)


# First-Time Deployment Guide

This guide covers your **first deployment** to set up everything from scratch.

## 🎯 Two Approaches

### Approach 1: CI/CD Handles Everything (Recommended)

The GitHub Actions workflow will automatically clone your repository if it doesn't exist. You just need to set up the server infrastructure first.

### Approach 2: Manual Clone First

Clone the repository manually, then use CI/CD for updates.

---

## ✅ What You Need to Do FIRST (Before CI/CD)

Regardless of which approach you choose, you **must** set up these on your server:

### 1. Install Required Software

SSH into your server and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (for web server)
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx

# Install UFW firewall
sudo apt install -y ufw
```

### 2. Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Verify Installations

```bash
node --version   # Should show v18.x or higher
npm --version
pm2 --version
git --version
nginx -v
```

---

## 🚀 Approach 1: Let CI/CD Clone (Easiest)

### Step 1: Set Up GitHub Secrets

Go to your GitHub repo → Settings → Secrets → Actions, and add:
- `SERVER_HOST` - Your server IP or domain
- `SERVER_USER` - Your SSH username
- `SERVER_SSH_KEY` - Your SSH private key

### Step 2: Push Code

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Step 3: Watch GitHub Actions

1. Go to **Actions** tab in GitHub
2. Watch the workflow run
3. It will automatically:
   - Clone your repository to `/var/www/ersin-site`
   - Install dependencies
   - Build the app
   - Start PM2

### Step 4: Create Environment File

After the first deployment, SSH into your server:

```bash
ssh your-username@your-server-ip
nano /var/www/ersin-site/.env.production
```

Add:
```env
NODE_ENV=production
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Save and restart PM2:
```bash
pm2 restart ersin-site
```

### Step 5: Configure Nginx & SSL

Follow Steps 7-8 from `docs/DEPLOYMENT.md` to set up Nginx and SSL.

---

## 🛠️ Approach 2: Manual Clone First

If you prefer to clone manually first:

### Step 1: Create Directory

```bash
ssh your-username@your-server-ip
sudo mkdir -p /var/www/ersin-site
sudo chown -R $USER:$USER /var/www/ersin-site
```

### Step 2: Clone Repository

```bash
cd /var/www/ersin-site
git clone https://github.com/alyersin/ersin.site.git .
```

### Step 3: Create Environment File

```bash
nano .env.production
# Add your environment variables
```

### Step 4: Install & Build

```bash
npm install --production
npm run build
```

### Step 5: Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: Configure Nginx & SSL

Follow Steps 7-8 from `docs/DEPLOYMENT.md`.

### Step 7: Future Updates

After manual setup, CI/CD will handle future updates automatically!

---

## 📋 Quick Comparison

| Task | Manual Clone | CI/CD Clone |
|------|-------------|-------------|
| Clone repo | ✅ You do it | ✅ Workflow does it |
| Install deps | ✅ You do it | ✅ Workflow does it |
| Build app | ✅ You do it | ✅ Workflow does it |
| Start PM2 | ✅ You do it | ✅ Workflow does it |
| Create .env | ✅ You do it | ✅ You do it (after) |
| Setup Nginx | ✅ You do it | ✅ You do it (after) |
| Setup SSL | ✅ You do it | ✅ You do it (after) |

**Note:** `.env.production`, Nginx, and SSL always need manual setup (they're server-specific).

---

## 🎯 Recommendation

**Use Approach 1 (CI/CD Clone)** because:
- ✅ Less manual work
- ✅ Consistent deployment process
- ✅ Future updates are automatic
- ✅ You still need to do server setup anyway

Just make sure you:
1. ✅ Install Node.js, PM2, Git, Nginx first
2. ✅ Set up GitHub Secrets
3. ✅ Push code and let CI/CD clone it
4. ✅ Create `.env.production` after first deployment
5. ✅ Configure Nginx & SSL

---

## 🆘 Troubleshooting

### CI/CD fails to clone?

- Check SSH key is correct in GitHub Secrets
- Verify server has Git installed: `git --version`
- Check directory permissions: `sudo chown -R $USER:$USER /var/www/ersin-site`

### App doesn't start?

- Check PM2 logs: `pm2 logs ersin-site`
- Verify `.env.production` exists
- Check if port 3000 is available: `netstat -tlnp | grep 3000`

---

**Next Steps:** After first deployment, see `docs/DEPLOYMENT.md` for complete setup guide.


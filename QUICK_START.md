# Quick Start Deployment Guide

## 🚀 Fast Track Deployment (TL;DR)

### On Your Server:

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

---

## 📋 Pre-Deployment Checklist

Before starting, ensure:

- [ ] Domain `ersin.home.ro` DNS A record points to your server IP
- [ ] You have SSH access to your server
- [ ] You have sudo/root access
- [ ] Gmail App Password generated (for contact form)
- [ ] Server has at least 1GB RAM and 10GB disk space

---

## 🔧 Important Configuration Files

1. **PM2 Config**: `ecosystem.config.js` - Process management
2. **Nginx Config**: `nginx/ersin.home.ro.conf` - Web server & reverse proxy
3. **Environment**: `.env.production` - Secrets (create on server, don't commit!)
4. **Deploy Script**: `deploy.sh` - Quick updates

---

## 📝 Step-by-Step Details

See `DEPLOYMENT.md` for complete detailed instructions.

---

## 🔐 Security Notes

- Never commit `.env.production` to git
- Use Gmail App Password (not regular password)
- Keep server updated: `sudo apt update && sudo apt upgrade`
- Monitor logs regularly: `pm2 logs ersin-site`

---

## 🆘 Common Issues

**502 Bad Gateway**: App not running → `pm2 restart ersin-site`

**SSL not working**: Check DNS → `dig ersin.home.ro`

**Contact form fails**: Check email credentials in `.env.production`

**Port 3000 in use**: Change PORT in ecosystem.config.js and .env.production


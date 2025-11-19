# Deployment Documentation Index

Complete guide to deploying and maintaining your Next.js site on your Linux server.

## 📚 Documentation Files

### 🚀 Getting Started
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide (includes quick start section)

### 🔄 CI/CD & Automation
- **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** - Set up automatic deployments via GitHub Actions

### ⚙️ Configuration
- **[CONTACT_SETUP.md](./CONTACT_SETUP.md)** - Email configuration for contact form
- **[../env.production.example](../env.production.example)** - Environment variables template

### 📋 Configuration Files
- `../ecosystem.config.js` - PM2 process manager configuration
- `../nginx/ersin.home.ro.conf` - Nginx web server configuration
- `../.github/workflows/deploy.yml` - GitHub Actions CI/CD workflow
- `../scripts/deploy-server.sh` - Server-side deployment script
- `../deploy.sh` - Manual deployment script

---

## 🎯 Quick Navigation

### First Time Deployment?
1. Open **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Start with "Quick Start" section for fast setup, or follow detailed steps below
2. Configure email: **[CONTACT_SETUP.md](./CONTACT_SETUP.md)**

### Want Automatic Deployments?
1. Follow **[CI_CD_SETUP.md](./CI_CD_SETUP.md)**
2. Push code → Auto-deploy! 🚀

### Need to Update Manually?
```bash
cd /var/www/ersin-site
./deploy.sh
# or
bash scripts/deploy-server.sh
```

### Troubleshooting?
- See troubleshooting section in **[DEPLOYMENT.md](./DEPLOYMENT.md)**
- Check CI/CD troubleshooting in **[CI_CD_SETUP.md](./CI_CD_SETUP.md)**

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Domain DNS configured (`ersin.home.ro` → server IP)
- [ ] Server has SSH access
- [ ] Server has sudo/root access
- [ ] Gmail App Password generated (for contact form)
- [ ] Server meets requirements (1GB RAM, 10GB disk)

### Initial Setup
- [ ] Node.js 18+ installed
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Certbot installed
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Application directory created (`/var/www/ersin-site`)
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Application built
- [ ] Environment variables set (`.env.production`)
- [ ] PM2 configured and started
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] Website accessible via HTTPS

### Post-Deployment
- [ ] Website loads correctly
- [ ] SSL certificate valid (green padlock)
- [ ] Contact form works
- [ ] PM2 auto-start configured
- [ ] SSL auto-renewal configured
- [ ] Security hardening completed
- [ ] CI/CD configured (optional)

---

## 🔧 Common Tasks

### Update Application
**With CI/CD:** Just push to `main` branch

**Manual:**
```bash
cd /var/www/ersin-site
git pull
npm install --production
npm run build
pm2 restart ersin-site
```

### Check Application Status
```bash
pm2 status
pm2 logs ersin-site
curl http://localhost:3000
```

### Restart Services
```bash
pm2 restart ersin-site
sudo systemctl restart nginx
```

### View Logs
```bash
# Application logs
pm2 logs ersin-site

# Nginx access logs
sudo tail -f /var/log/nginx/ersin.home.ro.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

### Renew SSL Certificate
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 🆘 Need Help?

1. **Deployment Issues:** See troubleshooting in [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **CI/CD Issues:** See troubleshooting in [CI_CD_SETUP.md](./CI_CD_SETUP.md)
3. **Email Issues:** See [CONTACT_SETUP.md](./CONTACT_SETUP.md)
4. **Check logs:** `pm2 logs ersin-site`

---

## 📝 File Structure

```
ersin-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── nginx/
│   └── ersin.home.ro.conf      # Nginx configuration
├── scripts/
│   └── deploy-server.sh        # Server deployment script
├── ecosystem.config.js         # PM2 configuration
├── deploy.sh                   # Manual deployment script
├── DEPLOYMENT.md               # Main deployment guide
├── QUICK_START.md              # Quick reference
├── CI_CD_SETUP.md              # CI/CD setup guide
├── CONTACT_SETUP.md            # Email configuration
├── DEPLOYMENT_INDEX.md          # This file
└── .env.production.example     # Environment template
```

---

## 🎓 Learning Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

**Last Updated:** November 2024


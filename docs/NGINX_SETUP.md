# Nginx Setup Guide for ersin.home.ro

Complete guide to configure Nginx as a reverse proxy for your Next.js application.

## 📋 Prerequisites

- Nginx installed on your server
- Your app running on a port (e.g., 3045)
- Domain `ersin.home.ro` pointing to your server IP

---

## Step 1: Copy Nginx Configuration

### Option A: Copy from repository (if files are on server)

```bash
cd ~/web-apps/ersin-site
sudo cp nginx/ersin.home.ro.conf /etc/nginx/sites-available/ersin.home.ro
```

### Option B: Create manually

```bash
sudo nano /etc/nginx/sites-available/ersin.home.ro
```

Copy the configuration from `nginx/ersin.home.ro.conf` in your repository.

---

## Step 2: Update Port Number

**IMPORTANT:** Update the port to match your app's port (3045):

```bash
sudo nano /etc/nginx/sites-available/ersin.home.ro
```

Find this section and change `3000` to `3045`:

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3045;  # Changed from 3000 to 3045
    keepalive 64;
}
```

**Save and exit** (Ctrl+X, Y, Enter)

---

## Step 3: Enable the Site

```bash
# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/

# Remove default site (optional, but recommended)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

If the test passes, you'll see:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## Step 4: Reload Nginx

```bash
sudo systemctl reload nginx
# or
sudo systemctl restart nginx
```

---

## Step 5: Verify Nginx is Working

```bash
# Check Nginx status
sudo systemctl status nginx

# Test HTTP (should redirect to HTTPS after SSL setup)
curl -I http://ersin.home.ro

# Check Nginx error logs if issues
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

---

## Step 6: Setup SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: **Yes**)
- Certbot will automatically configure Nginx

---

## Step 7: Verify SSL Auto-Renewal

```bash
# Test renewal process
sudo certbot renew --dry-run

# Check certbot timer status
sudo systemctl status certbot.timer
```

---

## 🔧 Quick Port Change

If you need to change the port later:

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/ersin.home.ro

# Change the port in upstream section
# server 127.0.0.1:3045;  (or whatever port you need)

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🆘 Troubleshooting

### Nginx 502 Bad Gateway

**Cause:** App not running or wrong port

**Fix:**
```bash
# Check if app is running
pm2 status

# Check if app is listening on the correct port
sudo netstat -tlnp | grep 3045

# Restart app
pm2 restart ersin-site

# Check Nginx error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

### Port Mismatch

**Cause:** Nginx pointing to wrong port

**Fix:**
```bash
# Check what port your app is using
pm2 logs ersin-site | grep -i port

# Update Nginx config to match
sudo nano /etc/nginx/sites-available/ersin.home.ro
# Change upstream port

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### Nginx Configuration Test Fails

**Fix:**
```bash
# Check for syntax errors
sudo nginx -t

# Common issues:
# - Missing semicolons
# - Wrong file paths
# - Invalid syntax

# View full error
sudo nginx -T 2>&1 | grep -i error
```

### SSL Certificate Issues

**Fix:**
```bash
# Check certificate status
sudo certbot certificates

# Renew manually if needed
sudo certbot renew

# Check DNS is correct
dig ersin.home.ro +short
# Should return your server IP
```

---

## 📝 Configuration File Locations

- **Nginx config:** `/etc/nginx/sites-available/ersin.home.ro`
- **Enabled site:** `/etc/nginx/sites-enabled/ersin.home.ro` (symlink)
- **Access logs:** `/var/log/nginx/ersin.home.ro.access.log`
- **Error logs:** `/var/log/nginx/ersin.home.ro.error.log`
- **SSL certificates:** `/etc/letsencrypt/live/ersin.home.ro/`

---

## ✅ Verification Checklist

- [ ] Nginx config file created at `/etc/nginx/sites-available/ersin.home.ro`
- [ ] Port updated to match your app (3045)
- [ ] Site enabled (symlink created)
- [ ] Nginx configuration test passes (`nginx -t`)
- [ ] Nginx reloaded/restarted
- [ ] App is running on the correct port
- [ ] HTTP redirects to HTTPS (after SSL setup)
- [ ] SSL certificate installed
- [ ] Website accessible at `https://ersin.home.ro`

---

## 🎯 Quick Reference Commands

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/ersin.home.ro

# Test configuration
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx (brief downtime)
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log

# View access logs
sudo tail -f /var/log/nginx/ersin.home.ro.access.log

# SSL certificate renewal
sudo certbot renew
```

---

**Next Steps:** After Nginx is configured, your site will be accessible via `https://ersin.home.ro`!


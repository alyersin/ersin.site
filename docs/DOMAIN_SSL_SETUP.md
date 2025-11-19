# Domain & SSL Setup Guide for ersin.home.ro

Complete guide to set up your domain and HTTPS.

## 🎯 What We'll Do

1. Configure DNS (point domain to your server)
2. Set up Nginx (reverse proxy from domain to your app on port 3045)
3. Get SSL certificate (Let's Encrypt)
4. Access via `https://ersin.home.ro`

---

## Step 1: Configure DNS

### 1.1 Log into Your ISP's DNS Management

Go to your ISP's DNS management panel (where you manage `ersin.home.ro`).

### 1.2 Add A Record

Create an **A Record**:

```
Type: A
Name: ersin (or @ for root domain)
Value: YOUR_SERVER_IP (e.g., 5.14.42.24)
TTL: 3600 (or default)
```

**Optional - Add WWW subdomain:**
```
Type: A
Name: www
Value: YOUR_SERVER_IP (same IP)
TTL: 3600
```

### 1.3 Verify DNS Propagation

Wait a few minutes, then verify:

```bash
# From your local machine or server
dig ersin.home.ro +short
# Should return your server IP

# Or use nslookup
nslookup ersin.home.ro
# Should show your server IP
```

---

## Step 2: Setup Nginx (Reverse Proxy)

### 2.1 Copy Nginx Config to Server

On your server:

```bash
cd ~/web-apps/ersin-site

# Copy config file
sudo cp nginx/ersin.home.ro.conf /etc/nginx/sites-available/ersin.home.ro
```

### 2.2 Update Port and Paths

```bash
sudo nano /etc/nginx/sites-available/ersin.home.ro
```

**Update these:**

1. **Port** (line ~11): Should already be `3045` after our update
   ```nginx
   server 127.0.0.1:3045;
   ```

2. **Static file paths** (lines ~77 and ~83): Replace `YOUR_USERNAME` with your actual username
   ```nginx
   alias /home/YOUR_USERNAME/web-apps/ersin-site/.next/static/;
   alias /home/YOUR_USERNAME/web-apps/ersin-site/public/assets/;
   ```

   **Example:** If your username is `hurmuzache`:
   ```nginx
   alias /home/hurmuzache/web-apps/ersin-site/.next/static/;
   alias /home/hurmuzache/web-apps/ersin-site/public/assets/;
   ```

**Save and exit** (Ctrl+X, Y, Enter)

### 2.3 Enable the Site

```bash
# Create symlink to enable
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

Should show:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.4 Reload Nginx

```bash
sudo systemctl reload nginx
```

### 2.5 Verify Nginx is Working

```bash
# Check Nginx status
sudo systemctl status nginx

# Test HTTP (will redirect to HTTPS after SSL setup)
curl -I http://ersin.home.ro

# Check Nginx error logs if issues
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

---

## Step 3: Test HTTP Access

Before SSL, test that HTTP works:

```bash
# From your server
curl -I http://ersin.home.ro

# Should redirect to HTTPS (after SSL setup) or show your site
```

From your browser, try: `http://ersin.home.ro`

**Note:** After SSL setup, HTTP will automatically redirect to HTTPS.

---

## Step 4: Setup SSL Certificate (Let's Encrypt)

### 4.1 Install Certbot (if not already installed)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Get SSL Certificate

```bash
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro
```

**Follow the prompts:**

1. **Email address:** Enter your email (for renewal notices)
2. **Terms of service:** Type `A` to agree
3. **Share email:** Your choice (Y or N)
4. **Redirect HTTP to HTTPS:** Type `2` to redirect (recommended)

Certbot will:
- Automatically get SSL certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

### 4.3 Verify SSL Certificate

```bash
# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### 4.4 Verify Auto-Renewal is Enabled

```bash
sudo systemctl status certbot.timer
# Should be active
```

---

## Step 5: Verify Everything Works

### 5.1 Test HTTPS

```bash
# From server
curl -I https://ersin.home.ro

# Should return 200 OK with SSL
```

### 5.2 Test in Browser

Open: `https://ersin.home.ro`

You should see:
- ✅ Green padlock (🔒) in address bar
- ✅ Your website loads
- ✅ URL shows `https://` (not `http://`)

### 5.3 Test HTTP Redirect

Open: `http://ersin.home.ro`

Should automatically redirect to `https://ersin.home.ro`

---

## 🔧 Quick Setup Script

Run this on your server (replace `YOUR_USERNAME`):

```bash
# Set your username
USERNAME="hurmuzache"  # Change this!

# Copy Nginx config
cd ~/web-apps/ersin-site
sudo cp nginx/ersin.home.ro.conf /etc/nginx/sites-available/ersin.home.ro

# Update paths in config
sudo sed -i "s|/home/YOUR_USERNAME/web-apps/ersin-site|/home/$USERNAME/web-apps/ersin-site|g" /etc/nginx/sites-available/ersin.home.ro

# Enable site
sudo ln -s /etc/nginx/sites-available/ersin.home.ro /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test and reload
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro

# Verify
curl -I https://ersin.home.ro
```

---

## 🆘 Troubleshooting

### DNS Not Resolving

```bash
# Check DNS
dig ersin.home.ro +short
# Should return your server IP

# If not, wait a bit (DNS can take up to 48 hours, usually minutes)
# Or check DNS settings in your ISP panel
```

### Nginx 502 Bad Gateway

**Cause:** Nginx can't reach your app on port 3045

**Fix:**
```bash
# Check if app is running
pm2 status

# Check if port 3045 is listening
sudo netstat -tlnp | grep 3045

# Restart app if needed
pm2 restart ersin-site

# Check Nginx error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

### SSL Certificate Fails

**Error:** `Failed to obtain certificate`

**Common causes:**
1. DNS not pointing to server yet
2. Port 80 not open in firewall
3. Domain already has certificate

**Fix:**
```bash
# Make sure port 80 is open
sudo ufw allow 80/tcp

# Check DNS
dig ersin.home.ro +short

# Try certbot again
sudo certbot --nginx -d ersin.home.ro -d www.ersin.home.ro
```

### Wrong Static File Paths

**Error:** 404 for static files (`/_next/static/...`)

**Fix:**
```bash
# Check your username
whoami

# Update Nginx config with correct path
sudo nano /etc/nginx/sites-available/ersin.home.ro
# Update the alias paths to match your actual directory

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

## ✅ Checklist

- [ ] DNS A record created: `ersin.home.ro` → your server IP
- [ ] DNS verified: `dig ersin.home.ro +short` returns your IP
- [ ] Nginx config copied to `/etc/nginx/sites-available/ersin.home.ro`
- [ ] Port updated to `3045` in Nginx config
- [ ] Static file paths updated in Nginx config
- [ ] Nginx config tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] HTTP works: `curl http://ersin.home.ro`
- [ ] SSL certificate obtained: `sudo certbot --nginx -d ersin.home.ro`
- [ ] HTTPS works: `curl https://ersin.home.ro`
- [ ] Browser shows green padlock
- [ ] HTTP redirects to HTTPS

---

## 🎉 After Setup

Once everything is working:

- ✅ Access via: `https://ersin.home.ro` (no port needed!)
- ✅ SSL certificate auto-renews every 90 days
- ✅ HTTP automatically redirects to HTTPS
- ✅ Your site is secure and accessible via domain

---

## 📝 Next Steps

After domain and SSL are set up:

1. **Test your site:** Visit `https://ersin.home.ro`
2. **Test contact form:** Make sure it works with HTTPS
3. **Monitor logs:** `sudo tail -f /var/log/nginx/ersin.home.ro.access.log`
4. **Set up monitoring:** Consider uptime monitoring

---

**Need help?** Check the troubleshooting section or share the error message!


# Troubleshooting Guide

Complete troubleshooting guide for common deployment issues.

---

## 🔍 Quick Diagnostics

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ersin-site --lines 50

# Check what's listening on ports
sudo netstat -tlnp | grep 3045
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Test app locally
curl http://localhost:3045
curl http://localhost
curl https://localhost
```

---

## ❌ Common Errors & Fixes

### 1. "Could not find a production build" Error

**Error:** `Could not find a production build in the '.next' directory`

**Cause:** App not built before starting

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Install dependencies (if needed)
npm install

# Build the application
npm run build

# Verify .next exists
ls -la .next

# Restart PM2
pm2 restart ersin-site
```

---

### 2. PM2 Status: "errored"

**Symptoms:** PM2 shows status as "errored"

**Check logs:**
```bash
pm2 logs ersin-site --lines 50
```

**Common causes:**

#### A. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3045`

**Fix:**
```bash
# Check what's using the port
sudo lsof -i :3045
# or
sudo netstat -tlnp | grep 3045

# Kill the process
sudo kill -9 <PID>

# Or change port in .env.production
nano ~/web-apps/ersin-site/.env.production
# Change PORT=3045 to PORT=3046

pm2 restart ersin-site
```

#### B. Missing Dependencies

**Error:** `Cannot find module` or `MODULE_NOT_FOUND`

**Fix:**
```bash
cd ~/web-apps/ersin-site
npm install
npm run build
pm2 restart ersin-site
```

#### C. Wrong Working Directory

**Error:** `File not found` or `Cannot find module`

**Fix:**
```bash
# Set environment variables
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Delete and restart
pm2 delete ersin-site
pm2 start ecosystem.config.js
```

#### D. Build Files Missing

**Error:** `.next` directory not found

**Fix:**
```bash
cd ~/web-apps/ersin-site
npm run build
pm2 restart ersin-site
```

---

### 3. App Running on Wrong Port (Reverted to 3000)

**Symptoms:** PM2 shows app running but it's on port 3000 instead of 3045

**Check what port PM2 is using:**
```bash
pm2 logs ersin-site --lines 10 | grep -i "local\|port"
pm2 env 0 | grep PORT
```

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Stop PM2
pm2 delete ersin-site

# Set directory variables
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Load .env.production
set -a
source .env.production
set +a

# Verify PORT is loaded
echo "PORT is: $PORT"
# Should show: PORT is: 3045

# Start PM2 with update-env flag
pm2 start ecosystem.config.js --update-env

# Save PM2 config
pm2 save

# Verify
sleep 3
pm2 logs ersin-site --lines 5 | grep -i local
sudo netstat -tlnp | grep 3045
```

**Note:** Port 3045 is hardcoded in `ecosystem.config.js`, so it won't revert to 3000.

---

### 4. Connection Refused (ERR_CONNECTION_REFUSED)

**Symptoms:** Can't connect to `http://ersin.home.ro` or `http://5.14.42.24:3045`

**Checks:**

#### Check 1: Is App Running?
```bash
pm2 status
# Should show "online"
```

#### Check 2: Is Port Listening?
```bash
sudo netstat -tlnp | grep 3045
```

**Good:** `0.0.0.0:3045` (accessible from outside)  
**Bad:** `127.0.0.1:3045` (only accessible locally)

#### Check 3: Is Firewall Blocking?
```bash
sudo ufw status | grep 3045
```

**Fixes:**

**Fix 1: Open Port in Firewall**
```bash
sudo ufw allow 3045/tcp
sudo ufw reload
```

**Fix 2: Ensure App Listens on All Interfaces**

Make sure `.env.production` has:
```env
HOSTNAME=0.0.0.0
PORT=3045
```

Or in `ecosystem.config.js`:
```javascript
env: {
  HOSTNAME: '0.0.0.0',
  PORT: 3045,
}
```

Then restart:
```bash
pm2 restart ersin-site --update-env
```

---

### 5. Port 80 Connection Refused (Can't Access HTTP)

**Symptoms:** `curl http://ersin.home.ro` fails from outside

**Fixes:**

#### Fix 1: Open Port 80 in UFW Firewall

```bash
# Allow port 80 (CRITICAL for Certbot!)
sudo ufw allow 80/tcp

# Allow port 443 (for HTTPS)
sudo ufw allow 443/tcp

# Reload firewall
sudo ufw reload

# Verify
sudo ufw status | grep -E '80|443'
# Should show both ports as ALLOW
```

#### Fix 2: Check Nginx is Running

```bash
# Check Nginx status
sudo systemctl status nginx

# If not running, start it
sudo systemctl start nginx
sudo systemctl enable nginx

# Check if it's listening
sudo netstat -tlnp | grep :80
# Should show: tcp ... 0.0.0.0:80 ... nginx
```

#### Fix 3: Check Router Port Forwarding

**If you're behind a router, you MUST forward ports 80 and 443:**

1. **Find your server's local IP:**
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.200
   ```

2. **Configure router:**
   - Log into router admin panel (usually `192.168.1.1`)
   - Go to **Port Forwarding** / **Virtual Server** / **NAT Forwarding**
   - Add rule for HTTP:
     - External Port: 80
     - Internal IP: Your server's local IP (e.g., 192.168.1.200)
     - Internal Port: 80
     - Protocol: TCP
   - Add rule for HTTPS:
     - External Port: 443
     - Internal IP: Same server IP
     - Internal Port: 443
     - Protocol: TCP

3. **Save and test again**

#### Fix 4: Check ISP Restrictions

Some ISPs block port 80 for residential connections. Check:
- Your ISP's terms of service
- Try accessing from a different network
- Contact ISP support

---

### 6. Missing Static Files (CSS, JS, Images Not Loading)

**Symptoms:** Site loads but looks broken, missing elements

**Check Nginx error logs:**
```bash
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
# Look for 404 errors for static files
```

**Fixes:**

#### Fix 1: Update Static File Paths in Nginx

```bash
# Replace YOUR_USERNAME with your actual username
USERNAME=$(whoami)
sudo sed -i "s|/home/YOUR_USERNAME/web-apps/ersin-site|/home/$USERNAME/web-apps/ersin-site|g" /etc/nginx/sites-available/ersin.home.ro

# Verify the change
sudo grep -A 1 "_next/static" /etc/nginx/sites-available/ersin.home.ro

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

#### Fix 2: Fix File Permissions (Permission Denied)

**Error:** `Permission denied (13)` in Nginx logs

**Fix:**
```bash
cd ~/web-apps/ersin-site

# CRITICAL: Fix parent directories (Nginx needs execute to traverse path)
chmod 755 ~
chmod 755 ~/web-apps
chmod 755 ~/web-apps/ersin-site

# Fix directory permissions (755 = readable and executable)
find .next -type d -exec chmod 755 {} \;
find public -type d -exec chmod 755 {} \;

# Fix file permissions (644 = readable)
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

---

### 7. SSL Certificate Failed (Certbot Errors)

**Common Errors:**

#### Error 1: NXDOMAIN for www subdomain

**Error:** `DNS problem: NXDOMAIN looking up A for www.ersin.home.ro`

**Fix:** Skip www subdomain for now:
```bash
sudo certbot --nginx -d ersin.home.ro
```

#### Error 2: Connection Error

**Error:** `Error getting validation data` or `connection` error

**Fixes:**

1. **Open Port 80 in Firewall:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw reload
   ```

2. **Verify DNS:**
   ```bash
   dig ersin.home.ro +short
   # Should return your server IP
   ```

3. **Test HTTP from Outside:**
   From your local machine:
   ```bash
   curl http://ersin.home.ro
   # Should return HTML content
   ```

4. **Check Router Port Forwarding:**
   - Make sure port 80 forwards to your server's local IP
   - See Fix 5.3 above

5. **Check Nginx is Running:**
   ```bash
   sudo systemctl status nginx
   sudo netstat -tlnp | grep :80
   ```

**Always test HTTP first before SSL!** If HTTP doesn't work, SSL won't work either.

---

### 8. Nginx 502 Bad Gateway

**Symptoms:** Website shows "502 Bad Gateway"

**Cause:** Nginx can't reach your app on port 3045

**Fix:**
```bash
# Check if app is running
pm2 status

# Check if app is listening on correct port
sudo netstat -tlnp | grep 3045

# Check Nginx config points to correct port
sudo grep -i "server 127.0.0.1" /etc/nginx/sites-available/ersin.home.ro
# Should show: server 127.0.0.1:3045;

# Restart app
pm2 restart ersin-site

# Check Nginx error logs
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

---

### 9. PM2 Not Running / Port Not Listening

**Symptoms:** `netstat` shows nothing on port 3045

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Stop and delete
pm2 delete ersin-site

# Set environment
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Load .env.production
set -a
source .env.production
set +a

# Verify .next exists
ls -la .next

# Start PM2
pm2 start ecosystem.config.js --update-env

# Wait and check
sleep 5
pm2 status
sudo netstat -tlnp | grep 3045
```

---

### 10. Old Errors in PM2 Logs

**Symptoms:** See old error messages in logs

**Fix:**
```bash
# Clear all PM2 logs
pm2 flush

# Or clear specific app logs
pm2 flush ersin-site

# View fresh logs
pm2 logs ersin-site --lines 20
```

---

## 🔧 Complete Reset Script

If nothing works, try a complete reset:

```bash
cd ~/web-apps/ersin-site

# Stop PM2
pm2 delete ersin-site

# Clear logs
pm2 flush

# Verify files exist
ls -la .next
ls -la node_modules/.bin/next
ls -la .env.production

# Set environment
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Load .env.production
set -a
[ -f .env.production ] && source .env.production
set +a

# Verify PORT is set
echo "PORT is: $PORT"

# Start PM2
pm2 start ecosystem.config.js --update-env

# Wait and check
sleep 5
pm2 status
pm2 logs ersin-site --lines 30
sudo netstat -tlnp | grep 3045
curl http://localhost:3045
```

---

## 🐛 Debugging Steps

### Step 1: Check Logs
```bash
pm2 logs ersin-site --lines 100
pm2 logs ersin-site --err --lines 50
sudo tail -f /var/log/nginx/ersin.home.ro.error.log
```

### Step 2: Test Manually
```bash
cd ~/web-apps/ersin-site

# Load environment
export NODE_ENV=production
export PORT=3045
export HOSTNAME=0.0.0.0
[ -f .env.production ] && source .env.production

# Try running directly
node_modules/.bin/next start

# If this works, PM2 config might be wrong
# If this fails, the error will show what's wrong
```

### Step 3: Check Ports
```bash
sudo netstat -tlnp | grep 3045
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo ss -tlnp | grep 3045
ps aux | grep next
```

### Step 4: Verify Environment
```bash
pm2 env 0  # Replace 0 with your app ID
pm2 describe ersin-site
```

### Step 5: Check Firewall
```bash
sudo ufw status
sudo ufw status numbered
sudo iptables -L -n | grep -E '80|443|3045'
```

---

## 📋 Troubleshooting Checklist

When something's not working:

- [ ] PM2 status shows "online": `pm2 status`
- [ ] Port 3045 is listening: `sudo netstat -tlnp | grep 3045`
- [ ] Port 3045 is accessible from outside: Shows `0.0.0.0:3045` not `127.0.0.1:3045`
- [ ] Firewall allows ports: `sudo ufw status | grep -E '80|443|3045'`
- [ ] Build exists: `ls -la .next`
- [ ] Dependencies installed: `ls -la node_modules`
- [ ] .env.production exists: `ls -la .env.production`
- [ ] App responds locally: `curl http://localhost:3045`
- [ ] Nginx config correct: `sudo grep -i "server 127.0.0.1" /etc/nginx/sites-available/ersin.home.ro`
- [ ] Nginx is running: `sudo systemctl status nginx`
- [ ] Port 80 is listening: `sudo netstat -tlnp | grep :80`
- [ ] HTTP works: `curl http://ersin.home.ro`
- [ ] Router port forwarding configured (if behind router)
- [ ] File permissions correct: `ls -ld ~ ~/web-apps ~/web-apps/ersin-site`

---

## 🆘 Still Not Working?

1. **Get full error:**
   ```bash
   pm2 logs ersin-site --lines 200 --err
   sudo tail -f /var/log/nginx/ersin.home.ro.error.log
   ```

2. **Check system resources:**
   ```bash
   free -h
   df -h
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

4. **Try manual start:**
   ```bash
   cd ~/web-apps/ersin-site
   NODE_ENV=production PORT=3045 HOSTNAME=0.0.0.0 node_modules/.bin/next start
   ```

---

## 💡 Quick Reference Commands

```bash
# PM2
pm2 status
pm2 logs ersin-site
pm2 restart ersin-site
pm2 delete ersin-site
pm2 flush

# Ports
sudo netstat -tlnp | grep 3045
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo lsof -i :3045

# Firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3045/tcp

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/ersin.home.ro.error.log

# Testing
curl http://localhost:3045
curl http://ersin.home.ro
curl https://ersin.home.ro
```

---

**For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

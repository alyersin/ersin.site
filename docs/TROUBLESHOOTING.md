# Troubleshooting Guide

Complete troubleshooting guide for common deployment issues.

## 🔍 Quick Diagnostics

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ersin-site --lines 50

# Check what's listening on ports
sudo netstat -tlnp | grep 3045

# Test app locally
curl http://localhost:3045
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

### 3. Connection Refused (ERR_CONNECTION_REFUSED)

**Symptoms:** Can't connect to `http://5.14.42.24:3045`

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
  PORT: process.env.PORT || 3000,
}
```

Then restart:
```bash
pm2 restart ersin-site --update-env
```

---

### 4. App Running on Wrong Port

**Symptoms:** PM2 shows app running but can't connect on expected port

**Check what port PM2 is using:**
```bash
pm2 logs ersin-site --lines 10 | grep -i "local\|port"
pm2 env 0 | grep PORT
```

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Update .env.production
nano .env.production
# Make sure PORT=3045

# Restart PM2
pm2 delete ersin-site
set -a && source .env.production && set +a
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"
pm2 start ecosystem.config.js --update-env

# Verify
pm2 logs ersin-site --lines 5 | grep -i local
sudo netstat -tlnp | grep 3045
```

---

### 5. PM2 Not Running / Port Not Listening

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

### 6. Nginx 502 Bad Gateway

**Symptoms:** Website shows "502 Bad Gateway"

**Cause:** Nginx can't reach your app

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

### 7. Port Configuration Issues

**If you need to change the port:**

Update in **3 places:**

1. **`.env.production`** (on server):
```bash
nano ~/web-apps/ersin-site/.env.production
# Change PORT=3045 to PORT=NEW_PORT
```

2. **`ecosystem.config.js`** (in repo):
```javascript
env: {
  PORT: process.env.PORT || NEW_PORT,
}
```

3. **Nginx config** (on server):
```bash
sudo nano /etc/nginx/sites-available/ersin.home.ro
# Change: server 127.0.0.1:NEW_PORT;
sudo nginx -t && sudo systemctl reload nginx
```

Then restart PM2:
```bash
pm2 restart ersin-site --update-env
```

---

### 8. Old Errors in PM2 Logs

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

### Step 3: Check Port
```bash
sudo netstat -tlnp | grep 3045
sudo ss -tlnp | grep 3045
ps aux | grep next
```

### Step 4: Verify Environment
```bash
pm2 env 0  # Replace 0 with your app ID
pm2 describe ersin-site
```

---

## 📋 Troubleshooting Checklist

When something's not working:

- [ ] PM2 status shows "online": `pm2 status`
- [ ] Port is listening: `sudo netstat -tlnp | grep 3045`
- [ ] Port is accessible from outside: Shows `0.0.0.0:3045` not `127.0.0.1:3045`
- [ ] Firewall allows port: `sudo ufw status | grep 3045`
- [ ] Build exists: `ls -la .next`
- [ ] Dependencies installed: `ls -la node_modules`
- [ ] .env.production exists: `ls -la .env.production`
- [ ] App responds locally: `curl http://localhost:3045`
- [ ] Nginx config correct: `sudo grep -i "server 127.0.0.1" /etc/nginx/sites-available/ersin.home.ro`
- [ ] No port conflicts: `sudo lsof -i :3045`

---

## 🆘 Still Not Working?

1. **Get full error:**
   ```bash
   pm2 logs ersin-site --lines 200 --err
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
sudo lsof -i :3045

# Firewall
sudo ufw status
sudo ufw allow 3045/tcp

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/ersin.home.ro.error.log

# Testing
curl http://localhost:3045
curl http://5.14.42.24:3045
```


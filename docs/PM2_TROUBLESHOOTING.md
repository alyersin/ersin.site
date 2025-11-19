# PM2 Troubleshooting Guide

Common PM2 errors and how to fix them.

## 🔍 Check PM2 Status

```bash
# Check status
pm2 status

# View logs
pm2 logs ersin-site

# View only errors
pm2 logs ersin-site --err

# View only output
pm2 logs ersin-site --out
```

---

## ❌ Common Errors

### 1. "errored" Status

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

# Kill the process using the port
sudo kill -9 <PID>

# Or change to a different port in .env.production
nano ~/web-apps/ersin-site/.env.production
# Change PORT=3045 to PORT=3046

# Restart PM2
pm2 restart ersin-site
```

#### B. Missing Dependencies

**Error:** `Cannot find module` or `MODULE_NOT_FOUND`

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Install dependencies
npm install --production

# Rebuild if needed
npm run build

# Restart PM2
pm2 restart ersin-site
```

#### C. Wrong Working Directory

**Error:** `File not found` or `Cannot find module`

**Fix:**
```bash
# Check ecosystem.config.js path
cat ~/web-apps/ersin-site/ecosystem.config.js

# Make sure cwd is correct
# Should be: cwd: process.env.PM2_APP_DIR || '/var/www/ersin-site'

# Set environment variable if using custom directory
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Delete and restart
pm2 delete ersin-site
pm2 start ecosystem.config.js
```

#### D. Environment Variables Not Loaded

**Error:** App crashes or can't find env vars

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Make sure .env.production exists
ls -la .env.production

# Check contents
cat .env.production

# PM2 should load .env.production automatically
# But you can also set them explicitly:
pm2 delete ersin-site
pm2 start ecosystem.config.js --update-env
```

#### E. Build Files Missing

**Error:** `.next` directory not found

**Fix:**
```bash
cd ~/web-apps/ersin-site

# Build the application
npm run build

# Verify .next directory exists
ls -la .next

# Restart PM2
pm2 restart ersin-site
```

---

## 🔧 Quick Fixes

### Reset PM2

```bash
# Stop and delete
pm2 delete ersin-site

# Clear logs
pm2 flush

# Start fresh
cd ~/web-apps/ersin-site
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"
pm2 start ecosystem.config.js

# Check status
pm2 status
pm2 logs ersin-site --lines 20
```

### Check Process Details

```bash
# Detailed info
pm2 describe ersin-site

# Show environment
pm2 show ersin-site

# Monitor in real-time
pm2 monit
```

### Verify Configuration

```bash
cd ~/web-apps/ersin-site

# Check ecosystem.config.js
cat ecosystem.config.js

# Check .env.production
cat .env.production

# Check if files exist
ls -la
ls -la .next
ls -la node_modules
```

---

## 🐛 Debugging Steps

### Step 1: Check Logs

```bash
pm2 logs ersin-site --lines 100
```

Look for:
- Error messages
- Stack traces
- Port conflicts
- Missing modules
- File not found errors

### Step 2: Test Manually

```bash
cd ~/web-apps/ersin-site

# Load environment
export NODE_ENV=production
export PORT=3045
source .env.production 2>/dev/null || true

# Try running directly
node_modules/.bin/next start

# If this works, PM2 config might be wrong
# If this fails, the error will show what's wrong
```

### Step 3: Check Port

```bash
# See what's listening
sudo netstat -tlnp | grep 3045
sudo ss -tlnp | grep 3045

# Check if PM2 process is running
ps aux | grep next
ps aux | grep node
```

### Step 4: Verify Environment

```bash
# Check PM2 environment
pm2 env 0  # Replace 0 with your app's ID from pm2 list

# Check if .env.production is being read
pm2 logs ersin-site | grep -i port
```

---

## ✅ Common Solutions

### Solution 1: Port Conflict

```bash
# Find and kill process on port 3045
sudo lsof -ti:3045 | xargs sudo kill -9

# Or change port
nano ~/web-apps/ersin-site/.env.production
# Change PORT=3045 to PORT=3046

pm2 restart ersin-site
```

### Solution 2: Missing Build

```bash
cd ~/web-apps/ersin-site
npm run build
pm2 restart ersin-site
```

### Solution 3: Wrong Directory

```bash
# Delete and restart with correct path
pm2 delete ersin-site

cd ~/web-apps/ersin-site
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
pm2 start ecosystem.config.js
```

### Solution 4: Dependencies Issue

```bash
cd ~/web-apps/ersin-site

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --production

# Rebuild
npm run build

# Restart
pm2 restart ersin-site
```

---

## 📋 Checklist

When PM2 shows "errored":

- [ ] Check PM2 logs: `pm2 logs ersin-site`
- [ ] Verify port is available: `sudo lsof -i :3045`
- [ ] Check if build exists: `ls -la .next`
- [ ] Verify dependencies: `ls -la node_modules`
- [ ] Check .env.production exists: `ls -la .env.production`
- [ ] Verify working directory is correct
- [ ] Try running manually: `node_modules/.bin/next start`
- [ ] Check file permissions
- [ ] Verify Node.js version: `node --version`

---

## 🆘 Still Not Working?

1. **Get full error:**
   ```bash
   pm2 logs ersin-site --lines 200 --err
   ```

2. **Try manual start:**
   ```bash
   cd ~/web-apps/ersin-site
   NODE_ENV=production PORT=3045 node_modules/.bin/next start
   ```

3. **Check system resources:**
   ```bash
   free -h
   df -h
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

---

**Share the error logs** and I can help diagnose the specific issue!


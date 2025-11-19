# Fix: PM2 Not Running / Port Not Listening

If `netstat` shows nothing on port 3045, PM2 isn't running your app correctly.

## 🔍 Check PM2 Status

```bash
pm2 status
pm2 list
```

## 🔧 Fix Steps

### Step 1: Check PM2 Status

```bash
pm2 status
```

**If status shows "errored" or "stopped":**

### Step 2: Check Logs

```bash
pm2 logs ersin-site --lines 50
```

Look for error messages.

### Step 3: Delete and Restart Fresh

```bash
cd ~/web-apps/ersin-site

# Stop and delete
pm2 delete ersin-site

# Set environment variables
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

# Check status immediately
pm2 status
pm2 logs ersin-site --lines 20
```

### Step 4: Verify Port is Listening

```bash
# Wait a few seconds
sleep 5

# Check if port is listening
sudo netstat -tlnp | grep 3045
# or
sudo ss -tlnp | grep 3045

# Should show something like:
# tcp  0  0  0.0.0.0:3045  0.0.0.0:*  LISTEN  <PID>/node
```

### Step 5: Test Locally

```bash
curl http://localhost:3045
```

---

## 🚨 Common Issues

### Issue 1: .next Directory Missing

```bash
cd ~/web-apps/ersin-site
ls -la .next

# If it doesn't exist:
npm run build
```

### Issue 2: Wrong Working Directory

PM2 might be looking in wrong directory. Check:

```bash
pm2 describe ersin-site | grep cwd
```

Should show: `/home/YOUR_USERNAME/web-apps/ersin-site`

### Issue 3: Environment Variables Not Loaded

```bash
# Check what PM2 sees
pm2 env 0  # Replace 0 with your app ID

# Should show PORT=3045
```

### Issue 4: App Crashing Immediately

```bash
# Check error logs
pm2 logs ersin-site --err --lines 50

# Common causes:
# - Missing dependencies
# - Build errors
# - Port already in use
```

---

## ✅ Complete Reset Script

Run this to completely reset:

```bash
cd ~/web-apps/ersin-site

# Stop PM2
pm2 delete ersin-site

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

# Check port
sudo netstat -tlnp | grep 3045
```

---

## 🔍 Debug Commands

```bash
# Check PM2 status
pm2 status

# View all logs
pm2 logs ersin-site --lines 100

# Check what PM2 sees
pm2 describe ersin-site

# Check environment
pm2 env 0

# Check if process is running
ps aux | grep next
ps aux | grep node

# Check all listening ports
sudo netstat -tlnp | grep -E 'node|next'

# Check what's using port 3045
sudo lsof -i :3045
```

---

## 💡 Quick Test

Try running Next.js directly (not through PM2) to see if it works:

```bash
cd ~/web-apps/ersin-site

# Set environment
export NODE_ENV=production
export PORT=3045
export HOSTNAME=0.0.0.0
[ -f .env.production ] && source .env.production

# Run directly
node_modules/.bin/next start

# If this works, PM2 config is the issue
# If this fails, there's a problem with the app itself
```


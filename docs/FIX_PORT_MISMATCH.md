# Fix: App Running on Wrong Port

If PM2 shows the app is running but you can't connect, check the port.

## 🔍 Check What Port PM2 is Using

```bash
# Check PM2 logs - look for "Local:" line
pm2 logs ersin-site --lines 10 | grep -i "local\|port"

# Check PM2 environment
pm2 env 0 | grep PORT

# Check what's actually listening
sudo netstat -tlnp | grep -E 'node|next'
```

---

## 🔧 Fix: Make App Use Port 3045

### Step 1: Verify .env.production

```bash
cd ~/web-apps/ersin-site
cat .env.production
```

Should show:
```env
PORT=3045
HOSTNAME=0.0.0.0
```

### Step 2: Update .env.production if Needed

```bash
nano ~/web-apps/ersin-site/.env.production
```

Make sure it has:
```env
NODE_ENV=production
PORT=3045
HOSTNAME=0.0.0.0
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
```

Save and exit (Ctrl+X, Y, Enter)

### Step 3: Restart PM2 with Updated Environment

```bash
cd ~/web-apps/ersin-site

# Stop PM2
pm2 delete ersin-site

# Load environment
set -a
source .env.production
set +a

# Verify PORT is set
echo "PORT is: $PORT"
# Should show: PORT is: 3045

# Set directory variables
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Start PM2
pm2 start ecosystem.config.js --update-env

# Wait a moment
sleep 3

# Check logs - should show port 3045
pm2 logs ersin-site --lines 10
```

### Step 4: Verify Port is Listening

```bash
# Check if port 3045 is listening
sudo netstat -tlnp | grep 3045

# Should show:
# tcp  0  0  0.0.0.0:3045  0.0.0.0:*  LISTEN  <PID>/node
```

### Step 5: Open Firewall

```bash
# Allow port 3045
sudo ufw allow 3045/tcp

# Verify
sudo ufw status | grep 3045
```

### Step 6: Test Connection

```bash
# Test locally
curl http://localhost:3045

# Should return HTML content
```

---

## 🚨 If Still Not Working

### Check 1: Is it listening on 0.0.0.0?

```bash
sudo netstat -tlnp | grep 3045
```

**Good:** `0.0.0.0:3045` (accessible from outside)  
**Bad:** `127.0.0.1:3045` (only local)

### Check 2: Firewall Status

```bash
sudo ufw status
```

Port 3045 should be listed as ALLOW.

### Check 3: Test from Server

```bash
curl http://localhost:3045
curl http://127.0.0.1:3045
curl http://0.0.0.0:3045
```

All should work if app is running.

### Check 4: Test from Outside

From your local machine:
```bash
curl http://5.14.42.24:3045
```

---

## ✅ Quick Fix Script

Run this complete fix:

```bash
cd ~/web-apps/ersin-site

# Update .env.production
cat > .env.production << EOF
NODE_ENV=production
PORT=3045
HOSTNAME=0.0.0.0
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
EOF

# Stop PM2
pm2 delete ersin-site

# Load environment
set -a
source .env.production
set +a
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Start PM2
pm2 start ecosystem.config.js --update-env

# Wait
sleep 5

# Check
pm2 status
pm2 logs ersin-site --lines 5 | grep -i "local\|port"
sudo netstat -tlnp | grep 3045

# Open firewall
sudo ufw allow 3045/tcp

# Test
curl http://localhost:3045
```

---

## 🔍 Debug Commands

```bash
# What port is PM2 using?
pm2 logs ersin-site | grep -i "local\|port"

# What's listening?
sudo netstat -tlnp | grep node

# Check firewall
sudo ufw status

# Check environment
pm2 env 0 | grep PORT
```


# Fix: App Reverted to Port 3000

If your app restarts and goes back to port 3000 instead of 3045, PM2 isn't loading `.env.production` correctly.

## 🔍 Quick Check

```bash
# Check what port PM2 is using
pm2 logs ersin-site --lines 5 | grep -i "local\|port"

# Check PM2 environment
pm2 env 0 | grep PORT

# Check .env.production
cat ~/web-apps/ersin-site/.env.production | grep PORT
```

---

## 🔧 Fix: Force PM2 to Use Port 3045

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

### Step 2: Stop PM2

```bash
pm2 delete ersin-site
```

### Step 3: Load Environment and Restart

```bash
cd ~/web-apps/ersin-site

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

# Wait a moment
sleep 3

# Verify it's on port 3045
pm2 logs ersin-site --lines 5 | grep -i local
# Should show: Local: http://localhost:3045
```

---

## 🚨 Permanent Fix: Make PM2 Auto-Load Environment

### Option 1: Use PM2 Ecosystem with env_file (Recommended)

Update `ecosystem.config.js` to explicitly load `.env.production`:

```javascript
module.exports = {
  apps: [
    {
      name: 'ersin-site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: process.env.PM2_APP_DIR || '/var/www/ersin-site',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env.production',  // Add this line
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
      },
      // ... rest of config
    },
  ],
};
```

**Note:** PM2 doesn't natively support `env_file`. Use Option 2 instead.

### Option 2: Use PM2 Startup Script

Create a startup script that loads environment before PM2:

```bash
# Create startup script
nano ~/web-apps/ersin-site/start.sh
```

Add:
```bash
#!/bin/bash
cd "$HOME/web-apps/ersin-site"

# Load environment
set -a
[ -f .env.production ] && source .env.production
set +a

# Set directory variables
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Start PM2
pm2 start ecosystem.config.js --update-env
```

Make executable:
```bash
chmod +x ~/web-apps/ersin-site/start.sh
```

Update `ecosystem.config.js` to use the script:
```javascript
script: 'start.sh',  // Instead of next binary
```

### Option 3: Set Environment in ecosystem.config.js Directly

Hardcode the port in `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3045,  // Hardcode instead of process.env.PORT
  HOSTNAME: '0.0.0.0',
},
```

**Downside:** Port is hardcoded, less flexible.

---

## ✅ Recommended Solution

**Use a wrapper script** that ensures environment is loaded:

1. **Create `start-app.sh`:**
```bash
cd ~/web-apps/ersin-site
nano start-app.sh
```

Add:
```bash
#!/bin/bash
cd "$(dirname "$0")"

# Load environment
set -a
[ -f .env.production ] && source .env.production
set +a

export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Start with PM2
exec pm2 start ecosystem.config.js --update-env
```

Make executable:
```bash
chmod +x start-app.sh
```

2. **Update PM2 startup command:**
```bash
pm2 delete ersin-site
cd ~/web-apps/ersin-site
./start-app.sh
```

3. **Save PM2 config:**
```bash
pm2 save
```

---

## 🔍 Why This Happens

PM2 doesn't automatically reload `.env.production` on restart. When the app crashes or PM2 restarts:
- PM2 uses the environment from when it was first started
- If `.env.production` wasn't loaded initially, it defaults to port 3000
- The `--update-env` flag helps, but only if env vars are in the shell when starting

---

## 🎯 Quick Fix Right Now

```bash
cd ~/web-apps/ersin-site

# Stop PM2
pm2 delete ersin-site

# Load environment
set -a && source .env.production && set +a
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"

# Verify PORT
echo "PORT: $PORT"

# Start with update-env
pm2 start ecosystem.config.js --update-env

# Save PM2 config
pm2 save

# Verify
sleep 3
pm2 logs ersin-site --lines 5 | grep -i local
sudo netstat -tlnp | grep 3045
```

---

## 🔄 Prevent Future Issues

1. **Always use `--update-env` flag:**
   ```bash
   pm2 restart ersin-site --update-env
   ```

2. **Check logs after restart:**
   ```bash
   pm2 logs ersin-site --lines 10 | grep -i port
   ```

3. **Set up PM2 to auto-restart with correct env:**
   Use the wrapper script method above.

---

## 📋 Checklist

- [ ] `.env.production` has `PORT=3045`
- [ ] Environment loaded before starting PM2
- [ ] PM2 started with `--update-env` flag
- [ ] PM2 logs show port 3045
- [ ] `netstat` shows listening on 3045
- [ ] `curl http://localhost:3045` works
- [ ] PM2 config saved: `pm2 save`


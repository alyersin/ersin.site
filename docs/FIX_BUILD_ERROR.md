# Fix: "Could not find a production build" Error

This error means the `.next` directory doesn't exist. You need to build the app before starting it.

## 🔧 Quick Fix

**If you see "next: not found" error:**

On your server, run:

```bash
cd ~/web-apps/ersin-site

# First, install dependencies (IMPORTANT!)
npm install

# Then build the application
npm run build

# Verify .next directory was created
ls -la .next

# Restart PM2
pm2 restart ersin-site

# Check logs
pm2 logs ersin-site --lines 20
```

---

## ✅ Complete Fix Steps

### Step 1: Navigate to App Directory

```bash
cd ~/web-apps/ersin-site
```

### Step 2: Install Dependencies (if needed)

```bash
npm install --production
```

### Step 3: Build the Application

```bash
npm run build
```

You should see output like:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

### Step 4: Verify Build

```bash
# Check if .next directory exists
ls -la .next

# Should see directories like:
# - .next/
#   - static/
#   - server/
#   - BUILD_ID
```

### Step 5: Restart PM2

```bash
pm2 restart ersin-site

# Or if it's not running:
pm2 delete ersin-site
export PM2_APP_DIR="$HOME/web-apps/ersin-site"
export PM2_LOG_DIR="$HOME/.pm2/logs"
pm2 start ecosystem.config.js
```

### Step 6: Verify It's Working

```bash
# Check PM2 status
pm2 status

# Should show "online" status

# Check logs
pm2 logs ersin-site --lines 20

# Test the app
curl http://localhost:3045
```

---

## 🚨 If Build Fails

### Check for Errors

```bash
npm run build 2>&1 | tee build.log
```

Common issues:

#### Missing Dependencies

```bash
# Install all dependencies (including dev dependencies for build)
npm install

# Then build
npm run build
```

#### TypeScript Errors

```bash
# Check TypeScript config
cat tsconfig.json

# Try building with more verbose output
npm run build -- --debug
```

#### Environment Variables Missing

```bash
# Make sure .env.production exists
ls -la .env.production

# Check contents
cat .env.production
```

---

## 🔄 For Future Deployments

Make sure the CI/CD workflow builds before starting PM2. The workflow should:

1. ✅ Install dependencies
2. ✅ Build the app (`npm run build`)
3. ✅ Then start PM2

---

## 📋 Checklist

- [ ] Navigated to app directory: `cd ~/web-apps/ersin-site`
- [ ] Dependencies installed: `npm install --production`
- [ ] App built: `npm run build`
- [ ] `.next` directory exists: `ls -la .next`
- [ ] PM2 restarted: `pm2 restart ersin-site`
- [ ] PM2 status shows "online": `pm2 status`
- [ ] App responds: `curl http://localhost:3045`

---

## 💡 Pro Tip

Add a build check to your deployment script:

```bash
# Check if build exists before starting
if [ ! -d ".next" ]; then
  echo "Building application..."
  npm run build
fi

pm2 restart ersin-site
```


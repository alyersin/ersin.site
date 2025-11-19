# Fix: Connection Refused Error

If you get `ERR_CONNECTION_REFUSED` when accessing your server, check these:

## 🔍 Quick Checks

### 1. Is the App Running?

```bash
# Check PM2 status
pm2 status

# Should show "online" status
```

### 2. Is it Listening on the Right Port?

```bash
# Check what's listening on port 3045
sudo netstat -tlnp | grep 3045
# or
sudo ss -tlnp | grep 3045
```

**Important:** Look for `0.0.0.0:3045` or `:::3045` (accessible from outside)
**Bad:** `127.0.0.1:3045` (only accessible locally)

### 3. Is Firewall Blocking?

```bash
# Check firewall status
sudo ufw status

# Check if port 3045 is open
sudo ufw status | grep 3045
```

---

## 🔧 Fixes

### Fix 1: Open Port in Firewall

```bash
# Allow port 3045
sudo ufw allow 3045/tcp

# Verify
sudo ufw status
```

### Fix 2: Check if App is Listening on All Interfaces

Next.js should listen on `0.0.0.0` by default, but verify:

```bash
# Check what interface it's listening on
sudo netstat -tlnp | grep 3045

# If it shows 127.0.0.1:3045, that's the problem
```

**Solution:** Make sure your `.env.production` has:
```env
HOSTNAME=0.0.0.0
PORT=3045
```

Or in `ecosystem.config.js`, add:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,
  HOSTNAME: '0.0.0.0',  // Listen on all interfaces
},
```

### Fix 3: Restart PM2 After Changes

```bash
pm2 restart ersin-site --update-env
```

---

## ✅ Complete Troubleshooting Steps

### Step 1: Verify App is Running

```bash
pm2 status
pm2 logs ersin-site --lines 10
```

### Step 2: Check Port Listening

```bash
sudo netstat -tlnp | grep 3045
```

Should show something like:
```
tcp  0  0  0.0.0.0:3045  0.0.0.0:*  LISTEN  12345/node
```

### Step 3: Check Firewall

```bash
# Check status
sudo ufw status

# If port 3045 is not listed, add it:
sudo ufw allow 3045/tcp

# Reload firewall
sudo ufw reload
```

### Step 4: Test Locally First

```bash
# From the server itself
curl http://localhost:3045

# Should return HTML content
```

### Step 5: Test from Outside

```bash
# From your local machine
curl http://5.14.42.24:3045

# Or use your domain
curl http://ersin.home.ro:3045
```

---

## 🚨 Common Issues

### Issue 1: App Only Listening on localhost

**Symptom:** `netstat` shows `127.0.0.1:3045`

**Fix:**
```bash
# Update ecosystem.config.js to listen on all interfaces
# Add HOSTNAME: '0.0.0.0' to env section

# Or set in .env.production:
echo "HOSTNAME=0.0.0.0" >> ~/web-apps/ersin-site/.env.production

# Restart PM2
pm2 restart ersin-site --update-env
```

### Issue 2: Firewall Blocking

**Symptom:** App running but can't connect from outside

**Fix:**
```bash
sudo ufw allow 3045/tcp
sudo ufw reload
```

### Issue 3: Wrong Port

**Symptom:** Trying to connect but app is on different port

**Fix:**
```bash
# Check what port PM2 is actually using
pm2 describe ersin-site | grep -i port

# Or check logs
pm2 logs ersin-site | grep -i port
```

---

## 🔍 Debug Commands

```bash
# Check if app is running
pm2 status

# Check what ports are listening
sudo netstat -tlnp | grep -E '3045|3000'

# Check firewall rules
sudo ufw status numbered

# Test local connection
curl -v http://localhost:3045

# Check PM2 environment
pm2 env 0  # Replace 0 with your app ID

# View detailed PM2 info
pm2 describe ersin-site
```

---

## 📋 Checklist

- [ ] PM2 shows app as "online"
- [ ] App is listening on `0.0.0.0:3045` (not `127.0.0.1:3045`)
- [ ] Firewall allows port 3045: `sudo ufw allow 3045/tcp`
- [ ] Can connect locally: `curl http://localhost:3045`
- [ ] Can connect from outside: `curl http://5.14.42.24:3045`

---

## 💡 Quick Fix Script

Run this on your server:

```bash
cd ~/web-apps/ersin-site

# Ensure HOSTNAME is set
if ! grep -q "HOSTNAME" .env.production; then
  echo "HOSTNAME=0.0.0.0" >> .env.production
fi

# Open firewall port
sudo ufw allow 3045/tcp

# Restart PM2
pm2 restart ersin-site --update-env

# Verify
sleep 3
pm2 status
sudo netstat -tlnp | grep 3045
curl http://localhost:3045
```


# Port Configuration Guide

If you have multiple websites on your server, you may need to use a different port to avoid conflicts.

## 🔍 Check if Port 3000 is Available

On your server, run:

```bash
# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000
# or
sudo ss -tlnp | grep 3000
# or
sudo lsof -i :3000
```

If you see output, port 3000 is already in use. Choose a different port (e.g., 3001, 3002, 3003, etc.)

---

## 🔧 How to Change the Port

You need to update the port in **3 places**:

### 1. `.env.production` file

On your server:

```bash
nano ~/web-apps/ersin-site/.env.production
```

Change:
```env
PORT=3001
```
(Replace 3001 with your chosen port)

### 2. `ecosystem.config.js`

Update the PORT in the env section:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3001,  // Change this
},
```

### 3. Nginx Configuration

Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-available/ersin.home.ro
```

Change the upstream server:
```nginx
upstream nextjs_backend {
    server 127.0.0.1:3001;  # Change from 3000 to your port
    keepalive 64;
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📋 Common Ports to Use

- **3001** - Common alternative
- **3002** - Another option
- **3003** - If 3001-3002 are taken
- **4000** - Alternative range
- **5000** - Alternative range

**Avoid:**
- **80** - HTTP (used by Nginx)
- **443** - HTTPS (used by Nginx)
- **22** - SSH
- **3306** - MySQL (if you have databases)

---

## ✅ Quick Port Change Script

On your server, run this (replace `3001` with your desired port):

```bash
cd ~/web-apps/ersin-site

# Update .env.production
sed -i 's/PORT=3000/PORT=3001/g' .env.production

# Update ecosystem.config.js
sed -i 's/PORT: 3000/PORT: 3001/g' ecosystem.config.js

# Update Nginx config (if configured)
sudo sed -i 's/127.0.0.1:3000/127.0.0.1:3001/g' /etc/nginx/sites-available/ersin.home.ro
sudo nginx -t && sudo systemctl reload nginx

# Restart PM2
pm2 restart ersin-site
```

---

## 🧪 Verify Port Change

```bash
# Check if app is running on new port
curl http://localhost:3001

# Check PM2 status
pm2 status

# Check what's listening on ports
sudo netstat -tlnp | grep -E '3000|3001'
```

---

## 🔄 For CI/CD

The workflow will automatically use the port from `ecosystem.config.js`, so just make sure:
1. ✅ `ecosystem.config.js` has the correct port
2. ✅ `.env.production` has the correct port (on server)
3. ✅ Nginx config points to the correct port

---

## 💡 Pro Tip

You can also use environment variables in `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,  // Uses PORT env var, defaults to 3000
},
```

Then set `PORT=3001` in your `.env.production` file.


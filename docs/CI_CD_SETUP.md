# CI/CD Setup Guide - GitHub Actions to Server

This guide will help you set up automatic deployment from GitHub to your server using GitHub Actions.

## 🎯 What This Does

When you push code to the `main` branch on GitHub:
1. ✅ Code is checked out
2. ✅ Dependencies are installed
3. ✅ Application is built
4. ✅ Code is deployed to your server via SSH
5. ✅ PM2 restarts the application
6. ✅ Deployment is verified

## 📋 Prerequisites

- GitHub repository (already done ✅)
- Linux server with SSH access
- PM2 installed on server
- Git installed on server

---

## Step 1: Generate SSH Key Pair

On your **local machine** (or server), generate an SSH key pair for GitHub Actions:

```bash
# Generate SSH key (use a descriptive name)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# This creates two files:
# ~/.ssh/github_actions_deploy (private key)
# ~/.ssh/github_actions_deploy.pub (public key)
```

**Important:** Don't set a passphrase (press Enter when prompted) - GitHub Actions needs passwordless access.

---

## Step 2: Add Public Key to Server

Copy the **public key** to your server:

```bash
# Display the public key
cat ~/.ssh/github_actions_deploy.pub

# Copy the output, then SSH into your server
ssh your-username@your-server-ip

# On the server, add the public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Alternative method** (from local machine):
```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub your-username@your-server-ip
```

---

## Step 3: Test SSH Connection

Test that you can SSH into your server without a password:

```bash
ssh -i ~/.ssh/github_actions_deploy your-username@your-server-ip
```

If it works, you're good to go! Exit the SSH session.

---

## Step 4: Configure GitHub Secrets

Go to your GitHub repository: `https://github.com/alyersin/ersin.site`

1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets one by one:

### Secret 1: `SERVER_HOST`
- **Name:** `SERVER_HOST`
- **Value:** Your server IP address (e.g., `123.45.67.89`) or domain (e.g., `ersin.home.ro`)

### Secret 2: `SERVER_USER`
- **Name:** `SERVER_USER`
- **Value:** Your SSH username (e.g., `ubuntu`, `root`, `deploy`)

### Secret 3: `SERVER_SSH_KEY`
- **Name:** `SERVER_SSH_KEY`
- **Value:** The **entire contents** of your **private key** file:
  ```bash
  cat ~/.ssh/github_actions_deploy
  ```
  Copy **everything** including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

### Secret 4: `SERVER_PORT` (Optional)
- **Name:** `SERVER_PORT`
- **Value:** Your SSH port (default is `22`, only add this if you use a custom port)

---

## Step 5: Verify Workflow File

The workflow file `.github/workflows/deploy.yml` should already be in your repository. Verify it exists:

```bash
# On your local machine
ls -la .github/workflows/deploy.yml
```

If it doesn't exist, make sure you've committed and pushed it:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push
```

---

## Step 6: Test the Workflow

### Option 1: Push a Test Change
```bash
# Make a small change
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test CI/CD deployment"
git push origin main
```

### Option 2: Manual Trigger
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Production Server** workflow
4. Click **Run workflow** → **Run workflow**

---

## Step 7: Monitor Deployment

1. Go to **Actions** tab on GitHub
2. Click on the latest workflow run
3. Watch the deployment progress in real-time
4. Check logs if anything fails

---

## 🔍 Troubleshooting

### SSH Connection Fails

**Error:** `Permission denied (publickey)`

**Solution:**
- Verify public key is in `~/.ssh/authorized_keys` on server
- Check file permissions: `chmod 600 ~/.ssh/authorized_keys`
- Verify private key secret in GitHub is complete (includes BEGIN/END lines)

### Build Fails

**Error:** `npm run build` fails

**Solution:**
- Check build logs in GitHub Actions
- Test build locally: `npm run build`
- Ensure all dependencies are in `package.json`

### PM2 Not Found

**Error:** `pm2: command not found`

**Solution:**
- Install PM2 on server: `sudo npm install -g pm2`
- Or use full path: `/usr/bin/pm2` (update workflow file)

### Application Not Restarting

**Error:** App doesn't restart after deployment

**Solution:**
- Check PM2 status: `pm2 status`
- Verify ecosystem.config.js path is correct
- Check PM2 logs: `pm2 logs ersin-site`

---

## 🔐 Security Best Practices

1. **Never commit private keys** - Always use GitHub Secrets
2. **Use dedicated SSH key** - Don't use your personal SSH key
3. **Restrict SSH key** - Consider restricting the key to specific commands
4. **Monitor deployments** - Review GitHub Actions logs regularly
5. **Rotate keys periodically** - Regenerate SSH keys every 6-12 months

---

## 📝 Manual Deployment (Fallback)

If CI/CD fails, you can still deploy manually:

```bash
# SSH into server
ssh your-username@your-server-ip

# Run deployment script
cd /var/www/ersin-site
./scripts/deploy-server.sh

# Or use the original deploy.sh
./deploy.sh
```

---

## 🎉 Success!

Once set up, every push to `main` will automatically:
- ✅ Build your application
- ✅ Deploy to your server
- ✅ Restart the application
- ✅ Verify it's running

You can now focus on coding and let GitHub Actions handle the deployment! 🚀


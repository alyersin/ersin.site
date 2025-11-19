# Setting Up Passwordless Sudo for CI/CD

The GitHub Actions workflow needs to create directories in `/var/www/`, which typically requires sudo. You have two options:

## Option 1: Configure Passwordless Sudo (Recommended)

This allows the workflow to create directories without a password prompt.

### Step 1: SSH into your server

```bash
ssh your-username@your-server-ip
```

### Step 2: Edit sudoers file

```bash
sudo visudo
```

### Step 3: Add this line at the end

Replace `your-username` with your actual SSH username:

```
your-username ALL=(ALL) NOPASSWD: /bin/mkdir, /bin/chown, /bin/chmod
```

Or for more security, allow only specific directories:

```
your-username ALL=(ALL) NOPASSWD: /bin/mkdir -p /var/www/*, /bin/chown -R * /var/www/*, /bin/mkdir -p /var/log/pm2, /bin/chown -R * /var/log/pm2
```

### Step 4: Save and exit

- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 5: Test

```bash
sudo -n mkdir -p /var/www/test
echo $?
# Should return 0 (success)
```

---

## Option 2: Pre-create Directories Manually (Easier)

If you don't want to configure passwordless sudo, create the directories manually first:

### Step 1: SSH into your server

```bash
ssh your-username@your-server-ip
```

### Step 2: Create directories with sudo (one-time)

```bash
sudo mkdir -p /var/www/ersin-site
sudo chown -R $USER:$USER /var/www/ersin-site
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### Step 3: Verify permissions

```bash
ls -la /var/www/
# Should show ersin-site directory owned by you

ls -la /var/log/pm2
# Should show directory owned by you
```

### Step 4: Test write access

```bash
touch /var/www/ersin-site/test.txt
rm /var/www/ersin-site/test.txt
# Should work without errors
```

After this, the CI/CD workflow will work without needing sudo!

---

## Option 3: Use Home Directory (No Sudo Needed)

If you prefer not to use `/var/www/`, the workflow will automatically fall back to `$HOME/ersin-site` if sudo isn't available.

**Note:** If you use this option, you'll need to:
1. Update `ecosystem.config.js` to use the home directory path
2. Update Nginx config to point to the correct path
3. Update any other references to `/var/www/ersin-site`

---

## Recommendation

**Use Option 2 (Pre-create directories)** - It's the simplest and most secure:
- ✅ No passwordless sudo needed
- ✅ One-time setup
- ✅ More secure than passwordless sudo
- ✅ Works immediately

Just run those 4 commands once, and you're done!

---

## Troubleshooting

### "Permission denied" errors

- Check directory ownership: `ls -la /var/www/`
- Verify you own the directory: `stat /var/www/ersin-site`
- Fix ownership: `sudo chown -R $USER:$USER /var/www/ersin-site`

### Sudo still asking for password

- Check sudoers file: `sudo visudo -c`
- Verify your username matches exactly
- Make sure there are no typos in the sudoers entry


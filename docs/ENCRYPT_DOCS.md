# Encrypt Documentation Files

Guide to encrypt your docs folder so they're hidden in your public GitHub repo but still accessible when you pull the code.

---

## 🔒 Option 1: Use git-crypt (Recommended)

`git-crypt` encrypts files transparently - they're encrypted in the repo but automatically decrypted when you clone/pull.

### Step 1: Install git-crypt

**On Linux:**
```bash
sudo apt install git-crypt
```

**On macOS:**
```bash
brew install git-crypt
```

**On Windows:**
```bash
# Download from: https://github.com/AGWA/git-crypt/releases
# Or use WSL
```

### Step 2: Initialize git-crypt

```bash
cd your-project-folder

# Initialize git-crypt
git-crypt init

# This creates a key file: .git-crypt/keys/default
```

### Step 3: Configure .gitattributes

The `.gitattributes` file is already created in your repo. It encrypts all `.md` files in `docs/` except `ENCRYPT_DOCS.md` (so you can read these instructions).

**Current configuration:**
```
docs/*.md filter=git-crypt diff=git-crypt
!docs/ENCRYPT_DOCS.md
```

This means:
- ✅ All `.md` files in `docs/` are encrypted
- ✅ `ENCRYPT_DOCS.md` stays unencrypted (so you can read it)

### Step 4: Add and Commit

```bash
# Add .gitattributes
git add .gitattributes

# Add docs (they'll be encrypted automatically)
git add docs/

# Commit
git commit -m "Encrypt docs folder with git-crypt"

# Push
git push origin main
```

### Step 5: Export Your Key (IMPORTANT!)

**You MUST save this key to decrypt files later!**

```bash
# Export the key
git-crypt export-key ~/git-crypt-key

# Backup this key somewhere safe (USB drive, password manager, etc.)
# Without this key, you CANNOT decrypt the files!
```

**Store the key securely:**
- Password manager (1Password, Bitwarden, etc.)
- Encrypted USB drive
- Cloud storage (encrypted)
- Print and store physically

### Step 6: On a New Machine

When you clone the repo on a different machine:

```bash
# Clone the repo
git clone https://github.com/alyersin/ersin.site.git

# Copy your key to the machine
# (from your secure backup location)

# Unlock git-crypt
git-crypt unlock ~/git-crypt-key

# Files are now decrypted and readable!
```

---

## 🔐 Option 2: Use git-secret (Alternative)

Similar to git-crypt but uses GPG keys.

### Step 1: Install git-secret

```bash
# Linux
sudo apt install git-secret

# macOS
brew install git-secret
```

### Step 2: Setup

```bash
cd your-project-folder

# Initialize
git-secret init

# Add your GPG key
git-secret tell your-email@example.com

# Add files to encrypt
git-secret add docs/

# Encrypt
git-secret hide

# Commit encrypted files
git add .secret docs/
git commit -m "Encrypt docs with git-secret"
git push
```

### Step 3: Decrypt on New Machine

```bash
git clone https://github.com/alyersin/ersin.site.git
cd ersin-site

# Decrypt (will prompt for GPG passphrase)
git-secret reveal
```

---

## 📁 Option 3: Move Docs to Private Repo

Keep docs in a separate private repository.

### Step 1: Create Private Repo

1. Create a new private GitHub repo: `ersin-site-docs`
2. Copy your docs there
3. Keep it private

### Step 2: Use Git Submodule

```bash
# In your main repo
git submodule add https://github.com/alyersin/ersin-site-docs.git docs-private

# On new machine
git clone --recursive https://github.com/alyersin/ersin.site.git
```

---

## 🎯 Recommendation

**Use Option 1 (git-crypt)** because:
- ✅ Files stay in the same repo
- ✅ Automatic encryption/decryption
- ✅ Works seamlessly with git
- ✅ No separate repo needed
- ✅ Easy to use
- ✅ **Public users CANNOT read encrypted files without your key**
- ✅ **You can decrypt automatically when you pull (with key)**

---

## ⚠️ Important Notes

1. **Backup your key!** Without the git-crypt key, you cannot decrypt files.
2. **Don't commit the key** to the repo (it's already in `.gitignore`)
3. **Test on a new machine** to make sure you can decrypt
4. **Keep key secure** - treat it like a password

---

## 🔍 Verify Encryption

After pushing, check on GitHub:
- Files in `docs/` should show as encrypted/binary
- You won't be able to read them directly on GitHub
- But they'll decrypt automatically when you pull locally (if you have the key)

### What Others See

**Without the key (public users):**
- ❌ Files appear as encrypted/binary data
- ❌ Cannot read the content
- ❌ See gibberish/encrypted text
- ✅ Files are completely unreadable

**With the key (you):**
- ✅ Files automatically decrypt when you pull
- ✅ Can read everything normally
- ✅ Works seamlessly with git

### Test It Yourself

After encrypting, try viewing on GitHub:
1. Go to: `https://github.com/alyersin/ersin.site/blob/main/docs/DEPLOYMENT.md`
2. You should see encrypted/binary content (not readable)
3. But when you pull locally with the key, it decrypts automatically

---

## 🚨 If You Lose Your Key

If you lose the git-crypt key:
- ❌ You cannot decrypt the files
- ❌ You'll need to re-encrypt with a new key
- ✅ Always backup your key!

---

**I recommend Option 1 (git-crypt) - it's the simplest and most reliable!**


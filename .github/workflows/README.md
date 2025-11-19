# GitHub Actions Workflows

## Deploy to Production Server

**Trigger:** Automatically runs on every push to `main` branch

**What it does:**
1. Checks out code
2. Installs dependencies
3. Runs linter
4. Builds application
5. Deploys to server via SSH
6. Restarts PM2
7. Verifies deployment

**Manual trigger:** Go to Actions → Deploy to Production Server → Run workflow

**Setup:** See [CI_CD_SETUP.md](../../CI_CD_SETUP.md) for configuration instructions.


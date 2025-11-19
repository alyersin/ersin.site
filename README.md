# Ersin's Portfolio Website

Personal portfolio website built with Next.js, deployed on a Linux server.

🌐 **Live Site:** [ersin.home.ro](https://ersin.home.ro)

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Deployment

**Documentation:**
- 📖 **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - **START HERE!** Complete guide from Git Push to SSL Certificate (all steps, ports, fixes)
- 🔄 **[docs/CI_CD_SETUP.md](./docs/CI_CD_SETUP.md)** - Automatic deployments via GitHub Actions
- 📧 **[docs/CONTACT_SETUP.md](./docs/CONTACT_SETUP.md)** - Email configuration
- 🔧 **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues & fixes
- 🔒 **[docs/SSL_VS_TLS_EXPLAINED.md](./docs/SSL_VS_TLS_EXPLAINED.md)** - SSL vs TLS explained

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.2
- **UI Library:** Chakra UI
- **Styling:** Tailwind CSS, Styled Components
- **Animations:** Framer Motion, React Spring
- **Email:** Nodemailer
- **Deployment:** PM2 + Nginx + SSL/TLS
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── data/            # Static data (projects, etc.)
└── theme.js         # Chakra UI theme config
```

## 🔧 Configuration

- **PM2 Config:** `ecosystem.config.js`
- **Nginx Config:** `nginx/ersin.home.ro.conf`
- **CI/CD Workflow:** `.github/workflows/deploy.yml`
- **Environment:** `.env.production` (create from `env.production.example`)

## 📚 Documentation

All deployment documentation is in the [`docs/`](./docs/) folder:

> **🔒 Note:** Documentation files are encrypted in this public repo. See [docs/ENCRYPT_DOCS.md](./docs/ENCRYPT_DOCS.md) for decryption instructions.

- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - **START HERE!** Complete guide from Git Push to SSL Certificate (all steps, ports, fixes included)
- **[docs/CI_CD_SETUP.md](./docs/CI_CD_SETUP.md)** - GitHub Actions CI/CD setup
- **[docs/CONTACT_SETUP.md](./docs/CONTACT_SETUP.md)** - Contact form email configuration
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Troubleshooting common issues
- **[docs/SSL_VS_TLS_EXPLAINED.md](./docs/SSL_VS_TLS_EXPLAINED.md)** - SSL vs TLS explained
- **[docs/ENCRYPT_DOCS.md](./docs/ENCRYPT_DOCS.md)** - How to decrypt documentation files

## 🚢 Deployment

### Manual Deployment
```bash
cd /var/www/ersin-site
./deploy.sh
```

### Automatic Deployment (CI/CD)
Push to `main` branch → GitHub Actions deploys automatically!

See **[docs/CI_CD_SETUP.md](./docs/CI_CD_SETUP.md)** for setup instructions.

## 📝 License

ISC

## 👤 Author

Ersin - [ersin.home.ro](https://ersin.home.ro)

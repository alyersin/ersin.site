# Contact Form Setup Instructions

## Email Configuration

To make the contact form work, you need to set up email credentials in your environment variables.

### 1. Create a `.env.production` file on your server

```bash
nano /var/www/ersin-site/.env.production
```

Add these variables:
```env
NODE_ENV=production
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Save and exit** (Ctrl+X, then Y, then Enter)

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password in `EMAIL_PASS` (NOT your regular password)

### 3. Alternative Email Services

You can also use other email services by modifying the service in `/src/app/api/contact/route.js`:

- **Outlook/Hotmail**: Change `service: 'gmail'` to `service: 'hotmail'`
- **Yahoo**: Change `service: 'gmail'` to `service: 'yahoo'`
- **Custom SMTP**: Configure manually with host, port, etc.

### 4. Testing

1. Restart PM2: `pm2 restart ersin-site`
2. Open the contact form in your browser
3. Fill out and submit the form
4. Check your email for the message

### 5. Deployment

Make sure to add the environment variables to your server:
- Create `.env.production` file in `/var/www/ersin-site/`
- Never commit this file to git (it's in `.gitignore`)

## Troubleshooting

- **Authentication failed**: Make sure you're using an App Password for Gmail
- **Form not submitting**: Check browser console for errors
- **No email received**: Check spam folder and verify email configuration
- **500 Error**: Check PM2 logs: `pm2 logs ersin-site`

## Security Notes

- Never commit your `.env.production` file to version control
- Use App Passwords instead of regular passwords
- Consider using a dedicated email address for contact forms

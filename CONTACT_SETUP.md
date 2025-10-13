# Contact Form Setup Instructions

## Email Configuration

To make the contact form work, you need to set up email credentials in your environment variables.

### 1. Create a `.env.local` file in your project root

```bash
# Email Configuration for Contact Form
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

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

1. Start your development server: `npm run dev`
2. Open the contact form in your browser
3. Fill out and submit the form
4. Check your email for the message

### 5. Deployment

Make sure to add the environment variables to your hosting platform:
- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **Other platforms**: Follow their specific instructions

## Troubleshooting

- **Authentication failed**: Make sure you're using an App Password for Gmail
- **Form not submitting**: Check browser console for errors
- **No email received**: Check spam folder and verify email configuration

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of regular passwords
- Consider using a dedicated email address for contact forms

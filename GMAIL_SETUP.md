# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for email notifications in your ToDo application as an alternative to SendGrid.

## Overview

Gmail SMTP provides a free, reliable email service that's perfect for personal projects and small applications. You can send up to 500 emails per day using Gmail SMTP.

## Prerequisites

- Gmail account
- Node.js application (your ToDo app)
- Two-factor authentication enabled on Gmail (required for app passwords)

## Step 1: Enable Two-Factor Authentication

1. **Go to your Google Account settings**:
   ```
   https://myaccount.google.com/
   ```

2. **Navigate to Security**:
   - Click on "Security" in the left sidebar
   - Scroll down to "Signing in to Google"

3. **Enable 2-Step Verification**:
   - Click on "2-Step Verification"
   - Follow the setup process
   - Add your phone number for verification

## Step 2: Generate App Password

1. **Access App Passwords**:
   - Go back to Security settings
   - Under "Signing in to Google", click "App passwords"
   - You may need to sign in again

2. **Create New App Password**:
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (custom name)"
   - Enter a name like "ToDo App Notifications"
   - Click "Generate"

3. **Save the App Password**:
   - Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
   - **Important**: Save this password securely - you won't see it again!

## Step 3: Update Your Environment Variables

Update your `.env` file with Gmail SMTP configuration:

```env
# Gmail SMTP Configuration (replaces SendGrid)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
GMAIL_FROM_NAME=ToDo App Notifications

# Optional Gmail Settings
GMAIL_REPLY_TO=support@yourdomain.com
```

### Example Configuration:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Gmail SMTP Configuration (for Email)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
GMAIL_FROM_NAME=ToDo App Notifications
GMAIL_REPLY_TO=support@yourdomain.com
```

## Step 4: Install Required Dependencies

```bash
cd backend
npm install nodemailer
```

## Step 5: Create Gmail Email Service

I'll create a new email service that uses Gmail SMTP instead of SendGrid.

## Step 6: Test Gmail Configuration

### Test Gmail SMTP Connection
```bash
# Test if Gmail credentials work
curl -X GET http://localhost:5000/api/test/gmail-config
```

### Send Test Email
```bash
# Send a test email via Gmail
curl -X POST http://localhost:5000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "subject": "Test Email from ToDo App",
    "message": "This is a test email sent via Gmail SMTP! 📧"
  }'
```

### PowerShell Test Command
```powershell
$body = @{
    email = "your-test-email@example.com"
    subject = "Test Email from ToDo App"
    message = "This is a test email sent via Gmail SMTP! 📧"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/email" -Method POST -Body $body -ContentType "application/json"
```

## Gmail SMTP Advantages

### ✅ **Pros**
- **Free**: 500 emails per day at no cost
- **Reliable**: Google's infrastructure ensures high deliverability
- **Simple Setup**: Just need Gmail account and app password
- **No Monthly Fees**: Unlike SendGrid's paid plans
- **Familiar Interface**: Use your existing Gmail account
- **Good Deliverability**: Gmail-to-Gmail emails have excellent delivery rates

### ⚠️ **Limitations**
- **Daily Limit**: 500 emails per day (vs SendGrid's higher limits)
- **Rate Limiting**: Maximum 100 recipients per email
- **Less Analytics**: No detailed delivery analytics like SendGrid
- **Branding**: Emails come from your Gmail address
- **No Templates**: Basic HTML emails only (no dynamic templates)

## Alternative Email Services

If you need more than 500 emails per day, consider these alternatives:

### 1. **Mailgun** (Recommended)
- **Free Tier**: 5,000 emails/month for 3 months
- **Pricing**: $35/month for 50,000 emails
- **Features**: Advanced analytics, templates, API
- **Setup**: Similar to SendGrid

### 2. **Amazon SES**
- **Free Tier**: 62,000 emails/month (if sent from EC2)
- **Pricing**: $0.10 per 1,000 emails
- **Features**: High deliverability, detailed analytics
- **Setup**: Requires AWS account

### 3. **Resend**
- **Free Tier**: 3,000 emails/month
- **Pricing**: $20/month for 50,000 emails
- **Features**: Modern API, great developer experience
- **Setup**: Simple API integration

### 4. **Postmark**
- **Free Tier**: 100 emails/month
- **Pricing**: $15/month for 10,000 emails
- **Features**: Focus on transactional emails
- **Setup**: Clean API, good documentation

### 5. **EmailJS** (Frontend-only)
- **Free Tier**: 200 emails/month
- **Pricing**: $15/month for 1,000 emails
- **Features**: Send emails directly from frontend
- **Setup**: No backend required

## Comparison Table

| Service | Free Tier | Paid Starting | Best For |
|---------|-----------|---------------|----------|
| **Gmail SMTP** | 500/day | Free | Personal projects |
| **Mailgun** | 5,000/month | $35/month | Small businesses |
| **Amazon SES** | 62,000/month* | $0.10/1000 | High volume |
| **Resend** | 3,000/month | $20/month | Modern apps |
| **Postmark** | 100/month | $15/month | Transactional |
| **EmailJS** | 200/month | $15/month | Frontend apps |

*From EC2 instances only

## Security Best Practices

### Gmail SMTP Security
1. **Never commit app passwords** to version control
2. **Use environment variables** for all credentials
3. **Enable 2FA** on your Gmail account
4. **Rotate app passwords** regularly
5. **Use dedicated Gmail account** for app notifications
6. **Monitor email activity** in Gmail security settings

### Email Content Security
1. **Sanitize user input** in email content
2. **Validate email addresses** before sending
3. **Rate limit email sending** to prevent abuse
4. **Log email activities** for audit trails
5. **Handle bounces and failures** gracefully

## Troubleshooting

### Common Issues

**Authentication Failed**:
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution**: 
- Ensure 2FA is enabled
- Generate new app password
- Use app password, not regular Gmail password

**Connection Timeout**:
```
Error: Connection timeout
```
**Solution**:
- Check internet connection
- Verify Gmail SMTP settings
- Check firewall settings

**Daily Limit Exceeded**:
```
Error: 550 5.4.5 Daily sending quota exceeded
```
**Solution**:
- Wait 24 hours for quota reset
- Consider upgrading to paid service
- Optimize email frequency

**Blocked by Gmail**:
```
Error: 550 5.7.1 Message rejected
```
**Solution**:
- Check Gmail security settings
- Verify sender reputation
- Review email content for spam triggers

## Production Considerations

### For Production Deployment:

1. **Use Dedicated Gmail Account**:
   - Create separate Gmail account for app notifications
   - Don't use personal Gmail account

2. **Monitor Usage**:
   - Track daily email count
   - Set up alerts for quota limits
   - Plan for scaling if needed

3. **Email Templates**:
   - Create consistent HTML templates
   - Use responsive email design
   - Test across email clients

4. **Error Handling**:
   - Implement retry logic for failed emails
   - Log email failures for debugging
   - Have fallback notification methods

5. **Performance**:
   - Queue emails for bulk sending
   - Implement connection pooling
   - Cache email templates

## Migration from SendGrid

If you were previously using SendGrid:

1. **Update Environment Variables**:
   - Replace SendGrid vars with Gmail vars
   - Update deployment configs

2. **Update Code**:
   - Switch from SendGrid SDK to Nodemailer
   - Update email templates if needed

3. **Test Thoroughly**:
   - Test all email types (reminder, overdue, completion)
   - Verify email formatting
   - Check delivery rates

4. **Monitor Performance**:
   - Compare delivery times
   - Monitor bounce rates
   - Track user engagement

## Getting Started Checklist

- [ ] Enable 2FA on Gmail account
- [ ] Generate app password
- [ ] Update .env file with Gmail credentials
- [ ] Install nodemailer package
- [ ] Update NotificationService to use Gmail
- [ ] Test email sending functionality
- [ ] Verify email delivery and formatting
- [ ] Set up monitoring for daily limits

Gmail SMTP provides an excellent free alternative to SendGrid for personal projects and small applications. With proper setup and monitoring, it can reliably handle your notification needs! 📧✨

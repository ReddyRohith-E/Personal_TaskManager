# Gmail Email Testing Guide

This guide provides comprehensive testing procedures for your Gmail email integration in the ToDo application.

## 🔧 Configuration Testing

### 1. Check Gmail Configuration

```bash
# Check if Gmail is properly configured
curl -X GET http://localhost:5000/api/test/gmail-config
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Gmail is properly configured",
  "config": {
    "user": "your-email@gmail.com",
    "from": "ToDo App <your-email@gmail.com>"
  }
}
```

### 2. Send Test Email

```bash
curl -X POST http://localhost:5000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email from ToDo App",
    "message": "Test email from ToDo App! 🎉"
  }'
```

## 📧 Email Testing

### Test Basic Email
```powershell
# PowerShell testing
$body = @{
    to = "test@example.com"
    subject = "Test Email from ToDo App"
    message = "Test email from ToDo App! 🎉"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/email" -Method POST -Body $body -ContentType "application/json"
```

### Test Enhanced Task Email
```powershell
# Test task reminder email with enhanced templates
$body = @{
    to = "test@example.com"
    taskId = "your-task-id-here"
    type = "reminder"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/task-email" -Method POST -Body $body -ContentType "application/json"
```

### Test Bulk Email
```powershell
# Test sending emails to multiple recipients
$body = @{
    emails = @("user1@example.com", "user2@example.com")
    subject = "Bulk Test Email"
    message = "This is a bulk test email from ToDo App!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/test/bulk-email" -Method POST -Body $body -ContentType "application/json"
```

## 🌟 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test/gmail-config` | GET | Check Gmail configuration status |
| `/api/test/service-status` | GET | Check Gmail service status |
| `/api/test/email` | POST | Send test email |
| `/api/test/task-email` | POST | Send enhanced task email |
| `/api/test/bulk-email` | POST | Send bulk test emails |

## ✅ Expected Success Responses

### Configuration Check (Gmail)
```json
{
  "status": "success", 
  "service": "gmail",
  "configured": true,
  "message": "Gmail is properly configured"
}
```

### Email Send Success
```json
{
  "status": "success",
  "message": "Email sent successfully",
  "messageId": "unique-message-id",
  "to": "recipient@example.com"
}
```

### Service Status
```json
{
  "status": "success",
  "gmail": {
    "configured": true,
    "status": "operational"
  },
  "quotas": {
    "daily": "500 emails per day",
    "hourly": "100 emails per hour"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Gmail Authentication Error**
   - Check GMAIL_USER and GMAIL_APP_PASSWORD in .env
   - Ensure App Password is correctly generated in Google Account settings

2. **Email Not Delivered**
   - Check spam/junk folder
   - Verify recipient email address
   - Check Gmail sending quotas

3. **SSL/TLS Errors**
   - Ensure port 587 is open
   - Verify SMTP settings (smtp.gmail.com:587)

4. **Rate Limiting**
   - Gmail has sending limits (500/day, 100/hour for new accounts)
   - Implement retry logic with exponential backoff

### Debugging Commands

```bash
# Check service logs
curl -X GET http://localhost:5000/api/test/service-status

# Test email configuration
curl -X GET http://localhost:5000/api/test/gmail-config

# Send test email with detailed response
curl -X POST http://localhost:5000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Debug Test","message":"Debug email test"}'
```

## 📊 Performance Testing

Test email delivery performance:

```bash
# Send multiple test emails to measure performance
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/test/email \
    -H "Content-Type: application/json" \
    -d "{\"to\":\"test@example.com\",\"subject\":\"Performance Test $i\",\"message\":\"Performance test email #$i\"}"
  echo "Sent email $i"
done
```

## 🔐 Security Notes

- Never commit Gmail credentials to version control
- Use App Passwords instead of regular passwords
- Regularly rotate App Passwords
- Monitor for unusual sending activity
- Implement rate limiting on email endpoints

## 📈 Monitoring

Monitor your email service:
- Track delivery rates
- Monitor bounce rates  
- Watch for authentication failures
- Check sending quotas usage

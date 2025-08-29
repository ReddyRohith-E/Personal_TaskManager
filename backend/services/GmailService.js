const nodemailer = require('nodemailer');

class GmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.warn('⚠️ Gmail credentials not found in environment variables');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: gmailUser,
          pass: gmailAppPassword
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      this.isConfigured = true;
      console.log('✅ Gmail SMTP transporter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gmail transporter:', error.message);
      this.isConfigured = false;
    }
  }

  async verifyConnection() {
    if (!this.isConfigured || !this.transporter) {
      throw new Error('Gmail transporter not configured');
    }

    try {
      await this.transporter.verify();
      console.log('✅ Gmail SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ Gmail SMTP verification failed:', error.message);
      throw error;
    }
  }

  async sendEmail({ to, subject, text, html, replyTo, priority = 'normal' }) {
    if (!this.isConfigured || !this.transporter) {
      throw new Error('Gmail service not properly configured');
    }

    const fromName = process.env.GMAIL_FROM_NAME || 'ToDo App';
    const fromEmail = process.env.GMAIL_USER;
    const defaultReplyTo = process.env.GMAIL_REPLY_TO || fromEmail;

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: text,
      html: html || this.generateHTMLFromText(text, subject),
      replyTo: replyTo || defaultReplyTo,
      // Gmail specific options
      messageId: `${Date.now()}.${Math.random().toString(36).substring(7)}@${fromEmail.split('@')[1]}`,
      headers: {
        'X-Mailer': 'ToDo App Notification System v2.0',
        'X-Priority': priority === 'urgent' ? '1' : priority === 'high' ? '2' : '3',
        'X-MSMail-Priority': priority === 'urgent' ? 'High' : priority === 'high' ? 'High' : 'Normal',
        'Importance': priority === 'urgent' ? 'high' : priority === 'high' ? 'high' : 'normal'
      }
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully via Gmail SMTP:', {
        messageId: info.messageId,
        to: to,
        subject: subject,
        response: info.response
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      };
    } catch (error) {
      console.error('❌ Failed to send email via Gmail SMTP:', error.message);
      throw error;
    }
  }

  generateHTMLFromText(text, subject = '') {
    if (!text) return '';

    // Convert plain text to basic HTML with enhanced formatting
    const htmlContent = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #14b8a6; text-decoration: none;">$1</a>');

    // Determine email type for styling
    const isUrgent = subject.includes('URGENT') || subject.includes('⚠️') || subject.includes('🚨');
    const isOverdue = subject.includes('Overdue') || subject.includes('OVERDUE');
    const isReminder = subject.includes('Reminder') || subject.includes('📋');
    const isCompletion = subject.includes('Completed') || subject.includes('✅');

    let themeColors = {
      primary: '#14b8a6',
      secondary: '#0ea5e9',
      background: '#f8fafc',
      accent: '#3b82f6'
    };

    if (isUrgent || isOverdue) {
      themeColors.primary = '#ef4444';
      themeColors.accent = '#dc2626';
    } else if (isCompletion) {
      themeColors.primary = '#10b981';
      themeColors.accent = '#059669';
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject || 'ToDo App Notification'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            background-color: ${themeColors.background};
            padding: 20px;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .header {
            background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          
          .header .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .header .tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
          }
          
          .content {
            padding: 40px 30px;
            background: white;
          }
          
          .content p {
            margin: 16px 0;
            color: #475569;
          }
          
          .content h1, .content h2, .content h3 {
            color: #1e293b;
            margin: 20px 0 12px 0;
          }
          
          .highlight-box {
            background: linear-gradient(135deg, ${themeColors.primary}15 0%, ${themeColors.secondary}15 100%);
            border-left: 4px solid ${themeColors.primary};
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          
          .action-button {
            display: inline-block;
            background: linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
          }
          
          .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: #64748b;
            font-size: 14px;
            margin: 8px 0;
          }
          
          .footer a {
            color: ${themeColors.primary};
            text-decoration: none;
            font-weight: 500;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, ${themeColors.primary}40 50%, transparent 100%);
            margin: 30px 0;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">
              📝 ${process.env.GMAIL_FROM_NAME || 'ToDo App'}
            </div>
            <div class="tagline">Smart Task Management & Notifications</div>
          </div>
          
          <div class="content">
            <p>${htmlContent}</p>
            
            <div class="divider"></div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="action-button">
                🚀 Open ToDo App
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Stay organized, stay productive!</strong></p>
            <p>This email was sent from your personal ToDo App notification system.</p>
            <div class="divider"></div>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Open App</a> •
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile">Manage Notifications</a> •
              <a href="mailto:${process.env.GMAIL_REPLY_TO || process.env.GMAIL_USER}">Contact Support</a>
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
              © ${new Date().getFullYear()} ToDo App. Made with ❤️ for productivity.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendTaskReminder({ to, task, message }) {
    const priority = task.priority || 'medium';
    const priorityEmoji = { 
      urgent: '🚨', 
      high: '🔴', 
      medium: '🟡', 
      low: '🟢' 
    }[priority] || '🟡';
    
    const subject = `${priorityEmoji} Task Reminder: ${task.title}`;
    
    const enhancedMessage = this.enhanceTaskMessage(message, task, 'reminder');
    const html = this.generateTaskHTML(task, enhancedMessage, 'reminder');
    
    return this.sendEmail({ 
      to, 
      subject, 
      text: enhancedMessage, 
      html,
      priority: priority === 'urgent' ? 'urgent' : priority === 'high' ? 'high' : 'normal'
    });
  }

  async sendTaskOverdue({ to, task, message }) {
    const subject = `🚨 OVERDUE: ${task.title} - Immediate Action Required`;
    
    const enhancedMessage = this.enhanceTaskMessage(message, task, 'overdue');
    const html = this.generateTaskHTML(task, enhancedMessage, 'overdue');
    
    return this.sendEmail({ 
      to, 
      subject, 
      text: enhancedMessage, 
      html,
      priority: 'urgent'
    });
  }

  async sendTaskCompletion({ to, task, message }) {
    const subject = `✅ Task Completed: ${task.title} - Well Done!`;
    
    const enhancedMessage = this.enhanceTaskMessage(message, task, 'completion');
    const html = this.generateTaskHTML(task, enhancedMessage, 'completion');
    
    return this.sendEmail({ 
      to, 
      subject, 
      text: enhancedMessage, 
      html,
      priority: 'normal'
    });
  }

  enhanceTaskMessage(baseMessage, task, type) {
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleString() : new Date().toLocaleString();
    
    let enhancedMessage = baseMessage + '\n\n';
    
    // Add task details section
    enhancedMessage += '📋 **TASK DETAILS**\n';
    enhancedMessage += `**Title:** ${task.title}\n`;
    
    if (task.description) {
      enhancedMessage += `**Description:** ${task.description}\n`;
    }
    
    enhancedMessage += `**Type:** ${task.type || 'General'}\n`;
    enhancedMessage += `**Priority:** ${(task.priority || 'Medium').toUpperCase()}\n`;
    
    if (type === 'completion') {
      enhancedMessage += `**Completed:** ${completedDate}\n`;
    } else {
      enhancedMessage += `**Due Date:** ${dueDate}\n`;
    }
    
    if (type === 'overdue') {
      const overdueDays = this.getOverdueDays(task.dueDate);
      enhancedMessage += `**Overdue by:** ${overdueDays} day${overdueDays !== 1 ? 's' : ''}\n`;
    } else if (type === 'reminder') {
      const timeRemaining = this.getTimeRemaining(task.dueDate);
      enhancedMessage += `**Time Remaining:** ${timeRemaining}\n`;
    }
    
    if (task.tags && task.tags.length > 0) {
      enhancedMessage += `**Tags:** ${task.tags.join(', ')}\n`;
    }
    
    // Add motivational message based on type
    enhancedMessage += '\n';
    if (type === 'reminder') {
      enhancedMessage += '⏰ **Don\'t let this slip away!** Your future self will thank you for staying on top of this.\n';
    } else if (type === 'overdue') {
      enhancedMessage += '🚨 **This task needs your immediate attention!** The sooner you tackle it, the sooner you\'ll feel the relief of completion.\n';
    } else if (type === 'completion') {
      enhancedMessage += '🎉 **Congratulations!** You\'ve successfully completed another task. Your productivity streak continues!\n';
    }
    
    enhancedMessage += '\n📱 Open your ToDo App to manage your tasks: ' + (process.env.FRONTEND_URL || 'http://localhost:5173');
    
    return enhancedMessage;
  }

  generateTaskHTML(task, message, type) {
    const priorityClass = `priority-${task.priority || 'medium'}`;
    const typeEmoji = {
      reminder: '⏰',
      overdue: '🚨',
      completion: '✅'
    }[type] || '📋';
    
    const typeColor = {
      reminder: '#3b82f6',
      overdue: '#ef4444',
      completion: '#10b981'
    }[type] || '#14b8a6';
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date';
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleString() : new Date().toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${typeEmoji} ${task.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 20px;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          }
          
          .header {
            background: linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
          }
          
          .header-content {
            position: relative;
            z-index: 1;
          }
          
          .type-emoji {
            font-size: 48px;
            margin-bottom: 16px;
            display: block;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .message-box {
            background: linear-gradient(135deg, ${typeColor}10 0%, ${typeColor}05 100%);
            border-left: 4px solid ${typeColor};
            padding: 24px;
            margin-bottom: 30px;
            border-radius: 8px;
            font-size: 16px;
            line-height: 1.7;
          }
          
          .task-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          
          .task-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid ${typeColor}30;
          }
          
          .task-icon {
            font-size: 24px;
          }
          
          .task-title {
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            flex: 1;
          }
          
          .priority-badge {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .priority-urgent {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          
          .priority-high {
            background: #fff7ed;
            color: #ea580c;
            border: 1px solid #fed7aa;
          }
          
          .priority-medium {
            background: #fefce8;
            color: #ca8a04;
            border: 1px solid #fde047;
          }
          
          .priority-low {
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
          }
          
          .task-details {
            display: grid;
            gap: 16px;
          }
          
          .detail-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .detail-row:last-child {
            border-bottom: none;
          }
          
          .detail-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
          }
          
          .detail-label {
            font-weight: 600;
            color: #64748b;
            min-width: 120px;
          }
          
          .detail-value {
            color: #334155;
            font-weight: 500;
          }
          
          .action-section {
            text-align: center;
            margin: 40px 0;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 8px 16px ${typeColor}30;
            transition: all 0.3s ease;
          }
          
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          
          .footer h3 {
            margin-bottom: 16px;
            font-size: 18px;
          }
          
          .footer p {
            opacity: 0.8;
            margin: 8px 0;
            font-size: 14px;
          }
          
          .footer-links {
            margin-top: 20px;
          }
          
          .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
          }
          
          .footer-links a:hover {
            color: white;
          }
          
          @media (max-width: 600px) {
            .email-container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 20px; }
            .task-card { padding: 20px; }
            .header h1 { font-size: 20px; }
            .type-emoji { font-size: 36px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="header-content">
              <span class="type-emoji">${typeEmoji}</span>
              <h1>${task.title}</h1>
              <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Notification</div>
            </div>
          </div>
          
          <div class="content">
            <div class="message-box">
              ${message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
            
            <div class="task-card">
              <div class="task-header">
                <div class="task-icon">📋</div>
                <div class="task-title">${task.title}</div>
                <div class="priority-badge ${priorityClass}">${(task.priority || 'medium').toUpperCase()}</div>
              </div>
              
              <div class="task-details">
                ${task.description ? `
                  <div class="detail-row">
                    <div class="detail-icon">📝</div>
                    <div class="detail-label">Description:</div>
                    <div class="detail-value">${task.description}</div>
                  </div>
                ` : ''}
                
                <div class="detail-row">
                  <div class="detail-icon">🏷️</div>
                  <div class="detail-label">Type:</div>
                  <div class="detail-value">${task.type || 'General'}</div>
                </div>
                
                ${type === 'completion' ? `
                  <div class="detail-row">
                    <div class="detail-icon">✅</div>
                    <div class="detail-label">Completed:</div>
                    <div class="detail-value">${completedDate}</div>
                  </div>
                ` : `
                  <div class="detail-row">
                    <div class="detail-icon">📅</div>
                    <div class="detail-label">Due Date:</div>
                    <div class="detail-value">${dueDate}</div>
                  </div>
                `}
                
                ${type === 'overdue' ? `
                  <div class="detail-row">
                    <div class="detail-icon">⚠️</div>
                    <div class="detail-label">Overdue by:</div>
                    <div class="detail-value">${this.getOverdueDays(task.dueDate)} day${this.getOverdueDays(task.dueDate) !== 1 ? 's' : ''}</div>
                  </div>
                ` : ''}
                
                ${task.tags && task.tags.length > 0 ? `
                  <div class="detail-row">
                    <div class="detail-icon">🏷️</div>
                    <div class="detail-label">Tags:</div>
                    <div class="detail-value">${task.tags.join(', ')}</div>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="action-section">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">
                🚀 Open ToDo App
              </a>
            </div>
          </div>
          
          <div class="footer">
            <h3>📝 ${process.env.GMAIL_FROM_NAME || 'ToDo App'}</h3>
            <p>Smart Task Management & Productivity</p>
            <p>Stay organized, stay productive, achieve your goals!</p>
            
            <div class="footer-links">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Open App</a> •
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile">Settings</a> •
              <a href="mailto:${process.env.GMAIL_REPLY_TO || process.env.GMAIL_USER}">Support</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
              © ${new Date().getFullYear()} ToDo App. Made with ❤️ for productivity enthusiasts.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendBulkEmail(recipients, { subject, text, html }) {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients must be a non-empty array');
    }

    // Gmail SMTP has a limit of 100 recipients per email
    const maxRecipientsPerEmail = 100;
    const batches = [];
    
    for (let i = 0; i < recipients.length; i += maxRecipientsPerEmail) {
      batches.push(recipients.slice(i, i + maxRecipientsPerEmail));
    }

    const results = [];

    for (const batch of batches) {
      try {
        const result = await this.sendEmail({
          to: batch.join(', '),
          subject,
          text,
          html
        });
        results.push({ success: true, recipients: batch, result });
      } catch (error) {
        console.error(`Failed to send email to batch:`, error.message);
        results.push({ success: false, recipients: batch, error: error.message });
      }
    }

    return results;
  }

  getOverdueDays(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getTimeRemaining(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    
    if (diffTime <= 0) return 'Overdue';
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  getConnectionStatus() {
    return {
      isConfigured: this.isConfigured,
      hasCredentials: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      service: 'Gmail SMTP',
      host: 'smtp.gmail.com',
      port: 587,
      fromEmail: process.env.GMAIL_USER,
      fromName: process.env.GMAIL_FROM_NAME || 'ToDo App',
      dailyLimit: 500,
      rateLimits: {
        maxRecipientsPerEmail: 100,
        recommendedDelay: '1-2 seconds between emails'
      }
    };
  }

  async getQuotaInfo() {
    // Gmail doesn't provide API access to quota info via SMTP
    // This is an estimation based on Gmail's documented limits
    return {
      service: 'Gmail SMTP',
      dailyLimit: 500,
      currentUsage: 'Not available via SMTP',
      resetTime: 'Daily at midnight Pacific Time',
      recommendations: [
        'Monitor your sending volume manually',
        'Consider upgrading to Google Workspace for higher limits',
        'Use batch sending for multiple recipients',
        'Implement retry logic for rate limit errors',
        'Use beautiful HTML templates for better engagement',
        'Personalize emails based on task types and priorities'
      ]
    };
  }
}

module.exports = new GmailService();

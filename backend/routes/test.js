const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const MessageGenerator = require('../services/MessageGenerator');
const GmailService = require('../services/GmailService');

// Initialize notification service and message generator for testing
const notificationService = new NotificationService();
const messageGenerator = new MessageGenerator();

/**
 * Test Email functionality via Gmail SMTP
 * POST /api/test/email
 */
router.post('/email', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // Validate input
    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Email, subject, and message are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if Gmail is configured
    if (!GmailService.isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Gmail service not configured. Please check GMAIL_USER and GMAIL_APP_PASSWORD in your .env file.'
      });
    }

    // Send test email via Gmail
    const result = await GmailService.sendEmail({
      to: email,
      subject: subject || 'Test Email from ToDo App',
      text: message || 'This is a test email sent via Gmail SMTP from your ToDo application! 📧'
    });

    res.json({
      success: true,
      message: 'Email sent successfully via Gmail SMTP',
      service: 'Gmail SMTP',
      to: email,
      messageId: result.messageId,
      response: result.response
    });

  } catch (error) {
    console.error('Test email failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * Check Gmail SMTP configuration
 * GET /api/test/gmail-config
 */
router.get('/gmail-config', async (req, res) => {
  try {
    const status = GmailService.getConnectionStatus();
    
    if (status.isConfigured) {
      // Test connection
      await GmailService.verifyConnection();
      res.json({
        configured: true,
        message: 'Gmail SMTP is configured and connection verified',
        service: 'Gmail SMTP',
        details: {
          fromEmail: status.fromEmail ? 'Configured' : 'Missing',
          fromName: status.fromName ? 'Configured' : 'Using default',
          host: status.host,
          port: status.port,
          dailyLimit: status.dailyLimit,
          maxRecipientsPerEmail: status.rateLimits.maxRecipientsPerEmail
        },
        environment: process.env.NODE_ENV
      });
    } else {
      const missingFields = [];
      if (!process.env.GMAIL_USER) missingFields.push('GMAIL_USER');
      if (!process.env.GMAIL_APP_PASSWORD) missingFields.push('GMAIL_APP_PASSWORD');
      
      res.json({
        configured: false,
        message: 'Gmail SMTP configuration incomplete. Check your .env file.',
        service: 'Gmail SMTP',
        missing: missingFields,
        details: {
          gmailUser: !!process.env.GMAIL_USER ? 'Configured' : 'Missing',
          gmailAppPassword: !!process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Missing',
          gmailFromName: process.env.GMAIL_FROM_NAME || 'Using default: ToDo App'
        },
        setupGuide: 'See GMAIL_SETUP.md for configuration instructions',
        environment: process.env.NODE_ENV
      });
    }
  } catch (error) {
    res.status(500).json({
      configured: false,
      message: 'Gmail SMTP connection failed',
      service: 'Gmail SMTP',
      error: error.message,
      troubleshooting: [
        'Verify Gmail credentials are correct',
        'Ensure 2FA is enabled on Gmail account',
        'Check if app password is properly generated',
        'Verify internet connection'
      ]
    });
  }
});

/**
 * Test enhanced Gmail email functionality (task-specific)
 * POST /api/test/gmail-task-email
 */
router.post('/gmail-task-email', async (req, res) => {
  try {
    const { 
      email, 
      emailType = 'reminder', // 'reminder', 'overdue', 'completion'
      taskType = 'work',
      title = 'Sample Task',
      description = 'Test task description',
      priority = 'medium'
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    if (!GmailService.isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Gmail service not configured'
      });
    }

    // Create mock task
    const mockTask = {
      id: 'test-task-123',
      title,
      description,
      type: taskType,
      priority,
      dueDate: emailType === 'overdue' 
        ? new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        : new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      completedAt: emailType === 'completion' ? new Date() : null
    };

    // Generate custom message
    const messageGenerator = new MessageGenerator();
    let message;
    
    switch (emailType) {
      case 'reminder':
        message = messageGenerator.generateReminderMessage(mockTask, 'full');
        break;
      case 'overdue':
        message = messageGenerator.generateOverdueMessage(mockTask, 'full');
        break;
      case 'completion':
        message = messageGenerator.generateCompletionMessage(mockTask, 'full');
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid emailType. Use: reminder, overdue, or completion'
        });
    }

    // Send enhanced email
    let result;
    switch (emailType) {
      case 'reminder':
        result = await GmailService.sendTaskReminder({ to: email, task: mockTask, message });
        break;
      case 'overdue':
        result = await GmailService.sendTaskOverdue({ to: email, task: mockTask, message });
        break;
      case 'completion':
        result = await GmailService.sendTaskCompletion({ to: email, task: mockTask, message });
        break;
    }

    res.json({
      success: true,
      message: `Enhanced ${emailType} email sent successfully via Gmail SMTP`,
      service: 'Gmail SMTP',
      emailType,
      taskType,
      to: email,
      messageId: result.messageId,
      taskDetails: {
        title: mockTask.title,
        type: mockTask.type,
        priority: mockTask.priority
      }
    });

  } catch (error) {
    console.error('Gmail task email test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

/**
 * Get Gmail quota and service information
 * GET /api/test/gmail-quota
 */
router.get('/gmail-quota', async (req, res) => {
  try {
    const quotaInfo = await GmailService.getQuotaInfo();
    const connectionStatus = GmailService.getConnectionStatus();
    
    res.json({
      success: true,
      service: 'Gmail SMTP',
      quota: quotaInfo,
      connection: connectionStatus,
      recommendations: quotaInfo.recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get Gmail quota information'
    });
  }
});

/**
 * Get comprehensive notification service status
 * GET /api/test/service-status
 */
router.get('/service-status', async (req, res) => {
  try {
    const status = {
      email: GmailService.getConnectionStatus(),
      push: {
        service: 'Socket.io',
        configured: !!notificationService.io,
        realtime: true
      }
    };

    // Test connections if configured
    if (status.email.isConfigured) {
      try {
        await GmailService.verifyConnection();
        status.email.connectionTest = 'PASSED';
      } catch (error) {
        status.email.connectionTest = 'FAILED';
        status.email.connectionError = error.message;
      }
    }

    const configuredServices = Object.values(status).filter(s => s.configured).length;
    
    res.json({
      success: true,
      summary: {
        totalServices: 2, // Email and Push only
        configuredServices,
        allConfigured: configuredServices === 2
      },
      services: status,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get service status'
    });
  }
});

/**
 * Send a test notification (Email + Push only)
 * POST /api/test/full-notification
 */
router.post('/full-notification', async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    const results = [];
    const testMessage = message || 'Complete notification test from ToDo App! 🎉';

    // Test Email (using Gmail)
    try {
      const emailResult = await GmailService.sendEmail({
        to: email,
        subject: 'Complete Test Notification from ToDo App',
        text: testMessage
      });
      results.push({
        type: 'email',
        service: 'Gmail SMTP',
        success: true,
        messageId: emailResult.messageId,
        to: email,
        response: emailResult.response
      });
    } catch (error) {
      results.push({
        type: 'email',
        service: 'Gmail SMTP',
        success: false,
        error: error.message,
        to: email
      });
    }

    // Test Push notification (simulated)
    try {
      // Simulate push notification
      results.push({
        type: 'push',
        service: 'Socket.io',
        success: true,
        message: 'Push notification would be sent via Socket.io',
        simulated: true
      });
    } catch (error) {
      results.push({
        type: 'push',
        service: 'Socket.io',
        success: false,
        error: error.message,
        simulated: true
      });
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: successCount > 0,
      message: `${successCount}/${totalCount} notifications sent successfully`,
      results,
      services: {
        email: 'Gmail SMTP',
        push: 'Socket.io'
      }
    });

  } catch (error) {
    console.error('Full notification test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test custom messages based on task type
 * POST /api/test/custom-message
 */
router.post('/custom-message', async (req, res) => {
  try {
    const { 
      taskType = 'work',
      priority = 'medium', 
      title = 'Sample Task',
      description = 'This is a test task description',
      messageType = 'reminder' // 'reminder', 'overdue', 'completion'
    } = req.body;

    // Create a mock task object
    const mockTask = {
      title,
      description,
      type: taskType,
      priority,
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      tags: ['test', taskType],
      isRecurring: false
    };

    // Generate different message types
    let messages = {};
    
    if (messageType === 'reminder' || messageType === 'all') {
      messages.reminder = {
        full: messageGenerator.generateReminderMessage(mockTask, 'full'),
        email: messageGenerator.generateReminderMessage(mockTask, 'email'),
        push: messageGenerator.generateReminderMessage(mockTask, 'push')
      };
    }

    if (messageType === 'overdue' || messageType === 'all') {
      // Set task as overdue for testing
      const overdueTask = { ...mockTask, dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000) };
      messages.overdue = {
        full: messageGenerator.generateOverdueMessage(overdueTask, 'full'),
        email: messageGenerator.generateOverdueMessage(overdueTask, 'email'),
        push: messageGenerator.generateOverdueMessage(overdueTask, 'push')
      };
    }

    if (messageType === 'completion' || messageType === 'all') {
      // Set task as completed for testing
      const completedTask = { ...mockTask, completedAt: new Date() };
      messages.completion = {
        full: messageGenerator.generateCompletionMessage(completedTask, 'full'),
        email: messageGenerator.generateCompletionMessage(completedTask, 'email'),
        push: messageGenerator.generateCompletionMessage(completedTask, 'push')
      };
    }

    res.json({
      success: true,
      taskType,
      priority,
      messageType,
      messages,
      availableTypes: messageGenerator.getAvailableTaskTypes(),
      typeConfig: messageGenerator.getTaskTypeConfig(taskType)
    });

  } catch (error) {
    console.error('Custom message test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get all available task types and their configurations
 * GET /api/test/task-types
 */
router.get('/task-types', (req, res) => {
  try {
    const taskTypes = messageGenerator.getAvailableTaskTypes();
    const configurations = {};
    
    taskTypes.forEach(type => {
      configurations[type] = messageGenerator.getTaskTypeConfig(type);
    });

    res.json({
      success: true,
      taskTypes,
      configurations,
      totalTypes: taskTypes.length
    });

  } catch (error) {
    console.error('Task types fetch failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test bulk email sending
 * POST /api/test/bulk-email
 */
router.post('/bulk-email', async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Emails array is required and must not be empty'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Subject and message are required'
      });
    }

    if (!GmailService.isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Gmail service not configured'
      });
    }

    const results = await GmailService.sendBulkEmail(emails, {
      subject: subject || 'Bulk Test Email from ToDo App',
      text: message || 'This is a bulk test email from your ToDo application!'
    });

    const successCount = results.filter(r => r.success).length;
    const totalBatches = results.length;

    res.json({
      success: successCount > 0,
      message: `${successCount}/${totalBatches} email batches sent successfully`,
      totalEmails: emails.length,
      results,
      service: 'Gmail SMTP'
    });

  } catch (error) {
    console.error('Bulk email test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

/**
 * Test custom message functionality
 * POST /api/test/custom-message
 */
router.post('/custom-message', async (req, res) => {
  try {
    const { 
      email,
      messageType = 'reminder', // 'reminder', 'overdue', 'completion'
      customMessage,
      taskTitle = 'Sample Custom Message Task',
      taskType = 'work',
      priority = 'medium'
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    if (!customMessage) {
      return res.status(400).json({
        success: false,
        error: 'Custom message is required'
      });
    }

    // Create a mock task object for message generation
    const mockTask = {
      title: taskTitle,
      description: `Test task for custom ${messageType} message`,
      type: taskType,
      priority: priority,
      dueDate: new Date(),
      tags: ['test', 'custom-message'],
      userId: 'test-user'
    };

    // Use custom message instead of auto-generated
    const subject = `${messageType.charAt(0).toUpperCase() + messageType.slice(1)}: ${taskTitle}`;
    
    // Send email with custom message
    await gmailService.sendEmail({
      to: email,
      subject: subject,
      text: customMessage,
      html: gmailService.generateHTMLFromText(customMessage, {
        title: subject,
        priority: priority,
        type: taskType
      })
    });

    res.json({
      success: true,
      message: `Custom ${messageType} message sent successfully`,
      details: {
        to: email,
        subject: subject,
        messageType: messageType,
        customMessage: customMessage,
        taskType: taskType,
        priority: priority
      },
      service: 'Gmail SMTP'
    });

  } catch (error) {
    console.error('Custom message test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

/**
 * Test custom task notification with user-defined messages
 * POST /api/test/custom-task-notification
 */
router.post('/custom-task-notification', async (req, res) => {
  try {
    const { 
      email,
      taskData,
      customMessages = {}
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    if (!taskData) {
      return res.status(400).json({
        success: false,
        error: 'Task data is required'
      });
    }

    // Default task data
    const task = {
      title: 'Custom Notification Test',
      description: 'Testing custom notifications',
      type: 'work',
      priority: 'medium',
      dueDate: new Date(),
      ...taskData
    };

    const results = [];

    // Test reminder message if provided
    if (customMessages.reminderMessage) {
      try {
        const subject = `Reminder: ${task.title}`;
        await gmailService.sendEmail({
          to: email,
          subject: subject,
          text: customMessages.reminderMessage,
          html: gmailService.generateHTMLFromText(customMessages.reminderMessage, {
            title: subject,
            priority: task.priority,
            type: task.type
          })
        });
        
        results.push({
          type: 'reminder',
          success: true,
          message: 'Reminder message sent successfully'
        });
      } catch (error) {
        results.push({
          type: 'reminder',
          success: false,
          error: error.message
        });
      }
    }

    // Test overdue message if provided
    if (customMessages.overdueMessage) {
      try {
        const subject = `OVERDUE: ${task.title}`;
        await gmailService.sendEmail({
          to: email,
          subject: subject,
          text: customMessages.overdueMessage,
          html: gmailService.generateHTMLFromText(customMessages.overdueMessage, {
            title: subject,
            priority: 'urgent',
            type: task.type
          })
        });
        
        results.push({
          type: 'overdue',
          success: true,
          message: 'Overdue message sent successfully'
        });
      } catch (error) {
        results.push({
          type: 'overdue',
          success: false,
          error: error.message
        });
      }
    }

    // Test completion message if provided
    if (customMessages.completionMessage) {
      try {
        const subject = `Completed: ${task.title}`;
        await gmailService.sendEmail({
          to: email,
          subject: subject,
          text: customMessages.completionMessage,
          html: gmailService.generateHTMLFromText(customMessages.completionMessage, {
            title: subject,
            priority: task.priority,
            type: task.type
          })
        });
        
        results.push({
          type: 'completion',
          success: true,
          message: 'Completion message sent successfully'
        });
      } catch (error) {
        results.push({
          type: 'completion',
          success: false,
          error: error.message
        });
      }
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No custom messages provided. Include reminderMessage, overdueMessage, or completionMessage.'
      });
    }

    res.json({
      success: true,
      message: `Custom task notifications tested`,
      results: results,
      taskData: task,
      service: 'Gmail SMTP'
    });

  } catch (error) {
    console.error('Custom task notification test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

/**
 * Validate custom message content
 * POST /api/test/validate-message
 */
router.post('/validate-message', async (req, res) => {
  try {
    const { message, messageType = 'reminder' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const validation = {
      length: message.length,
      wordCount: message.split(/\s+/).length,
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(message),
      hasEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(message),
      isValid: true,
      warnings: [],
      suggestions: []
    };

    // Validation rules
    if (validation.length < 10) {
      validation.warnings.push('Message is very short - consider adding more context');
    }
    
    if (validation.length > 500) {
      validation.warnings.push('Message is quite long - consider shortening for better readability');
    }

    if (messageType === 'reminder' && !message.toLowerCase().includes('reminder')) {
      validation.suggestions.push('Consider including the word "reminder" to clarify the message type');
    }

    if (messageType === 'overdue' && !message.toLowerCase().includes('overdue')) {
      validation.suggestions.push('Consider including "overdue" to emphasize urgency');
    }

    if (messageType === 'completion' && !message.toLowerCase().includes('complet')) {
      validation.suggestions.push('Consider including "completed" or "congratulations" for positive reinforcement');
    }

    // Tone analysis
    const positiveWords = ['great', 'excellent', 'good', 'awesome', 'congratulations', 'well done'];
    const urgentWords = ['urgent', 'immediately', 'asap', 'critical', 'important'];
    const politeWords = ['please', 'thank you', 'kindly', 'appreciate'];

    validation.tone = {
      positive: positiveWords.some(word => message.toLowerCase().includes(word)),
      urgent: urgentWords.some(word => message.toLowerCase().includes(word)),
      polite: politeWords.some(word => message.toLowerCase().includes(word))
    };

    res.json({
      success: true,
      message: 'Message validation completed',
      messageType: messageType,
      originalMessage: message,
      validation: validation
    });

  } catch (error) {
    console.error('Message validation failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

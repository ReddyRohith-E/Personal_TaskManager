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

module.exports = router;

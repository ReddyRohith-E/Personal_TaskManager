const express = require('express');
const { body, validationResult } = require('express-validator');
const NotificationService = require('../services/NotificationService');
const GmailService = require('../services/GmailService');

const router = express.Router();

// Initialize notification service for routes
const notificationService = new NotificationService();

// Get notification history
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await notificationService.getNotificationStats(userId);
    
    res.json({
      success: true,
      data: {
        notifications: stats,
        message: 'Notification history retrieved successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Test email notification
router.post('/test/email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, subject, message } = req.body;
    const userId = req.user.id;

    if (!GmailService.isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Gmail service not configured. Please check your email settings.'
      });
    }

    const result = await notificationService.sendEmail(
      email,
      subject,
      message,
      null, // no taskId for test
      userId
    );

    res.json({
      success: true,
      message: 'Test email sent successfully',
      service: 'Gmail SMTP',
      messageId: result.messageId,
      to: email
    });

  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

// Send enhanced task email (reminder, overdue, completion)
router.post('/send/task-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('taskId').trim().isLength({ min: 1 }).withMessage('Task ID is required'),
  body('emailType').isIn(['reminder', 'overdue', 'completion']).withMessage('Valid email type is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, taskId, emailType, customMessage } = req.body;
    const userId = req.user.id;

    if (!GmailService.isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Gmail service not configured. Please check your email settings.'
      });
    }

    // Get task details (you'll need to implement this based on your Task model)
    const Task = require('../models/Task');
    const task = await Task.findById(taskId, userId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const message = customMessage || `This is a ${emailType} notification for your task.`;
    
    const result = await notificationService.sendEnhancedTaskEmail(
      emailType,
      email,
      task,
      message,
      userId
    );

    res.json({
      success: true,
      message: `Enhanced ${emailType} email sent successfully`,
      service: 'Gmail SMTP',
      emailType,
      messageId: result.messageId,
      taskTitle: task.title
    });

  } catch (error) {
    console.error('Enhanced task email failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      service: 'Gmail SMTP'
    });
  }
});

// Get notification service status
router.get('/status', async (req, res, next) => {
  try {
    const status = await notificationService.getServiceStatus();
    
    res.json({
      success: true,
      data: status,
      message: 'Notification service status retrieved'
    });
  } catch (error) {
    next(error);
  }
});

// Get email service quota information
router.get('/quota', async (req, res, next) => {
  try {
    const quotaInfo = await notificationService.getEmailQuotaInfo();
    
    res.json({
      success: true,
      data: quotaInfo,
      message: 'Email quota information retrieved'
    });
  } catch (error) {
    next(error);
  }
});

// Test email connection
router.post('/test/connection', async (req, res, next) => {
  try {
    const result = await notificationService.testEmailConnection();
    
    res.json({
      success: true,
      data: result,
      message: 'Email connection test completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Email connection test failed'
    });
  }
});

// Send custom notification
router.post('/send/custom', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, subject, message } = req.body;
    const userId = req.user.id;

    const result = await notificationService.sendCustomNotification(
      userId,
      subject,
      message,
      email
    );

    res.json({
      success: true,
      data: result,
      message: 'Custom notification sent successfully'
    });

  } catch (error) {
    console.error('Custom notification failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

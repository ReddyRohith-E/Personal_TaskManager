const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

// Validation middleware
const taskValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').optional().trim(),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('reminderTime').optional().isISO8601().withMessage('Valid reminder time required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priority must be low, medium, high, or urgent'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// Get all tasks for user
router.get('/', [
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { status, priority, search, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId: req.user.id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get tasks with real-time countdown
router.get('/countdown', async (req, res, next) => {
  try {
    const tasks = await Task.getTasksWithCountdown(req.user.id);

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Task.getDashboardStats(req.user.id);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

// Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Create new task
router.post('/', taskValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { 
      title, 
      description, 
      dueDate, 
      reminderTime, 
      priority, 
      tags, 
      type, 
      reminders, 
      customNotifications 
    } = req.body;

    // Validate reminder time is before due date
    if (reminderTime && new Date(reminderTime) >= new Date(dueDate)) {
      return res.status(400).json({ 
        error: 'Reminder time must be before due date' 
      });
    }

    // Validate multiple reminders
    if (reminders && Array.isArray(reminders)) {
      for (const reminder of reminders) {
        if (new Date(reminder.time) >= new Date(dueDate)) {
          return res.status(400).json({ 
            error: 'All reminder times must be before due date' 
          });
        }
      }
    }

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      dueDate,
      reminderTime,
      priority,
      tags,
      type: type || 'other',
      reminders: reminders || [],
      customNotifications: customNotifications || {}
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('dueDate').optional().isISO8601(),
  body('reminderTime').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('type').optional().isIn([
    'work', 'personal', 'health', 'finance', 'education', 
    'shopping', 'meeting', 'deadline', 'appointment', 
    'project', 'exercise', 'social', 'travel', 'maintenance', 'other'
  ]),
  body('tags').optional().isArray(),
  body('reminders').optional().isArray(),
  body('customNotifications').optional().isObject()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const updates = {};
    const allowedFields = [
      'title', 'description', 'dueDate', 'reminderTime', 
      'priority', 'status', 'tags', 'type', 'reminders', 'customNotifications'
    ];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    // Validate reminder time is before due date
    if (updates.reminderTime && updates.dueDate && 
        new Date(updates.reminderTime) >= new Date(updates.dueDate)) {
      return res.status(400).json({ 
        error: 'Reminder time must be before due date' 
      });
    }

    // Validate multiple reminders
    if (updates.reminders && Array.isArray(updates.reminders)) {
      const dueDate = updates.dueDate || (await Task.findById(req.params.id)).dueDate;
      for (const reminder of updates.reminders) {
        if (new Date(reminder.time) >= new Date(dueDate)) {
          return res.status(400).json({ 
            error: 'All reminder times must be before due date' 
          });
        }
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Add reminder to task
router.post('/:id/reminders', [
  body('time').isISO8601().withMessage('Valid reminder time is required'),
  body('message.custom').optional().isLength({ max: 500 }).withMessage('Custom message too long'),
  body('message.email.subject').optional().isLength({ max: 100 }).withMessage('Email subject too long'),
  body('message.email.body').optional().isLength({ max: 1000 }).withMessage('Email body too long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate reminder time is before due date
    if (new Date(req.body.time) >= new Date(task.dueDate)) {
      return res.status(400).json({ 
        error: 'Reminder time must be before due date' 
      });
    }

    await task.addReminder(req.body);

    res.json({
      success: true,
      message: 'Reminder added successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Remove reminder from task
router.delete('/:id/reminders/:reminderId', async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.removeReminder(req.params.reminderId);

    res.json({
      success: true,
      message: 'Reminder removed successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Update custom notifications for task
router.put('/:id/notifications', [
  body('custom.enabled').optional().isBoolean(),
  body('custom.reminderMessage').optional().isLength({ max: 500 }).withMessage('Reminder message too long'),
  body('custom.overdueMessage').optional().isLength({ max: 500 }).withMessage('Overdue message too long'),
  body('custom.completionMessage').optional().isLength({ max: 500 }).withMessage('Completion message too long'),
  body('email.enabled').optional().isBoolean(),
  body('email.subject').optional().isLength({ max: 100 }).withMessage('Email subject too long'),
  body('email.body').optional().isLength({ max: 1000 }).withMessage('Email body too long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { customNotifications: req.body },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Custom notifications updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Test custom notification
router.post('/:id/test-notification', [
  body('type').isIn(['email', 'custom']).withMessage('Type must be email or custom'),
  body('email').optional().isEmail().withMessage('Valid email required for email test'),
  body('customMessage').optional().isString().withMessage('Custom message must be a string')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const NotificationService = require('../services/NotificationService');
    const notificationService = new NotificationService();

    let result;
    if (req.body.type === 'email' && req.body.email) {
      const subject = task.customMessage?.reminderMessage || 
                     `Task Reminder: ${task.title}`;
      const body = task.customMessage?.reminderMessage || 
                  `This is a reminder for your task: ${task.title}`;
      result = await notificationService.sendEmail(req.body.email, subject, body, task._id, req.user.id);
    } else if (req.body.type === 'custom' && req.body.customMessage) {
      // For custom messages, we can send as email notification
      const subject = `Custom Task Notification: ${task.title}`;
      const body = req.body.customMessage;
      result = await notificationService.sendEmail(req.body.email || req.user.email, subject, body, task._id, req.user.id);
    } else {
      return res.status(400).json({ error: 'Missing required fields for notification test' });
    }

    res.json({
      success: true,
      message: 'Test notification sent',
      data: { result }
    });
  } catch (error) {
    next(error);
  }
});

// Bulk delete completed tasks
router.delete('/bulk/completed', [
  query('olderThan').optional().isInt({ min: 1 }).withMessage('olderThan must be a positive number (days)')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const olderThan = parseInt(req.query.olderThan) || 30; // Default 30 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThan);

    const result = await Task.deleteMany({
      userId: req.user.id,
      status: 'completed',
      completedAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed tasks older than ${olderThan} days`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
});

// Get cleanup statistics
router.get('/cleanup/stats', async (req, res, next) => {
  try {
    const CleanupService = require('../services/CleanupService');
    const stats = await CleanupService.getCleanupStats();

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

// Manual cleanup trigger
router.post('/cleanup/run', async (req, res, next) => {
  try {
    const CleanupService = require('../services/CleanupService');
    const result = await CleanupService.runCleanupNow();

    res.json({
      success: true,
      message: 'Cleanup completed',
      data: { result }
    });
  } catch (error) {
    next(error);
  }
});

// Mark task as complete
router.patch('/:id/complete', async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.markComplete();

    res.json({
      success: true,
      message: 'Task marked as complete',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

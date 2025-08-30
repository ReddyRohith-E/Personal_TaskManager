const db = require('../config/database');
const MessageGenerator = require('./MessageGenerator');
const GmailService = require('./GmailService');
const Task = require('../models/Task');

class NotificationService {
  constructor(io = null) {
    this.io = io;
    this.messageGenerator = new MessageGenerator();
    this.gmailService = GmailService;

    // Initialize Gmail Service
    if (this.gmailService.isConfigured) {
      console.log('✅ Gmail email service initialized');
    } else {
      console.warn('⚠️  Gmail credentials not configured - Email notifications disabled');
    }
  }

  async sendEmail(email, subject, message, taskId = null, userId = null) {
    if (!this.gmailService.isConfigured) {
      throw new Error('Gmail service not configured');
    }

    try {
      const result = await this.gmailService.sendEmail({
        to: email,
        subject: subject,
        text: message
      });

      // Log notification
      await this.logNotification({
        userId,
        taskId,
        type: 'email',
        recipient: email,
        message: subject,
        status: 'sent',
        externalId: result.messageId
      });

      console.log(`📧 Email sent to ${email} via Gmail SMTP: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      // Log failed notification
      await this.logNotification({
        userId,
        taskId,
        type: 'email',
        recipient: email,
        message: subject,
        status: 'failed',
        error: error.message
      });

      console.error('❌ Email failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEnhancedTaskEmail(emailType, email, task, message, userId = null) {
    if (!this.gmailService.isConfigured) {
      throw new Error('Gmail service not configured');
    }

    try {
      let result;
      
      switch (emailType) {
        case 'reminder':
          result = await this.gmailService.sendTaskReminder({
            to: email,
            task: task,
            message: message
          });
          break;
          
        case 'overdue':
          result = await this.gmailService.sendTaskOverdue({
            to: email,
            task: task,
            message: message
          });
          break;
          
        case 'completion':
          result = await this.gmailService.sendTaskCompletion({
            to: email,
            task: task,
            message: message
          });
          break;
          
        default:
          result = await this.gmailService.sendEmail({
            to: email,
            subject: `📋 Task Update: ${task.title}`,
            text: message
          });
      }

      // Log notification
      await this.logNotification({
        userId,
        taskId: task.id,
        type: 'email',
        recipient: email,
        message: `${emailType}: ${task.title}`,
        status: 'sent',
        externalId: result.messageId
      });

      console.log(`📧 Enhanced ${emailType} email sent to ${email} via Gmail SMTP: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      // Log failed notification
      await this.logNotification({
        userId,
        taskId: task.id,
        type: 'email',
        recipient: email,
        message: `${emailType}: ${task.title}`,
        status: 'failed',
        error: error.message
      });

      console.error(`❌ Enhanced ${emailType} email failed:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendPushNotification(userId, title, message, taskId = null) {
    if (!this.io) {
      console.warn('Socket.io not configured for push notifications');
      return { success: false, error: 'Socket.io not configured' };
    }

    try {
      // Send real-time notification via Socket.io
      this.io.to(`user-${userId}`).emit('notification', {
        type: 'task_reminder',
        title,
        message,
        taskId,
        timestamp: new Date().toISOString()
      });

      // Log notification
      await this.logNotification({
        userId,
        taskId,
        type: 'push',
        recipient: `user-${userId}`,
        message: title,
        status: 'sent'
      });

      console.log(`🔔 Push notification sent to user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Push notification failed:', error);
      
      await this.logNotification({
        userId,
        taskId,
        type: 'push',
        recipient: `user-${userId}`,
        message: title,
        status: 'failed',
        error: error.message
      });

      return { success: false, error: error.message };
    }
  }

  // Enhanced method for sending task reminders with custom messages
  async sendTaskReminder(task, user, reminder = null) {
    const { notification_preferences = {} } = user;
    const {
      email: emailEnabled = true,
      push: pushEnabled = true
    } = notification_preferences;

    let emailSubject, emailBody, pushTitle;

    // Use custom messages if available, otherwise generate them
    if (reminder && reminder.message) {
      emailSubject = reminder.message.email?.subject;
      emailBody = reminder.message.email?.body;
    } else if (task.customNotifications) {
      emailSubject = task.customNotifications.email?.subject;
      emailBody = task.customNotifications.email?.body;
    }

    // Generate default messages if custom ones are not available
    if (!emailSubject) {
      emailSubject = this.messageGenerator.generateReminderMessage(task, 'push');
    }
    if (!emailBody) {
      emailBody = this.messageGenerator.generateReminderMessage(task, 'full');
    }
    pushTitle = emailSubject;

    const notifications = [];

    try {
      // Send push notification (always try first for immediate feedback)
      if (pushEnabled) {
        const pushResult = await this.sendPushNotification(
          user.id,
          pushTitle,
          emailBody,
          task.id
        );
        notifications.push({ type: 'push', ...pushResult });
      }

      // Send enhanced email notification if enabled
      if (emailEnabled && user.email && 
          (task.customNotifications?.email?.enabled !== false)) {
        const emailResult = await this.sendEnhancedTaskEmail(
          'reminder',
          user.email,
          task,
          emailBody,
          user.id
        );
        notifications.push({ type: 'email', ...emailResult });
      }

      // Mark reminder as sent
      if (reminder) {
        await task.markSpecificReminderSent(reminder.id);
      } else {
        await task.markReminderSent();
      }

      console.log(`✅ Sent ${notifications.length} notifications for task: ${task.title}`);
      return { success: true, notifications };

    } catch (error) {
      console.error('❌ Error sending task reminder:', error);
      return { success: false, error: error.message, notifications };
    }
  }

  async sendOverdueAlert(task, user) {
    // Generate custom overdue messages based on task type
    const emailMessage = this.messageGenerator.generateOverdueMessage(task, 'full');
    const pushTitle = this.messageGenerator.generateOverdueMessage(task, 'push');
    const pushMessage = `${task.title} is overdue!`;

    const notifications = [];

    try {
      // Always send push notification for overdue tasks
      const pushResult = await this.sendPushNotification(
        user.id,
        pushTitle,
        pushMessage,
        task.id
      );
      notifications.push({ type: 'push', ...pushResult });

      // Send enhanced email if enabled
      if (user.notification_preferences?.email && user.email) {
        const emailResult = await this.sendEnhancedTaskEmail(
          'overdue',
          user.email,
          task,
          emailMessage,
          user.id
        );
        notifications.push({ type: 'email', ...emailResult });
      }

      console.log(`🚨 Sent overdue alert for ${task.type} task: ${task.title}`);
      return { success: true, notifications };
    } catch (error) {
      console.error('❌ Error sending overdue alert:', error);
      return { success: false, error: error.message, notifications };
    }
  }

  async sendTaskCompletionNotification(task, user) {
    const { notification_preferences = {} } = user;
    const {
      email: emailEnabled = true,
      push: pushEnabled = true
    } = notification_preferences;

    // Generate custom completion messages based on task type
    const emailMessage = this.messageGenerator.generateCompletionMessage(task, 'full');
    const pushTitle = this.messageGenerator.generateCompletionMessage(task, 'push');
    const pushMessage = this.messageGenerator.generateCompletionMessage(task, 'push');

    const notifications = [];

    try {
      // Send push notification for completion
      if (pushEnabled) {
        const pushResult = await this.sendPushNotification(
          user.id,
          pushTitle,
          pushMessage,
          task.id
        );
        notifications.push({ type: 'push', ...pushResult });
      }

      // Send enhanced email notification for important task types
      const importantTypes = ['work', 'deadline', 'project', 'meeting', 'appointment'];
      if (emailEnabled && user.email && importantTypes.includes(task.type)) {
        const emailResult = await this.sendEnhancedTaskEmail(
          'completion',
          user.email,
          task,
          emailMessage,
          user.id
        );
        notifications.push({ type: 'email', ...emailResult });
      }

      console.log(`✅ Sent completion notification for ${task.type} task: ${task.title}`);
      return { success: true, notifications };

    } catch (error) {
      console.error('❌ Error sending completion notification:', error);
      return { success: false, error: error.message, notifications };
    }
  }

  // Process all due reminders including multiple reminders per task
  async processDueReminders() {
    try {
      console.log('Processing due reminders...');
      
      // Get tasks with due reminders using the new reminder system
      const dueReminders = await Task.getDueReminders();
      
      let processed = 0;
      let failed = 0;

      for (const reminderData of dueReminders) {
        try {
          // Find the user
          const User = require('../models/User');
          const user = await User.findById(reminderData.userId);
          
          if (user) {
            await this.sendTaskReminder(reminderData, user, reminderData.reminders);
            processed++;
          }
        } catch (error) {
          console.error(`Failed to send reminder for task ${reminderData._id}:`, error);
          failed++;
        }
      }

      // Also process legacy reminders
      const legacyReminders = await Task.getUpcomingReminders();
      
      for (const task of legacyReminders) {
        try {
          const User = require('../models/User');
          const user = await User.findById(task.userId);
          
          if (user) {
            await this.sendTaskReminder(task, user);
            processed++;
          }
        } catch (error) {
          console.error(`Failed to send legacy reminder for task ${task._id}:`, error);
          failed++;
        }
      }

      console.log(`Reminder processing completed: ${processed} sent, ${failed} failed`);
      
      return {
        success: true,
        processed: processed,
        failed: failed,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error processing due reminders:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Send custom notification (Email only now)
  async sendCustomNotification(userId, emailSubject, emailBody, emailAddress) {
    try {
      const results = {};

      // Send email if email address provided
      if (emailAddress && emailSubject && emailBody) {
        results.email = await this.sendEmail(emailAddress, emailSubject, emailBody, null, userId);
      }

      return {
        success: true,
        results: results,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error sending custom notification:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async logNotification({ userId, taskId, type, recipient, message, status, externalId = null, error = null }) {
    try {
      const NotificationLog = require('../models/NotificationLog');
      await NotificationLog.create({
        userId,
        taskId,
        type,
        recipient,
        message,
        status,
        externalId,
        error
      });
    } catch (logError) {
      console.error('❌ Failed to log notification:', logError);
    }
  }

  async getNotificationStats(userId) {
    try {
      const query = `
        SELECT 
          type,
          status,
          COUNT(*) as count
        FROM notification_logs 
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY type, status
        ORDER BY type, status
      `;
      
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Failed to get notification stats:', error);
      return [];
    }
  }

  async getServiceStatus() {
    const status = {
      email: this.gmailService.getConnectionStatus(),
      push: {
        service: 'Socket.io',
        configured: !!this.io,
        realtime: true
      }
    };

    return status;
  }

  async testEmailConnection() {
    if (!this.gmailService.isConfigured) {
      throw new Error('Gmail service not configured');
    }

    try {
      await this.gmailService.verifyConnection();
      return { success: true, message: 'Gmail SMTP connection verified successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getEmailQuotaInfo() {
    return await this.gmailService.getQuotaInfo();
  }
}

module.exports = NotificationService;

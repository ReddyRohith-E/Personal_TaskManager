const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const NotificationService = require('./NotificationService');

class TimerService {
  constructor(io, notificationService = null) {
    this.io = io;
    this.notificationService = notificationService || new NotificationService(io);
    this.countdownIntervals = new Map();
  }

  // Start real-time countdown updates via Socket.io
  startCountdownUpdates() {
    console.log('🕐 Starting real-time countdown service...');
    
    // Update countdowns every second
    setInterval(async () => {
      try {
        // Get all active tasks with countdowns
        const query = `
          SELECT t.*, u.id as user_id
          FROM tasks t
          JOIN users u ON t.user_id = u.id
          WHERE t.status = 'pending' 
            AND t.due_date > NOW()
        `;
        
        const db = require('../config/database');
        const result = await db.query(query);
        
        // Group tasks by user
        const userTasks = {};
        result.rows.forEach(task => {
          if (!userTasks[task.user_id]) {
            userTasks[task.user_id] = [];
          }
          
          const timeRemaining = Math.max(0, Math.floor(
            (new Date(task.due_date) - new Date()) / 1000
          ));
          
          userTasks[task.user_id].push({
            id: task.id,
            title: task.title,
            dueDate: task.due_date,
            timeRemaining,
            isOverdue: timeRemaining === 0
          });
        });

        // Send updates to each user
        Object.keys(userTasks).forEach(userId => {
          this.io.to(`user-${userId}`).emit('countdown-update', {
            tasks: userTasks[userId],
            timestamp: new Date().toISOString()
          });
        });

      } catch (error) {
        console.error('❌ Error in countdown update:', error);
      }
    }, 1000); // Update every second
  }

  // Start notification scheduler (checks every minute)
  startNotificationScheduler() {
    console.log('📅 Starting notification scheduler...');
    
    // Check for reminders every minute
    cron.schedule('* * * * *', async () => {
      try {
        await this.processTaskReminders();
        await this.processOverdueTasks();
      } catch (error) {
        console.error('❌ Error in notification scheduler:', error);
      }
    });

    // Daily cleanup of old notifications (runs at 2 AM)
    cron.schedule('0 2 * * *', async () => {
      try {
        await this.cleanupOldNotifications();
      } catch (error) {
        console.error('❌ Error in notification cleanup:', error);
      }
    });

    console.log('✅ Notification scheduler started');
  }

  async processTaskReminders() {
    try {
      // Get tasks that need reminders (within next 5 minutes and not yet sent)
      const tasksToRemind = await Task.getUpcomingReminders(5);
      
      for (const task of tasksToRemind) {
        try {
          const user = {
            id: task.user_id,
            email: task.email,
            first_name: task.first_name,
            notification_preferences: task.notification_preferences || {}
          };

          // Send reminder notifications
          await this.notificationService.sendTaskReminder(task, user);
          
          // Mark reminder as sent
          await Task.markReminderSent(task.id);
          
          // Send real-time update to user
          this.io.to(`user-${task.user_id}`).emit('task-reminder-sent', {
            taskId: task.id,
            title: task.title,
            message: 'Reminder sent successfully',
            timestamp: new Date().toISOString()
          });

          console.log(`✅ Processed reminder for task: ${task.title}`);
          
        } catch (error) {
          console.error(`❌ Failed to send reminder for task ${task.id}:`, error);
        }
      }

      if (tasksToRemind.length > 0) {
        console.log(`📨 Processed ${tasksToRemind.length} task reminders`);
      }

    } catch (error) {
      console.error('❌ Error processing task reminders:', error);
    }
  }

  async processOverdueTasks() {
    try {
      const overdueTasks = await Task.getOverdueTasks();
      
      for (const task of overdueTasks) {
        try {
          // Check if we've already sent an overdue alert today
          const db = require('../config/database');
          const alertCheck = await db.query(`
            SELECT id FROM notification_logs 
            WHERE task_id = $1 
              AND type = 'push' 
              AND message LIKE '%overdue%'
              AND created_at >= CURRENT_DATE
          `, [task.id]);

          // Only send one overdue alert per day
          if (alertCheck.rows.length === 0) {
            const user = {
              id: task.user_id,
              email: task.email,
              first_name: task.first_name,
              notification_preferences: task.notification_preferences || {}
            };

            await this.notificationService.sendOverdueAlert(task, user);
            
            // Send real-time update to user
            this.io.to(`user-${task.user_id}`).emit('task-overdue', {
              taskId: task.id,
              title: task.title,
              dueDate: task.due_date,
              timestamp: new Date().toISOString()
            });

            console.log(`🚨 Sent overdue alert for task: ${task.title}`);
          }
          
        } catch (error) {
          console.error(`❌ Failed to process overdue task ${task.id}:`, error);
        }
      }

      if (overdueTasks.length > 0) {
        console.log(`🚨 Processed ${overdueTasks.length} overdue tasks`);
      }

    } catch (error) {
      console.error('❌ Error processing overdue tasks:', error);
    }
  }

  async cleanupOldNotifications() {
    try {
      const db = require('../config/database');
      
      // Delete notification logs older than 90 days
      const result = await db.query(`
        DELETE FROM notification_logs 
        WHERE created_at < NOW() - INTERVAL '90 days'
      `);

      console.log(`🧹 Cleaned up ${result.rowCount} old notification logs`);
      
    } catch (error) {
      console.error('❌ Error cleaning up notifications:', error);
    }
  }

  // Manual trigger for testing
  async triggerTestReminder(taskId, userId) {
    try {
      const task = await Task.findById(taskId, userId);
      if (!task) {
        throw new Error('Task not found');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await this.notificationService.sendTaskReminder(task, user);
      console.log(`🧪 Test reminder sent for task: ${task.title}`);
      
      return { success: true, message: 'Test reminder sent' };
    } catch (error) {
      console.error('❌ Error sending test reminder:', error);
      throw error;
    }
  }

  // Get countdown status for specific tasks
  async getTaskCountdowns(userId) {
    try {
      const tasks = await Task.getTasksWithCountdown(userId);
      
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        timeRemaining: Math.max(0, Math.floor(task.time_remaining_seconds)),
        isOverdue: task.is_overdue,
        status: task.status,
        priority: task.priority
      }));
      
    } catch (error) {
      console.error('❌ Error getting task countdowns:', error);
      throw error;
    }
  }

  // Format time remaining for display
  static formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Overdue';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

module.exports = TimerService;

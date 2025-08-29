/**
 * Message Generator Service
 * Generates custom notification messages based on task properties
 */

class MessageGenerator {
  constructor() {
    // Define task type configurations
    this.taskTypeConfigs = {
      work: {
        icon: '💼',
        reminderPrefix: 'Work Reminder',
        overduePrefix: 'Work Task Overdue',
        completionPrefix: 'Work Completed',
        reminderTemplates: [
          'Time to focus on your work task: "{title}"',
          'Your work deadline is approaching: "{title}"',
          'Don\'t forget your work commitment: "{title}"',
          'Professional reminder: "{title}" needs attention'
        ],
        overdueTemplates: [
          'Work deadline missed! "{title}" requires immediate attention',
          'Professional priority: "{title}" is overdue',
          'Work task "{title}" needs urgent completion'
        ]
      },
      personal: {
        icon: '🏠',
        reminderPrefix: 'Personal Reminder',
        overduePrefix: 'Personal Task Overdue',
        completionPrefix: 'Personal Goal Achieved',
        reminderTemplates: [
          'Personal reminder: Don\'t forget "{title}"',
          'Time for your personal task: "{title}"',
          'Your personal goal "{title}" is due soon',
          'Personal commitment reminder: "{title}"'
        ],
        overdueTemplates: [
          'Personal task overdue: "{title}" needs your attention',
          'Your personal commitment "{title}" is past due',
          'Personal reminder: "{title}" is waiting for completion'
        ]
      },
      health: {
        icon: '🏥',
        reminderPrefix: 'Health Reminder',
        overduePrefix: 'Health Priority',
        completionPrefix: 'Health Goal Completed',
        reminderTemplates: [
          'Health reminder: Time for "{title}"',
          'Your wellness task "{title}" is due',
          'Health priority: Don\'t miss "{title}"',
          'Take care of yourself: "{title}" is scheduled now'
        ],
        overdueTemplates: [
          'Health priority overdue: "{title}" needs immediate attention',
          'Your wellness task "{title}" is past due - prioritize your health!',
          'Health reminder: "{title}" was missed - reschedule soon'
        ]
      },
      finance: {
        icon: '💰',
        reminderPrefix: 'Financial Reminder',
        overduePrefix: 'Financial Urgent',
        completionPrefix: 'Financial Task Completed',
        reminderTemplates: [
          'Financial reminder: "{title}" is due',
          'Money matters: Don\'t forget "{title}"',
          'Financial deadline approaching: "{title}"',
          'Budget reminder: Time to handle "{title}"'
        ],
        overdueTemplates: [
          'Financial deadline missed! "{title}" needs immediate action',
          'Money matters: "{title}" is overdue - act now!',
          'Financial priority: "{title}" requires urgent attention'
        ]
      },
      education: {
        icon: '📚',
        reminderPrefix: 'Study Reminder',
        overduePrefix: 'Study Task Overdue',
        completionPrefix: 'Learning Achievement',
        reminderTemplates: [
          'Study time: "{title}" is scheduled now',
          'Learning reminder: Don\'t miss "{title}"',
          'Educational goal: "{title}" is due',
          'Knowledge building: Time for "{title}"'
        ],
        overdueTemplates: [
          'Study deadline passed: "{title}" needs attention',
          'Learning goal overdue: Catch up on "{title}"',
          'Educational priority: "{title}" is past due'
        ]
      },
      shopping: {
        icon: '🛒',
        reminderPrefix: 'Shopping Reminder',
        overduePrefix: 'Shopping Task Overdue',
        completionPrefix: 'Shopping Completed',
        reminderTemplates: [
          'Shopping reminder: Time to get "{title}"',
          'Don\'t forget to buy: "{title}"',
          'Shopping list alert: "{title}" is needed',
          'Purchase reminder: "{title}" is on your list'
        ],
        overdueTemplates: [
          'Shopping task overdue: Still need to get "{title}"',
          'Purchase reminder: "{title}" is still pending',
          'Shopping alert: "{title}" was supposed to be bought'
        ]
      },
      meeting: {
        icon: '🤝',
        reminderPrefix: 'Meeting Reminder',
        overduePrefix: 'Meeting Missed',
        completionPrefix: 'Meeting Completed',
        reminderTemplates: [
          'Meeting alert: "{title}" is starting soon',
          'Conference reminder: "{title}" is scheduled now',
          'Don\'t miss your meeting: "{title}"',
          'Appointment alert: "{title}" is coming up'
        ],
        overdueTemplates: [
          'Meeting missed! "{title}" was scheduled earlier',
          'Appointment overdue: "{title}" needs rescheduling',
          'Conference alert: "{title}" was missed'
        ]
      },
      deadline: {
        icon: '⏰',
        reminderPrefix: 'Deadline Alert',
        overduePrefix: 'DEADLINE MISSED',
        completionPrefix: 'Deadline Met',
        reminderTemplates: [
          'DEADLINE ALERT: "{title}" is due now!',
          'Critical deadline: "{title}" must be completed',
          'Time sensitive: "{title}" deadline approaching',
          'URGENT: "{title}" deadline is here'
        ],
        overdueTemplates: [
          'DEADLINE MISSED! "{title}" is overdue - URGENT ACTION REQUIRED',
          'CRITICAL: "{title}" deadline has passed!',
          'URGENT: "{title}" is past deadline - immediate action needed'
        ]
      },
      appointment: {
        icon: '📅',
        reminderPrefix: 'Appointment Reminder',
        overduePrefix: 'Appointment Missed',
        completionPrefix: 'Appointment Completed',
        reminderTemplates: [
          'Appointment reminder: "{title}" is scheduled now',
          'Don\'t miss your appointment: "{title}"',
          'Upcoming appointment: "{title}"',
          'Scheduled appointment: "{title}" is starting'
        ],
        overdueTemplates: [
          'Appointment missed: "{title}" was scheduled earlier',
          'Missed appointment: "{title}" needs rescheduling',
          'Appointment alert: "{title}" was not attended'
        ]
      },
      project: {
        icon: '📋',
        reminderPrefix: 'Project Update',
        overduePrefix: 'Project Behind Schedule',
        completionPrefix: 'Project Milestone',
        reminderTemplates: [
          'Project reminder: "{title}" milestone due',
          'Project alert: Time to work on "{title}"',
          'Project deadline: "{title}" needs attention',
          'Project progress: "{title}" is scheduled now'
        ],
        overdueTemplates: [
          'Project behind schedule: "{title}" is overdue',
          'Project deadline missed: "{title}" needs immediate focus',
          'Project alert: "{title}" milestone was missed'
        ]
      },
      exercise: {
        icon: '💪',
        reminderPrefix: 'Workout Reminder',
        overduePrefix: 'Workout Missed',
        completionPrefix: 'Workout Completed',
        reminderTemplates: [
          'Workout time: "{title}" is scheduled now',
          'Fitness reminder: Time for "{title}"',
          'Exercise alert: Don\'t skip "{title}"',
          'Health goal: "{title}" workout is due'
        ],
        overdueTemplates: [
          'Workout missed: "{title}" was scheduled earlier',
          'Fitness goal behind: "{title}" was skipped',
          'Exercise reminder: Catch up on "{title}"'
        ]
      },
      social: {
        icon: '👥',
        reminderPrefix: 'Social Reminder',
        overduePrefix: 'Social Commitment Missed',
        completionPrefix: 'Social Activity Completed',
        reminderTemplates: [
          'Social reminder: "{title}" is planned now',
          'Don\'t forget: "{title}" with friends/family',
          'Social commitment: "{title}" is scheduled',
          'Personal time: "{title}" is coming up'
        ],
        overdueTemplates: [
          'Social commitment missed: "{title}" was planned',
          'Social reminder: "{title}" was supposed to happen',
          'Personal time missed: "{title}" needs rescheduling'
        ]
      },
      travel: {
        icon: '✈️',
        reminderPrefix: 'Travel Reminder',
        overduePrefix: 'Travel Task Overdue',
        completionPrefix: 'Travel Prepared',
        reminderTemplates: [
          'Travel reminder: "{title}" needs attention',
          'Trip preparation: Don\'t forget "{title}"',
          'Travel alert: "{title}" is due now',
          'Journey prep: Time for "{title}"'
        ],
        overdueTemplates: [
          'Travel task overdue: "{title}" still needs completion',
          'Trip preparation behind: "{title}" was missed',
          'Travel alert: "{title}" should have been done'
        ]
      },
      maintenance: {
        icon: '🔧',
        reminderPrefix: 'Maintenance Reminder',
        overduePrefix: 'Maintenance Overdue',
        completionPrefix: 'Maintenance Completed',
        reminderTemplates: [
          'Maintenance due: "{title}" needs attention',
          'Upkeep reminder: Time for "{title}"',
          'Maintenance alert: "{title}" is scheduled',
          'Service reminder: "{title}" is due now'
        ],
        overdueTemplates: [
          'Maintenance overdue: "{title}" needs immediate attention',
          'Service alert: "{title}" is past due',
          'Maintenance behind: "{title}" was missed'
        ]
      },
      other: {
        icon: '📝',
        reminderPrefix: 'Task Reminder',
        overduePrefix: 'Task Overdue',
        completionPrefix: 'Task Completed',
        reminderTemplates: [
          'Reminder: "{title}" is due now',
          'Don\'t forget: "{title}"',
          'Task alert: "{title}" needs completion',
          'Scheduled task: "{title}" is ready'
        ],
        overdueTemplates: [
          'Task overdue: "{title}" needs attention',
          'Missed task: "{title}" is past due',
          'Overdue alert: "{title}" requires completion'
        ]
      }
    };

    // Priority-based message modifiers
    this.priorityModifiers = {
      urgent: {
        prefix: '🚨 URGENT',
        suffix: '- ACT NOW!',
        emphasis: '⚠️⚠️⚠️'
      },
      high: {
        prefix: '⚡ HIGH PRIORITY',
        suffix: '- Important!',
        emphasis: '⚠️⚠️'
      },
      medium: {
        prefix: '',
        suffix: '',
        emphasis: '⚠️'
      },
      low: {
        prefix: '📌',
        suffix: '- When convenient',
        emphasis: ''
      }
    };
  }

  /**
   * Generate reminder message for a task
   */
  generateReminderMessage(task, messageType = 'full') {
    const config = this.taskTypeConfigs[task.type] || this.taskTypeConfigs.other;
    const priority = this.priorityModifiers[task.priority] || this.priorityModifiers.medium;
    
    // Select random template for variety
    const templates = config.reminderTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Format the basic message
    const basicMessage = template.replace('{title}', task.title);
    
    // Add priority modifier
    const priorityPrefix = priority.prefix ? `${priority.prefix} ` : '';
    const prioritySuffix = priority.suffix ? ` ${priority.suffix}` : '';
    
    // Format due date
    const dueDate = new Date(task.dueDate).toLocaleString();
    const timeUntilDue = this.getTimeUntilDue(task.dueDate);
    
    if (messageType === 'short') {
      // Short version for brief notifications
      return `${config.icon} ${priorityPrefix}${basicMessage}${prioritySuffix} Due: ${dueDate}`;
    } else if (messageType === 'push') {
      // Push notification title
      return `${config.icon} ${priorityPrefix}${config.reminderPrefix}`;
    } else {
      // Full message for email
      let message = `${config.icon} ${priorityPrefix}${config.reminderPrefix}\n\n`;
      message += `${basicMessage}\n\n`;
      
      if (task.description) {
        message += `Description: ${task.description}\n\n`;
      }
      
      message += `Due Date: ${dueDate}\n`;
      message += `Time Remaining: ${timeUntilDue}\n`;
      message += `Priority: ${task.priority.toUpperCase()}\n`;
      
      if (task.tags && task.tags.length > 0) {
        message += `Tags: ${task.tags.join(', ')}\n`;
      }
      
      if (task.isRecurring) {
        message += `Recurring: ${task.recurringPattern}\n`;
      }
      
      message += `\n${priority.emphasis} ${prioritySuffix}`;
      
      return message.trim();
    }
  }

  /**
   * Generate overdue alert message for a task
   */
  generateOverdueMessage(task, messageType = 'full') {
    const config = this.taskTypeConfigs[task.type] || this.taskTypeConfigs.other;
    const priority = this.priorityModifiers[task.priority] || this.priorityModifiers.medium;
    
    // Select random template for variety
    const templates = config.overdueTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Format the basic message
    const basicMessage = template.replace('{title}', task.title);
    
    // Calculate how overdue
    const overdueDuration = this.getOverdueDuration(task.dueDate);
    const wasdue = new Date(task.dueDate).toLocaleString();
    
    if (messageType === 'short') {
      // Short version for brief notifications
      return `${config.icon} 🚨 ${basicMessage} Was due: ${wasdue}. ${overdueDuration} overdue!`;
    } else if (messageType === 'push') {
      // Push notification title
      return `${config.icon} 🚨 ${config.overduePrefix}`;
    } else {
      // Full message for email
      let message = `${config.icon} 🚨 ${config.overduePrefix}\n\n`;
      message += `${basicMessage}\n\n`;
      
      if (task.description) {
        message += `Description: ${task.description}\n\n`;
      }
      
      message += `Was Due: ${wasdue}\n`;
      message += `Overdue By: ${overdueDuration}\n`;
      message += `Priority: ${task.priority.toUpperCase()}\n`;
      
      if (task.tags && task.tags.length > 0) {
        message += `Tags: ${task.tags.join(', ')}\n`;
      }
      
      message += `\n🚨 This task requires immediate attention! 🚨`;
      
      if (priority.suffix) {
        message += `\n${priority.emphasis} ${priority.suffix}`;
      }
      
      return message.trim();
    }
  }

  /**
   * Generate completion message for a task
   */
  generateCompletionMessage(task, messageType = 'full') {
    const config = this.taskTypeConfigs[task.type] || this.taskTypeConfigs.other;
    
    const completionTemplates = [
      'Congratulations! "{title}" has been completed successfully! 🎉',
      'Well done! "{title}" is now complete! ✅',
      'Task accomplished! "{title}" has been finished! 👏',
      'Success! "{title}" is checked off your list! 🌟',
      'Great job! "{title}" has been completed! 💪'
    ];
    
    const template = completionTemplates[Math.floor(Math.random() * completionTemplates.length)];
    const basicMessage = template.replace('{title}', task.title);
    
    if (messageType === 'short') {
      return `${config.icon} ✅ ${basicMessage}`;
    } else if (messageType === 'push') {
      return `${config.icon} ✅ ${config.completionPrefix}`;
    } else {
      let message = `${config.icon} ✅ ${config.completionPrefix}\n\n`;
      message += `${basicMessage}\n\n`;
      
      if (task.description) {
        message += `Task: ${task.description}\n\n`;
      }
      
      const completedTime = task.completedAt ? new Date(task.completedAt).toLocaleString() : new Date().toLocaleString();
      message += `Completed: ${completedTime}\n`;
      message += `Type: ${task.type}\n`;
      message += `Priority: ${task.priority.toUpperCase()}\n`;
      
      if (task.isRecurring) {
        message += `\nNote: This is a recurring task (${task.recurringPattern}). The next instance will be created automatically.`;
      }
      
      message += `\n\nKeep up the great work! 🎯`;
      
      return message.trim();
    }
  }

  /**
   * Calculate time until due date
   */
  getTimeUntilDue(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  /**
   * Calculate how long task has been overdue
   */
  getOverdueDuration(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = now.getTime() - due.getTime();
    
    if (diff <= 0) return 'Not overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  /**
   * Get available task types
   */
  getAvailableTaskTypes() {
    return Object.keys(this.taskTypeConfigs);
  }

  /**
   * Get task type configuration
   */
  getTaskTypeConfig(type) {
    return this.taskTypeConfigs[type] || this.taskTypeConfigs.other;
  }
}

module.exports = MessageGenerator;

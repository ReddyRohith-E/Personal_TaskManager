const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  dueDate: {
    type: Date,
    required: true
  },
  reminderTime: {
    type: Date,
    required: false
  },
  reminders: [{
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    time: {
      type: Date,
      required: true
    },
    message: {
      email: {
        subject: {
          type: String,
          trim: true,
          maxlength: 100
        },
        body: {
          type: String,
          trim: true,
          maxlength: 1000
        }
      },
      push: {
        type: String,
        trim: true,
        maxlength: 100
      },
      custom: {
        enabled: {
          type: Boolean,
          default: true
        },
        reminderMessage: {
          type: String,
          trim: true,
          maxlength: 500
        },
        overdueMessage: {
          type: String,
          trim: true,
          maxlength: 500
        },
        completionMessage: {
          type: String,
          trim: true,
          maxlength: 500
        }
      }
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  customNotifications: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      template: {
        type: String,
        enum: ['basic', 'enhanced', 'premium'],
        default: 'enhanced'
      },
      subject: {
        type: String,
        trim: true,
        maxlength: 100
      },
      body: {
        type: String,
        trim: true,
        maxlength: 1000
      }
    },
    custom: {
      enabled: {
        type: Boolean,
        default: true
      },
      reminderMessage: {
        type: String,
        trim: true,
        maxlength: 500
      },
      overdueMessage: {
        type: String,
        trim: true,
        maxlength: 500
      },
      completionMessage: {
        type: String,
        trim: true,
        maxlength: 500
      }
    },
    push: {
      enabled: {
        type: Boolean,
        default: true
      },
      message: {
        type: String,
        trim: true,
        maxlength: 150
      }
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: [
      'work', 'personal', 'health', 'finance', 'education', 
      'shopping', 'meeting', 'deadline', 'appointment', 
      'project', 'exercise', 'social', 'travel', 'maintenance', 'other'
    ],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  }
}, {
  timestamps: true
});

// Indexes for better performance
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ reminderTime: 1, reminderSent: 1 });
taskSchema.index({ 'reminders.time': 1, 'reminders.sent': 1 });
taskSchema.index({ completedAt: 1 });

// Auto-delete completed tasks older than 30 days
taskSchema.statics.cleanupOldTasks = async function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const result = await this.deleteMany({
    status: 'completed',
    completedAt: { $lt: thirtyDaysAgo }
  });
  
  return result;
};

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  if (this.dueDate > new Date()) {
    return Math.max(0, this.dueDate.getTime() - new Date().getTime());
  }
  return 0;
});

// Virtual for is overdue
taskSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' && this.dueDate < new Date();
});

// Instance method to mark as complete
taskSchema.methods.markComplete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Instance method to mark reminder as sent
taskSchema.methods.markReminderSent = function() {
  this.reminderSent = true;
  return this.save();
};

// Instance method to add a reminder
taskSchema.methods.addReminder = function(reminderData) {
  this.reminders.push(reminderData);
  return this.save();
};

// Instance method to remove a reminder
taskSchema.methods.removeReminder = function(reminderId) {
  this.reminders = this.reminders.filter(reminder => reminder.id !== reminderId);
  return this.save();
};

// Instance method to mark specific reminder as sent
taskSchema.methods.markSpecificReminderSent = function(reminderId) {
  const reminder = this.reminders.find(r => r.id === reminderId);
  if (reminder) {
    reminder.sent = true;
    reminder.sentAt = new Date();
  }
  return this.save();
};

// Instance method to soft delete
taskSchema.methods.softDelete = function() {
  this.status = 'cancelled';
  return this.save();
};

// Static method to get tasks with countdown
taskSchema.statics.getTasksWithCountdown = function(userId) {
  return this.find({ 
    userId, 
    status: 'pending' 
  }).sort({ dueDate: 1 });
};

// Static method to get upcoming reminders
taskSchema.statics.getUpcomingReminders = function(timeWindow = 5) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + timeWindow * 60 * 1000);
  
  return this.find({
    status: 'pending',
    $or: [
      // Legacy reminder system
      {
        reminderTime: { 
          $gte: now, 
          $lte: windowEnd 
        },
        reminderSent: false
      },
      // New multiple reminders system
      {
        'reminders.time': {
          $gte: now,
          $lte: windowEnd
        },
        'reminders.sent': false
      }
    ]
  }).populate('userId', 'email profile preferences');
};

// Static method to get specific reminders due
taskSchema.statics.getDueReminders = function(timeWindow = 5) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + timeWindow * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        status: 'pending',
        'reminders.time': {
          $gte: now,
          $lte: windowEnd
        }
      }
    },
    {
      $unwind: '$reminders'
    },
    {
      $match: {
        'reminders.time': {
          $gte: now,
          $lte: windowEnd
        },
        'reminders.sent': false
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    }
  ]);
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = function() {
  return this.find({
    status: 'pending',
    dueDate: { $lt: new Date() }
  }).populate('userId', 'email profile preferences');
};

// Static method to get dashboard stats
taskSchema.statics.getDashboardStats = async function(userId) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pendingTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        overdueTasks: {
          $sum: {
            $cond: [
              { 
                $and: [
                  { $eq: ['$status', 'pending'] },
                  { $lt: ['$dueDate', now] }
                ]
              }, 
              1, 
              0
            ]
          }
        },
        dueToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$status', 'pending'] },
                  { $gte: ['$dueDate', now] },
                  { $lte: ['$dueDate', tomorrow] }
                ]
              },
              1,
              0
            ]
          }
        },
        upcomingTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$status', 'pending'] },
                  { $gt: ['$dueDate', tomorrow] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    dueToday: 0,
    upcomingTasks: 0
  };
};

// Ensure virtuals are included in JSON output
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

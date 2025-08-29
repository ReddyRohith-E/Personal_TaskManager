const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
require('dotenv').config();

// Sample user data with different roles and notification preferences
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'err2k24@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
    notificationPreferences: {
      email: true,
      push: true,
      reminderFrequency: 'all'
    }
  },
  {
    name: 'Nithin Pula',
    email: 'nithinpula123@gmail.com',
    password: 'nithin@9618',
    role: 'user',
    isVerified: true,
    notificationPreferences: {
      email: true,
      push: true,
      reminderFrequency: 'all'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    password: 'User123!',
    role: 'user',
    notificationPreferences: {
      email: true,
      push: true,
      reminderFrequency: 'daily'
    }
  },
  {
    name: 'Test Manager',
    email: 'manager@todoapp.com',
    password: 'Manager123!',
    role: 'manager',
    notificationPreferences: {
      email: true,
      push: true,
      reminderFrequency: 'all'
    }
  }
];

// Comprehensive task data covering all features
const generateTasksForUser = (userId, userEmail) => {
  const baseDate = new Date();
  
  return [
    // Work tasks with various priorities and types
    {
      title: 'Complete Q4 Report',
      description: 'Comprehensive quarterly business report with performance metrics and future projections',
      type: 'work',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      reminderTime: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      userId: userId,
      tags: ['quarterly', 'business', 'analytics', 'urgent'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          sent: false,
          message: {
            email: {
              subject: 'Reminder: Q4 Report Due Tomorrow',
              body: `Hello,\n\nThis is a friendly reminder that your Q4 Report is due tomorrow. Please ensure all performance metrics and projections are included.\n\nBest regards,\nTask Management System`
            },
            custom: {
              enabled: true,
              reminderMessage: 'Your Q4 Report is due tomorrow! Please complete all performance metrics and projections.',
              overdueMessage: 'URGENT: Q4 Report is overdue! This needs immediate attention for business operations.',
              completionMessage: 'Excellent work! Q4 Report completed successfully. Great job on meeting the deadline!'
            }
          }
        }
      ],
      customNotifications: {
        email: {
          enabled: true,
          template: 'enhanced',
          subject: 'Q4 Report - Action Required',
          body: 'Your quarterly report needs completion. This is critical for our business metrics.'
        },
        push: {
          enabled: true,
          message: 'Q4 Report deadline approaching! Complete by {{dueDate}}'
        }
      }
    },
    
    // Personal tasks with multiple reminders
    {
      title: 'Doctor Appointment',
      description: 'Annual health checkup with Dr. Johnson at City Medical Center',
      type: 'health',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      reminderTime: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: userId,
      tags: ['health', 'appointment', 'annual'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days before
          sent: false,
          message: {
            email: {
              subject: 'Upcoming Doctor Appointment',
              body: 'Don\'t forget your health checkup appointment in 2 days at City Medical Center!'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Health reminder: Your annual checkup with Dr. Johnson is in 2 days. Please arrive 15 minutes early.',
              overdueMessage: 'You missed your doctor appointment! Please call City Medical Center to reschedule as soon as possible.',
              completionMessage: 'Great job attending your health checkup! Taking care of your health is so important.'
            }
          }
        },
        {
          time: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 2 hours before
          sent: false,
          message: {
            email: {
              subject: 'Doctor Appointment in 2 Hours',
              body: 'Final reminder: Your appointment is coming up soon at City Medical Center.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Your doctor appointment is in 2 hours. Time to head to City Medical Center!',
              overdueMessage: 'Appointment time has passed. Contact the clinic immediately to reschedule.',
              completionMessage: 'Appointment completed! Hope everything went well with Dr. Johnson.'
            }
          }
        }
      ]
    },

    // Deadline task (overdue for testing)
    {
      title: 'Submit Tax Documents',
      description: 'Compile and submit all required tax documentation for fiscal year',
      type: 'deadline',
      priority: 'urgent',
      status: 'pending',
      dueDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday (overdue)
      reminderTime: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      userId: userId,
      tags: ['taxes', 'legal', 'government', 'overdue'],
      reminders: [
        {
          time: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
          sent: true,
          message: {
            email: {
              subject: 'URGENT: Tax Document Deadline',
              body: 'This is an urgent reminder about your tax submission deadline.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'URGENT: Tax documents must be submitted TODAY! Don\'t delay - penalties apply after deadline.',
              overdueMessage: 'CRITICAL: Tax deadline has passed! You may face penalties. Submit immediately and contact tax advisor.',
              completionMessage: 'Relief! Tax documents submitted successfully. Good job meeting this important deadline.'
            }
          }
        }
      ]
    },

    // Meeting task
    {
      title: 'Team Stand-up Meeting',
      description: 'Daily team synchronization and progress updates',
      type: 'meeting',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      reminderTime: new Date(baseDate.getTime() - 13 * 60 * 60 * 1000), // 13 hours ago
      userId: userId,
      tags: ['daily', 'team', 'standup', 'sync'],
      completedAt: new Date(baseDate.getTime() - 10 * 60 * 60 * 1000),
      reminders: [
        {
          time: new Date(baseDate.getTime() - 13 * 60 * 60 * 1000),
          sent: true,
          message: {
            email: {
              subject: 'Daily Standup Starting Soon',
              body: 'Join the team for our daily sync meeting.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Daily standup meeting in 1 hour. Please prepare your updates on current progress.',
              overdueMessage: 'You missed the daily standup! Please catch up with the team and share your updates.',
              completionMessage: 'Great teamwork in today\'s standup! Good communication helps the whole team succeed.'
            }
          }
        }
      ]
    },

    // Personal task with custom notifications
    {
      title: 'Plan Weekend Trip',
      description: 'Research destinations, book accommodations, and plan itinerary for weekend getaway',
      type: 'personal',
      priority: 'low',
      status: 'in-progress',
      dueDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      reminderTime: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      userId: userId,
      tags: ['travel', 'vacation', 'planning', 'research'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
          sent: false,
          message: {
            email: {
              subject: 'Weekend Trip Planning Reminder',
              body: 'Don\'t forget to complete your weekend trip planning. Book those accommodations!'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Time to finalize your weekend trip plans! Research destinations and book accommodations soon. 🌴',
              overdueMessage: 'Your trip planning deadline passed! Last-minute bookings may be expensive. Plan now!',
              completionMessage: 'Awesome! Trip planning complete. Time to get excited for your well-deserved getaway! �'
            }
          }
        }
      ],
      customNotifications: {
        email: {
          enabled: true,
          template: 'enhanced',
          subject: 'Travel Planning Reminder - Weekend Getaway',
          body: 'Complete your weekend trip planning to ensure a great vacation! Book accommodations before they fill up.'
        },
        push: {
          enabled: true,
          message: 'Weekend trip planning due soon! Don\'t miss out on good deals 🏨'
        }
      }
    },

    // Health task with detailed reminders
    {
      title: 'Take Daily Medication',
      description: 'Take prescribed medication as directed by physician',
      type: 'health',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
      reminderTime: new Date(baseDate.getTime() + 7 * 60 * 60 * 1000), // 7 hours from now
      userId: userId,
      tags: ['health', 'medication', 'daily', 'prescription'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 7 * 60 * 60 * 1000),
          sent: false,
          message: {
            email: {
              subject: 'Daily Medication Reminder',
              body: 'Time to take your daily medication as prescribed by your physician.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Medication reminder: Take your prescribed pills in 1 hour. Set a timer so you don\'t forget!',
              overdueMessage: 'You missed your medication time! Take it now if it\'s not too late, or wait for the next scheduled dose.',
              completionMessage: 'Good job taking your medication on time! Consistency is key for your health.'
            }
          }
        }
      ]
    },

    // Work project with milestones
    {
      title: 'Launch Product Feature',
      description: 'Complete development, testing, and deployment of new user dashboard feature',
      type: 'work',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      reminderTime: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      userId: userId,
      tags: ['development', 'feature', 'dashboard', 'launch'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000),
          sent: false,
          message: {
            email: {
              subject: 'Product Feature Launch - 2 Days Remaining',
              body: 'Final stretch! Ensure all testing is complete before launch.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Feature launch in 2 days! Final testing phase needs to be completed. Check all functionality.',
              overdueMessage: 'Feature launch deadline passed! Stakeholders are waiting. Deploy immediately or communicate delays.',
              completionMessage: 'Congratulations! Feature launched successfully. Great work on delivering this important update!'
            }
          }
        },
        {
          time: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000),
          sent: false,
          message: {
            email: {
              subject: 'Feature Launch Tomorrow - Final Check',
              body: 'One day to go! Perform final checks and prepare for deployment.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Tomorrow is launch day! Ready for deployment? Double-check everything is working perfectly.',
              overdueMessage: 'Launch day has arrived! Users are expecting the new feature. Deploy now if everything is ready.',
              completionMessage: 'Feature deployed successfully! Monitor for any issues and celebrate this achievement!'
            }
          }
        }
      ]
    },

    // Old completed task (for cleanup testing)
    {
      title: 'Archive Old Files',
      description: 'Clean up and archive old project files from previous quarters',
      type: 'work',
      priority: 'low',
      status: 'completed',
      dueDate: new Date(baseDate.getTime() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      reminderTime: new Date(baseDate.getTime() - 36 * 24 * 60 * 60 * 1000), // 36 days ago
      completedAt: new Date(baseDate.getTime() - 32 * 24 * 60 * 60 * 1000), // Completed 32 days ago
      userId: userId,
      tags: ['cleanup', 'archive', 'maintenance'],
      reminders: []
    },

    // Another old completed task
    {
      title: 'Update Resume',
      description: 'Update professional resume with recent accomplishments and skills',
      type: 'personal',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(baseDate.getTime() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      reminderTime: new Date(baseDate.getTime() - 41 * 24 * 60 * 60 * 1000), // 41 days ago
      completedAt: new Date(baseDate.getTime() - 38 * 24 * 60 * 60 * 1000), // Completed 38 days ago
      userId: userId,
      tags: ['career', 'resume', 'personal-development'],
      reminders: []
    },

    // Future task with comprehensive setup
    {
      title: 'Prepare Annual Presentation',
      description: 'Create comprehensive annual performance presentation for board meeting',
      type: 'work',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      reminderTime: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      userId: userId,
      tags: ['presentation', 'annual', 'board', 'performance'],
      reminders: [
        {
          time: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          sent: false,
          message: {
            email: {
              subject: 'Annual Presentation - Start Preparation',
              body: 'Begin preparing your annual presentation. Gather performance data and create slide deck.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Start working on annual presentation - 4 days to deadline. Begin gathering data and creating slides.',
              overdueMessage: 'Annual presentation deadline passed! Board meeting is waiting. Submit immediately or request extension.',
              completionMessage: 'Outstanding! Annual presentation completed. Ready to impress the board with your achievements!'
            }
          }
        },
        {
          time: new Date(baseDate.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
          sent: false,
          message: {
            email: {
              subject: 'Annual Presentation - Final Review',
              body: 'Final review of your annual presentation. Ensure all data is accurate and slides are polished.'
            },
            custom: {
              enabled: true,
              reminderMessage: 'Annual presentation due in 2 days! Final preparations needed. Review all slides and data accuracy.',
              overdueMessage: 'Presentation deadline reached! Board members are expecting your annual performance review.',
              completionMessage: 'Excellent work! Annual presentation is complete and ready for the board meeting.'
            }
          }
        }
      ],
      customNotifications: {
        email: {
          enabled: true,
          template: 'premium',
          subject: 'Annual Presentation Deadline Notice',
          body: 'Your annual presentation is due on {{dueDate}}. Please ensure it\'s ready for the board meeting with all performance metrics.'
        },
        push: {
          enabled: true,
          message: 'Annual presentation deadline approaching! Due: {{dueDate}}'
        }
      }
    }
  ];
};

// Function to clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

// Function to create users
const createUsers = async () => {
  try {
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      // Don't hash password here - let the User model's pre-save middleware handle it
      const user = new User({
        ...userData
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
};

// Function to create tasks
const createTasks = async (users) => {
  try {
    let totalTasks = 0;
    
    for (const user of users) {
      const tasks = generateTasksForUser(user._id, user.email);
      
      for (const taskData of tasks) {
        const task = new Task(taskData);
        await task.save();
        totalTasks++;
      }
      
      console.log(`✅ Created ${tasks.length} tasks for ${user.name}`);
    }
    
    console.log(`✅ Total tasks created: ${totalTasks}`);
    return totalTasks;
  } catch (error) {
    console.error('❌ Error creating tasks:', error);
    throw error;
  }
};

// Function to display seeding summary
const displaySummary = async () => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const overdueTasks = await Task.countDocuments({ 
      status: 'pending', 
      dueDate: { $lt: new Date() } 
    });
    const tasksWithReminders = await Task.countDocuments({ 
      'reminders.0': { $exists: true } 
    });
    const tasksWithCustomNotifications = await Task.countDocuments({ 
      'customNotifications.email.enabled': true 
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`👥 Total Users Created: ${userCount}`);
    console.log(`📋 Total Tasks Created: ${taskCount}`);
    console.log('');
    console.log('📈 Task Status Breakdown:');
    console.log(`   ⏳ Pending: ${pendingTasks}`);
    console.log(`   🏃 In Progress: ${inProgressTasks}`);
    console.log(`   ✅ Completed: ${completedTasks}`);
    console.log(`   🚨 Overdue: ${overdueTasks}`);
    console.log('');
    console.log('🔔 Notification Features:');
    console.log(`   📅 Tasks with Reminders: ${tasksWithReminders}`);
    console.log(`   � Tasks with Custom Email: ${tasksWithCustomNotifications}`);
    console.log('');
    console.log('👤 Test User Accounts:');
    
    const users = await User.find({}, 'name email role').lean();
    users.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} (${user.name})`);
    });
    
    console.log('');
    console.log('🔑 Default Password for all test accounts: User123! (Admin123! for admin)');
    console.log('');
    console.log('✨ Features to Test:');
    console.log('   • Multiple reminders per task');
    console.log('   • Custom email messages with templates');
    console.log('   • Different task types and priorities');
    console.log('   • Overdue task handling');
    console.log('   • Automatic cleanup (tasks >30 days old)');
    console.log('   • Real-time notifications');
    console.log('   • Task filtering and search');
    console.log('   • Responsive UI across devices');
    console.log('   • Custom reminder, overdue, and completion messages');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error generating summary:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    console.log('');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await clearDatabase();
    
    // Create users
    console.log('👥 Creating test users...');
    const users = await createUsers();
    
    // Create tasks
    console.log('📋 Creating test tasks...');
    await createTasks(users);
    
    // Display summary
    await displaySummary();
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearDatabase,
  createUsers,
  createTasks,
  sampleUsers
};

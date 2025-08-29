const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
require('dotenv').config();

// Admin emails to preserve (these won't be deleted)
const PROTECTED_ADMIN_EMAILS = [
  'err2k24@gmail.com'
];

/**
 * Clear database utility script
 * This script will remove all data except protected admin users
 * 
 * Options:
 * --preserve-admins: Keep all admin role users (default: true)
 * --preserve-specific: Keep only specific admin emails defined in PROTECTED_ADMIN_EMAILS
 * --clear-all: Remove everything including all users
 * --tasks-only: Remove only tasks, keep all users
 * --users-only: Remove only non-admin users, keep all tasks
 * --help: Show help information
 */

class DatabaseCleaner {
  constructor() {
    this.options = this.parseArguments();
    this.stats = {
      usersDeleted: 0,
      tasksDeleted: 0,
      usersPreserved: 0,
      errors: []
    };
  }

  parseArguments() {
    const args = process.argv.slice(2);
    const options = {
      preserveAdmins: true,
      preserveSpecific: false,
      clearAll: false,
      tasksOnly: false,
      usersOnly: false,
      help: false,
      dryRun: false
    };

    args.forEach(arg => {
      switch(arg) {
        case '--preserve-admins':
          options.preserveAdmins = true;
          options.preserveSpecific = false;
          break;
        case '--preserve-specific':
          options.preserveSpecific = true;
          options.preserveAdmins = false;
          break;
        case '--clear-all':
          options.clearAll = true;
          options.preserveAdmins = false;
          options.preserveSpecific = false;
          break;
        case '--tasks-only':
          options.tasksOnly = true;
          break;
        case '--users-only':
          options.usersOnly = true;
          break;
        case '--dry-run':
          options.dryRun = true;
          break;
        case '--help':
          options.help = true;
          break;
      }
    });

    return options;
  }

  showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Database Cleanup Utility                  ║
╚══════════════════════════════════════════════════════════════╝

Usage: node clearDatabase.js [options]

Options:
  --preserve-admins    Keep all users with admin role (default)
  --preserve-specific  Keep only specific admin emails:
                       ${PROTECTED_ADMIN_EMAILS.join(', ')}
  --clear-all         Remove everything including all users
  --tasks-only        Remove only tasks, keep all users
  --users-only        Remove only non-admin users, keep all tasks
  --dry-run           Show what would be deleted without actually deleting
  --help              Show this help information

Examples:
  node clearDatabase.js                          # Keep all admins, remove everything else
  node clearDatabase.js --preserve-specific      # Keep only specific admins
  node clearDatabase.js --tasks-only             # Remove only tasks
  node clearDatabase.js --clear-all              # Remove everything
  node clearDatabase.js --dry-run                # Preview what would be deleted

Protected Admin Emails:
${PROTECTED_ADMIN_EMAILS.map(email => `  • ${email}`).join('\n')}
    `);
  }

  async connectToDatabase() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not found in environment variables');
      }

      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async getStatistics() {
    try {
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            emails: { $push: '$email' }
          }
        }
      ]);

      const taskStats = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalUsers = await User.countDocuments();
      const totalTasks = await Task.countDocuments();

      return {
        totalUsers,
        totalTasks,
        usersByRole: userStats,
        tasksByStatus: taskStats
      };
    } catch (error) {
      console.error('❌ Error getting statistics:', error.message);
      return null;
    }
  }

  async clearTasks() {
    try {
      console.log('\n🗑️  Clearing tasks...');
      
      if (this.options.dryRun) {
        const count = await Task.countDocuments();
        console.log(`   📊 Would delete ${count} tasks`);
        this.stats.tasksDeleted = count;
        return true;
      }

      const result = await Task.deleteMany({});
      this.stats.tasksDeleted = result.deletedCount;
      console.log(`   ✅ Deleted ${result.deletedCount} tasks`);
      return true;
    } catch (error) {
      const errorMsg = `Failed to clear tasks: ${error.message}`;
      console.error(`   ❌ ${errorMsg}`);
      this.stats.errors.push(errorMsg);
      return false;
    }
  }

  async clearUsers() {
    try {
      console.log('\n👤 Clearing users...');
      
      let query = {};
      let preservedUsers = [];

      if (this.options.preserveAdmins) {
        query = { role: { $ne: 'admin' } };
        preservedUsers = await User.find({ role: 'admin' }, 'email role');
      } else if (this.options.preserveSpecific) {
        query = { email: { $nin: PROTECTED_ADMIN_EMAILS } };
        preservedUsers = await User.find({ email: { $in: PROTECTED_ADMIN_EMAILS } }, 'email role');
      }

      if (this.options.dryRun) {
        const toDelete = await User.countDocuments(query);
        console.log(`   📊 Would delete ${toDelete} users`);
        console.log(`   📊 Would preserve ${preservedUsers.length} users:`);
        preservedUsers.forEach(user => {
          console.log(`      • ${user.email} (${user.role})`);
        });
        this.stats.usersDeleted = toDelete;
        this.stats.usersPreserved = preservedUsers.length;
        return true;
      }

      const result = await User.deleteMany(query);
      this.stats.usersDeleted = result.deletedCount;
      this.stats.usersPreserved = preservedUsers.length;

      console.log(`   ✅ Deleted ${result.deletedCount} users`);
      console.log(`   🛡️  Preserved ${preservedUsers.length} users:`);
      preservedUsers.forEach(user => {
        console.log(`      • ${user.email} (${user.role})`);
      });

      return true;
    } catch (error) {
      const errorMsg = `Failed to clear users: ${error.message}`;
      console.error(`   ❌ ${errorMsg}`);
      this.stats.errors.push(errorMsg);
      return false;
    }
  }

  async clearTasksForDeletedUsers() {
    try {
      console.log('\n🔗 Clearing orphaned tasks...');
      
      // Find tasks that belong to deleted users
      const orphanedTasks = await Task.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            user: { $size: 0 }
          }
        }
      ]);

      if (orphanedTasks.length === 0) {
        console.log('   ✅ No orphaned tasks found');
        return true;
      }

      if (this.options.dryRun) {
        console.log(`   📊 Would delete ${orphanedTasks.length} orphaned tasks`);
        return true;
      }

      const taskIds = orphanedTasks.map(task => task._id);
      const result = await Task.deleteMany({ _id: { $in: taskIds } });
      
      console.log(`   ✅ Deleted ${result.deletedCount} orphaned tasks`);
      return true;
    } catch (error) {
      const errorMsg = `Failed to clear orphaned tasks: ${error.message}`;
      console.error(`   ❌ ${errorMsg}`);
      this.stats.errors.push(errorMsg);
      return false;
    }
  }

  async run() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Database Cleanup Utility                  ║
╚══════════════════════════════════════════════════════════════╝
    `);

    if (this.options.help) {
      this.showHelp();
      return;
    }

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN MODE - No actual changes will be made\n');
    }

    // Connect to database
    const connected = await this.connectToDatabase();
    if (!connected) {
      process.exit(1);
    }

    // Get current statistics
    console.log('\n📊 Current database statistics:');
    const stats = await this.getStatistics();
    if (stats) {
      console.log(`   Total Users: ${stats.totalUsers}`);
      console.log(`   Total Tasks: ${stats.totalTasks}`);
      
      if (stats.usersByRole.length > 0) {
        console.log('   Users by role:');
        stats.usersByRole.forEach(role => {
          console.log(`     • ${role._id}: ${role.count} users`);
        });
      }

      if (stats.tasksByStatus.length > 0) {
        console.log('   Tasks by status:');
        stats.tasksByStatus.forEach(status => {
          console.log(`     • ${status._id}: ${status.count} tasks`);
        });
      }
    }

    // Confirm before proceeding (skip in dry run)
    if (!this.options.dryRun) {
      console.log('\n⚠️  WARNING: This operation will permanently delete data!');
      console.log('   Make sure you have a backup before proceeding.');
      
      // In a real environment, you might want to add a confirmation prompt
      // For now, we'll add a 3-second delay
      console.log('   Proceeding in 3 seconds... Press Ctrl+C to cancel');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    try {
      let success = true;

      // Execute cleanup based on options
      if (this.options.clearAll) {
        console.log('\n🔥 CLEARING ALL DATA...');
        success = await this.clearTasks() && success;
        success = await User.deleteMany({}) && success;
        if (!this.options.dryRun) {
          const userResult = await User.deleteMany({});
          this.stats.usersDeleted = userResult.deletedCount;
          console.log(`   ✅ Deleted ${userResult.deletedCount} users (including admins)`);
        }
      } else if (this.options.tasksOnly) {
        success = await this.clearTasks() && success;
      } else if (this.options.usersOnly) {
        success = await this.clearUsers() && success;
        success = await this.clearTasksForDeletedUsers() && success;
      } else {
        // Default: clear everything except protected users
        success = await this.clearTasks() && success;
        success = await this.clearUsers() && success;
      }

      // Show final statistics
      console.log('\n📈 Cleanup Summary:');
      console.log(`   Users deleted: ${this.stats.usersDeleted}`);
      console.log(`   Users preserved: ${this.stats.usersPreserved}`);
      console.log(`   Tasks deleted: ${this.stats.tasksDeleted}`);
      
      if (this.stats.errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        this.stats.errors.forEach(error => {
          console.log(`   • ${error}`);
        });
      }

      if (success && this.stats.errors.length === 0) {
        console.log('\n✅ Database cleanup completed successfully!');
      } else {
        console.log('\n⚠️  Database cleanup completed with some issues.');
      }

    } catch (error) {
      console.error('\n❌ Unexpected error during cleanup:', error.message);
    } finally {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run the cleanup utility
if (require.main === module) {
  const cleaner = new DatabaseCleaner();
  cleaner.run().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = DatabaseCleaner;

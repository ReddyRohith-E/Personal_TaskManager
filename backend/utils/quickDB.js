const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
require('dotenv').config();

/**
 * Quick Database Operations Utility
 * Provides simple one-command operations for common database tasks
 */

const PROTECTED_ADMINS = ['err2k24@gmail.com'];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function getDBStats() {
  try {
    const users = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const tasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Users: ${users}`);
    console.log(`   Admin Users: ${admins}`);
    console.log(`   Total Tasks: ${tasks}`);
    console.log(`   Completed Tasks: ${completedTasks}`);
    console.log(`   Pending Tasks: ${pendingTasks}`);
    
    return { users, admins, tasks, completedTasks, pendingTasks };
  } catch (error) {
    console.error('❌ Error getting stats:', error.message);
    return null;
  }
}

async function clearAllTasks() {
  try {
    const result = await Task.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} tasks`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error clearing tasks:', error.message);
    return 0;
  }
}

async function clearNonAdminUsers() {
  try {
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`✅ Deleted ${result.deletedCount} non-admin users`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error clearing users:', error.message);
    return 0;
  }
}

async function clearTestUsers() {
  try {
    const result = await User.deleteMany({ 
      email: { $nin: PROTECTED_ADMINS },
      role: { $ne: 'admin' }
    });
    console.log(`✅ Deleted ${result.deletedCount} test users`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error clearing test users:', error.message);
    return 0;
  }
}

async function clearCompletedTasks() {
  try {
    const result = await Task.deleteMany({ status: 'completed' });
    console.log(`✅ Deleted ${result.deletedCount} completed tasks`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error clearing completed tasks:', error.message);
    return 0;
  }
}

async function clearOldTasks(days = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await Task.deleteMany({
      status: 'completed',
      completedAt: { $lt: cutoffDate }
    });
    console.log(`✅ Deleted ${result.deletedCount} tasks older than ${days} days`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error clearing old tasks:', error.message);
    return 0;
  }
}

async function resetToAdminsOnly() {
  try {
    console.log('🔄 Resetting database to admin users only...');
    
    const tasksDeleted = await clearAllTasks();
    const usersDeleted = await clearNonAdminUsers();
    
    // Clean up orphaned tasks
    const orphanedTasks = await Task.deleteMany({
      userId: { $nin: await User.find({ role: 'admin' }).distinct('_id') }
    });
    
    console.log(`✅ Reset complete: ${usersDeleted} users and ${tasksDeleted + orphanedTasks.deletedCount} tasks deleted`);
    return { usersDeleted, tasksDeleted: tasksDeleted + orphanedTasks.deletedCount };
  } catch (error) {
    console.error('❌ Error during reset:', error.message);
    return null;
  }
}

async function main() {
  const command = process.argv[2];
  
  if (!command) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                Quick Database Operations                      ║
╚══════════════════════════════════════════════════════════════╝

Usage: node quickDB.js <command>

Commands:
  stats              Show current database statistics
  clear-tasks        Delete all tasks
  clear-users        Delete all non-admin users
  clear-test-users   Delete test users (keep protected admins)
  clear-completed    Delete completed tasks only
  clear-old [days]   Delete completed tasks older than X days (default: 30)
  reset-admins       Reset to admin users only (delete everything else)

Protected Admin Emails:
${PROTECTED_ADMINS.map(email => `  • ${email}`).join('\n')}

Examples:
  node quickDB.js stats
  node quickDB.js clear-tasks
  node quickDB.js clear-old 7
  node quickDB.js reset-admins
    `);
    return;
  }

  if (!await connectDB()) {
    process.exit(1);
  }

  try {
    switch (command) {
      case 'stats':
        await getDBStats();
        break;
        
      case 'clear-tasks':
        console.log('🗑️  Clearing all tasks...');
        await clearAllTasks();
        break;
        
      case 'clear-users':
        console.log('👤 Clearing non-admin users...');
        await clearNonAdminUsers();
        break;
        
      case 'clear-test-users':
        console.log('🧪 Clearing test users...');
        await clearTestUsers();
        break;
        
      case 'clear-completed':
        console.log('✅ Clearing completed tasks...');
        await clearCompletedTasks();
        break;
        
      case 'clear-old':
        const days = parseInt(process.argv[3]) || 30;
        console.log(`🗓️  Clearing tasks older than ${days} days...`);
        await clearOldTasks(days);
        break;
        
      case 'reset-admins':
        await resetToAdminsOnly();
        break;
        
      default:
        console.log('❌ Unknown command. Use "node quickDB.js" to see available commands.');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  connectDB,
  getDBStats,
  clearAllTasks,
  clearNonAdminUsers,
  clearTestUsers,
  clearCompletedTasks,
  clearOldTasks,
  resetToAdminsOnly
};

const cron = require('node-cron');
const Task = require('../models/Task');

class CleanupService {
  constructor() {
    this.isRunning = false;
  }

  // Start the cleanup scheduler
  start() {
    if (this.isRunning) {
      console.log('Cleanup service is already running');
      return;
    }

    // Run cleanup every day at 2 AM
    this.cleanupJob = cron.schedule('0 2 * * *', async () => {
      await this.performCleanup();
    }, {
      scheduled: false
    });

    this.cleanupJob.start();
    this.isRunning = true;
    console.log('Cleanup service started - runs daily at 2 AM');
  }

  // Stop the cleanup scheduler
  stop() {
    if (this.cleanupJob) {
      this.cleanupJob.stop();
      this.isRunning = false;
      console.log('Cleanup service stopped');
    }
  }

  // Perform the actual cleanup
  async performCleanup() {
    try {
      console.log('Starting automatic cleanup of old completed tasks...');
      
      const result = await Task.cleanupOldTasks();
      
      console.log(`Cleanup completed: ${result.deletedCount} old tasks removed`);
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error during cleanup:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Manual cleanup trigger
  async runCleanupNow() {
    return await this.performCleanup();
  }

  // Get cleanup status
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.cleanupJob ? this.cleanupJob.nextDate() : null
    };
  }

  // Cleanup tasks by custom criteria
  async cleanupTasksByCriteria(criteria = {}) {
    try {
      const defaultCriteria = {
        status: 'completed',
        completedAt: { 
          $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      };

      const finalCriteria = { ...defaultCriteria, ...criteria };
      const result = await Task.deleteMany(finalCriteria);

      return {
        success: true,
        deletedCount: result.deletedCount,
        criteria: finalCriteria,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Get cleanup statistics
  async getCleanupStats() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = await Task.aggregate([
        {
          $facet: {
            oldCompletedTasks: [
              {
                $match: {
                  status: 'completed',
                  completedAt: { $lt: thirtyDaysAgo }
                }
              },
              { $count: 'count' }
            ],
            totalCompletedTasks: [
              {
                $match: { status: 'completed' }
              },
              { $count: 'count' }
            ],
            recentCompletedTasks: [
              {
                $match: {
                  status: 'completed',
                  completedAt: { $gte: thirtyDaysAgo }
                }
              },
              { $count: 'count' }
            ]
          }
        }
      ]);

      const result = stats[0];
      
      return {
        oldCompletedTasks: result.oldCompletedTasks[0]?.count || 0,
        totalCompletedTasks: result.totalCompletedTasks[0]?.count || 0,
        recentCompletedTasks: result.recentCompletedTasks[0]?.count || 0,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

module.exports = new CleanupService();

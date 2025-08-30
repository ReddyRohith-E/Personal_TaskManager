const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
// Load environment variables from backend directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
// Trust first proxy for correct rate-limit and IP handling (Render/Netlify/production)
app.set('trust proxy', 1);
const server = http.createServer(app);

// Configure allowed origins - Netlify and Render deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  // Netlify default domains
  process.env.NETLIFY_URL ? `https://${process.env.NETLIFY_URL}` : null,
  // Add your custom Netlify domain here when you set it up
  // 'https://your-app-name.netlify.app'
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Also check without trailing slash
    const originWithoutSlash = origin.replace(/\/$/, '');
    if (allowedOrigins.indexOf(originWithoutSlash) !== -1) {
      return callback(null, true);
    }
    
    // Also check with trailing slash
    const originWithSlash = origin + '/';
    if (allowedOrigins.indexOf(originWithSlash) !== -1) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
}));

// Handle preflight requests explicitly
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    const originWithoutSlash = origin.replace(/\/$/, '');
    if (allowedOrigins.indexOf(originWithoutSlash) !== -1) {
      return callback(null, true);
    }
    
    const originWithSlash = origin + '/';
    if (allowedOrigins.indexOf(originWithSlash) !== -1) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Serve static files from frontend build (for Vercel)
// NOTE: Commented out for separate Netlify + Render deployment
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));
// }

// Connect to MongoDB using centralized database config
const connectDB = require('./config/database');

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://personal-taskmanager.onrender.com'
    : `http://localhost:${PORT}`;

  const endpoints = {
    message: 'Personal Task Manager API',
    version: '1.0.0',
    baseUrl: baseUrl,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      authentication: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user',
          body: '{name, email, password}'
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'User login',
          body: '{email, password}'
        },
        profile: {
          method: 'GET',
          path: '/api/auth/profile',
          description: 'Get user profile',
          auth: 'JWT token required'
        },
        updateProfile: {
          method: 'PUT',
          path: '/api/auth/profile',
          description: 'Update user profile',
          body: '{name, email}',
          auth: 'JWT token required'
        },
        changePassword: {
          method: 'PUT',
          path: '/api/auth/password',
          description: 'Change password',
          body: '{currentPassword, newPassword}',
          auth: 'JWT token required'
        }
      },
      tasks: {
        getAll: {
          method: 'GET',
          path: '/api/tasks',
          description: 'Get all tasks with pagination',
          query: 'page, limit, status, priority, type',
          auth: 'JWT token required'
        },
        create: {
          method: 'POST',
          path: '/api/tasks',
          description: 'Create new task',
          body: '{title, description, type, priority, dueDate, tags, isRecurring}',
          auth: 'JWT token required'
        },
        getById: {
          method: 'GET',
          path: '/api/tasks/:id',
          description: 'Get single task',
          auth: 'JWT token required'
        },
        update: {
          method: 'PUT',
          path: '/api/tasks/:id',
          description: 'Update task',
          auth: 'JWT token required'
        },
        delete: {
          method: 'DELETE',
          path: '/api/tasks/:id',
          description: 'Delete task',
          auth: 'JWT token required'
        },
        complete: {
          method: 'PUT',
          path: '/api/tasks/:id/complete',
          description: 'Mark task as complete',
          auth: 'JWT token required'
        },
        uncomplete: {
          method: 'PUT',
          path: '/api/tasks/:id/uncomplete',
          description: 'Mark task as incomplete',
          auth: 'JWT token required'
        },
        remind: {
          method: 'POST',
          path: '/api/tasks/:id/remind',
          description: 'Send reminder for task',
          auth: 'JWT token required'
        },
        stats: {
          method: 'GET',
          path: '/api/tasks/stats/summary',
          description: 'Get task statistics',
          auth: 'JWT token required'
        },
        detailedStats: {
          method: 'GET',
          path: '/api/tasks/stats/detailed',
          description: 'Get detailed task statistics',
          auth: 'JWT token required'
        },
        overdue: {
          method: 'GET',
          path: '/api/tasks/overdue',
          description: 'Get overdue tasks',
          auth: 'JWT token required'
        },
        upcoming: {
          method: 'GET',
          path: '/api/tasks/upcoming',
          description: 'Get upcoming tasks',
          auth: 'JWT token required'
        },
        bulkDelete: {
          method: 'POST',
          path: '/api/tasks/bulk-delete',
          description: 'Delete multiple tasks',
          body: '{taskIds: []}',
          auth: 'JWT token required'
        },
        bulkUpdate: {
          method: 'PUT',
          path: '/api/tasks/bulk-update',
          description: 'Update multiple tasks',
          body: '{taskIds: [], updates: {}}',
          auth: 'JWT token required'
        },
        bulkComplete: {
          method: 'POST',
          path: '/api/tasks/bulk-complete',
          description: 'Complete multiple tasks',
          body: '{taskIds: []}',
          auth: 'JWT token required'
        }
      },
      notifications: {
        testEmail: {
          method: 'POST',
          path: '/api/notifications/test/email',
          description: 'Test email sending',
          body: '{email, subject, message}',
          auth: 'JWT token required'
        },
        status: {
          method: 'GET',
          path: '/api/notifications/status',
          description: 'Get notification service status',
          auth: 'JWT token required'
        },
        quota: {
          method: 'GET',
          path: '/api/notifications/quota',
          description: 'Get email quota information',
          auth: 'JWT token required'
        },
        sendCustom: {
          method: 'POST',
          path: '/api/notifications/send/custom',
          description: 'Send custom notification',
          body: '{email, message, type}',
          auth: 'JWT token required'
        }
      },
      test: {
        email: {
          method: 'POST',
          path: '/api/test/email',
          description: 'Test basic email functionality',
          body: '{email, subject, message}'
        },
        gmailConfig: {
          method: 'GET',
          path: '/api/test/gmail-config',
          description: 'Check Gmail SMTP configuration'
        },
        gmailTaskEmail: {
          method: 'POST',
          path: '/api/test/gmail-task-email',
          description: 'Test task-specific email',
          body: '{email, emailType, taskType, title, description, priority}'
        },
        gmailQuota: {
          method: 'GET',
          path: '/api/test/gmail-quota',
          description: 'Get Gmail quota information'
        },
        serviceStatus: {
          method: 'GET',
          path: '/api/test/service-status',
          description: 'Get comprehensive service status'
        },
        fullNotification: {
          method: 'POST',
          path: '/api/test/full-notification',
          description: 'Test full notification system',
          body: '{email, message}'
        },
        customMessage: {
          method: 'POST',
          path: '/api/test/custom-message',
          description: 'Test custom message generation',
          body: '{taskType, priority, title, description, messageType}'
        },
        taskTypes: {
          method: 'GET',
          path: '/api/test/task-types',
          description: 'Get available task types'
        },
        bulkEmail: {
          method: 'POST',
          path: '/api/test/bulk-email',
          description: 'Test bulk email sending',
          body: '{emails[], subject, message}'
        },
        customTaskNotification: {
          method: 'POST',
          path: '/api/test/custom-task-notification',
          description: 'Test custom task notifications',
          body: '{email, taskData, customMessages}'
        },
        validateMessage: {
          method: 'POST',
          path: '/api/test/validate-message',
          description: 'Validate message content',
          body: '{message, messageType}'
        }
      },
      health: {
        check: {
          method: 'GET',
          path: '/api/health',
          description: 'Health check endpoint'
        }
      }
    },
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Required for all endpoints except auth/* and test/*'
    },
    responseFormat: {
      success: 'boolean',
      message: 'string',
      data: 'object (on success)',
      error: 'string (on failure)'
    }
  };

  res.json(endpoints);
});

// Update the route to handle POST requests for test notifications
app.post('/api/tasks/:id/test-notification', (req, res) => {
    const { id } = req.params;
    const { type, email, customMessage } = req.body;

    // Log the request for debugging
    console.log(`Received test notification request for task ID: ${id}, type: ${type}, email: ${email}`);

    // Simulate task existence check (replace with actual DB logic)
    const taskExists = true; // Replace with actual database query

    if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Simulate sending a test notification (replace with actual logic)
    res.status(200).json({ message: `Test ${type} notification sent for task ID: ${id}` });
});

// Load routes safely
console.log('Loading routes...');

// Auth routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error.message);
}

// Task routes  
try {
  const { authenticateToken } = require('./middleware/auth');
  const taskRoutes = require('./routes/tasks');
  app.use('/api/tasks', authenticateToken, taskRoutes);
  console.log('✅ Task routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load task routes:', error.message);
}

// Notification routes
try {
  const { authenticateToken } = require('./middleware/auth');
  const notificationRoutes = require('./routes/notifications');
  app.use('/api/notifications', authenticateToken, notificationRoutes);
  console.log('✅ Notification routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load notification routes:', error.message);
}

// Test routes (for development and testing)
try {
  const testRoutes = require('./routes/test');
  app.use('/api/test', testRoutes);
  console.log('✅ Test routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load test routes:', error.message);
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Serve frontend for all non-API routes (SPA routing)
// NOTE: Commented out for separate Netlify + Render deployment
// if (process.env.NODE_ENV === 'production') {
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   });
// }

// Error handling middleware - move this before the last app.use call
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Initialize cleanup service
    try {
      const CleanupService = require('./services/CleanupService');
      CleanupService.start();
      console.log('✅ Cleanup service initialized');
    } catch (error) {
      console.error('⚠️  Failed to initialize cleanup service:', error.message);
    }
    
    // Initialize notification processing
    try {
      const NotificationService = require('./services/NotificationService');
      const notificationService = new NotificationService(io);
      
      // Process notifications every 5 minutes
      setInterval(async () => {
        await notificationService.processDueReminders();
      }, 5 * 60 * 1000);
      
      console.log('✅ Notification processing initialized');
    } catch (error) {
      console.error('⚠️  Failed to initialize notification processing:', error.message);
    }
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`🌐 API Base URL: https://personal-taskmanager.onrender.com`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// For Vercel, we need to export the app instead of starting the server
if (process.env.VERCEL) {
  // Initialize database connection for Vercel
  connectDB().catch(console.error);
  module.exports = app;
} else {
  startServer();
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  
  try {
    // Stop cleanup service
    try {
      const CleanupService = require('./services/CleanupService');
      CleanupService.stop();
      console.log('🔌 Cleanup service stopped');
    } catch (error) {
      console.error('Warning: Failed to stop cleanup service:', error.message);
    }

    // Close server first
    await new Promise((resolve) => {
      server.close(() => {
        console.log('🔌 HTTP server closed');
        resolve();
      });
    });

    // Close database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }

    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;

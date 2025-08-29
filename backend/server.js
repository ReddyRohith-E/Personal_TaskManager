const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://personal-taskflow.netlify.app',
  'https://personal-taskflow.netlify.app/',
  process.env.FRONTEND_URL
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
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
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

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
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

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

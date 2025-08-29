const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure the MongoDB URI includes the database name
    let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
    
    // If using MongoDB Atlas and no database is specified in URI, append it
    if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('mongodb.net/') && mongoURI.includes('mongodb.net/?')) {
      mongoURI = mongoURI.replace('mongodb.net/?', 'mongodb.net/taskmanager?');
    } else if (mongoURI.includes('mongodb+srv://') && mongoURI.includes('mongodb.net/?')) {
      mongoURI = mongoURI.replace('/?', '/taskmanager?');
    }
     
    const conn = await mongoose.connect(mongoURI);

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
    
    // Verify we're connected to the correct database
    if (conn.connection.name !== 'taskmanager') {
      console.warn(`⚠️  Warning: Connected to database '${conn.connection.name}' instead of 'taskmanager'`);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    return conn;

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error; // Re-throw to let the caller handle it
  }
};

module.exports = connectDB;

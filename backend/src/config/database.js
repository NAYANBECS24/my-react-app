const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Use different MongoDB URIs based on environment
    let mongoURI;
    
    if (process.env.MONGODB_URI) {
      mongoURI = process.env.MONGODB_URI;
    } else if (process.env.NODE_ENV === 'production') {
      mongoURI = 'mongodb://localhost:27017/tor-sentinel';
    } else {
      // Development - try to connect, but don't fail if MongoDB isn't running
      mongoURI = 'mongodb://localhost:27017/tor-sentinel-dev';
    }
    
    logger.info(`Attempting to connect to MongoDB: ${mongoURI}`);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    await mongoose.connect(mongoURI, options);
    
    logger.info('✅ MongoDB Connected Successfully');
    
    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });
    
    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
    return mongoose.connection;
    
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
      logger.error('Application cannot run without database in production');
      process.exit(1);
    } else {
      logger.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
      logger.warn('Running in development mode without database');
      logger.warn('Some features may not work correctly');
      
      // Create a mock connection for development
      return {
        readyState: 0,
        host: 'mock',
        port: 27017,
        name: 'tor-sentinel-mock',
        _mock: true
      };
    }
  }
};

module.exports = connectDB;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed to 5001
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Initialize services
connectDB();
connectRedis();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Socket.IO events
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);
  
  socket.on('subscribe', (channel) => {
    socket.join(channel);
    logger.info(`Client ${socket.id} subscribed to ${channel}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Tor Sentinel API is working correctly!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test',
      api: '/api'
    }
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Tor Sentinel API',
    version: '1.0.0',
    description: 'Tor Network Monitoring System Backend API',
    status: 'operational',
    documentation: 'Coming soon...'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: ['/health', '/api/test', '/api']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`==========================================`);
      logger.info(`🚀 Tor Sentinel Backend Server Started`);
      logger.info(`📍 Port: ${PORT}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
      logger.info(`🏥 Health: http://localhost:${PORT}/health`);
      logger.info(`🛠️  API Test: http://localhost:${PORT}/api/test`);
      logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
      logger.info(`==========================================`);
      
      // Console output for user
      console.log('\n✅ Backend Server Started Successfully!');
      console.log('==========================================');
      console.log(`📡 Local:    http://localhost:${PORT}`);
      console.log(`🌐 Network:  http://0.0.0.0:${PORT}`);
      console.log(`🏥 Health:   http://localhost:${PORT}/health`);
      console.log(`🛠️  API Test: http://localhost:${PORT}/api/test`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
      console.log('==========================================');
      console.log('\n📋 Quick Test Commands:');
      console.log(`curl http://localhost:${PORT}/health`);
      console.log(`curl http://localhost:${PORT}/api/test`);
    });
    
    // Handle server errors
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Trying port ${Number(PORT) + 1}...`);
        httpServer.listen(Number(PORT) + 1);
      } else {
        logger.error(`Server error: ${error.message}`);
      }
    });
    
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down server gracefully...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  // Add this import
const serviceRoutes = require('./routes/services.routes');

// Add this after other routes
app.use('/api', serviceRoutes);

});
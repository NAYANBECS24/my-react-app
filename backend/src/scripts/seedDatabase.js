const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const TorNode = require('../models/TorNode');
const logger = require('../utils/logger');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');
    
    // Clear existing data
    await User.deleteMany({});
    await TorNode.deleteMany({});
    logger.info('Cleared existing data');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@torsentinel.com',
      password: adminPassword,
      role: 'admin',
      preferences: {
        notifications: {
          email: true,
          push: true
        },
        theme: 'dark'
      }
    });
    await adminUser.save();
    
    // Create analyst user
    const analystPassword = await bcrypt.hash('analyst123', 10);
    const analystUser = new User({
      username: 'analyst',
      email: 'analyst@torsentinel.com',
      password: analystPassword,
      role: 'analyst',
      preferences: {
        notifications: {
          email: true,
          push: false
        },
        theme: 'auto'
      }
    });
    await analystUser.save();
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = new User({
      username: 'user',
      email: 'user@torsentinel.com',
      password: userPassword,
      role: 'user',
      preferences: {
        notifications: {
          email: false,
          push: true
        },
        theme: 'light'
      }
    });
    await regularUser.save();
    
    logger.info('Created users: admin, analyst, user');
    
    // Create sample Tor nodes
    const sampleNodes = [
      {
        nodeId: 'node001',
        fingerprint: '1234567890ABCDEF1234567890ABCDEF12345678',
        nickname: 'GuardNode01',
        ipAddress: '192.168.1.100',
        country: 'United States',
        countryCode: 'US',
        bandwidth: {
          average: 50000000,
          burst: 100000000,
          observed: 45000000
        },
        flags: ['Running', 'Valid', 'Fast', 'Stable', 'Guard'],
        status: 'online',
        isGuard: true,
        isExit: false,
        version: 'Tor 0.4.7.13',
        firstSeen: new Date('2023-01-01'),
        lastSeen: new Date()
      },
      {
        nodeId: 'node002',
        fingerprint: '234567890ABCDEF1234567890ABCDEF123456789',
        nickname: 'ExitNode01',
        ipAddress: '192.168.1.101',
        country: 'Germany',
        countryCode: 'DE',
        bandwidth: {
          average: 75000000,
          burst: 150000000,
          observed: 70000000
        },
        flags: ['Running', 'Valid', 'Fast', 'Stable', 'Exit'],
        status: 'online',
        isGuard: false,
        isExit: true,
        version: 'Tor 0.4.7.12',
        firstSeen: new Date('2023-01-15'),
        lastSeen: new Date()
      },
      {
        nodeId: 'node003',
        fingerprint: '34567890ABCDEF1234567890ABCDEF1234567890',
        nickname: 'RelayNode01',
        ipAddress: '192.168.1.102',
        country: 'Canada',
        countryCode: 'CA',
        bandwidth: {
          average: 30000000,
          burst: 60000000,
          observed: 28000000
        },
        flags: ['Running', 'Valid', 'Stable'],
        status: 'online',
        isGuard: false,
        isExit: false,
        version: 'Tor 0.4.7.11',
        firstSeen: new Date('2023-02-01'),
        lastSeen: new Date()
      },
      {
        nodeId: 'node004',
        fingerprint: '4567890ABCDEF1234567890ABCDEF12345678901',
        nickname: 'SuspiciousNode',
        ipAddress: '192.168.1.103',
        country: 'Russia',
        countryCode: 'RU',
        bandwidth: {
          average: 10000000,
          burst: 20000000,
          observed: 5000000
        },
        flags: ['Running', 'Valid'],
        status: 'suspicious',
        isGuard: false,
        isExit: true,
        version: 'Tor 0.4.6.10',
        firstSeen: new Date('2023-03-01'),
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        nodeId: 'node005',
        fingerprint: '567890ABCDEF1234567890ABCDEF123456789012',
        nickname: 'OfflineNode',
        ipAddress: '192.168.1.104',
        country: 'France',
        countryCode: 'FR',
        bandwidth: {
          average: 20000000,
          burst: 40000000,
          observed: 18000000
        },
        flags: ['Running', 'Valid', 'Fast'],
        status: 'offline',
        isGuard: true,
        isExit: false,
        version: 'Tor 0.4.7.13',
        firstSeen: new Date('2023-01-20'),
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      }
    ];
    
    await TorNode.insertMany(sampleNodes);
    logger.info(`Created ${sampleNodes.length} sample Tor nodes`);
    
    logger.info('Database seeding completed successfully');
    process.exit(0);
    
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
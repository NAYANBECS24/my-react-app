const TorNode = require('../models/TorNode');
const TrafficLog = require('../models/TrafficLog');
const torMetricsService = require('../services/torMetricsService');
const trafficAnalyzer = require('../services/trafficAnalyzer');
const logger = require('../utils/logger');
const { getRedisClient } = require('../config/redis');

const torController = {
  // Get network overview statistics
  getNetworkOverview: async (req, res) => {
    try {
      const redisClient = getRedisClient();
      let stats;
      
      // Try to get from cache first
      if (redisClient) {
        const cachedStats = await redisClient.get('network:overview');
        if (cachedStats) {
          stats = JSON.parse(cachedStats);
        }
      }
      
      // If not cached, fetch fresh data
      if (!stats) {
        stats = await torMetricsService.getNetworkStatistics();
        
        // Cache for 5 minutes
        if (redisClient) {
          await redisClient.set('network:overview', JSON.stringify(stats), {
            EX: 300
          });
        }
      }
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      logger.error(`Get network overview error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get network overview',
        error: error.message
      });
    }
  },
  
  // Get all nodes with pagination and filtering
  getNodes: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = 'lastSeen',
        sortOrder = 'desc',
        status,
        country,
        isExit,
        isGuard,
        search
      } = req.query;
      
      const query = {};
      
      // Apply filters
      if (status) query.status = status;
      if (country) query.countryCode = country;
      if (isExit !== undefined) query.isExit = isExit === 'true';
      if (isGuard !== undefined) query.isGuard = isGuard === 'true';
      
      // Search filter
      if (search) {
        query.$or = [
          { nickname: { $regex: search, $options: 'i' } },
          { ipAddress: { $regex: search, $options: 'i' } },
          { fingerprint: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Determine sort order
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      // Execute query
      const [nodes, total] = await Promise.all([
        TorNode.find(query)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v')
          .lean(),
        TorNode.countDocuments(query)
      ]);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / parseInt(limit));
      
      res.json({
        success: true,
        data: {
          nodes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });
      
    } catch (error) {
      logger.error(`Get nodes error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get nodes',
        error: error.message
      });
    }
  },
  
  // Get node by ID
  getNodeById: async (req, res) => {
    try {
      const { id } = req.params;
      
      let node;
      
      // Check if it's a fingerprint or ObjectId
      if (id.length === 40) {
        // Likely a fingerprint
        node = await TorNode.findOne({ fingerprint: id });
      } else {
        // Try as ObjectId
        node = await TorNode.findById(id);
      }
      
      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found'
        });
      }
      
      // Get detailed information
      const details = await torMetricsService.getNodeDetails(node.fingerprint);
      
      res.json({
        success: true,
        data: details
      });
      
    } catch (error) {
      logger.error(`Get node by ID error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get node details',
        error: error.message
      });
    }
  },
  
  // Get node statistics
  getNodeStatistics: async (req, res) => {
    try {
      const { id } = req.params;
      const { timeRange = '24h' } = req.query;
      
      const node = await TorNode.findById(id);
      
      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found'
        });
      }
      
      let timeFilter;
      const now = new Date();
      
      switch (timeRange) {
        case '1h':
          timeFilter = new Date(now - 60 * 60 * 1000);
          break;
        case '24h':
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          timeFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          timeFilter = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
      }
      
      const stats = await TrafficLog.aggregate([
        {
          $match: {
            $or: [
              { sourceNode: node._id },
              { exitNode: node._id }
            ],
            timestamp: { $gte: timeFilter }
          }
        },
        {
          $facet: {
            trafficSummary: [
              {
                $group: {
                  _id: null,
                  totalBytesSent: { $sum: '$bytesSent' },
                  totalBytesReceived: { $sum: '$bytesReceived' },
                  totalConnections: { $sum: 1 },
                  maliciousConnections: {
                    $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
                  },
                  avgDuration: { $avg: '$duration' }
                }
              }
            ],
            protocolDistribution: [
              {
                $group: {
                  _id: '$protocol',
                  count: { $sum: 1 },
                  bytes: { $sum: { $add: ['$bytesSent', '$bytesReceived'] } }
                }
              },
              { $sort: { count: -1 } }
            ],
            hourlyActivity: [
              {
                $group: {
                  _id: { $hour: '$timestamp' },
                  connections: { $sum: 1 },
                  bytes: { $sum: { $add: ['$bytesSent', '$bytesReceived'] } },
                  malicious: {
                    $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
                  }
                }
              },
              { $sort: { '_id': 1 } }
            ],
            topDestinations: [
              {
                $group: {
                  _id: '$destinationIp',
                  connections: { $sum: 1 },
                  bytes: { $sum: { $add: ['$bytesSent', '$bytesReceived'] } },
                  malicious: {
                    $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
                  }
                }
              },
              { $sort: { connections: -1 } },
              { $limit: 10 }
            ],
            threatBreakdown: [
              {
                $match: { isMalicious: true }
              },
              {
                $unwind: '$threatType'
              },
              {
                $group: {
                  _id: '$threatType',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } }
            ]
          }
        }
      ]);
      
      const performanceMetrics = {
        uptimePercentage: torMetricsService.calculateUptimePercentage(node),
        reliabilityScore: torMetricsService.calculateReliabilityScore(node),
        threatScore: torMetricsService.calculateThreatScore(node),
        bandwidthUtilization: node.bandwidth.average,
        lastSeen: node.lastSeen
      };
      
      res.json({
        success: true,
        data: {
          node: node.getSummary(),
          statistics: stats[0],
          performanceMetrics,
          timeRange
        }
      });
      
    } catch (error) {
      logger.error(`Get node statistics error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get node statistics',
        error: error.message
      });
    }
  },
  
  // Update node status
  updateNodeStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const node = await TorNode.findById(id);
      
      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found'
        });
      }
      
      // Validate status
      const validStatuses = ['online', 'offline', 'suspicious', 'compromised'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      
      // Update node status
      const previousStatus = node.status;
      node.status = status;
      node.lastUpdated = new Date();
      
      await node.save();
      
      // Log the status change
      logger.info(`Node ${node.fingerprint} status changed from ${previousStatus} to ${status}`);
      
      // If marking as suspicious/compromised, create an alert
      if (status === 'suspicious' || status === 'compromised') {
        const Alert = require('../models/Alert');
        
        const alert = new Alert({
          title: `Node marked as ${status}: ${node.nickname || node.fingerprint}`,
          description: `Tor node ${node.nickname || node.fingerprint} (${node.ipAddress}) has been marked as ${status}. ${notes || ''}`,
          type: status === 'suspicious' ? 'malicious_traffic' : 'security_breach',
          severity: status === 'suspicious' ? 'medium' : 'high',
          source: 'user',
          affectedNodes: [node._id],
          metadata: {
            previousStatus,
            changedBy: req.user.id,
            notes,
            nodeInfo: node.getSummary()
          }
        });
        
        await alert.save();
      }
      
      res.json({
        success: true,
        message: 'Node status updated successfully',
        data: node.getSummary()
      });
      
    } catch (error) {
      logger.error(`Update node status error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update node status',
        error: error.message
      });
    }
  },
  
  // Get nodes by country
  getNodesByCountry: async (req, res) => {
    try {
      const countryDistribution = await TorNode.aggregate([
        { $match: { status: 'online' } },
        {
          $group: {
            _id: '$countryCode',
            country: { $first: '$country' },
            count: { $sum: 1 },
            totalBandwidth: { $sum: '$bandwidth.average' },
            exitNodes: {
              $sum: { $cond: [{ $eq: ['$isExit', true] }, 1, 0] }
            },
            guardNodes: {
              $sum: { $cond: [{ $eq: ['$isGuard', true] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      res.json({
        success: true,
        data: countryDistribution
      });
      
    } catch (error) {
      logger.error(`Get nodes by country error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get nodes by country',
        error: error.message
      });
    }
  },
  
  // Get node performance metrics
  getNodePerformance: async (req, res) => {
    try {
      const { id } = req.params;
      const { period = '24h' } = req.query;
      
      const node = await TorNode.findById(id);
      
      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found'
        });
      }
      
      let timeFilter;
      const now = new Date();
      
      switch (period) {
        case '1h':
          timeFilter = new Date(now - 60 * 60 * 1000);
          break;
        case '6h':
          timeFilter = new Date(now - 6 * 60 * 60 * 1000);
          break;
        case '24h':
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          timeFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
      }
      
      const performanceData = await TrafficLog.aggregate([
        {
          $match: {
            $or: [
              { sourceNode: node._id },
              { exitNode: node._id }
            ],
            timestamp: { $gte: timeFilter }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === '1h' || period === '6h' ? '%H:%M' : '%Y-%m-%d %H:00',
                date: '$timestamp'
              }
            },
            timestamp: { $first: '$timestamp' },
            connections: { $sum: 1 },
            bytesSent: { $sum: '$bytesSent' },
            bytesReceived: { $sum: '$bytesReceived' },
            avgDuration: { $avg: '$duration' },
            successRate: {
              $avg: {
                $cond: [
                  { $and: [
                    { $gt: ['$bytesReceived', 0] },
                    { $lt: ['$responseCode', 500] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { timestamp: 1 } }
      ]);
      
      res.json({
        success: true,
        data: {
          node: node.getSummary(),
          performanceData,
          period
        }
      });
      
    } catch (error) {
      logger.error(`Get node performance error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get node performance',
        error: error.message
      });
    }
  },
  
  // Force update nodes from Tor metrics
  forceUpdateNodes: async (req, res) => {
    try {
      // Check if user has permission
      if (req.user.role !== 'admin' && req.user.role !== 'analyst') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      logger.info(`Manual node update triggered by user ${req.user.username}`);
      
      const result = await torMetricsService.updateNodes();
      
      res.json({
        success: true,
        message: 'Node update initiated',
        data: result
      });
      
    } catch (error) {
      logger.error(`Force update nodes error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update nodes',
        error: error.message
      });
    }
  },
  
  // Search nodes
  searchNodes: async (req, res) => {
    try {
      const { q, field = 'all' } = req.query;
      
      if (!q || q.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters'
        });
      }
      
      const searchQuery = {};
      
      switch (field) {
        case 'nickname':
          searchQuery.nickname = { $regex: q, $options: 'i' };
          break;
        case 'ip':
          searchQuery.ipAddress = { $regex: q, $options: 'i' };
          break;
        case 'fingerprint':
          searchQuery.fingerprint = { $regex: q, $options: 'i' };
          break;
        case 'country':
          searchQuery.country = { $regex: q, $options: 'i' };
          break;
        case 'all':
        default:
          searchQuery.$or = [
            { nickname: { $regex: q, $options: 'i' } },
            { ipAddress: { $regex: q, $options: 'i' } },
            { fingerprint: { $regex: q, $options: 'i' } },
            { country: { $regex: q, $options: 'i' } },
            { countryCode: { $regex: q, $options: 'i' } }
          ];
      }
      
      const nodes = await TorNode.find(searchQuery)
        .limit(50)
        .select('nickname fingerprint ipAddress country countryCode status bandwidth flags')
        .lean();
      
      res.json({
        success: true,
        data: nodes
      });
      
    } catch (error) {
      logger.error(`Search nodes error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message
      });
    }
  }
};

module.exports = torController;
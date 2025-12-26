const Alert = require('../models/Alert');
const User = require('../models/User');
const logger = require('../utils/logger');

const alertController = {
  // Get all alerts with filtering and pagination
  getAlerts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        severity,
        type,
        assignedTo,
        startDate,
        endDate,
        search
      } = req.query;
      
      const query = { isActive: true };
      
      // Apply filters
      if (status && status !== 'all') query.status = status;
      if (severity && severity !== 'all') query.severity = severity;
      if (type && type !== 'all') query.type = type;
      if (assignedTo && assignedTo !== 'all') query.assignedTo = assignedTo;
      
      // Date range filter
      if (startDate || endDate) {
        query.triggeredAt = {};
        if (startDate) query.triggeredAt.$gte = new Date(startDate);
        if (endDate) query.triggeredAt.$lte = new Date(endDate);
      }
      
      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Execute query with population
      const [alerts, total] = await Promise.all([
        Alert.find(query)
          .sort({ triggeredAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('affectedNodes', 'nickname ipAddress country')
          .populate('acknowledgedBy resolvedBy assignedTo', 'username email')
          .populate('notes.user', 'username')
          .lean(),
        Alert.countDocuments(query)
      ]);
      
      // Get alert statistics
      const stats = await Alert.getStatistics();
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / parseInt(limit));
      
      res.json({
        success: true,
        data: {
          alerts,
          statistics: stats,
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
      logger.error(`Get alerts error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get alerts',
        error: error.message
      });
    }
  },
  
  // Get alert by ID
  getAlertById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const alert = await Alert.findById(id)
        .populate('affectedNodes', 'nickname fingerprint ipAddress country status')
        .populate('affectedTraffic', 'timestamp destinationIp protocol bytesSent bytesReceived')
        .populate('acknowledgedBy resolvedBy assignedTo', 'username email')
        .populate('notes.user', 'username');
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      res.json({
        success: true,
        data: alert
      });
      
    } catch (error) {
      logger.error(`Get alert by ID error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get alert',
        error: error.message
      });
    }
  },
  
  // Create new alert
  createAlert: async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        severity,
        affectedNodes,
        affectedTraffic,
        metadata,
        tags
      } = req.body;
      
      // Validate required fields
      if (!title || !description || !type || !severity) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, type, and severity are required'
        });
      }
      
      const alertData = {
        title,
        description,
        type,
        severity,
        source: 'user',
        createdBy: req.user.id,
        metadata: metadata || {},
        tags: tags || []
      };
      
      if (affectedNodes) alertData.affectedNodes = affectedNodes;
      if (affectedTraffic) alertData.affectedTraffic = affectedTraffic;
      
      const alert = new Alert(alertData);
      await alert.save();
      
      // Populate for response
      const populatedAlert = await Alert.findById(alert._id)
        .populate('affectedNodes', 'nickname ipAddress')
        .populate('createdBy', 'username');
      
      // Emit real-time alert
      const io = require('../server').io;
      if (io) {
        io.to('alerts').emit('new_alert', {
          alert: alert.getSummary(),
          type: alert.type,
          severity: alert.severity
        });
      }
      
      logger.info(`New alert created by ${req.user.username}: ${alert.title}`);
      
      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: populatedAlert
      });
      
    } catch (error) {
      logger.error(`Create alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create alert',
        error: error.message
      });
    }
  },
  
  // Update alert
  updateAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'analyst') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update alert'
        });
      }
      
      // Update alert
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== '__v') {
          alert[key] = updateData[key];
        }
      });
      
      alert.updatedAt = new Date();
      await alert.save();
      
      // Populate for response
      const populatedAlert = await Alert.findById(alert._id)
        .populate('affectedNodes', 'nickname ipAddress')
        .populate('acknowledgedBy resolvedBy assignedTo', 'username');
      
      logger.info(`Alert ${id} updated by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Alert updated successfully',
        data: populatedAlert
      });
      
    } catch (error) {
      logger.error(`Update alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update alert',
        error: error.message
      });
    }
  },
  
  // Acknowledge alert
  acknowledgeAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Update alert status
      alert.status = 'acknowledged';
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = req.user.id;
      
      // Add note if provided
      if (notes) {
        alert.notes.push({
          user: req.user.id,
          note: `Acknowledged: ${notes}`,
          timestamp: new Date()
        });
      }
      
      await alert.save();
      
      logger.info(`Alert ${id} acknowledged by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Alert acknowledged successfully',
        data: alert.getSummary()
      });
      
    } catch (error) {
      logger.error(`Acknowledge alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to acknowledge alert',
        error: error.message
      });
    }
  },
  
  // Resolve alert
  resolveAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const { resolutionNotes } = req.body;
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'analyst') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to resolve alert'
        });
      }
      
      // Update alert status
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      alert.resolvedBy = req.user.id;
      
      // Add resolution note
      alert.notes.push({
        user: req.user.id,
        note: `Resolved: ${resolutionNotes || 'Alert resolved'}`,
        timestamp: new Date()
      });
      
      await alert.save();
      
      logger.info(`Alert ${id} resolved by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Alert resolved successfully',
        data: alert.getSummary()
      });
      
    } catch (error) {
      logger.error(`Resolve alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve alert',
        error: error.message
      });
    }
  },
  
  // Close alert
  closeAlert: async (req, res) => {
    try {
      const { id } = req.params;
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Check permissions
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to close alert'
        });
      }
      
      // Update alert status
      alert.status = 'closed';
      alert.isActive = false;
      
      await alert.save();
      
      logger.info(`Alert ${id} closed by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Alert closed successfully',
        data: alert.getSummary()
      });
      
    } catch (error) {
      logger.error(`Close alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to close alert',
        error: error.message
      });
    }
  },
  
  // Add note to alert
  addNote: async (req, res) => {
    try {
      const { id } = req.params;
      const { note } = req.body;
      
      if (!note) {
        return res.status(400).json({
          success: false,
          message: 'Note is required'
        });
      }
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Add note
      alert.notes.push({
        user: req.user.id,
        note,
        timestamp: new Date()
      });
      
      await alert.save();
      
      // Populate note user
      const populatedAlert = await Alert.findById(alert._id)
        .populate('notes.user', 'username');
      
      // Get the newly added note
      const newNote = populatedAlert.notes[populatedAlert.notes.length - 1];
      
      logger.info(`Note added to alert ${id} by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Note added successfully',
        data: newNote
      });
      
    } catch (error) {
      logger.error(`Add note error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to add note',
        error: error.message
      });
    }
  },
  
  // Assign alert to user
  assignAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      const alert = await Alert.findById(id);
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update assignment
      alert.assignedTo = userId;
      alert.status = 'investigating';
      
      // Add note about assignment
      alert.notes.push({
        user: req.user.id,
        note: `Assigned to ${user.username}`,
        timestamp: new Date()
      });
      
      await alert.save();
      
      logger.info(`Alert ${id} assigned to ${user.username} by ${req.user.username}`);
      
      res.json({
        success: true,
        message: 'Alert assigned successfully',
        data: alert.getSummary()
      });
      
    } catch (error) {
      logger.error(`Assign alert error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to assign alert',
        error: error.message
      });
    }
  },
  
  // Get alert statistics
  getAlertStatistics: async (req, res) => {
    try {
      const { timeRange = '7d' } = req.query;
      
      let timeFilter;
      const now = new Date();
      
      switch (timeRange) {
        case '24h':
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          timeFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          timeFilter = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          timeFilter = new Date(now - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
      }
      
      const stats = await Alert.aggregate([
        {
          $match: {
            triggeredAt: { $gte: timeFilter },
            isActive: true
          }
        },
        {
          $facet: {
            bySeverity: [
              {
                $group: {
                  _id: '$severity',
                  count: { $sum: 1 },
                  avgResolutionTime: {
                    $avg: {
                      $cond: [
                        { $and: ['$resolvedAt', '$triggeredAt'] },
                        { $subtract: ['$resolvedAt', '$triggeredAt'] },
                        null
                      ]
                    }
                  }
                }
              }
            ],
            byType: [
              {
                $group: {
                  _id: '$type',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } }
            ],
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            byDay: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$triggeredAt'
                    }
                  },
                  count: { $sum: 1 },
                  criticalCount: {
                    $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
                  },
                  highCount: {
                    $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
                  }
                }
              },
              { $sort: { '_id': 1 } }
            ],
            resolutionStats: [
              {
                $match: {
                  status: { $in: ['resolved', 'closed'] },
                  resolvedAt: { $exists: true },
                  triggeredAt: { $exists: true }
                }
              },
              {
                $group: {
                  _id: null,
                  avgResolutionTime: {
                    $avg: { $subtract: ['$resolvedAt', '$triggeredAt'] }
                  },
                  minResolutionTime: {
                    $min: { $subtract: ['$resolvedAt', '$triggeredAt'] }
                  },
                  maxResolutionTime: {
                    $max: { $subtract: ['$resolvedAt', '$triggeredAt'] }
                  },
                  totalResolved: { $sum: 1 }
                }
              }
            ],
            topAlertSources: [
              {
                $group: {
                  _id: '$source',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } }
            ]
          }
        }
      ]);
      
      // Calculate MTTR (Mean Time To Resolution)
      const mttr = stats[0].resolutionStats[0]?.avgResolutionTime || 0;
      const mttrHours = mttr / (1000 * 60 * 60);
      
      // Calculate alert volume trend
      const alertVolume = stats[0].byDay || [];
      const volumeTrend = alertVolume.length >= 2 
        ? (alertVolume[alertVolume.length - 1].count - alertVolume[0].count) / alertVolume[0].count
        : 0;
      
      res.json({
        success: true,
        data: {
          ...stats[0],
          summary: {
            mttrHours: mttrHours.toFixed(2),
            volumeTrend: (volumeTrend * 100).toFixed(2),
            timeRange
          }
        }
      });
      
    } catch (error) {
      logger.error(`Get alert statistics error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get alert statistics',
        error: error.message
      });
    }
  },
  
  // Bulk update alerts
  bulkUpdateAlerts: async (req, res) => {
    try {
      const { alertIds, updates } = req.body;
      
      if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Alert IDs are required'
        });
      }
      
      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'analyst') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions for bulk operations'
        });
      }
      
      const updateOperations = {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      };
      
      // Execute bulk update
      const result = await Alert.updateMany(
        { _id: { $in: alertIds } },
        updateOperations
      );
      
      logger.info(`Bulk update performed on ${result.modifiedCount} alerts by ${req.user.username}`);
      
      res.json({
        success: true,
        message: `Updated ${result.modifiedCount} alerts`,
        data: result
      });
      
    } catch (error) {
      logger.error(`Bulk update alerts error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update alerts',
        error: error.message
      });
    }
  }
};

module.exports = alertController;
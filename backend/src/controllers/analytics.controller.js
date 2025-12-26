const TrafficLog = require('../models/TrafficLog');
const TorNode = require('../models/TorNode');
const trafficAnalyzer = require('../services/trafficAnalyzer');
const logger = require('../utils/logger');
const { getRedisClient } = require('../config/redis');

const analyticsController = {
  // Get traffic statistics
  getTrafficStats: async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      
      const stats = await trafficAnalyzer.getTrafficStatistics(timeRange);
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      logger.error(`Get traffic stats error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get traffic statistics',
        error: error.message
      });
    }
  },
  
  // Get real-time traffic data
  getRealtimeTraffic: async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      
      const recentTraffic = await TrafficLog.find()
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .populate('sourceNode exitNode', 'nickname ipAddress country')
        .lean();
      
      // Process for real-time display
      const processedTraffic = recentTraffic.map(log => ({
        id: log._id,
        timestamp: log.timestamp,
        sourceNode: log.sourceNode ? {
          id: log.sourceNode._id,
          nickname: log.sourceNode.nickname,
          ipAddress: log.sourceNode.ipAddress,
          country: log.sourceNode.country
        } : null,
        exitNode: log.exitNode ? {
          id: log.exitNode._id,
          nickname: log.exitNode.nickname,
          ipAddress: log.exitNode.ipAddress,
          country: log.exitNode.country
        } : null,
        destinationIp: log.destinationIp,
        destinationPort: log.destinationPort,
        protocol: log.protocol,
        bytesSent: log.bytesSent,
        bytesReceived: log.bytesReceived,
        isMalicious: log.isMalicious,
        threatLevel: log.threatLevel,
        threatType: log.threatType,
        purpose: log.purpose,
        duration: log.duration
      }));
      
      res.json({
        success: true,
        data: processedTraffic
      });
      
    } catch (error) {
      logger.error(`Get realtime traffic error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get real-time traffic',
        error: error.message
      });
    }
  },
  
  // Get malicious traffic analysis
  getMaliciousTraffic: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        threatLevel,
        timeRange = '24h'
      } = req.query;
      
      const query = { isMalicious: true };
      
      // Apply threat level filter
      if (threatLevel && threatLevel !== 'all') {
        query.threatLevel = threatLevel;
      }
      
      // Apply time range filter
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
      
      query.timestamp = { $gte: timeFilter };
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Execute query
      const [traffic, total] = await Promise.all([
        TrafficLog.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('sourceNode exitNode', 'nickname ipAddress country')
          .lean(),
        TrafficLog.countDocuments(query)
      ]);
      
      // Calculate threat level distribution
      const threatDistribution = await TrafficLog.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$threatLevel',
            count: { $sum: 1 },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        }
      ]);
      
      // Calculate threat type distribution
      const threatTypeDistribution = await TrafficLog.aggregate([
        { $match: query },
        { $unwind: '$threatType' },
        {
          $group: {
            _id: '$threatType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      // Calculate top malicious nodes
      const topMaliciousNodes = await TrafficLog.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'tornodes',
            localField: 'sourceNode',
            foreignField: '_id',
            as: 'nodeInfo'
          }
        },
        { $unwind: '$nodeInfo' },
        {
          $group: {
            _id: '$sourceNode',
            nickname: { $first: '$nodeInfo.nickname' },
            ipAddress: { $first: '$nodeInfo.ipAddress' },
            country: { $first: '$nodeInfo.country' },
            count: { $sum: 1 },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / parseInt(limit));
      
      res.json({
        success: true,
        data: {
          traffic,
          statistics: {
            total,
            threatDistribution,
            threatTypeDistribution,
            topMaliciousNodes
          },
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
      logger.error(`Get malicious traffic error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get malicious traffic',
        error: error.message
      });
    }
  },
  
  // Get geographic traffic analysis
  getGeographicAnalysis: async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      
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
      
      // Get source country distribution
      const sourceCountries = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            'geoData.sourceCountryCode': { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$geoData.sourceCountryCode',
            country: { $first: '$geoData.sourceCountry' },
            count: { $sum: 1 },
            maliciousCount: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);
      
      // Get destination country distribution
      const destCountries = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            'geoData.destCountryCode': { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$geoData.destCountryCode',
            country: { $first: '$geoData.destCountry' },
            count: { $sum: 1 },
            maliciousCount: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);
      
      // Get country-to-country traffic
      const countryPairs = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            'geoData.sourceCountryCode': { $exists: true, $ne: null },
            'geoData.destCountryCode': { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: {
              source: '$geoData.sourceCountryCode',
              dest: '$geoData.destCountryCode'
            },
            sourceCountry: { $first: '$geoData.sourceCountry' },
            destCountry: { $first: '$geoData.destCountry' },
            count: { $sum: 1 },
            maliciousCount: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 50 }
      ]);
      
      res.json({
        success: true,
        data: {
          sourceCountries,
          destCountries,
          countryPairs,
          timeRange
        }
      });
      
    } catch (error) {
      logger.error(`Get geographic analysis error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get geographic analysis',
        error: error.message
      });
    }
  },
  
  // Get protocol analysis
  getProtocolAnalysis: async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      
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
      
      const protocolStats = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            protocol: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$protocol',
            count: { $sum: 1 },
            maliciousCount: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            },
            avgDuration: { $avg: '$duration' },
            avgBytesPerConnection: {
              $avg: { $add: ['$bytesSent', '$bytesReceived'] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      // Get port distribution for TCP/UDP
      const portDistribution = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            destinationPort: { $exists: true, $ne: null },
            protocol: { $in: ['TCP', 'UDP'] }
          }
        },
        {
          $group: {
            _id: '$destinationPort',
            count: { $sum: 1 },
            protocol: { $first: '$protocol' },
            maliciousCount: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);
      
      res.json({
        success: true,
        data: {
          protocolStats,
          portDistribution,
          timeRange
        }
      });
      
    } catch (error) {
      logger.error(`Get protocol analysis error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get protocol analysis',
        error: error.message
      });
    }
  },
  
  // Get time-based traffic trends
  getTrafficTrends: async (req, res) => {
    try {
      const { period = '24h', interval = 'hour' } = req.query;
      
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
        case '30d':
          timeFilter = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now - 24 * 60 * 60 * 1000);
      }
      
      let dateFormat;
      switch (interval) {
        case 'minute':
          dateFormat = '%Y-%m-%d %H:%M';
          break;
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        default:
          dateFormat = '%Y-%m-%d %H:00';
      }
      
      const trends = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: '$timestamp'
              }
            },
            timestamp: { $first: '$timestamp' },
            totalConnections: { $sum: 1 },
            maliciousConnections: {
              $sum: { $cond: [{ $eq: ['$isMalicious', true] }, 1, 0] }
            },
            totalBytes: {
              $sum: { $add: ['$bytesSent', '$bytesReceived'] }
            },
            avgBytesPerConnection: {
              $avg: { $add: ['$bytesSent', '$bytesReceived'] }
            },
            avgDuration: { $avg: '$duration' }
          }
        },
        { $sort: { timestamp: 1 } }
      ]);
      
      // Calculate moving averages
      const processedTrends = trends.map((point, index, array) => {
        const window = array.slice(Math.max(0, index - 2), index + 1);
        const avgConnections = window.reduce((sum, p) => sum + p.totalConnections, 0) / window.length;
        const avgBytes = window.reduce((sum, p) => sum + p.totalBytes, 0) / window.length;
        
        return {
          ...point,
          movingAvgConnections: avgConnections,
          movingAvgBytes: avgBytes,
          maliciousPercentage: point.totalConnections > 0 
            ? (point.maliciousConnections / point.totalConnections) * 100 
            : 0
        };
      });
      
      res.json({
        success: true,
        data: {
          trends: processedTrends,
          period,
          interval
        }
      });
      
    } catch (error) {
      logger.error(`Get traffic trends error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get traffic trends',
        error: error.message
      });
    }
  },
  
  // Get threat intelligence summary
  getThreatIntelligence: async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      
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
      
      const threatStats = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { $gte: timeFilter },
            isMalicious: true
          }
        },
        {
          $facet: {
            byThreatType: [
              { $unwind: '$threatType' },
              {
                $group: {
                  _id: '$threatType',
                  count: { $sum: 1 },
                  totalBytes: {
                    $sum: { $add: ['$bytesSent', '$bytesReceived'] }
                  },
                  avgBytes: {
                    $avg: { $add: ['$bytesSent', '$bytesReceived'] }
                  }
                }
              },
              { $sort: { count: -1 } }
            ],
            byThreatLevel: [
              {
                $group: {
                  _id: '$threatLevel',
                  count: { $sum: 1 },
                  totalBytes: {
                    $sum: { $add: ['$bytesSent', '$bytesReceived'] }
                  }
                }
              },
              { $sort: { _id: -1 } }
            ],
            topSourceNodes: [
              {
                $lookup: {
                  from: 'tornodes',
                  localField: 'sourceNode',
                  foreignField: '_id',
                  as: 'nodeInfo'
                }
              },
              { $unwind: '$nodeInfo' },
              {
                $group: {
                  _id: '$sourceNode',
                  nickname: { $first: '$nodeInfo.nickname' },
                  ipAddress: { $first: '$nodeInfo.ipAddress' },
                  country: { $first: '$nodeInfo.country' },
                  count: { $sum: 1 },
                  threatTypes: { $addToSet: '$threatType' }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            topDestinationIps: [
              {
                $group: {
                  _id: '$destinationIp',
                  count: { $sum: 1 },
                  threatTypes: { $addToSet: '$threatType' },
                  totalBytes: {
                    $sum: { $add: ['$bytesSent', '$bytesReceived'] }
                  }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            hourlyDistribution: [
              {
                $group: {
                  _id: { $hour: '$timestamp' },
                  count: { $sum: 1 }
                }
              },
              { $sort: { '_id': 1 } }
            ]
          }
        }
      ]);
      
      // Get emerging threats (threats that appeared recently)
      const emergingThreats = await TrafficLog.aggregate([
        {
          $match: {
            timestamp: { 
              $gte: new Date(now - 2 * 60 * 60 * 1000), // Last 2 hours
              $lt: new Date(now - 1 * 60 * 60 * 1000) // But not in the last hour
            },
            isMalicious: true
          }
        },
        { $unwind: '$threatType' },
        {
          $group: {
            _id: '$threatType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      res.json({
        success: true,
        data: {
          ...threatStats[0],
          emergingThreats,
          timeRange
        }
      });
      
    } catch (error) {
      logger.error(`Get threat intelligence error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get threat intelligence',
        error: error.message
      });
    }
  },
  
  // Analyze specific traffic log
  analyzeTrafficLog: async (req, res) => {
    try {
      const { logId } = req.params;
      
      const trafficLog = await TrafficLog.findById(logId)
        .populate('sourceNode exitNode', 'nickname ipAddress country');
      
      if (!trafficLog) {
        return res.status(404).json({
          success: false,
          message: 'Traffic log not found'
        });
      }
      
      // Perform analysis
      const analysis = await trafficAnalyzer.analyzeTraffic(trafficLog);
      
      // Get similar traffic patterns
      const similarTraffic = await TrafficLog.find({
        _id: { $ne: trafficLog._id },
        destinationIp: trafficLog.destinationIp,
        isMalicious: true,
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
      .limit(10)
      .select('timestamp bytesSent bytesReceived threatLevel threatType')
      .lean();
      
      res.json({
        success: true,
        data: {
          trafficLog,
          analysis,
          similarTraffic,
          recommendations: this.generateRecommendations(analysis)
        }
      });
      
    } catch (error) {
      logger.error(`Analyze traffic log error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze traffic log',
        error: error.message
      });
    }
  },
  
  // Generate recommendations based on analysis
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.threatTypes.includes('malware')) {
      recommendations.push({
        priority: 'high',
        action: 'Block the source node immediately',
        reason: 'Malware activity detected',
        steps: [
          'Mark node as compromised',
          'Review all recent traffic from this node',
          'Check for data exfiltration attempts'
        ]
      });
    }
    
    if (analysis.threatTypes.includes('ddos')) {
      recommendations.push({
        priority: 'high',
        action: 'Implement rate limiting for affected destination',
        reason: 'DDoS attack pattern detected',
        steps: [
          'Monitor traffic patterns',
          'Consider implementing DDoS mitigation',
          'Alert network administrators'
        ]
      });
    }
    
    if (analysis.threatTypes.includes('data_exfiltration')) {
      recommendations.push({
        priority: 'high',
        action: 'Investigate data transfer patterns',
        reason: 'Large data transfer detected',
        steps: [
          'Review transferred data volume',
          'Check destination reputation',
          'Monitor for repeated patterns'
        ]
      });
    }
    
    if (analysis.threatTypes.includes('scanning')) {
      recommendations.push({
        priority: 'medium',
        action: 'Monitor source for further scanning activity',
        reason: 'Port scanning detected',
        steps: [
          'Track all connection attempts',
          'Check for vulnerability exploitation',
          'Consider blocking if pattern continues'
        ]
      });
    }
    
    if (analysis.threatTypes.includes('geo_anomaly')) {
      recommendations.push({
        priority: 'medium',
        action: 'Review geographic access patterns',
        reason: 'Unusual geographic pattern detected',
        steps: [
          'Verify if this is legitimate traffic',
          'Check for VPN or proxy usage',
          'Monitor for similar anomalies'
        ]
      });
    }
    
    // Add general recommendation if multiple threat types
    if (analysis.threatTypes.length >= 2) {
      recommendations.push({
        priority: 'high',
        action: 'Perform comprehensive security review',
        reason: 'Multiple threat indicators detected',
        steps: [
          'Conduct thorough investigation',
          'Review all system logs',
          'Consider incident response procedures'
        ]
      });
    }
    
    return recommendations;
  }
};

module.exports = analyticsController;
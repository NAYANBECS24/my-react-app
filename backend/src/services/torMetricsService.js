const axios = require('axios');
const logger = require('../utils/logger');
const TorNode = require('../models/TorNode');
const { getRedisClient } = require('../config/redis');

class TorMetricsService {
  constructor() {
    this.baseUrl = process.env.TOR_METRICS_API || 'https://metrics.torproject.org';
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.isUpdating = false;
  }
  
  async fetchRelayData() {
    try {
      const response = await axios.get(`${this.baseUrl}/relay-search.json`, {
        params: {
          limit: 1000,
          running: true
        },
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch relay data: ${error.message}`);
      throw error;
    }
  }
  
  async fetchBridgeData() {
    try {
      const response = await axios.get(`${this.baseUrl}/bridge-search.json`, {
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch bridge data: ${error.message}`);
      throw error;
    }
  }
  
  async fetchNetworkStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/network-status.json`, {
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch network status: ${error.message}`);
      throw error;
    }
  }
  
  async updateNodes() {
    if (this.isUpdating) {
      logger.warn('Node update already in progress');
      return;
    }
    
    this.isUpdating = true;
    const startTime = Date.now();
    
    try {
      logger.info('Starting Tor node data update...');
      
      const [relays, bridges, networkStatus] = await Promise.all([
        this.fetchRelayData(),
        this.fetchBridgeData(),
        this.fetchNetworkStatus()
      ]);
      
      const nodes = [...(relays.relays || []), ...(bridges.bridges || [])];
      
      let updatedCount = 0;
      let createdCount = 0;
      let errorCount = 0;
      
      for (const nodeData of nodes) {
        try {
          const nodeId = nodeData.id || nodeData.fingerprint;
          
          if (!nodeId) {
            continue;
          }
          
          const nodeDoc = {
            nodeId,
            fingerprint: nodeData.fingerprint || nodeId,
            nickname: nodeData.nickname || '',
            ipAddress: nodeData.addresses?.[0] || nodeData.or_addresses?.[0] || '0.0.0.0',
            country: nodeData.country_name || 'Unknown',
            countryCode: nodeData.country_code || 'XX',
            asNumber: nodeData.as_number || '',
            asName: nodeData.as_name || '',
            bandwidth: {
              average: nodeData.advertised_bandwidth || 0,
              burst: nodeData.burst_bandwidth || 0,
              observed: nodeData.observed_bandwidth || 0
            },
            uptime: nodeData.uptime || 0,
            flags: nodeData.flags || [],
            version: nodeData.version || '',
            contact: nodeData.contact || '',
            platform: nodeData.platform || '',
            firstSeen: nodeData.first_seen ? new Date(nodeData.first_seen) : null,
            lastSeen: new Date(),
            status: 'online',
            metrics: {
              consensusWeight: nodeData.consensus_weight || 0,
              guardProbability: nodeData.guard_probability || 0,
              exitProbability: nodeData.exit_probability || 0,
              advertisedBandwidth: nodeData.advertised_bandwidth || 0
            },
            isRelay: !nodeData.running,
            isBridge: !!nodeData.running,
            isExit: (nodeData.flags || []).includes('Exit'),
            isGuard: (nodeData.flags || []).includes('Guard'),
            lastMetricsUpdate: new Date()
          };
          
          // Update geo location if available
          if (nodeData.latitude && nodeData.longitude) {
            nodeDoc.geoLocation = {
              latitude: nodeData.latitude,
              longitude: nodeData.longitude,
              city: nodeData.city || '',
              region: nodeData.region || ''
            };
          }
          
          const result = await TorNode.findOneAndUpdate(
            { fingerprint: nodeDoc.fingerprint },
            { $set: nodeDoc },
            { upsert: true, new: true }
          );
          
          if (result.isNew) {
            createdCount++;
          } else {
            updatedCount++;
          }
          
        } catch (error) {
          errorCount++;
          logger.error(`Error processing node: ${error.message}`);
        }
      }
      
      // Mark offline nodes
      const offlineThreshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes
      await TorNode.updateMany(
        { lastSeen: { $lt: offlineThreshold }, status: 'online' },
        { $set: { status: 'offline' } }
      );
      
      const duration = Date.now() - startTime;
      logger.info(`Node update completed in ${duration}ms - Created: ${createdCount}, Updated: ${updatedCount}, Errors: ${errorCount}`);
      
      // Cache network statistics
      await this.cacheNetworkStats();
      
      return {
        success: true,
        created: createdCount,
        updated: updatedCount,
        errors: errorCount,
        duration
      };
      
    } catch (error) {
      logger.error(`Failed to update nodes: ${error.message}`);
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }
  
  async cacheNetworkStats() {
    try {
      const redisClient = getRedisClient();
      if (!redisClient) return;
      
      const stats = await this.getNetworkStatistics();
      await redisClient.set('network:stats', JSON.stringify(stats), {
        EX: 300 // 5 minutes
      });
      
      logger.debug('Network statistics cached');
    } catch (error) {
      logger.error(`Failed to cache network stats: ${error.message}`);
    }
  }
  
  async getNetworkStatistics() {
    try {
      const totalNodes = await TorNode.countDocuments({ status: 'online' });
      const exitNodes = await TorNode.countDocuments({ isExit: true, status: 'online' });
      const guardNodes = await TorNode.countDocuments({ isGuard: true, status: 'online' });
      const bridgeNodes = await TorNode.countDocuments({ isBridge: true, status: 'online' });
      
      const bandwidthStats = await TorNode.aggregate([
        { $match: { status: 'online' } },
        {
          $group: {
            _id: null,
            totalBandwidth: { $sum: '$bandwidth.average' },
            avgBandwidth: { $avg: '$bandwidth.average' },
            maxBandwidth: { $max: '$bandwidth.average' },
            minBandwidth: { $min: '$bandwidth.average' }
          }
        }
      ]);
      
      const countryDistribution = await TorNode.aggregate([
        { $match: { status: 'online' } },
        {
          $group: {
            _id: '$countryCode',
            count: { $sum: 1 },
            totalBandwidth: { $sum: '$bandwidth.average' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      const versionDistribution = await TorNode.aggregate([
        { $match: { status: 'online', version: { $exists: true, $ne: '' } } },
        {
          $group: {
            _id: { $arrayElemAt: [{ $split: ['$version', ' '] }, 0] }, // Get major version
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      return {
        totalNodes,
        exitNodes,
        guardNodes,
        bridgeNodes,
        bandwidth: bandwidthStats[0] || {
          totalBandwidth: 0,
          avgBandwidth: 0,
          maxBandwidth: 0,
          minBandwidth: 0
        },
        countryDistribution,
        versionDistribution,
        lastUpdated: new Date()
      };
      
    } catch (error) {
      logger.error(`Failed to get network statistics: ${error.message}`);
      throw error;
    }
  }
  
  async getNodeDetails(fingerprint) {
    try {
      const node = await TorNode.findOne({ fingerprint });
      
      if (!node) {
        throw new Error('Node not found');
      }
      
      // Get related traffic
      const recentTraffic = await TrafficLog.find({
        $or: [
          { sourceNode: node._id },
          { exitNode: node._id }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('sourceNode exitNode', 'nickname ipAddress country');
      
      // Get node performance history
      const performanceHistory = await TrafficLog.aggregate([
        {
          $match: {
            $or: [
              { sourceNode: node._id },
              { exitNode: node._id }
            ],
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              hour: { $hour: '$timestamp' }
            },
            avgBytesSent: { $avg: '$bytesSent' },
            avgBytesReceived: { $avg: '$bytesReceived' },
            totalConnections: { $sum: 1 }
          }
        },
        { $sort: { '_id.hour': 1 } }
      ]);
      
      return {
        node: node.toObject(),
        recentTraffic,
        performanceHistory,
        metrics: {
          uptimePercentage: this.calculateUptimePercentage(node),
          reliabilityScore: this.calculateReliabilityScore(node),
          threatScore: this.calculateThreatScore(node)
        }
      };
      
    } catch (error) {
      logger.error(`Failed to get node details: ${error.message}`);
      throw error;
    }
  }
  
  calculateUptimePercentage(node) {
    if (!node.firstSeen) return 0;
    
    const totalUptime = node.uptime || 0;
    const totalTime = Date.now() - new Date(node.firstSeen).getTime();
    
    return totalTime > 0 ? (totalUptime / totalTime) * 100 : 0;
  }
  
  calculateReliabilityScore(node) {
    let score = 50; // Base score
    
    // Add points for flags
    const flags = node.flags || [];
    if (flags.includes('Stable')) score += 20;
    if (flags.includes('Fast')) score += 15;
    if (flags.includes('Valid')) score += 10;
    if (flags.includes('Running')) score += 5;
    
    // Deduct points for issues
    if (node.status === 'offline') score -= 30;
    if (node.status === 'suspicious') score -= 20;
    
    // Bandwidth factor
    const bandwidthScore = Math.min(node.bandwidth.average / 10000000, 10); // 10MB/s = +10 points
    score += bandwidthScore;
    
    return Math.max(0, Math.min(100, score));
  }
  
  calculateThreatScore(node) {
    let score = 0;
    
    // Exit nodes have higher risk
    if (node.isExit) score += 30;
    
    // Recent suspicious activity
    if (node.status === 'suspicious') score += 40;
    if (node.status === 'compromised') score += 70;
    
    // Country risk factors (example - adjust based on your risk assessment)
    const highRiskCountries = ['RU', 'CN', 'IR', 'KP', 'SY'];
    if (highRiskCountries.includes(node.countryCode)) score += 20;
    
    return Math.min(100, score);
  }
  
  async startAutoUpdate() {
    logger.info('Starting Tor metrics auto-update service');
    
    const updateInterval = async () => {
      try {
        await this.updateNodes();
      } catch (error) {
        logger.error(`Auto-update failed: ${error.message}`);
      }
      
      // Schedule next update
      setTimeout(updateInterval, this.updateInterval);
    };
    
    // Initial update
    setTimeout(updateInterval, 1000);
  }
}

module.exports = new TorMetricsService();
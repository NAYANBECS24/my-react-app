const mongoose = require('mongoose');

const trafficLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  sourceNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TorNode'
  },
  destinationIp: {
    type: String
  },
  destinationPort: {
    type: Number
  },
  protocol: {
    type: String,
    enum: ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'OTHER'],
    default: 'TCP'
  },
  bytesSent: {
    type: Number,
    default: 0
  },
  bytesReceived: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  exitNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TorNode'
  },
  circuitId: {
    type: String
  },
  streamId: {
    type: String
  },
  purpose: {
    type: String,
    enum: ['USER', 'DIR', 'HSDIR', 'INTRO', 'REND', 'CONTROL', 'OTHER'],
    default: 'USER'
  },
  isMalicious: {
    type: Boolean,
    default: false
  },
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  threatType: [{
    type: String,
    enum: ['malware', 'phishing', 'ddos', 'scanning', 'exploit', 'data_exfiltration', 'command_control']
  }],
  geoData: {
    sourceCountry: { type: String },
    sourceCountryCode: { type: String },
    destCountry: { type: String },
    destCountryCode: { type: String }
  },
  userAgent: {
    type: String
  },
  requestedDomain: {
    type: String
  },
  responseCode: {
    type: Number
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound indexes for common query patterns
trafficLogSchema.index({ timestamp: -1, isMalicious: 1 });
trafficLogSchema.index({ sourceNode: 1, timestamp: -1 });
trafficLogSchema.index({ exitNode: 1, timestamp: -1 });
trafficLogSchema.index({ threatLevel: 1, timestamp: -1 });
trafficLogSchema.index({ protocol: 1, timestamp: -1 });
trafficLogSchema.index({ 'geoData.sourceCountryCode': 1, timestamp: -1 });
trafficLogSchema.index({ circuitId: 1 });
trafficLogSchema.index({ isMalicious: 1, timestamp: -1 });

// Method to get log summary
trafficLogSchema.methods.getSummary = function() {
  return {
    id: this._id,
    timestamp: this.timestamp,
    sourceNode: this.sourceNode,
    destinationIp: this.destinationIp,
    protocol: this.protocol,
    bytesSent: this.bytesSent,
    bytesReceived: this.bytesReceived,
    isMalicious: this.isMalicious,
    threatLevel: this.threatLevel,
    threatType: this.threatType,
    geoData: this.geoData
  };
};

const TrafficLog = mongoose.model('TrafficLog', trafficLogSchema);

module.exports = TrafficLog;
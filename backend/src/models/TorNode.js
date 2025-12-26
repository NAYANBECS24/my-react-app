const mongoose = require('mongoose');

const torNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true
  },
  fingerprint: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  asNumber: {
    type: String
  },
  asName: {
    type: String
  },
  bandwidth: {
    average: { type: Number, default: 0 },
    burst: { type: Number, default: 0 },
    observed: { type: Number, default: 0 }
  },
  uptime: {
    type: Number,
    default: 0
  },
  flags: [{
    type: String,
    enum: ['Running', 'Valid', 'Fast', 'Stable', 'Guard', 'Exit', 'HSDir', 'V2Dir', 'Authority']
  }],
  version: {
    type: String
  },
  contact: {
    type: String,
    trim: true
  },
  platform: {
    type: String
  },
  firstSeen: {
    type: Date
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'suspicious', 'compromised'],
    default: 'online'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  metrics: {
    consensusWeight: { type: Number, default: 0 },
    guardProbability: { type: Number, default: 0 },
    exitProbability: { type: Number, default: 0 },
    advertisedBandwidth: { type: Number, default: 0 }
  },
  geoLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    region: { type: String }
  },
  isRelay: {
    type: Boolean,
    default: true
  },
  isBridge: {
    type: Boolean,
    default: false
  },
  isExit: {
    type: Boolean,
    default: false
  },
  isGuard: {
    type: Boolean,
    default: false
  },
  lastMetricsUpdate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
torNodeSchema.index({ countryCode: 1 });
torNodeSchema.index({ status: 1 });
torNodeSchema.index({ isExit: 1 });
torNodeSchema.index({ isGuard: 1 });
torNodeSchema.index({ lastSeen: -1 });
torNodeSchema.index({ 'bandwidth.average': -1 });
torNodeSchema.index({ fingerprint: 1 }, { unique: true });

// Method to get node summary
torNodeSchema.methods.getSummary = function() {
  return {
    nodeId: this.nodeId,
    nickname: this.nickname,
    ipAddress: this.ipAddress,
    country: this.country,
    countryCode: this.countryCode,
    bandwidth: this.bandwidth.average,
    status: this.status,
    flags: this.flags,
    isExit: this.isExit,
    isGuard: this.isGuard,
    lastSeen: this.lastSeen
  };
};

const TorNode = mongoose.model('TorNode', torNodeSchema);

module.exports = TorNode;
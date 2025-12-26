const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'node_offline',
      'malicious_traffic',
      'bandwidth_anomaly',
      'new_exit_node',
      'geo_anomaly',
      'protocol_violation',
      'performance_degradation',
      'security_breach',
      'system_health'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'acknowledged', 'investigating', 'resolved', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['system', 'user', 'api', 'external'],
    default: 'system'
  },
  affectedNodes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TorNode'
  }],
  affectedTraffic: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrafficLog'
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  triggeredAt: {
    type: Date,
    default: Date.now
  },
  acknowledgedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  // For recurring alerts
  recurrence: {
    pattern: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly', 'custom']
    },
    nextTrigger: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes
alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ triggeredAt: -1 });
alertSchema.index({ type: 1, triggeredAt: -1 });
alertSchema.index({ severity: 1, triggeredAt: -1 });
alertSchema.index({ isActive: 1, status: 1 });
alertSchema.index({ assignedTo: 1, status: 1 });

// Method to get alert summary
alertSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    type: this.type,
    severity: this.severity,
    status: this.status,
    triggeredAt: this.triggeredAt,
    acknowledgedAt: this.acknowledgedAt,
    resolvedAt: this.resolvedAt,
    affectedNodes: this.affectedNodes?.length || 0
  };
};

// Static method to get alert statistics
alertSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        bySeverity: [
          { $group: { _id: '$severity', count: { $sum: 1 } } }
        ],
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ],
        total: [
          { $count: 'count' }
        ],
        recent: [
          { $sort: { triggeredAt: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);
  
  return stats[0];
};

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
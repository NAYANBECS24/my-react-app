// Mock API for ATWC engine
export const atwcApi = {
  getRecentCorrelations: async ({ limit }) => {
    const mockCorrelations = Array.from({ length: limit || 20 }, (_, i) => ({
      id: `corr-${i + 1}`,
      circuitId: `circuit_${Math.random().toString(36).substr(2, 9)}`,
      entryNode: `entry_${Math.random().toString(36).substr(2, 6)}`,
      exitNode: `exit_${Math.random().toString(36).substr(2, 6)}`,
      timingDelta: Math.floor(Math.random() * 1000) + 100,
      confidence: Math.random() * 0.3 + 0.6, // Between 0.6 and 0.9
      involvedISPs: ['BSNL Chennai', 'Jio Mumbai', 'Airtel Delhi'].slice(0, Math.floor(Math.random() * 3) + 1),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
    
    return { data: mockCorrelations };
  },
  
  getEngineStatus: async () => {
    return {
      data: {
        active: true,
        version: '2.1.0',
        accuracy: 0.89,
        confidence: 0.92,
        processingRate: 1250,
        memoryUsage: 342,
        cpuUsage: 28,
        queueSize: 0
      }
    };
  }
};
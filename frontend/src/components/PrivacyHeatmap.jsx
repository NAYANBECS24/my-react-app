import React from 'react';
import { Box, Typography } from '@mui/material';

const PrivacyHeatmap = ({ metrics, height = 200 }) => {
  const privacyData = [
    { label: 'DP Budget', value: metrics?.differentialPrivacy?.epsilon || 1.2, max: 10, color: '#2196f3' },
    { label: 'Noise Scale', value: metrics?.differentialPrivacy?.noiseScale || 0.1, max: 1, color: '#4caf50' },
    { label: 'Feature Reduction', value: metrics?.dataMinimization?.featureReduction || 0.85, max: 1, color: '#ff9800' },
    { label: 'PII Removal', value: metrics?.dataMinimization?.piiRemoval || 1.0, max: 1, color: '#f44336' },
    { label: 'k-Anonymity', value: metrics?.dataMinimization?.kAnonymity || 3, max: 10, color: '#9c27b0' },
    { label: 'l-Diversity', value: metrics?.dataMinimization?.lDiversity || 2.5, max: 5, color: '#00bcd4' },
  ];

  return (
    <Box sx={{ height, p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Privacy Metrics Heatmap
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, height: 'calc(100% - 30px)' }}>
        {privacyData.map((item, index) => {
          const percentage = (item.value / item.max) * 100;
          const intensity = Math.min(100, percentage);
          
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, ${intensity / 100})`,
                border: `1px solid ${item.color}40`,
              }}
            >
              <Typography variant="caption" align="center" sx={{ fontWeight: 'bold', color: intensity > 50 ? '#fff' : '#000' }}>
                {item.label}
              </Typography>
              <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', color: intensity > 50 ? '#fff' : '#000' }}>
                {item.value}
              </Typography>
              <Typography variant="caption" align="center" sx={{ color: intensity > 50 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)' }}>
                {Math.round(percentage)}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PrivacyHeatmap;
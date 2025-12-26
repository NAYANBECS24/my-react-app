import React from 'react';
import { Box, Typography } from '@mui/material';

const FederatedTrainingChart = ({ data, height = 200, showAllMetrics = false }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No training data available</Typography>
      </Box>
    );
  }

  const maxAccuracy = Math.max(...data.map(d => d.accuracy));
  const minAccuracy = Math.min(...data.map(d => d.accuracy));
  const chartWidth = 800;
  const chartHeight = height;
  const padding = 40;
  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  const getX = (index) => padding + (index / (data.length - 1)) * plotWidth;
  const getY = (value) => padding + plotHeight - (value / maxAccuracy) * plotHeight;

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      <svg width="100%" height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={padding}
              y1={getY(ratio * maxAccuracy)}
              x2={padding + plotWidth}
              y2={getY(ratio * maxAccuracy)}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={getY(ratio * maxAccuracy)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#666"
            >
              {Math.round(ratio * maxAccuracy * 100)}%
            </text>
          </g>
        ))}

        {/* Accuracy line */}
        <polyline
          points={data.map((d, i) => `${getX(i)},${getY(d.accuracy)}`).join(' ')}
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={getX(i)}
              cy={getY(d.accuracy)}
              r="4"
              fill="#4caf50"
            />
            <text
              x={getX(i)}
              y={getY(d.accuracy) - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {Math.round(d.accuracy * 100)}%
            </text>
          </g>
        ))}

        {/* Round labels */}
        {data.map((d, i) => (
          <text
            key={`label-${i}`}
            x={getX(i)}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#666"
          >
            R{d.round}
          </text>
        ))}
      </svg>
    </Box>
  );
};

export default FederatedTrainingChart;
import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const ISPParticipationNetwork = ({ isps, onISPSelect, height = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isps || isps.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    // Draw central node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#9c27b0';
    ctx.fill();
    ctx.strokeStyle = '#673ab7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw central label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Federation Hub', centerX, centerY + 40);

    // Draw ISP nodes
    isps.forEach((isp, index) => {
      const angle = (index / isps.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isp.isActive ? 
        (isp.status === 'training' ? '#ff9800' : '#4caf50') : 
        '#ccc';
      ctx.lineWidth = isp.isActive ? 2 : 1;
      ctx.stroke();

      // Draw ISP node
      const nodeRadius = 15 + (isp.dataPoints / 20000) * 10; // Size based on data points
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      
      // Color based on ISP type and status
      let fillColor;
      if (isp.ispType === 'government') {
        fillColor = isp.isActive ? '#2196f3' : '#90caf9';
      } else {
        fillColor = isp.isActive ? '#4caf50' : '#a5d6a7';
      }
      
      if (isp.status === 'training') {
        fillColor = '#ff9800';
      }
      
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw ISP initial
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isp.name.charAt(0), x, y);

      // Draw ISP name
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(isp.name.split(' ')[0], x, y + nodeRadius + 15);

      // Store clickable area
      isp.canvasPosition = { x, y, radius: nodeRadius };
    });

    // Add click handler
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      isps.forEach(isp => {
        if (isp.canvasPosition) {
          const dx = x - isp.canvasPosition.x;
          const dy = y - isp.canvasPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance <= isp.canvasPosition.radius + 5) { // +5 for easier clicking
            onISPSelect(isp);
          }
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [isps, onISPSelect, height]);

  return (
    <Box sx={{ height, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      />
      <Box sx={{ position: 'absolute', bottom: 10, left: 10, bgcolor: 'rgba(255,255,255,0.9)', p: 1, borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Click on ISP nodes for details
        </Typography>
      </Box>
    </Box>
  );
};

export default ISPParticipationNetwork;
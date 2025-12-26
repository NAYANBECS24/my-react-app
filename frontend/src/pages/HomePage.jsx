import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  CloudDownload as CloudDownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  DeviceHub as DeviceHubIcon,
  Public as PublicIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

const HomePage = () => {
  const stats = [
    { 
      title: 'Active Connections', 
      value: '1,245', 
      icon: <SpeedIcon />, 
      color: '#2196f3', 
      change: '+12%',
      description: 'Live network connections'
    },
    { 
      title: 'Encrypted Traffic', 
      value: '98.7%', 
      icon: <SecurityIcon />, 
      color: '#4caf50', 
      change: '+2.3%',
      description: 'AES-256 encrypted'
    },
    { 
      title: 'Threats Blocked', 
      value: '42', 
      icon: <AnalyticsIcon />, 
      color: '#f44336', 
      change: '-8%',
      description: 'Last 24 hours'
    },
    { 
      title: 'Data Processed', 
      value: '245 GB', 
      icon: <CloudDownloadIcon />, 
      color: '#ff9800', 
      change: '+18%',
      description: 'Today\'s volume'
    },
  ];

  const systemMetrics = [
    { label: 'Network Uptime', value: '99.8%', progress: 99.8, color: 'success' },
    { label: 'Encryption Strength', value: 'AES-256', progress: 100, color: 'primary' },
    { label: 'Data Security', value: 'Optimal', progress: 95, color: 'info' },
    { label: 'System Load', value: '42%', progress: 42, color: 'warning' },
  ];

  const recentActivity = [
    { 
      action: 'System scan completed', 
      time: '2 minutes ago', 
      icon: <CheckCircleIcon color="success" /> 
    },
    { 
      action: 'New connection detected', 
      time: '15 minutes ago', 
      icon: <WarningIcon color="warning" /> 
    },
    { 
      action: 'Encryption updated', 
      time: '1 hour ago', 
      icon: <CheckCircleIcon color="success" /> 
    },
    { 
      action: 'Backup completed', 
      time: '3 hours ago', 
      icon: <CheckCircleIcon color="success" /> 
    },
  ];

  const networkHealth = [
    { label: 'Nodes Online', value: '98.5%', status: 'good' },
    { label: 'Latency', value: '45ms', status: 'good' },
    { label: 'Packet Loss', value: '0.2%', status: 'good' },
    { label: 'Bandwidth Usage', value: '78%', status: 'warning' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of network performance and security
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => console.log('Refresh')}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`,
              border: `1px solid ${stat.color}30`,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${stat.color}30`,
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: `${stat.color}20`, 
                    p: 1, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } })}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    color={stat.change.startsWith('+') ? 'success' : 'error'}
                    icon={stat.change.startsWith('+') ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - System Status & Quick Actions */}
        <Grid item xs={12} md={8}>
          {/* System Status */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                System Status
              </Typography>
              <Chip label="All Systems Operational" color="success" size="small" />
            </Box>
            
            {systemMetrics.map((metric, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">{metric.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{metric.value}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metric.progress} 
                  color={metric.color}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </Box>
            ))}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Start Network Scan', color: 'primary', icon: <SpeedIcon /> },
                { label: 'View Alerts', color: 'secondary', icon: <NotificationsIcon /> },
                { label: 'Export Data', color: 'success', icon: <DownloadIcon /> },
                { label: 'System Settings', color: 'info', icon: <SettingsIcon /> },
                { label: 'Performance Report', color: 'warning', icon: <AnalyticsIcon /> },
                { label: 'Backup Now', color: 'error', icon: <CloudDownloadIcon /> },
              ].map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Button
                    variant="contained"
                    color={action.color}
                    startIcon={action.icon}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Recent Activity & Network Health */}
        <Grid item xs={12} md={4}>
          {/* Recent Activity */}
          <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 24 hours
              </Typography>
            </Box>
            
            {recentActivity.map((activity, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  {activity.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Network Health */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Network Health
            </Typography>
            
            <Grid container spacing={2}>
              {networkHealth.map((health, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {health.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {health.label}
                    </Typography>
                    <Box sx={{ 
                      mt: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 
                        health.status === 'good' ? 'rgba(76, 175, 80, 0.2)' :
                        health.status === 'warning' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                    }}>
                      <Box sx={{ 
                        width: health.status === 'good' ? '90%' : 
                               health.status === 'warning' ? '70%' : '40%',
                        height: '100%',
                        borderRadius: 2,
                        backgroundColor: 
                          health.status === 'good' ? '#4caf50' :
                          health.status === 'warning' ? '#ff9800' : '#f44336',
                      }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section - Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Traffic Analysis
            </Typography>
            <Box sx={{ 
              height: 200, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(33, 150, 243, 0.05)',
              borderRadius: 2,
              border: '1px dashed rgba(33, 150, 243, 0.3)'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Traffic visualization chart
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Chart integration pending)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Node Distribution
            </Typography>
            <Box sx={{ 
              height: 200, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(156, 39, 176, 0.05)',
              borderRadius: 2,
              border: '1px dashed rgba(156, 39, 176, 0.3)'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <DeviceHubIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Node distribution chart
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Chart integration pending)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Info Alert */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ 
          p: 2, 
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          border: '1px solid rgba(33, 150, 243, 0.2)',
          borderRadius: 2
        }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PublicIcon fontSize="small" color="info" />
            <strong>Tip:</strong> Monitor traffic patterns regularly to detect anomalies early.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
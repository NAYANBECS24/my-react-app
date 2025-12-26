import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Equalizer as EqualizerIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkCheckIcon,
  DeviceHub as DeviceHubIcon,
  Router as RouterIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const RealTimeMonitor = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [timeRange, setTimeRange] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [data, setData] = useState([]);
  const [liveStats, setLiveStats] = useState({
    bandwidth: 0,
    packets: 0,
    connections: 0,
    threats: 0,
    latency: 0,
    throughput: 0,
  });

  const colors = {
    primary: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    purple: '#9c27b0',
    cyan: '#00bcd4',
    grey: '#607d8b',
  };

  // Mock data generation
  const generateMockData = () => {
    const now = new Date();
    const newData = [];
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - (i * 6000));
      newData.unshift({
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bandwidth: Math.random() * 100 + 50,
        packets: Math.random() * 1000 + 500,
        connections: Math.floor(Math.random() * 100) + 20,
        threats: Math.floor(Math.random() * 10),
        latency: Math.random() * 100 + 20,
        throughput: Math.random() * 50 + 10,
      });
    }
    setData(newData);
    
    // Update live stats with latest data
    if (newData.length > 0) {
      const latest = newData[newData.length - 1];
      setLiveStats({
        bandwidth: latest.bandwidth,
        packets: latest.packets,
        connections: latest.connections,
        threats: latest.threats,
        latency: latest.latency,
        throughput: latest.throughput,
      });
    }
  };

  useEffect(() => {
    generateMockData();
    const interval = setInterval(() => {
      if (isPlaying) {
        generateMockData();
      }
    }, 2000 / speed);
    
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const statsCards = [
    {
      title: 'Bandwidth Usage',
      value: `${liveStats.bandwidth.toFixed(1)} Mbps`,
      icon: <SpeedIcon />,
      color: colors.primary,
      trend: liveStats.bandwidth > 75 ? 'up' : 'down',
      change: '+12.5%',
    },
    {
      title: 'Active Connections',
      value: liveStats.connections.toString(),
      icon: <DeviceHubIcon />,
      color: colors.success,
      trend: 'up',
      change: '+8.2%',
    },
    {
      title: 'Packet Rate',
      value: `${liveStats.packets.toFixed(0)}/s`,
      icon: <NetworkCheckIcon />,
      color: colors.purple,
      trend: liveStats.packets > 800 ? 'up' : 'down',
      change: liveStats.packets > 800 ? '+5.3%' : '-2.1%',
    },
    {
      title: 'Active Threats',
      value: liveStats.threats.toString(),
      icon: <WarningIcon />,
      color: colors.error,
      trend: liveStats.threats > 5 ? 'up' : 'down',
      severity: liveStats.threats > 5 ? 'high' : 'medium',
    },
  ];

  const recentAlerts = [
    { id: 1, type: 'DDoS', severity: 'high', source: '192.168.1.100', time: 'Just now', status: 'active' },
    { id: 2, type: 'Port Scan', severity: 'medium', source: '10.0.0.45', time: '2 min ago', status: 'detected' },
    { id: 3, type: 'Malware', severity: 'critical', source: 'External', time: '5 min ago', status: 'mitigated' },
    { id: 4, type: 'Unauthorized Access', severity: 'high', source: 'Internal', time: '10 min ago', status: 'blocked' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              <TimelineIcon sx={{ mr: 2, verticalAlign: 'middle', color: colors.cyan }} />
              Real-time Monitor
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Live network monitoring and analytics dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title={isPlaying ? 'Pause updates' : 'Resume updates'}>
              <IconButton 
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{ 
                  background: isPlaying ? `linear-gradient(135deg, ${colors.error}, #ff6b6b)` : `linear-gradient(135deg, ${colors.success}, #66bb6a)`,
                  color: 'white',
                  '&:hover': {
                    background: isPlaying ? `linear-gradient(135deg, #d32f2f, ${colors.error})` : `linear-gradient(135deg, #388e3c, ${colors.success})`,
                  }
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={generateMockData}
              sx={{ borderColor: colors.primary, color: colors.primary }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})` }}
            >
              Export Data
            </Button>
          </Box>
        </Box>

        {/* Controls */}
        <Paper sx={{ p: 2, mb: 3, background: 'rgba(19, 47, 76, 0.5)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>Update Speed</Typography>
              <Slider
                value={speed}
                onChange={(e, val) => setSpeed(val)}
                min={0.5}
                max={5}
                step={0.5}
                marks={[
                  { value: 0.5, label: '0.5x' },
                  { value: 2.5, label: '2.5x' },
                  { value: 5, label: '5x' },
                ]}
                sx={{ color: colors.primary }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value={15}>Last 15 minutes</MenuItem>
                  <MenuItem value={30}>Last 30 minutes</MenuItem>
                  <MenuItem value={60}>Last hour</MenuItem>
                  <MenuItem value={180}>Last 3 hours</MenuItem>
                  <MenuItem value={360}>Last 6 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={<Switch checked={isPlaying} onChange={() => setIsPlaying(!isPlaying)} />}
                label="Live Updates"
                sx={{ color: 'text.primary' }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              background: `linear-gradient(135deg, rgba(19, 47, 76, 0.8), rgba(33, 150, 243, 0.1))`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${stat.color}30`,
              height: '100%',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: `${stat.color}20`, 
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                {stat.change && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {stat.trend === 'up' ? (
                      <ArrowUpIcon sx={{ color: colors.success, mr: 0.5 }} />
                    ) : (
                      <ArrowDownIcon sx={{ color: colors.error, mr: 0.5 }} />
                    )}
                    <Typography variant="body2" sx={{ color: stat.trend === 'up' ? colors.success : colors.error }}>
                      {stat.change} from last hour
                    </Typography>
                  </Box>
                )}
                {stat.severity && (
                  <Chip 
                    label={stat.severity.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: stat.severity === 'high' ? colors.error : colors.warning,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            background: 'rgba(19, 47, 76, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(66, 165, 245, 0.2)',
            height: '400px',
          }}>
            <CardHeader
              title="Network Performance Trends"
              action={
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="all">All Metrics</MenuItem>
                    <MenuItem value="bandwidth">Bandwidth</MenuItem>
                    <MenuItem value="latency">Latency</MenuItem>
                    <MenuItem value="throughput">Throughput</MenuItem>
                  </Select>
                </FormControl>
              }
              sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
            <CardContent sx={{ height: 'calc(100% - 70px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.7)" />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: 'rgba(10, 25, 41, 0.95)',
                      border: '1px solid rgba(66, 165, 245, 0.3)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="bandwidth" 
                    stroke={colors.primary} 
                    fill={colors.primary}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Bandwidth (Mbps)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke={colors.warning} 
                    fill={colors.warning}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Latency (ms)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="throughput" 
                    stroke={colors.success} 
                    fill={colors.success}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Throughput (Gbps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            background: 'rgba(19, 47, 76, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(66, 165, 245, 0.2)',
            height: '400px',
          }}>
            <CardHeader title="Traffic Distribution" />
            <CardContent sx={{ height: 'calc(100% - 70px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'HTTP', value: 35, color: colors.primary },
                      { name: 'HTTPS', value: 25, color: colors.success },
                      { name: 'DNS', value: 15, color: colors.warning },
                      { name: 'SSH', value: 10, color: colors.purple },
                      { name: 'Other', value: 15, color: colors.grey },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'HTTP', value: 35, color: colors.primary },
                      { name: 'HTTPS', value: 25, color: colors.success },
                      { name: 'DNS', value: 15, color: colors.warning },
                      { name: 'SSH', value: 10, color: colors.purple },
                      { name: 'Other', value: 15, color: colors.grey },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'rgba(19, 47, 76, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(66, 165, 245, 0.2)',
          }}>
            <CardHeader 
              title="Recent Security Alerts"
              action={
                <IconButton>
                  <FilterIcon />
                </IconButton>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Source IP</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAlerts.map((alert) => (
                      <TableRow key={alert.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarningIcon 
                              sx={{ 
                                mr: 1, 
                                color: alert.severity === 'critical' ? colors.error : 
                                       alert.severity === 'high' ? colors.warning : colors.success 
                              }} 
                            />
                            {alert.type}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={alert.severity}
                            size="small"
                            sx={{
                              background: alert.severity === 'critical' ? colors.error : 
                                        alert.severity === 'high' ? colors.warning : colors.success,
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell>{alert.source}</TableCell>
                        <TableCell>{alert.time}</TableCell>
                        <TableCell>
                          <Chip 
                            label={alert.status}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: alert.status === 'active' ? colors.error : 
                                         alert.status === 'detected' ? colors.warning : colors.success,
                              color: alert.status === 'active' ? colors.error : 
                                   alert.status === 'detected' ? colors.warning : colors.success,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                            Details
                          </Button>
                          <Button size="small" variant="contained">
                            Mitigate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMonitor;
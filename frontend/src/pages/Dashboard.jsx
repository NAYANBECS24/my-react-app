import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  AvatarGroup,
  Tab,
  Tabs,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Traffic as TrafficIcon,
  DeviceHub as NodesIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  Analytics as AnalyticsIcon,
  CloudDownload as DataIcon,
  AutoAwesome as AIcon,
  Link as CorrelationIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  NetworkCheck as NetworkIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { useWebSocket } from '../utils/websocket';
import { 
  correlationApi, 
  encryptionApi, 
  atwcApi, 
  trafficApi, 
  dataCollectionApi 
} from '../api/tor';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [servicesStatus, setServicesStatus] = useState({});
  const [correlationData, setCorrelationData] = useState([]);
  const [encryptionStatus, setEncryptionStatus] = useState({});
  const [atwcPredictions, setAtwcPredictions] = useState([]);
  const [trafficAnalysis, setTrafficAnalysis] = useState({});
  const [collectionStatus, setCollectionStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Use WebSocket for real-time updates
  useWebSocket();

  useEffect(() => {
    loadAllServicesData();
    const interval = setInterval(loadAllServicesData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAllServicesData = async () => {
    try {
      setIsLoading(true);
      
      // Load all services data in parallel
      const [
        correlationResp,
        encryptionResp,
        atwcResp,
        trafficResp,
        collectionResp,
        healthResp
      ] = await Promise.allSettled([
        correlationApi.getPatterns(),
        encryptionApi.getStatus(),
        atwcApi.getStatus(),
        trafficApi.getStatistics(),
        dataCollectionApi.getStatus(),
        fetch('/api/health').then(res => res.json())
      ]);

      // Update states
      if (correlationResp.status === 'fulfilled') {
        setCorrelationData(correlationResp.value.data.patterns || []);
      }
      
      if (encryptionResp.status === 'fulfilled') {
        setEncryptionStatus(encryptionResp.value.data || {});
      }
      
      if (atwcResp.status === 'fulfilled') {
        setAtwcPredictions(atwcResp.value.data.predictions || []);
      }
      
      if (trafficResp.status === 'fulfilled') {
        setTrafficAnalysis(trafficResp.value.data || {});
      }
      
      if (collectionResp.status === 'fulfilled') {
        setCollectionStatus(collectionResp.value.data || {});
      }
      
      if (healthResp.status === 'fulfilled') {
        setServicesStatus(healthResp.value.services || {});
      }
      
    } catch (error) {
      console.error('Error loading services data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartService = async (service) => {
    try {
      let response;
      switch(service) {
        case 'dataCollection':
          response = await dataCollectionApi.startCollection();
          break;
        case 'atwc':
          response = await atwcApi.trainModel({});
          break;
        case 'correlation':
          response = await correlationApi.analyze([], 60000, 0.7);
          break;
        default:
          break;
      }
      if (response) {
        await loadAllServicesData();
      }
    } catch (error) {
      console.error(`Error starting ${service}:`, error);
    }
  };

  const handleStopService = async (service) => {
    try {
      let response;
      switch(service) {
        case 'dataCollection':
          response = await dataCollectionApi.stopCollection();
          break;
        default:
          break;
      }
      if (response) {
        await loadAllServicesData();
      }
    } catch (error) {
      console.error(`Error stopping ${service}:`, error);
    }
  };

  const stats = {
    totalTraffic: '12.4M',
    activeNodes: 6985,
    threatsDetected: 128,
    bandwidth: '156 TB',
    threatRate: '4.2%',
    avgResponse: '2.3s',
    encryptedConnections: '98.7%',
    nodeUptime: '96.4%',
    correlationAccuracy: '92%',
    atwcPredictions: '85%',
    dataCollectionRate: '1.2K/sec'
  };

  const recentAlerts = [
    { id: 1, type: 'DDoS Attack', severity: 'critical', timestamp: '2 min ago', node: 'ExitNode03', status: 'active' },
    { id: 2, type: 'Port Scanning', severity: 'high', timestamp: '15 min ago', node: 'GuardNode01', status: 'investigating' },
    { id: 3, type: 'Node Offline', severity: 'medium', timestamp: '1 hour ago', node: 'GuardNode12', status: 'resolved' },
    { id: 4, type: 'Bandwidth Spike', severity: 'medium', timestamp: '2 hours ago', node: 'ExitNode01', status: 'monitoring' },
  ];

  const nodeStatus = [
    { type: 'Guard Nodes', count: 2450, status: '95%', color: '#2196f3', icon: <VpnKeyIcon /> },
    { type: 'Relay Nodes', count: 3200, status: '97%', color: '#4caf50', icon: <NodesIcon /> },
    { type: 'Exit Nodes', count: 1335, status: '89%', color: '#f44336', icon: <PublicIcon /> },
    { type: 'Bridges', count: 497, status: '92%', color: '#9c27b0', icon: <SecurityIcon /> },
  ];

  // Service status cards
  const serviceCards = [
    {
      title: 'Correlation Engine',
      description: 'Real-time threat correlation',
      icon: <CorrelationIcon />,
      status: servicesStatus.correlationEngine,
      color: '#2196f3',
      endpoint: '/api/correlation',
      actions: [
        { label: 'Analyze', action: () => handleStartService('correlation') },
        { label: 'View Patterns', action: () => setActiveTab(1) }
      ]
    },
    {
      title: 'Traffic Analyzer',
      description: 'Deep packet analysis',
      icon: <AnalyticsIcon />,
      status: servicesStatus.trafficAnalyzer,
      color: '#4caf50',
      endpoint: '/api/traffic',
      actions: [
        { label: 'Analyze Now', action: () => trafficApi.analyzeTraffic({}) }
      ]
    },
    {
      title: 'Encryption Manager',
      description: 'End-to-end encryption',
      icon: <LockIcon />,
      status: servicesStatus.encryptionManager,
      color: '#9c27b0',
      endpoint: '/api/encryption',
      actions: [
        { label: 'Rotate Keys', action: () => encryptionApi.rotateKeys() },
        { label: 'Status', action: () => setActiveTab(2) }
      ]
    },
    {
      title: 'ATWC Engine',
      description: 'Federated learning AI',
      icon: <AIcon />,
      status: servicesStatus.atwcEngine,
      color: '#ff9800',
      endpoint: '/api/atwc',
      actions: [
        { label: 'Train Model', action: () => handleStartService('atwc') },
        { label: 'Predict', action: () => atwcApi.getPredictions({}) }
      ]
    },
    {
      title: 'Data Collection',
      description: 'Real-time data gathering',
      icon: <DataIcon />,
      status: servicesStatus.dataCollector,
      color: '#607d8b',
      endpoint: '/api/collection',
      actions: [
        { label: 'Start', action: () => handleStartService('dataCollection') },
        { label: 'Stop', action: () => handleStopService('dataCollection') }
      ]
    },
    {
      title: 'Node Collector',
      description: 'Tor node discovery',
      icon: <NodesIcon />,
      status: servicesStatus.nodeCollector,
      color: '#00bcd4',
      endpoint: '/api/nodes',
      actions: [
        { label: 'Refresh', action: loadAllServicesData }
      ]
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #2196f3, #4dabf5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Tor Sentinel Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of all security services
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={loadAllServicesData}
            disabled={isLoading}
            sx={{ 
              borderColor: 'rgba(33, 150, 243, 0.3)',
              color: '#2196f3',
              '&:hover': {
                borderColor: '#2196f3',
                background: 'rgba(33, 150, 243, 0.1)'
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Refresh All'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<TimelineIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2196f3, #4dabf5)',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#2196f3',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab label="Overview" icon={<SpeedIcon />} iconPosition="start" />
          <Tab label="Correlation Engine" icon={<CorrelationIcon />} iconPosition="start" />
          <Tab label="Encryption Manager" icon={<LockIcon />} iconPosition="start" />
          <Tab label="ATWC AI Engine" icon={<AIcon />} iconPosition="start" />
          <Tab label="Traffic Analyzer" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Data Collection" icon={<DataIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          {/* Service Status Grid */}
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Service Status
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {serviceCards.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.8), rgba(10, 25, 41, 0.8))',
                  border: `1px solid ${service.color}40`,
                  boxShadow: `0 4px 20px ${service.color}20`,
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${service.color}30`
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${service.color}30, ${service.color}10)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {React.cloneElement(service.icon, { sx: { color: service.color, fontSize: 24 } })}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {service.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={service.status ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          background: service.status ? 
                            'linear-gradient(135deg, #4caf50, #81c784)' :
                            'linear-gradient(135deg, #f44336, #e57373)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {service.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="small"
                          variant="outlined"
                          onClick={action.action}
                          sx={{
                            borderColor: `${service.color}60`,
                            color: service.color,
                            '&:hover': {
                              borderColor: service.color,
                              background: `${service.color}10`
                            }
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* System Metrics */}
          <Typography variant="h6" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            System Metrics
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Traffic', value: stats.totalTraffic, icon: <TrafficIcon />, color: '#2196f3' },
              { label: 'Active Nodes', value: stats.activeNodes.toLocaleString(), icon: <NodesIcon />, color: '#4caf50' },
              { label: 'Threats Detected', value: stats.threatsDetected, icon: <SecurityIcon />, color: '#f44336' },
              { label: 'Network Bandwidth', value: stats.bandwidth, icon: <NetworkIcon />, color: '#ff9800' },
              { label: 'Correlation Accuracy', value: stats.correlationAccuracy, icon: <CorrelationIcon />, color: '#9c27b0' },
              { label: 'ATWC Predictions', value: stats.atwcPredictions, icon: <AIcon />, color: '#00bcd4' },
              { label: 'Data Collection Rate', value: stats.dataCollectionRate, icon: <DataIcon />, color: '#607d8b' },
              { label: 'Encrypted Connections', value: stats.encryptedConnections, icon: <LockIcon />, color: '#8bc34a' },
            ].map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.8), rgba(10, 25, 41, 0.8))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${metric.color}30, ${metric.color}10)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      {React.cloneElement(metric.icon, { sx: { color: metric.color, fontSize: 28 } })}
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      background: `linear-gradient(45deg, ${metric.color}, ${metric.color}80)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Alerts & Node Status */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.8), rgba(10, 25, 41, 0.8))',
                border: '1px solid rgba(33, 150, 243, 0.2)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 3 }}>
                  Recent Alerts
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {recentAlerts.map((alert) => (
                        <TableRow key={alert.id} hover sx={{ 
                          '&:hover': { 
                            background: 'rgba(33, 150, 243, 0.05)'
                          }
                        }}>
                          <TableCell sx={{ width: 50 }}>
                            <Box sx={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: '50%',
                              background: alert.severity === 'critical' ? 
                                'linear-gradient(135deg, #f44336, #e57373)' :
                                alert.severity === 'high' ? 
                                'linear-gradient(135deg, #ff5722, #ff8a65)' :
                                'linear-gradient(135deg, #ff9800, #ffb74d)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {alert.severity === 'critical' ? 
                                <ErrorIcon sx={{ color: 'white', fontSize: 16 }} /> : 
                                <WarningIcon sx={{ color: 'white', fontSize: 16 }} />
                              }
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {alert.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.node}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={alert.severity.toUpperCase()}
                              size="small"
                              sx={{
                                background: alert.severity === 'critical' ? 
                                  'linear-gradient(135deg, #f44336, #e57373)' :
                                  alert.severity === 'high' ? 
                                  'linear-gradient(135deg, #ff5722, #ff8a65)' :
                                  'linear-gradient(135deg, #ff9800, #ffb74d)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {alert.timestamp}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(19, 47, 76, 0.8), rgba(10, 25, 41, 0.8))',
                border: '1px solid rgba(33, 150, 243, 0.2)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 3 }}>
                  Node Status
                </Typography>
                {nodeStatus.map((node) => (
                  <Box key={node.type} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${node.color}40, ${node.color}20)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {React.cloneElement(node.icon, { sx: { color: node.color, fontSize: 18 } })}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{node.type}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {node.count.toLocaleString()} nodes
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: node.color }}>
                        {node.status}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseInt(node.status)}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        background: `${node.color}20`,
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${node.color}, ${node.color}80)`
                        }
                      }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Correlation Engine Tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Correlation Engine
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Correlation Patterns</Typography>
                  {correlationData.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Pattern</TableCell>
                            <TableCell>Confidence</TableCell>
                            <TableCell>Events</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Last Detected</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {correlationData.slice(0, 5).map((pattern, index) => (
                            <TableRow key={index}>
                              <TableCell>{pattern.ruleName}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={`${Math.round(pattern.confidence * 100)}%`}
                                  color={pattern.confidence > 0.8 ? 'success' : pattern.confidence > 0.6 ? 'warning' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{pattern.eventCount}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={pattern.severity}
                                  color={pattern.severity === 'critical' ? 'error' : pattern.severity === 'high' ? 'warning' : 'info'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{new Date(pattern.lastSeen).toLocaleTimeString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No correlation patterns detected</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Correlation Settings</Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Confidence Threshold</InputLabel>
                    <Select value={0.7} label="Confidence Threshold">
                      <MenuItem value={0.5}>50% (Low)</MenuItem>
                      <MenuItem value={0.7}>70% (Medium)</MenuItem>
                      <MenuItem value={0.9}>90% (High)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Time Window</InputLabel>
                    <Select value={60000} label="Time Window">
                      <MenuItem value={30000}>30 seconds</MenuItem>
                      <MenuItem value={60000}>1 minute</MenuItem>
                      <MenuItem value={300000}>5 minutes</MenuItem>
                      <MenuItem value={600000}>10 minutes</MenuItem>
                    </Select>
                  </FormControl>
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartService('correlation')}
                  >
                    Run Correlation Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Encryption Manager Tab */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Encryption Manager
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Encryption Status</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><LockIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Active Encryption" 
                        secondary={encryptionStatus.active ? 'Enabled' : 'Disabled'} 
                      />
                      <ListItemSecondaryAction>
                        <Switch checked={encryptionStatus.active || false} />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><VpnKeyIcon color="secondary" /></ListItemIcon>
                      <ListItemText 
                        primary="Key Rotation" 
                        secondary={`Last rotated: ${encryptionStatus.lastRotation || 'Never'}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Encryption Strength" 
                        secondary={encryptionStatus.strength || 'AES-256'} 
                      />
                    </ListItem>
                  </List>
                  <Button 
                    variant="contained" 
                    startIcon={<VpnKeyIcon />}
                    onClick={() => encryptionApi.rotateKeys()}
                    sx={{ mt: 2 }}
                  >
                    Rotate Encryption Keys
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* ATWC Engine Tab */}
      {activeTab === 3 && (
        <Paper sx={{ p: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            ATWC AI Engine
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>AI Predictions</Typography>
                  {atwcPredictions.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Prediction</TableCell>
                            <TableCell>Confidence</TableCell>
                            <TableCell>Input Features</TableCell>
                            <TableCell>Timestamp</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {atwcPredictions.slice(0, 5).map((pred, index) => (
                            <TableRow key={index}>
                              <TableCell>{pred.type}</TableCell>
                              <TableCell>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={pred.confidence * 100}
                                  sx={{ width: 100 }}
                                />
                              </TableCell>
                              <TableCell>{pred.features?.length || 0}</TableCell>
                              <TableCell>{new Date(pred.timestamp).toLocaleTimeString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No predictions available</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>AI Controls</Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartService('atwc')}
                    sx={{ mb: 2 }}
                  >
                    Train Model
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => atwcApi.getPredictions({})}
                  >
                    Get Predictions
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Traffic Analyzer Tab */}
      {activeTab === 4 && (
        <Paper sx={{ p: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Traffic Analyzer
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Traffic Analysis</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{trafficAnalysis.totalPackets || 0}</Typography>
                        <Typography variant="body2">Total Packets</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{trafficAnalysis.anomalies || 0}</Typography>
                        <Typography variant="body2">Anomalies Detected</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{trafficAnalysis.attackAttempts || 0}</Typography>
                        <Typography variant="body2">Attack Attempts</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Button 
                    variant="contained" 
                    startIcon={<AnalyticsIcon />}
                    onClick={() => trafficApi.analyzeTraffic({})}
                    sx={{ mt: 3 }}
                  >
                    Run Traffic Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Data Collection Tab */}
      {activeTab === 5 && (
        <Paper sx={{ p: 3, background: 'rgba(19, 47, 76, 0.8)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#ffffff', fontWeight: 'bold' }}>
            Data Collection Engine
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Collection Status</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><DataIcon color={collectionStatus.active ? 'success' : 'error'} /></ListItemIcon>
                      <ListItemText 
                        primary="Collection Active" 
                        secondary={collectionStatus.active ? 'Running' : 'Stopped'} 
                      />
                      <ListItemSecondaryAction>
                        {collectionStatus.active ? (
                          <Button 
                            variant="outlined" 
                            color="error"
                            startIcon={<StopIcon />}
                            onClick={() => handleStopService('dataCollection')}
                          >
                            Stop
                          </Button>
                        ) : (
                          <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<PlayIcon />}
                            onClick={() => handleStartService('dataCollection')}
                          >
                            Start
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><StorageIcon color="info" /></ListItemIcon>
                      <ListItemText 
                        primary="Data Collected" 
                        secondary={`${collectionStatus.totalData || 0} records`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SpeedIcon color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary="Collection Rate" 
                        secondary={`${collectionStatus.rate || 0} records/sec`} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
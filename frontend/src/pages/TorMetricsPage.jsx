import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Slider,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Rating
} from '@mui/material';
import {
  AutoAwesome as AIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon, // First import
  Download as DownloadIcon,
  Upload as UploadIcon,
  Psychology as PsychologyIcon,
  ModelTraining as TrainingIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon,
  Dataset as DatasetIcon,
  AccountTree as AccountTreeIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Share as ShareIcon,
  NetworkCheck as NetworkCheckIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  CorporateFare as CorporateFareIcon,
  Lan as LanIcon,
  CloudSync as CloudSyncIcon,
  DataUsage as DataUsageIcon,
  PrivacyTip as PrivacyTipIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
  SimCard as SimCardIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  SettingsEthernet as SettingsEthernetIcon,
  Bolt as BoltIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  SyncAlt as SyncAltIcon,
  Hub as HubIcon,
  Polyline as PolylineIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
  Traffic as TrafficIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { torMetricsApi, nodeCollectorApi } from '../api/tor';

// Add missing icon at the end (not in the import statement)
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const TorMetricsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState({
    totalNodes: 0,
    activeNodes: 0,
    bandwidth: '0 TB/s',
    uptime: 0,
    relaysByType: { guard: 0, middle: 0, exit: 0 },
    topCountries: [],
    performance: { avgLatency: 0, avgThroughput: 0, successRate: 0 },
    lastUpdated: new Date().toISOString()
  });
  
  const [trafficStats, setTrafficStats] = useState({
    timeframe: '1h',
    totalRequests: 0,
    bytesTransferred: '0 TB',
    topDestinations: [],
    trafficByProtocol: [],
    peakHours: [],
    anomalies: 0
  });
  
  const [activeNodes, setActiveNodes] = useState([]);
  const [nodeStats, setNodeStats] = useState({});
  const [loading, setLoading] = useState({
    metrics: true,
    traffic: true,
    nodes: true
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [timeframe, setTimeframe] = useState('1h');

  useEffect(() => {
    loadAllMetrics();
  }, [timeframe]);

  const loadAllMetrics = async () => {
    setLoading({ metrics: true, traffic: true, nodes: true });
    
    try {
      // Load network metrics
      const metricsResponse = await torMetricsApi.getMetrics();
      setMetrics(metricsResponse.data);
      setLoading(prev => ({ ...prev, metrics: false }));

      // Load traffic stats
      const trafficResponse = await torMetricsApi.getTrafficStats(timeframe);
      setTrafficStats(trafficResponse.data);
      setLoading(prev => ({ ...prev, traffic: false }));

      // Load active nodes
      const nodesResponse = await nodeCollectorApi.getActiveNodes();
      setActiveNodes(nodesResponse.data);
      
      // Load node stats
      const statsResponse = await nodeCollectorApi.getNodeStats();
      setNodeStats(statsResponse.data);
      setLoading(prev => ({ ...prev, nodes: false }));

    } catch (error) {
      console.error('Error loading metrics:', error);
      setLoading({ metrics: false, traffic: false, nodes: false });
    }
  };

  const handleNodeClick = async (nodeId) => {
    try {
      const response = await torMetricsApi.getNodeInfo(nodeId);
      setSelectedNode(response.data);
    } catch (error) {
      console.error('Error loading node info:', error);
    }
  };

  const handleRefresh = () => {
    loadAllMetrics();
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const getNodeStatusColor = (status) => {
    switch(status) {
      case 'stable': return 'success';
      case 'unstable': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getNodeTypeColor = (type) => {
    switch(type) {
      case 'guard': return 'primary';
      case 'exit': return 'error';
      case 'middle': return 'secondary';
      default: return 'default';
    }
  };

  const getCountryFlag = (countryCode) => {
    const flagEmojis = {
      'US': '🇺🇸', 'DE': '🇩🇪', 'FR': '🇫🇷', 'NL': '🇳🇱', 'RU': '🇷🇺',
      'CA': '🇨🇦', 'GB': '🇬🇧', 'JP': '🇯🇵', 'AU': '🇦🇺', 'IN': '🇮🇳'
    };
    return flagEmojis[countryCode] || '🌐';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.9))',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(30, 60, 114, 0.3)'
      }}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #4dabf5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <PublicIcon fontSize="large" />
            TOR Network Metrics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.8)">
            Real-time monitoring, analysis, and insights of the TOR network
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Chip 
              icon={<HubIcon />}
              label={`${metrics.totalNodes.toLocaleString()} Total Nodes`}
              color="info"
              variant="outlined"
            />
            <Chip 
              icon={<CheckCircleIcon />}
              label={`${metrics.activeNodes.toLocaleString()} Active`}
              color="success"
              variant="outlined"
            />
            <Chip 
              icon={<SpeedIcon />}
              label={`${metrics.bandwidth} Bandwidth`}
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => handleTimeframeChange(e.target.value)}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={loading.metrics ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading.metrics}
            sx={{
              background: 'linear-gradient(135deg, #2196f3, #1976d2)',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)'
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3, background: 'rgba(30, 60, 114, 0.8)' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              '&.Mui-selected': {
                color: '#4dabf5',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab label="Network Overview" icon={<HubIcon />} />
          <Tab label="Traffic Analysis" icon={<TrafficIcon />} />
          <Tab label="Active Nodes" icon={<AccountTreeIcon />} />
          <Tab label="Performance Metrics" icon={<ShowChartIcon />} />
          <Tab label="Geographic Distribution" icon={<MapIcon />} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Network Health Cards */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#2196f3' }}>
                  <NetworkCheckIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Network Health
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={metrics.uptime}
                    size={100}
                    thickness={4}
                    sx={{ color: metrics.uptime > 95 ? '#4caf50' : metrics.uptime > 90 ? '#ff9800' : '#f44336' }}
                  />
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {metrics.uptime}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Overall Uptime
                  </Typography>
                </Box>
                <Alert 
                  severity={metrics.uptime > 95 ? "success" : metrics.uptime > 90 ? "warning" : "error"}
                  sx={{ mt: 2 }}
                >
                  {metrics.uptime > 95 ? "Network is healthy and stable" :
                   metrics.uptime > 90 ? "Minor issues detected" :
                   "Network experiencing problems"}
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
                  <HubIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Node Distribution
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <ShieldIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Guard Nodes" 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {metrics.relaysByType.guard.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({((metrics.relaysByType.guard / metrics.totalNodes) * 100).toFixed(1)}%)
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SettingsEthernetIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Middle Nodes" 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {metrics.relaysByType.middle.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({((metrics.relaysByType.middle / metrics.totalNodes) * 100).toFixed(1)}%)
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ExitToAppIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Exit Nodes" 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {metrics.relaysByType.exit.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({((metrics.relaysByType.exit / metrics.totalNodes) * 100).toFixed(1)}%)
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff9800' }}>
                  <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Avg Latency: {metrics.performance.avgLatency}ms
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, metrics.performance.avgLatency / 10)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Avg Throughput: {metrics.performance.avgThroughput} MB/s
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, metrics.performance.avgThroughput)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Success Rate: {metrics.performance.successRate}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.successRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#9c27b0' }}>
                  <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Top Countries
                </Typography>
                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {metrics.topCountries.slice(0, 5).map((country, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <Typography variant="h6">{getCountryFlag(country.country)}</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary={country.country}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {country.nodes.toLocaleString()} nodes
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={country.percentage}
                              sx={{ flexGrow: 1, height: 4 }}
                            />
                            <Typography variant="caption">
                              {country.percentage}%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Stats */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Detailed Network Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {metrics.totalNodes.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Relay Nodes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {metrics.activeNodes.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Nodes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {metrics.bandwidth}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Network Bandwidth
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff5722' }}>
                  <TrafficIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Traffic Statistics ({trafficStats.timeframe})
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {(trafficStats.totalRequests / 1000000).toFixed(1)}M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Requests
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {trafficStats.bytesTransferred}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data Transferred
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {trafficStats.anomalies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Anomalies Detected
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Top Destinations
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Domain</TableCell>
                        <TableCell align="right">Requests</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell align="right">Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trafficStats.topDestinations.map((dest, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">{dest.domain}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {(dest.requests / 1000).toFixed(1)}K
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={dest.percentage}
                                sx={{ width: 60, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="body2">
                                {dest.percentage}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <TrendingUpIcon 
                              fontSize="small" 
                              color={dest.percentage > 20 ? "success" : "action"} 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#9c27b0' }}>
                  <PieChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Traffic by Protocol
                </Typography>
                <List dense>
                  {trafficStats.trafficByProtocol.map((protocol, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={protocol.protocol}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={protocol.percentage}
                              sx={{ flexGrow: 1, height: 6 }}
                            />
                            <Typography variant="caption">
                              {protocol.percentage}%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    <AccountTreeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Active Nodes ({activeNodes.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => nodeCollectorApi.refreshNodes().then(loadAllMetrics)}
                  >
                    Refresh Nodes
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Node ID</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Bandwidth</TableCell>
                        <TableCell>Uptime</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Seen</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeNodes.slice(0, 20).map((node, index) => (
                        <TableRow 
                          key={index} 
                          hover
                          onClick={() => handleNodeClick(node.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {node.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{node.ip}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">{getCountryFlag(node.country)}</Typography>
                              <Typography variant="body2">{node.country}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={node.type.toUpperCase()}
                              size="small"
                              color={getNodeTypeColor(node.type)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{node.bandwidth}</Typography>
                          </TableCell>
                          <TableCell>
                            <LinearProgress 
                              variant="determinate" 
                              value={parseInt(node.uptime)}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={node.status.toUpperCase()}
                              size="small"
                              color={getNodeStatusColor(node.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(node.lastSeen).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <AnalyticsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
      )}

      {/* Performance Metrics Tab (Tab 3) */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
                  <ShowChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance Trends
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Network performance over time:
                  </Typography>
                  {/* Add performance chart here */}
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 1, mt: 3 }}>
                    {Array.from({ length: 24 }, (_, i) => (
                      <Box 
                        key={i}
                        sx={{ 
                          flex: 1,
                          height: `${Math.random() * 100}%`,
                          bgcolor: i % 6 === 0 ? '#4caf50' : '#2196f3',
                          borderRadius: '4px 4px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff9800' }}>
                  <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Response Times
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Average Response Time" 
                      secondary="145ms"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="95th Percentile" 
                      secondary="289ms"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Success Rate" 
                      secondary="98.5%"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Error Rate" 
                      secondary="0.8%"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Geographic Distribution Tab (Tab 4) */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#9c27b0' }}>
                  <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Geographic Distribution
                </Typography>
                <Grid container spacing={2}>
                  {metrics.topCountries.map((country, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h4">{getCountryFlag(country.country)}</Typography>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {country.country}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {country.nodes.toLocaleString()} nodes
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={country.percentage}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {country.percentage}% of total network
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Node Details Dialog */}
      <Dialog 
        open={!!selectedNode} 
        onClose={() => setSelectedNode(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedNode && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountTreeIcon color="primary" />
                Node Details: {selectedNode.nickname}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Fingerprint" 
                        secondary={
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {selectedNode.fingerprint}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="IP Address" 
                        secondary={selectedNode.ip + ':' + selectedNode.port}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Country" 
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{getCountryFlag(selectedNode.country)}</Typography>
                            <Typography>{selectedNode.country} (AS{selectedNode.asNumber})</Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Node Properties
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedNode.flags.map((flag, index) => (
                      <Chip key={index} label={flag} size="small" color="primary" variant="outlined" />
                    ))}
                    {selectedNode.isExit && <Chip label="EXIT" size="small" color="error" />}
                    {selectedNode.isGuard && <Chip label="GUARD" size="small" color="primary" />}
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Platform" 
                        secondary={selectedNode.platform}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="First Seen" 
                        secondary={new Date(selectedNode.firstSeen).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Contact" 
                        secondary={selectedNode.contact}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedNode(null)}>Close</Button>
              <Button variant="contained" onClick={() => {
                // Add node monitoring logic here
                console.log('Monitoring node:', selectedNode.id);
              }}>
                Start Monitoring
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="TOR Metrics Actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<RefreshIcon />}
          tooltipTitle="Refresh All"
          onClick={handleRefresh}
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export Data"
          onClick={() => alert('Export functionality')}
        />
        <SpeedDialAction
          icon={<AssessmentIcon />}
          tooltipTitle="Generate Report"
          onClick={() => alert('Report generation')}
        />
      </SpeedDial>
    </Box>
  );
};

export default TorMetricsPage;
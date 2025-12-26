import React, { useState, useEffect, useRef } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import {
  AutoAwesome as AIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
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
  ExpandMore as ExpandMoreIcon,
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
  Business as BusinessIcon
} from '@mui/icons-material';

// Import the API files
import { federatedApi } from '../api/federated';
import { atwcApi } from '../api/atwc-engine';

// Import components
import FederatedTrainingChart from '../components/FederatedTrainingChart';
import PrivacyHeatmap from '../components/PrivacyHeatmap';
import ISPParticipationNetwork from '../components/ISPParticipationNetwork';

const FederatedLearningDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState({
    // Federation Status
    federationActive: true,
    currentRound: 8,
    totalRounds: 10,
    roundProgress: 75,
    
    // Global Model Performance
    globalAccuracy: 0.87,
    globalRecall: 0.94,
    globalPrecision: 0.82,
    globalF1: 0.88,
    
    // Privacy Metrics
    privacyScore: 0.98,
    epsilon: 1.2,
    delta: 1e-5,
    securityScore: 0.95,
    
    // Federation Statistics
    totalParticipants: 12,
    activeParticipants: 8,
    totalDataPoints: 1248000,
    avgDataPerISP: 104000,
    
    // Training Parameters
    learningRate: 0.001,
    batchSize: 32,
    epochsPerRound: 5,
    aggregationMethod: 'fedavg',
    
    // Real-time Metrics
    uploadSpeed: 45, // MB/s
    downloadSpeed: 120, // MB/s
    latency: 28, // ms
    bandwidthUsage: 342, // Mbps
  });

  const [isps, setISPs] = useState([
    {
      id: 'isp-chennai',
      name: 'BSNL Chennai',
      status: 'connected',
      dataPoints: 12500,
      contribution: 12.5,
      lastSeen: new Date(Date.now() - 120000).toISOString(),
      location: { lat: 13.0827, lng: 80.2707 },
      privacyCompliance: 0.98,
      trainingProgress: 85,
      modelAccuracy: 0.83,
      bandwidth: '1 Gbps',
      isActive: true,
      ispType: 'government',
      dataQuality: 0.92,
      participationScore: 95
    },
    {
      id: 'isp-mumbai',
      name: 'Jio Mumbai',
      status: 'training',
      dataPoints: 8900,
      contribution: 8.9,
      lastSeen: new Date(Date.now() - 60000).toISOString(),
      location: { lat: 19.0760, lng: 72.8777 },
      privacyCompliance: 0.96,
      trainingProgress: 65,
      modelAccuracy: 0.81,
      bandwidth: '10 Gbps',
      isActive: true,
      ispType: 'private',
      dataQuality: 0.95,
      participationScore: 88
    },
    {
      id: 'isp-delhi',
      name: 'Airtel Delhi',
      status: 'connected',
      dataPoints: 15600,
      contribution: 15.6,
      lastSeen: new Date(Date.now() - 180000).toISOString(),
      location: { lat: 28.7041, lng: 77.1025 },
      privacyCompliance: 0.97,
      trainingProgress: 92,
      modelAccuracy: 0.85,
      bandwidth: '5 Gbps',
      isActive: true,
      ispType: 'private',
      dataQuality: 0.89,
      participationScore: 92
    },
    {
      id: 'isp-bangalore',
      name: 'ACT Fibernet Bangalore',
      status: 'idle',
      dataPoints: 7400,
      contribution: 7.4,
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      location: { lat: 12.9716, lng: 77.5946 },
      privacyCompliance: 0.94,
      trainingProgress: 0,
      modelAccuracy: 0.79,
      bandwidth: '2 Gbps',
      isActive: false,
      ispType: 'private',
      dataQuality: 0.91,
      participationScore: 76
    },
    {
      id: 'isp-hyderabad',
      name: 'Hathway Hyderabad',
      status: 'connected',
      dataPoints: 11200,
      contribution: 11.2,
      lastSeen: new Date(Date.now() - 90000).toISOString(),
      location: { lat: 17.3850, lng: 78.4867 },
      privacyCompliance: 0.95,
      trainingProgress: 78,
      modelAccuracy: 0.82,
      bandwidth: '1 Gbps',
      isActive: true,
      ispType: 'private',
      dataQuality: 0.88,
      participationScore: 85
    },
    {
      id: 'isp-kolkata',
      name: 'BSNL Kolkata',
      status: 'training',
      dataPoints: 6800,
      contribution: 6.8,
      lastSeen: new Date(Date.now() - 150000).toISOString(),
      location: { lat: 22.5726, lng: 88.3639 },
      privacyCompliance: 0.99,
      trainingProgress: 45,
      modelAccuracy: 0.80,
      bandwidth: '500 Mbps',
      isActive: true,
      ispType: 'government',
      dataQuality: 0.93,
      participationScore: 82
    }
  ]);

  const [trainingHistory, setTrainingHistory] = useState([
    { round: 1, accuracy: 0.65, loss: 0.42, participants: 4, duration: '12m' },
    { round: 2, accuracy: 0.71, loss: 0.38, participants: 6, duration: '15m' },
    { round: 3, accuracy: 0.75, loss: 0.35, participants: 7, duration: '18m' },
    { round: 4, accuracy: 0.78, loss: 0.32, participants: 8, duration: '20m' },
    { round: 5, accuracy: 0.81, loss: 0.29, participants: 9, duration: '22m' },
    { round: 6, accuracy: 0.83, loss: 0.26, participants: 10, duration: '25m' },
    { round: 7, accuracy: 0.85, loss: 0.23, participants: 11, duration: '28m' },
    { round: 8, accuracy: 0.87, loss: 0.21, participants: 12, duration: '30m' },
  ]);

  const [privacyMetrics, setPrivacyMetrics] = useState({
    differentialPrivacy: {
      enabled: true,
      epsilon: 1.2,
      delta: 1e-5,
      noiseScale: 0.1,
      privacyBudgetUsed: 0.45
    },
    secureAggregation: {
      enabled: true,
      method: 'paillier',
      keySize: 2048,
      encryptionStrength: 'high'
    },
    dataMinimization: {
      featureReduction: 0.85,
      piiRemoval: 1.0,
      kAnonymity: 3,
      lDiversity: 2.5
    },
    auditLogging: {
      enabled: true,
      immutable: true,
      blockchainBacked: true,
      retentionDays: 365
    }
  });

  const [atwcCorrelations, setAtwcCorrelations] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedISP, setSelectedISP] = useState(null);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [federationSettings, setFederationSettings] = useState({
    autoStart: true,
    minParticipants: 3,
    maxRounds: 50,
    aggregationFrequency: 'hourly',
    modelSharing: 'encrypted',
    validationRequired: true
  });

  const wsRef = useRef(null);

  useEffect(() => {
    // Load initial data
    loadFederationStatus();
    loadATWCCorrelations();
    
    // Start periodic updates
    const interval = setInterval(() => {
      updateISPStatus();
    }, 10000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const updateISPStatus = () => {
    setISPs(prev => prev.map(isp => {
      // Simulate status changes
      if (isp.isActive && Math.random() > 0.9) {
        return {
          ...isp,
          status: isp.status === 'training' ? 'connected' : 'training',
          lastSeen: new Date().toISOString()
        };
      }
      return isp;
    }));
  };

  const loadFederationStatus = async () => {
    try {
      const response = await federatedApi.getStatus();
      setTrainingStatus(prev => ({ ...prev, ...response.data }));
      
      // Load training history
      const historyResponse = await federatedApi.getTrainingHistory();
      setTrainingHistory(historyResponse.data);
    } catch (error) {
      console.error('Error loading federation status:', error);
    }
  };

  const loadATWCCorrelations = async () => {
    try {
      const response = await atwcApi.getRecentCorrelations({ limit: 20 });
      setAtwcCorrelations(response.data);
    } catch (error) {
      console.error('Error loading ATWC correlations:', error);
    }
  };

  const startFederatedTraining = async () => {
    setIsTraining(true);
    try {
      await federatedApi.startTraining({
        participants: isps.filter(isp => isp.isActive).map(isp => isp.id),
        parameters: {
          learningRate: trainingStatus.learningRate,
          batchSize: trainingStatus.batchSize,
          epochs: trainingStatus.epochsPerRound,
          aggregation: trainingStatus.aggregationMethod
        }
      });
      
      // Update status
      setTrainingStatus(prev => ({
        ...prev,
        federationActive: true,
        currentRound: prev.currentRound + 1,
        roundProgress: 0
      }));
      
      // Simulate training progress
      simulateTrainingProgress();
      
    } catch (error) {
      console.error('Error starting training:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const simulateTrainingProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTrainingStatus(prev => ({
        ...prev,
        roundProgress: progress
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        // Add new training round to history
        const newRound = {
          round: trainingHistory.length + 1,
          accuracy: trainingStatus.globalAccuracy + 0.02,
          loss: 0.21 - 0.02,
          participants: trainingStatus.activeParticipants,
          duration: '32m'
        };
        setTrainingHistory(prev => [...prev, newRound]);
        setTrainingStatus(prev => ({
          ...prev,
          globalAccuracy: newRound.accuracy
        }));
      }
    }, 500);
  };

  const getISPStatusColor = (status) => {
    switch(status) {
      case 'connected': return 'success';
      case 'training': return 'warning';
      case 'idle': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getISPTypeColor = (type) => {
    switch(type) {
      case 'government': return 'primary';
      case 'private': return 'secondary';
      case 'enterprise': return 'success';
      default: return 'default';
    }
  };

  const calculateISPParticipationScore = (isp) => {
    // Weighted score based on multiple factors
    const weights = {
      dataPoints: 0.3,
      privacyCompliance: 0.25,
      dataQuality: 0.2,
      uptime: 0.15,
      bandwidth: 0.1
    };
    
    let score = 0;
    score += (isp.dataPoints / 20000) * weights.dataPoints; // Normalized to 20k max
    score += isp.privacyCompliance * weights.privacyCompliance;
    score += isp.dataQuality * weights.dataQuality;
    score += (isp.isActive ? 1 : 0.3) * weights.uptime;
    score += (isp.bandwidth.includes('Gbps') ? 1 : 0.5) * weights.bandwidth;
    
    return Math.min(100, score * 100);
  };

  const handleISPClick = (isp) => {
    setSelectedISP(isp);
  };

  const simulateLocalTraining = async (ispId) => {
    const isp = isps.find(i => i.id === ispId);
    if (!isp) return;
    
    // Update ISP status to training
    updateISPData({
      ...isp,
      status: 'training',
      trainingProgress: 0
    });
    
    // Simulate local training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        clearInterval(interval);
        
        // Update ISP status when done
        updateISPData({
          ...isp,
          status: 'connected',
          trainingProgress: 100,
          modelAccuracy: Math.min(0.95, isp.modelAccuracy + 0.02) // Small improvement
        });
      } else {
        updateISPData({
          ...isp,
          trainingProgress: Math.min(100, progress)
        });
      }
    }, 500);
  };

  const updateISPData = (ispData) => {
    setISPs(prev => prev.map(isp => 
      isp.id === ispData.id ? { ...isp, ...ispData } : isp
    ));
    
    // Update selected ISP if it's the one being updated
    if (selectedISP && selectedISP.id === ispData.id) {
      setSelectedISP(ispData);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Enhanced Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.9), rgba(60, 30, 90, 0.9))',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)'
      }}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <HubIcon fontSize="large" />
            TOR Sentinel Federated Learning
          </Typography>
          <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.8)">
            Privacy-Preserving Collaborative ML • Multi-ISP Federation • ATWC Enhanced Correlation
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Chip 
              icon={<PeopleIcon />}
              label={`${trainingStatus.activeParticipants}/${trainingStatus.totalParticipants} ISPs Active`}
              color="success"
              variant="outlined"
            />
            <Chip 
              icon={<ShieldIcon />}
              label={`Privacy Score: ${(trainingStatus.privacyScore * 100).toFixed(0)}%`}
              color="info"
              variant="outlined"
            />
            <Chip 
              icon={<TrendingUpIcon />}
              label={`Global Accuracy: ${(trainingStatus.globalAccuracy * 100).toFixed(1)}%`}
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={isTraining ? <CircularProgress size={20} /> : <PlayIcon />}
            onClick={startFederatedTraining}
            disabled={isTraining}
            sx={{
              background: 'linear-gradient(135deg, #9c27b0, #673ab7)',
              boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
              minWidth: 200
            }}
          >
            {isTraining ? 'Training...' : '🚀 Start Federated Training'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadFederationStatus}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3, background: 'rgba(30, 30, 70, 0.8)' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              '&.Mui-selected': {
                color: '#9c27b0',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab label="Federation Overview" icon={<HubIcon />} />
          <Tab label="ISP Participants" icon={<CorporateFareIcon />} />
          <Tab label="Training Analytics" icon={<AssessmentIcon />} />
          <Tab label="Privacy & Security" icon={<PrivacyTipIcon />} />
          <Tab label="ATWC Correlations" icon={<PolylineIcon />} />
          <Tab label="Settings" icon={<SettingsEthernetIcon />} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Left Column - Federation Status & Controls */}
          <Grid item xs={12} md={4}>
            {/* Federation Status Card */}
            <Card sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(103, 58, 183, 0.05))',
              border: '1px solid rgba(156, 39, 176, 0.3)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#9c27b0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SyncAltIcon />
                  Federation Status
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                        {trainingStatus.currentRound}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Current Round
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {trainingStatus.activeParticipants}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Active ISPs
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Round Progress</span>
                    <span>{trainingStatus.roundProgress}%</span>
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={trainingStatus.roundProgress}
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #9c27b0, #673ab7)'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Data Aggregated</span>
                    <span>{(trainingStatus.totalDataPoints / 1000).toFixed(1)}K samples</span>
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(trainingStatus.totalDataPoints / 2000000) * 100}
                    sx={{ 
                      height: 8,
                      borderRadius: 4
                    }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={isTraining ? <CircularProgress size={20} /> : <PlayIcon />}
                  onClick={startFederatedTraining}
                  disabled={isTraining}
                  sx={{ mb: 2 }}
                >
                  {isTraining ? 'Training In Progress...' : 'Start Next Training Round'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DownloadIcon />}
                >
                  Export Global Model
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Metrics Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#2196f3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ShieldIcon />
                  Privacy & Security
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Privacy Score: <strong>{(trainingStatus.privacyScore * 100).toFixed(0)}%</strong>
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={trainingStatus.privacyScore * 100}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #2196f3, #4dabf5)'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Differential Privacy (ε = {trainingStatus.epsilon})
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={70}
                    sx={{ 
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #4caf50, #81c784)'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Secure Aggregation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={100}
                      sx={{ 
                        flexGrow: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #ff9800, #ffb74d)'
                        }
                      }}
                    />
                    <CheckCircleIcon color="success" fontSize="small" />
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<PrivacyTipIcon />}
                  onClick={() => setShowPrivacyDetails(true)}
                >
                  View Privacy Details
                </Button>
              </CardContent>
            </Card>

            {/* Network Performance */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff9800' }}>
                  <NetworkCheckIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Network Performance
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <BoltIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Upload Speed" 
                      secondary={`${trainingStatus.uploadSpeed} MB/s`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <BoltIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Download Speed" 
                      secondary={`${trainingStatus.downloadSpeed} MB/s`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <TimerIcon color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Network Latency" 
                      secondary={`${trainingStatus.latency} ms`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <DataUsageIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Bandwidth Usage" 
                      secondary={`${trainingStatus.bandwidthUsage} Mbps`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Middle Column - Global Model Performance */}
          <Grid item xs={12} md={4}>
            {/* Global Model Performance */}
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AssessmentIcon />
                  Global Model Performance
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      height: '100%'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {(trainingStatus.globalAccuracy * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accuracy
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={trainingStatus.globalAccuracy * 100}
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      height: '100%'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {(trainingStatus.globalRecall * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recall
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={trainingStatus.globalRecall * 100}
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      height: '100%'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {(trainingStatus.globalPrecision * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precision
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={trainingStatus.globalPrecision * 100}
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                      height: '100%'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                        {(trainingStatus.globalF1 * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        F1 Score
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={trainingStatus.globalF1 * 100}
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Training History Chart */}
                <Box sx={{ height: 200 }}>
                  <FederatedTrainingChart 
                    data={trainingHistory}
                    height={200}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* ATWC Correlation Feed */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff5722' }}>
                  <PolylineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent ATWC Correlations
                </Typography>
                
                <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {atwcCorrelations.slice(0, 5).map((correlation, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: correlation.confidence > 0.8 ? 'rgba(76, 175, 80, 0.1)' :
                                 correlation.confidence > 0.6 ? 'rgba(255, 152, 0, 0.1)' :
                                 'rgba(244, 67, 54, 0.1)'
                      }}
                    >
                      <ListItemIcon>
                        <Badge 
                          badgeContent={Math.round(correlation.confidence * 100)}
                          color={
                            correlation.confidence > 0.8 ? 'success' :
                            correlation.confidence > 0.6 ? 'warning' : 'error'
                          }
                        >
                          <AccountTreeIcon />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" noWrap>
                            {correlation.circuitId?.slice(0, 12)}...
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" noWrap>
                            {correlation.involvedISPs?.length || 1} ISPs • {correlation.timestamp ? 
                              new Date(correlation.timestamp).toLocaleTimeString() : 'Just now'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="text"
                  fullWidth
                  size="small"
                  onClick={() => setActiveTab(4)}
                >
                  View All Correlations
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - ISP Participation Network */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#673ab7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CorporateFareIcon />
                  ISP Participation Network
                </Typography>
                
                <Box sx={{ height: 400, mb: 2 }}>
                  <ISPParticipationNetwork 
                    isps={isps}
                    onISPSelect={handleISPClick}
                    height={400}
                  />
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Legend:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label="Connected"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<TimelineIcon />}
                    label="Training"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<ErrorIcon />}
                    label="Idle"
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<ShieldIcon />}
                    label="Government"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<BusinessIcon />}
                    label="Private"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <CorporateFareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                ISP Participants Dashboard
              </Typography>
              
              <Grid container spacing={3}>
                {isps.map((isp) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={isp.id}>
                    <Card 
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        border: selectedISP?.id === isp.id ? '2px solid #9c27b0' : '1px solid rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => handleISPClick(isp)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getISPTypeColor(isp.ispType),
                              width: 40,
                              height: 40,
                              mr: 2
                            }}
                          >
                            {isp.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {isp.name.split(' ')[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {isp.name.split(' ').slice(1).join(' ')}
                            </Typography>
                          </Box>
                          <Chip 
                            label={isp.status}
                            size="small"
                            color={getISPStatusColor(isp.status)}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Data Points
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {isp.dataPoints.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Contribution
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {isp.contribution}%
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Local Model Accuracy
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={isp.modelAccuracy * 100}
                              sx={{ 
                                flexGrow: 1,
                                height: 6,
                                borderRadius: 3
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {(isp.modelAccuracy * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Training Progress
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={isp.trainingProgress}
                            sx={{ 
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(156, 39, 176, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #9c27b0, #673ab7)'
                              }
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {isp.isActive ? 'Online' : 'Offline'} • {isp.bandwidth}
                          </Typography>
                          <Rating 
                            value={isp.participationScore / 20}
                            readOnly
                            size="small"
                          />
                        </Box>
                        
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          startIcon={<TrainingIcon />}
                          sx={{ mt: 2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            simulateLocalTraining(isp.id);
                          }}
                          disabled={isp.status === 'training' || !isp.isActive}
                        >
                          {isp.status === 'training' ? 'Training...' : 'Start Local Training'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          
          {/* ISP Details Panel */}
          {selectedISP && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  <CorporateFareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedISP.name} - Detailed View
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          ISP Information
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="ISP Type" 
                              secondary={
                                <Chip 
                                  label={selectedISP.ispType}
                                  size="small"
                                  color={getISPTypeColor(selectedISP.ispType)}
                                />
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <StorageIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Data Points" 
                              secondary={selectedISP.dataPoints.toLocaleString()}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <WifiIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Network Bandwidth" 
                              secondary={selectedISP.bandwidth}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <TimerIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Last Active" 
                              secondary={new Date(selectedISP.lastSeen).toLocaleString()}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Performance Metrics
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" gutterBottom>
                            Local Model Accuracy
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedISP.modelAccuracy * 100}
                            sx={{ 
                              height: 10,
                              borderRadius: 5,
                              mb: 1
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {(selectedISP.modelAccuracy * 100).toFixed(1)}% (Global: {(trainingStatus.globalAccuracy * 100).toFixed(1)}%)
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" gutterBottom>
                            Data Quality Score
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedISP.dataQuality * 100}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(33, 150, 243, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #2196f3, #4dabf5)'
                              }
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            Participation Score
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={calculateISPParticipationScore(selectedISP)}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(156, 39, 176, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #9c27b0, #673ab7)'
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Privacy & Compliance
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Privacy Compliance
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={selectedISP.privacyCompliance * 100}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #4caf50, #81c784)'
                              }
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            DPDP Act Compliance
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <Typography variant="body2">Fully Compliant</Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Data Retention Policy
                          </Typography>
                          <Chip 
                            label="30 Days (Encrypted)"
                            size="small"
                            color="info"
                          />
                        </Box>
                        
                        <Button
                          variant="contained"
                          fullWidth
                          size="small"
                          startIcon={<CloudSyncIcon />}
                          onClick={() => simulateLocalTraining(selectedISP.id)}
                          disabled={selectedISP.status === 'training'}
                        >
                          {selectedISP.status === 'training' ? 'Training In Progress' : 'Sync Local Training'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Training Analytics & History
              </Typography>
              
              <Box sx={{ height: 300, mb: 4 }}>
                <FederatedTrainingChart 
                  data={trainingHistory}
                  height={300}
                  showAllMetrics={true}
                />
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Training Rounds History
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Round</TableCell>
                      <TableCell align="center">Accuracy</TableCell>
                      <TableCell align="center">Loss</TableCell>
                      <TableCell align="center">Participants</TableCell>
                      <TableCell align="center">Duration</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trainingHistory.map((round) => (
                      <TableRow key={round.round} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            R{round.round}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={round.accuracy * 100}
                              sx={{ 
                                width: 60,
                                height: 6,
                                borderRadius: 3
                              }}
                            />
                            <Typography variant="body2">
                              {(round.accuracy * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {round.loss.toFixed(3)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${round.participants} ISPs`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {round.duration}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label="Completed"
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Performance Insights
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Accuracy Improvement</span>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                    +{trainingHistory.length > 0 ? ((trainingHistory[trainingHistory.length - 1]?.accuracy - trainingHistory[0]?.accuracy) * 100).toFixed(1) : 0}%
                  </span>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={trainingHistory.length > 0 ? ((trainingHistory[trainingHistory.length - 1]?.accuracy - trainingHistory[0]?.accuracy) / trainingHistory[0]?.accuracy) * 100 || 0 : 0}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4caf50, #81c784)'
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Loss Reduction</span>
                  <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                    -{trainingHistory.length > 0 ? (trainingHistory[0]?.loss - trainingHistory[trainingHistory.length - 1]?.loss).toFixed(3) : 0}
                  </span>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={trainingHistory.length > 0 ? (100 - ((trainingHistory[trainingHistory.length - 1]?.loss / trainingHistory[0]?.loss) * 100 || 0)) : 0}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #f44336, #e57373)'
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Participant Growth</span>
                  <span style={{ color: '#2196f3', fontWeight: 'bold' }}>
                    +{trainingHistory.length > 0 ? (trainingHistory[trainingHistory.length - 1]?.participants - trainingHistory[0]?.participants || 0) : 0} ISPs
                  </span>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={trainingHistory.length > 0 ? ((trainingHistory[trainingHistory.length - 1]?.participants - trainingHistory[0]?.participants) / trainingHistory[0]?.participants) * 100 || 0 : 0}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2196f3, #4dabf5)'
                    }
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Training Efficiency
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TimerIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Avg. Round Duration" 
                    secondary="22 minutes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Processed/Round" 
                    secondary="~45K samples"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Training Speed" 
                    secondary="2.1 rounds/hour"
                  />
                </ListItem>
              </List>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <LanIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Federation Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                      {trainingStatus.totalParticipants}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total ISPs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {trainingStatus.activeParticipants}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Now
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {(trainingStatus.totalDataPoints / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Data
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {trainingStatus.avgDataPerISP.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg/ISP
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#2196f3' }}>
                <PrivacyTipIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Privacy & Security Dashboard
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon color="primary" />
                        Differential Privacy
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Privacy Budget (ε)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Slider
                            value={privacyMetrics.differentialPrivacy.epsilon}
                            onChange={(e, newValue) => setPrivacyMetrics(prev => ({
                              ...prev,
                              differentialPrivacy: { ...prev.differentialPrivacy, epsilon: newValue }
                            }))}
                            min={0.1}
                            max={10}
                            step={0.1}
                            sx={{ flexGrow: 1 }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 40 }}>
                            {privacyMetrics.differentialPrivacy.epsilon}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Lower ε = More Privacy, Higher ε = Better Accuracy
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Noise Scale: {privacyMetrics.differentialPrivacy.noiseScale}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={privacyMetrics.differentialPrivacy.noiseScale * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Privacy Budget Used: {privacyMetrics.differentialPrivacy.privacyBudgetUsed * 100}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={privacyMetrics.differentialPrivacy.privacyBudgetUsed * 100}
                          sx={{ 
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: privacyMetrics.differentialPrivacy.privacyBudgetUsed > 0.8 
                              ? 'rgba(244, 67, 54, 0.1)' 
                              : 'rgba(76, 175, 80, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: privacyMetrics.differentialPrivacy.privacyBudgetUsed > 0.8 
                                ? 'linear-gradient(90deg, #f44336, #e57373)'
                                : 'linear-gradient(90deg, #4caf50, #81c784)'
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon color="success" />
                        Secure Aggregation
                      </Typography>
                      
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Encryption Method" 
                            secondary={privacyMetrics.secureAggregation.method.toUpperCase()}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="info" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Key Size" 
                            secondary={`${privacyMetrics.secureAggregation.keySize} bits`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Encryption Strength" 
                            secondary={
                              <Chip 
                                label={privacyMetrics.secureAggregation.encryptionStrength}
                                size="small"
                                color="success"
                              />
                            }
                          />
                        </ListItem>
                      </List>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={privacyMetrics.secureAggregation.enabled}
                            onChange={(e) => setPrivacyMetrics(prev => ({
                              ...prev,
                              secureAggregation: { ...prev.secureAggregation, enabled: e.target.checked }
                            }))}
                            color="success"
                          />
                        }
                        label="Enable Secure Aggregation"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShieldIcon color="info" />
                        Data Minimization & Anonymization
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                              {privacyMetrics.dataMinimization.featureReduction * 100}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Feature Reduction
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                              {privacyMetrics.dataMinimization.piiRemoval * 100}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              PII Removal
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                              k={privacyMetrics.dataMinimization.kAnonymity}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              k-Anonymity
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                              l={privacyMetrics.dataMinimization.lDiversity}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              l-Diversity
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, height: 200 }}>
                        <PrivacyHeatmap 
                          metrics={privacyMetrics}
                          height={200}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#9c27b0' }}>
                <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Audit & Compliance
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="DPDP Act Compliance" 
                    secondary="Fully Compliant"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Audit Log Retention" 
                    secondary={`${privacyMetrics.auditLogging.retentionDays} days`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LockIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Immutable Logging" 
                    secondary={privacyMetrics.auditLogging.immutable ? "Enabled" : "Disabled"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountTreeIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Blockchain Backed" 
                    secondary={privacyMetrics.auditLogging.blockchainBacked ? "Yes" : "No"}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Recent Audit Events
              </Typography>
              
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {[
                  { id: 1, event: 'Model Update', user: 'System', timestamp: '2 min ago', status: 'success' },
                  { id: 2, event: 'ISP Data Sync', user: 'BSNL Chennai', timestamp: '5 min ago', status: 'success' },
                  { id: 3, event: 'Privacy Check', user: 'Auditor', timestamp: '12 min ago', status: 'warning' },
                  { id: 4, event: 'Model Export', user: 'Admin', timestamp: '25 min ago', status: 'success' },
                  { id: 5, event: 'ISP Joined', user: 'Airtel Delhi', timestamp: '1 hour ago', status: 'success' },
                ].map(event => (
                  <ListItem key={event.id} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <Badge 
                        color={event.status === 'success' ? 'success' : 'warning'}
                        variant="dot"
                      >
                        <HistoryIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">
                          {event.event}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {event.user} • {event.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff9800' }}>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Score
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ 
                  position: 'relative',
                  display: 'inline-flex',
                  width: 120,
                  height: 120
                }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={trainingStatus.securityScore * 100}
                    size={120}
                    thickness={4}
                    sx={{
                      color: trainingStatus.securityScore > 0.9 ? '#4caf50' : 
                             trainingStatus.securityScore > 0.7 ? '#ff9800' : '#f44336'
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {(trainingStatus.securityScore * 100).toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Overall Security Score
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Security Assessment:
                </Typography>
                <Alert 
                  severity={
                    trainingStatus.securityScore > 0.9 ? "success" :
                    trainingStatus.securityScore > 0.7 ? "warning" : "error"
                  }
                  icon={<ShieldIcon />}
                >
                  {trainingStatus.securityScore > 0.9 ? "Excellent - All security measures active" :
                   trainingStatus.securityScore > 0.7 ? "Good - Minor improvements needed" :
                   "Needs Attention - Review security settings"}
                </Alert>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ff5722' }}>
                <PolylineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                ATWC Correlation Engine
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Correlation Stats
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff5722' }}>
                          {atwcCorrelations.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Correlations
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        High Confidence
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {atwcCorrelations.filter(c => c.confidence > 0.8).length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          80% Confidence
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Avg. Confidence
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                          {atwcCorrelations.length > 0 
                            ? ((atwcCorrelations.reduce((sum, c) => sum + (c.confidence || 0), 0) / atwcCorrelations.length) * 100).toFixed(1)
                            : '0'}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Average Score
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        ISPs Involved
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                          {new Set(atwcCorrelations.flatMap(c => c.involvedISPs || [])).size}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unique ISPs
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Correlations
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Circuit ID</TableCell>
                      <TableCell>Entry Node</TableCell>
                      <TableCell>Exit Node</TableCell>
                      <TableCell>Timing Delta</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>ISPs Involved</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {atwcCorrelations.map((correlation, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {correlation.circuitId?.slice(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={correlation.entryNode?.slice(0, 15) || 'Unknown'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={correlation.exitNode?.slice(0, 15) || 'Unknown'}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {correlation.timingDelta ? `${correlation.timingDelta}ms` : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={correlation.confidence * 100}
                              sx={{ 
                                width: 80,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, #ff5722, ${correlation.confidence > 0.8 ? '#4caf50' : '#ff9800'})`
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 40 }}>
                              {(correlation.confidence * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {(correlation.involvedISPs || []).slice(0, 3).map((isp, i) => (
                              <Tooltip key={i} title={isp}>
                                <Avatar 
                                  sx={{ 
                                    width: 24, 
                                    height: 24,
                                    fontSize: '0.75rem',
                                    bgcolor: '#9c27b0'
                                  }}
                                >
                                  {isp.charAt(0)}
                                </Avatar>
                              </Tooltip>
                            ))}
                            {(correlation.involvedISPs || []).length > 3 && (
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                +{(correlation.involvedISPs || []).length - 3}
                              </Avatar>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {correlation.timestamp ? new Date(correlation.timestamp).toLocaleTimeString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Analyze Correlation">
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
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <SettingsEthernetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Federation Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={federationSettings.autoStart}
                        onChange={(e) => setFederationSettings(prev => ({ 
                          ...prev, 
                          autoStart: e.target.checked 
                        }))}
                      />
                    }
                    label="Auto-start Training Rounds"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Participants"
                    type="number"
                    value={federationSettings.minParticipants}
                    onChange={(e) => setFederationSettings(prev => ({ 
                      ...prev, 
                      minParticipants: parseInt(e.target.value) 
                    }))}
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Rounds"
                    type="number"
                    value={federationSettings.maxRounds}
                    onChange={(e) => setFederationSettings(prev => ({ 
                      ...prev, 
                      maxRounds: parseInt(e.target.value) 
                    }))}
                    InputProps={{ inputProps: { min: 1, max: 1000 } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Aggregation Frequency</InputLabel>
                    <Select
                      value={federationSettings.aggregationFrequency}
                      label="Aggregation Frequency"
                      onChange={(e) => setFederationSettings(prev => ({ 
                        ...prev, 
                        aggregationFrequency: e.target.value 
                      }))}
                    >
                      <MenuItem value="realtime">Real-time</MenuItem>
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Model Sharing Method</InputLabel>
                    <Select
                      value={federationSettings.modelSharing}
                      label="Model Sharing Method"
                      onChange={(e) => setFederationSettings(prev => ({ 
                        ...prev, 
                        modelSharing: e.target.value 
                      }))}
                    >
                      <MenuItem value="encrypted">Encrypted Weights</MenuItem>
                      <MenuItem value="differential">Differential Private</MenuItem>
                      <MenuItem value="homomorphic">Homomorphic Encryption</MenuItem>
                      <MenuItem value="secure">Secure MPC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={federationSettings.validationRequired}
                        onChange={(e) => setFederationSettings(prev => ({ 
                          ...prev, 
                          validationRequired: e.target.checked 
                        }))}
                      />
                    }
                    label="Require Model Validation"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      console.log('Saving federation settings:', federationSettings);
                      alert('Settings saved successfully!');
                    }}
                  >
                    Save Settings
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                <TrainingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Training Parameters
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Learning Rate"
                    type="number"
                    value={trainingStatus.learningRate}
                    onChange={(e) => setTrainingStatus(prev => ({ 
                      ...prev, 
                      learningRate: parseFloat(e.target.value) 
                    }))}
                    InputProps={{ inputProps: { min: 0.0001, max: 0.1, step: 0.0001 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Batch Size"
                    type="number"
                    value={trainingStatus.batchSize}
                    onChange={(e) => setTrainingStatus(prev => ({ 
                      ...prev, 
                      batchSize: parseInt(e.target.value) 
                    }))}
                    InputProps={{ inputProps: { min: 1, max: 1024 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Epochs per Round"
                    type="number"
                    value={trainingStatus.epochsPerRound}
                    onChange={(e) => setTrainingStatus(prev => ({ 
                      ...prev, 
                      epochsPerRound: parseInt(e.target.value) 
                    }))}
                    InputProps={{ inputProps: { min: 1, max: 100 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Aggregation Method</InputLabel>
                    <Select
                      value={trainingStatus.aggregationMethod}
                      label="Aggregation Method"
                      onChange={(e) => setTrainingStatus(prev => ({ 
                        ...prev, 
                        aggregationMethod: e.target.value 
                      }))}
                    >
                      <MenuItem value="fedavg">FedAvg</MenuItem>
                      <MenuItem value="fedprox">FedProx</MenuItem>
                      <MenuItem value="qfed">q-FedAvg</MenuItem>
                      <MenuItem value="scaffold">SCAFFOLD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Options
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Use GPU Acceleration"
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable Early Stopping"
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Cross-Device Learning"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Privacy Details Dialog */}
      <Dialog 
        open={showPrivacyDetails} 
        onClose={() => setShowPrivacyDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PrivacyTipIcon color="primary" />
            Privacy & Security Details
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Our federated learning system implements multiple layers of privacy protection:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Differential Privacy (ε = 1.2)"
                secondary="Adds calibrated noise to model updates to prevent data reconstruction"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Secure Multi-Party Computation"
                secondary="Model aggregation without revealing individual contributions"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ShieldIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Data Minimization"
                secondary="Only essential features are used, no PII is ever transmitted"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VerifiedUserIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="End-to-End Encryption"
                secondary="All communications are encrypted using TLS 1.3"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacyDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Federation Quick Actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<PlayIcon />}
          tooltipTitle="Start Training"
          onClick={startFederatedTraining}
        />
        <SpeedDialAction
          icon={<RefreshIcon />}
          tooltipTitle="Refresh Status"
          onClick={loadFederationStatus}
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export Report"
          onClick={() => alert('Export functionality would be implemented here')}
        />
        <SpeedDialAction
          icon={<SettingsEthernetIcon />}
          tooltipTitle="Settings"
          onClick={() => setActiveTab(5)}
        />
      </SpeedDial>
    </Box>
  );
};

export default FederatedLearningDashboard;
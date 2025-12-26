import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  Paper,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Link as CorrelationIcon,
  VpnKey as EncryptionIcon,
  AutoAwesome as AIcon,
  Traffic as TrafficIcon,
  CloudDownload as DataIcon,
  Timeline as MetricsIcon,
  DeviceHub as NodesIcon,
  ShowChart as FlowIcon,
  Security as ThreatsIcon,
  Analytics as AnalyticsIcon,
  Notifications as AlertIcon,
  Settings as SettingsIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Public as TorIcon,
  NetworkCheck as NetworkIcon,
  Pattern as PatternIcon,
  Timeline as RealTimeIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Correlation Analysis', icon: <CorrelationIcon />, path: '/correlationPage' },
    { text: 'Encryption Analysis', icon: <EncryptionIcon />, path: '/EncryptionPage' },
    { text: 'ATWC Engine', icon: <AIcon />, path: '/Atwcpage' },
    { text: 'Traffic Analyzer', icon: <TrafficIcon />, path: '/TrafficAnalyzer' },
    { text: 'Data Collection', icon: <DataIcon />, path: '/DataCollectionPage' },
    { text: 'TOR Metrics', icon: <MetricsIcon />, path: '/TorMetricsPage' },
    { text: 'Network Nodes', icon: <NodesIcon />, path: '/nodes' },
    { text: 'Traffic Flow', icon: <FlowIcon />, path: '/traffic' },
    { text: 'Threat Intelligence', icon: <ThreatsIcon />, path: '/threats' },
    { text: 'Advanced Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Real-time Monitor', icon: <RealTimeIcon />, path: '/realtime' },
    { text: 'NetworkMap', icon: <NetworkIcon />, path: '/NetworkMap' },
    { text: 'Pattern Recognition', icon: <PatternIcon />, path: '/pattern' },
    { text: 'AI Predictions', icon: <AIcon />, path: '/ai' },
  ];

  const bottomMenuItems = [
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/login' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawer = (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0a1929 0%, #132f4c 100%)',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center', 
        borderBottom: '1px solid rgba(33, 150, 243, 0.2)',
        background: 'rgba(10, 25, 41, 0.9)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2196f3, #4dabf5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <TorIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              letterSpacing: '0.5px'
            }}>
              TOR SENTINEL
            </Typography>
            <Chip 
              label="TN POLICE CYBER CELL" 
              size="small" 
              sx={{ 
                mt: 0.5,
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                color: '#4dabf5'
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ 
          backgroundColor: 'rgba(33, 150, 243, 0.2)', 
          my: 2,
          height: 2,
          borderRadius: 2
        }} />
        <Typography variant="caption" sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '0.75rem'
        }}>
          Navigation Menu
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        py: 2,
        px: 1
      }}>
        <List>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: 1.2,
                    '&:hover': {
                      backgroundColor: active 
                        ? 'rgba(33, 150, 243, 0.3)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s'
                    },
                    backgroundColor: active ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                    borderLeft: active ? '4px solid #2196f3' : '4px solid transparent',
                    borderRight: active ? '1px solid rgba(33, 150, 243, 0.3)' : 'none',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: active ? '#2196f3' : 'rgba(255, 255, 255, 0.7)', 
                    minWidth: 40,
                    mr: 1
                  }}>
                    {React.cloneElement(item.icon, { 
                      sx: { fontSize: 20 } 
                    })}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: active ? 600 : 400,
                      color: active ? '#2196f3' : 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                  {active && (
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#2196f3',
                      ml: 1,
                      animation: 'pulse 1.5s infinite'
                    }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* System Status */}
      <Box sx={{ 
        p: 2, 
        mx: 2, 
        mb: 2,
        borderRadius: 2,
        background: 'rgba(19, 47, 76, 0.6)',
        border: '1px solid rgba(33, 150, 243, 0.2)'
      }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255, 255, 255, 0.6)',
          display: 'block',
          mb: 1
        }}>
          System Status
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip 
            label="LIVE" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: '#4caf50',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Online
          </Typography>
        </Box>
      </Box>

      {/* Bottom Menu */}
      <Box sx={{ 
        borderTop: '1px solid rgba(33, 150, 243, 0.2)',
        background: 'rgba(10, 25, 41, 0.9)',
        py: 1
      }}>
        <List sx={{ py: 0 }}>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  minWidth: 36 
                }}>
                  {item.text === 'Logout' 
                    ? React.cloneElement(item.icon, { sx: { fontSize: 18 } })
                    : React.cloneElement(item.icon, { sx: { fontSize: 18 } })
                  }
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, rgba(19, 47, 76, 0.95) 0%, rgba(25, 118, 210, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap sx={{ 
              color: 'white',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: 2
            }}>
              Tor Sentinel
            </Typography>
            <Chip 
              label="Dashboard" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.7rem',
                height: 22
              }}
            />
          </Box>
          
          {/* Notifications and User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{ 
                  ml: 1,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#2196f3'
                  }
                }}
              >
                <Avatar sx={{ 
                  width: 36, 
                  height: 36, 
                  background: 'linear-gradient(135deg, #2196f3, #4dabf5)',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  OP
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                background: 'rgba(19, 47, 76, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
                mt: 1,
                minWidth: 180
              }
            }}
          >
            <MenuItem onClick={() => handleNavigation('/profile')} sx={{ color: 'white' }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" sx={{ color: '#2196f3' }} />
              </ListItemIcon>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/settings')} sx={{ color: 'white' }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: '#2196f3' }} />
              </ListItemIcon>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem onClick={() => handleNavigation('/login')} sx={{ color: '#f44336' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0a1929 0%, #132f4c 100%)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(33, 150, 243, 0.2)',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0a1929 0%, #132f4c 100%)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(33, 150, 243, 0.2)',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a1929 0%, #132f4c 100%)',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet /> {/* This is where page content will be rendered */}
      </Box>

      {/* Global styles for animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default Layout;
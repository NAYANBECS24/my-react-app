import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Component
import Layout from './components/Layout/Layout';

// Existing Pages - USING EXACT FILENAMES FROM YOUR LIST
import HomePage from './pages/HomePage';
import CorrelationPage from './pages/CorrelationPage';
import EncryptionPage from './pages/EncryptionPage';
import AtwcPage from './pages/ATWC ENGINE';  // Note: This is the exact filename
import TrafficAnalyzerPage from './pages/TrafficAnalyzer';
import DataCollectionPage from './pages/DataCollectionPage';
import TorMetricsPage from './pages/TorMetricsPage';
import NodesPage from './pages/NodesPage';
import Traffic from './pages/Traffic';  // Changed from TrafficPage to Traffic
import Threats from './pages/Threats';  // Changed from ThreatsPage to Threats
import Analytics from './pages/Analytics';  // Changed from AnalyticsPage to Analytics
import Alerts from './pages/Alerts';  // Changed from AlertsPage to Alerts
import AlertDetail from './pages/AlertDetail';  // Changed from AlertDetailPage to AlertDetail
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

// Add NetworkMap import
const NetworkMap = React.lazy(() => import('./pages/NetworkMap').catch(() => ({ default: () => <PlaceholderPage title="Network Map" /> })));

// Pages that might not exist or need lazy loading
const RealTimeMonitor = React.lazy(() => import('./pages/RealTimeMonitor').catch(() => ({ default: () => <PlaceholderPage title="Real-time Monitor" /> })));
const PatternRecognition = React.lazy(() => import('./pages/PatternRecognition').catch(() => ({ default: () => <PlaceholderPage title="Pattern Recognition" /> })));
const AIPredictions = React.lazy(() => import('./pages/ai').catch(() => ({ default: () => <PlaceholderPage title="AI Predictions" /> })));

// Simple placeholder component
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  const [isAuthenticated] = React.useState(true); // Set to false for login screen

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#2196f3' },
          background: { default: '#0a1929' },
        },
      })}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <Router>
      <React.Suspense fallback={<div style={{ padding: '40px', color: 'white' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Note: Layout already has <Outlet /> in its content area */}
            
            {/* Default route - HomePage */}
            <Route index element={<HomePage />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Existing routes - MATCHING THE PATHS FROM LAYOUT */}
            <Route path="correlationPage" element={<CorrelationPage />} />
            <Route path="EncryptionPage" element={<EncryptionPage />} />
            <Route path="Atwcpage" element={<AtwcPage />} />
            <Route path="TrafficAnalyzer" element={<TrafficAnalyzerPage />} />
            <Route path="DataCollectionPage" element={<DataCollectionPage />} />
            <Route path="TorMetricsPage" element={<TorMetricsPage />} />
            <Route path="nodes" element={<NodesPage />} />
            <Route path="traffic" element={<Traffic />} />
            <Route path="threats" element={<Threats />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetail />} />
            
            {/* NEW ROUTES - Must match Layout menu paths */}
            <Route path="realtime" element={<RealTimeMonitor />} />
            <Route path="NetworkMap" element={<NetworkMap />} /> {/* Added this line */}
            <Route path="pattern" element={<PatternRecognition />} />
            <Route path="ai" element={<AIPredictions />} />
            
            {/* Bottom menu routes */}
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="login" element={<Login />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
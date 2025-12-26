const express = require('express');
const router = express.Router();
const torController = require('../controllers/tor.controller');
const { authorize } = require('../middleware/auth');

// Public routes
router.get('/overview', torController.getNetworkOverview);
router.get('/nodes/country', torController.getNodesByCountry);

// Protected routes
router.get('/nodes', torController.getNodes);
router.get('/nodes/search', torController.searchNodes);
router.get('/nodes/:id', torController.getNodeById);
router.get('/nodes/:id/statistics', torController.getNodeStatistics);
router.get('/nodes/:id/performance', torController.getNodePerformance);
router.put('/nodes/:id/status', authorize('admin', 'analyst'), torController.updateNodeStatus);

// Admin only routes
router.post('/nodes/update', authorize('admin'), torController.forceUpdateNodes);

module.exports = router;
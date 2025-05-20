const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/admin/revenue-controller');

// Get revenue statistics
router.get('/statistics', revenueController.getRevenueStatistics);

module.exports = router; 
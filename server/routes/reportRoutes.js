const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');

router.get('/revenue', reportCtrl.getRevenue);
router.get('/cost', reportCtrl.getCost);
router.get('/satisfaction', reportCtrl.getSatisfaction);

module.exports = router;

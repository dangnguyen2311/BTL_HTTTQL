const express = require('express');
const router = express.Router();
const ratingController = require('../../controllers/admin/rating-controller');

// Get list of products for dropdown (protected route for admin)
router.get('/products',  ratingController.getProductsList);

// Get overall rating statistics (protected route for admin)
router.get('/stats',ratingController.getRatingStats);

// Get rating statistics for a specific product (protected route for admin)
router.get('/stats/product/:productId', ratingController.getProductRatingStats);

module.exports = router; 
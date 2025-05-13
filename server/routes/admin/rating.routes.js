const express = require('express');
const router = express.Router();
const ratingController = require('../../controllers/rating.controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');

// Get list of products for dropdown (protected route for admin)
router.get('/products', authMiddleware, ratingController.getProductsList);

// Get overall rating statistics (protected route for admin)
router.get('/stats', authMiddleware, ratingController.getRatingStats);

// Get rating statistics for a specific product (protected route for admin)
router.get('/stats/product/:productId', authMiddleware, ratingController.getProductRatingStats);

module.exports = router; 
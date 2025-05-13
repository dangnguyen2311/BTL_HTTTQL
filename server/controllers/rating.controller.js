const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

// Get rating statistics for all products
exports.getRatingStats = async (req, res) => {
    try {
        // Get rating distribution
        const distribution = await Review.aggregate([
            {
                $match: {
                    reviewValue: { $ne: null, $gte: 1, $lte: 5 }
                }
            },
            {
                $group: {
                    _id: "$reviewValue",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    rating: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { rating: 1 }
            }
        ]);

        // Get top rated products
        const products = await Product.find().select('_id title');
        const reviews = await Review.find({ reviewValue: { $ne: null, $gte: 1, $lte: 5 } });

        const productRatings = {};
        reviews.forEach(review => {
            if (!productRatings[review.productId]) {
                productRatings[review.productId] = {
                    ratings: [],
                    count: 0
                };
            }
            productRatings[review.productId].ratings.push(review.reviewValue);
            productRatings[review.productId].count++;
        });

        const topRated = products
            .map(product => ({
                _id: product._id,
                name: product.title,
                averageRating: productRatings[product._id]?.ratings.reduce((a, b) => a + b, 0) / (productRatings[product._id]?.count || 1) || 0,
                reviewCount: productRatings[product._id]?.count || 0
            }))
            .filter(p => p.reviewCount > 0)
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 5);

        // Get recent reviews
        const recentReviews = await Review.find({ reviewValue: { $ne: null, $gte: 1, $lte: 5 } })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const productIds = [...new Set(recentReviews.map(r => r.productId))];
        const productTitles = await Product.find({ _id: { $in: productIds } })
            .select('_id title')
            .lean();

        const productTitleMap = productTitles.reduce((map, p) => {
            map[p._id] = p.title;
            return map;
        }, {});

        const formattedRecentReviews = recentReviews.map(review => ({
            _id: review._id,
            productName: productTitleMap[review.productId] || 'Unknown Product',
            rating: review.reviewValue,
            comment: review.reviewMessage,
            userName: review.userName || 'Anonymous',
            createdAt: review.createdAt
        }));

        res.json({
            distribution,
            topRated,
            recentReviews: formattedRecentReviews
        });
    } catch (error) {
        console.error('Error in getRatingStats:', error);
        res.status(500).json({ message: 'Error getting rating stats', error: error.message });
    }
};

// Get list of products for dropdown
exports.getProductsList = async (req, res) => {
    try {
        const products = await Product.find()
            .select('_id title')
            .sort({ title: 1 });

        res.json(products.map(p => ({
            id: p._id,
            name: p.title
        })));
    } catch (error) {
        console.error('Error getting products list:', error);
        res.status(500).json({ message: 'Error getting products list', error: error.message });
    }
};

// Get rating statistics for a specific product
exports.getProductRatingStats = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const distribution = await Review.aggregate([
            {
                $match: {
                    productId: productId,
                    reviewValue: { $ne: null, $gte: 1, $lte: 5 }
                }
            },
            {
                $group: {
                    _id: "$reviewValue",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    rating: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { rating: 1 }
            }
        ]);

        const averageRating = await Review.aggregate([
            {
                $match: {
                    productId: productId,
                    reviewValue: { $ne: null, $gte: 1, $lte: 5 }
                }
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: "$reviewValue" },
                    total: { $sum: 1 }
                }
            }
        ]);

        const recentReviews = await Review.find({
            productId,
            reviewValue: { $ne: null, $gte: 1, $lte: 5 }
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            product: {
                name: product.title,
                averageRating: averageRating[0]?.average || 0,
                totalReviews: averageRating[0]?.total || 0
            },
            distribution,
            recentReviews: recentReviews.map(review => ({
                userName: review.userName || 'Anonymous',
                rating: review.reviewValue,
                comment: review.reviewMessage,
                createdAt: review.createdAt
            }))
        });
    } catch (error) {
        console.error('Error getting product rating stats:', error);
        res.status(500).json({ message: 'Error getting product rating stats', error: error.message });
    }
}; 
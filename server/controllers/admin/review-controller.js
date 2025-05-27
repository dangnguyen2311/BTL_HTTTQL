const Review = require('../models/review-model'); // Import your Review model

// Get list of reviews within a specific time range
exports.getReviewsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        const reviews = await Review.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews.', error });
    }
};

// Get review details by ID
exports.getReviewDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id).sort({ createdAt: -1 });

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review details.', error });
    }
};
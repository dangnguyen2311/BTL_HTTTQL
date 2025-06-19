const Review = require('../models/review-model'); // Import your Review model

// Get list of reviews within a specific time range
exports.getReviewsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        // Convert dates to start and end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Check if start date is greater than end date
        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be greater than end date"
            });
        }

        const reviews = await Review.find({
            createdAt: {
                $gte: start,
                $lte: end,
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
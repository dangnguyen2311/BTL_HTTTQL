const Order = require('../../models/Order');

// Get revenue statistics for a date range
exports.getRevenueStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        // Convert dates to start and end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Find all orders within the date range
        const orders = await Order.find({
            orderDate: {
                $gte: start,
                $lte: end
            },
            orderStatus: 'delivered' // Only count completed orders
        });
        console.log(orders);
        console.log(orders.length);

        // Calculate statistics
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const dailyRevenue = {};
        orders.forEach(order => {
            const date = order.orderDate ? order.orderDate.toISOString().split('T')[0] : null;
            if (date) {
                dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalAmount;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                dailyRevenue, 
                orders
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching revenue statistics"
        });
    }
}; 
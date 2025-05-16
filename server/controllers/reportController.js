const Order = require('../models/Order');
const Cost = require('../models/Cost');
const Feedback = require('../models/Feedback');

exports.getRevenue = async (req, res) => {
  const { start, end } = req.query;
  const orders = await Order.find({
    createdAt: { $gte: new Date(start), $lte: new Date(end) }
  });
  const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  res.json({ total, orders });
};

exports.getCost = async (req, res) => {
  const { start, end } = req.query;
  const costs = await Cost.find({
    createdAt: { $gte: new Date(start), $lte: new Date(end) }
  });
  const total = costs.reduce((sum, c) => sum + c.amount, 0);
  res.json({ total, costs });
};

exports.getSatisfaction = async (req, res) => {
  const { start, end } = req.query;
  const feedbacks = await Feedback.find({
    createdAt: { $gte: new Date(start), $lte: new Date(end) }
  });
  const count = feedbacks.length;
  const avg = count ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / count : 0;
  res.json({ totalFeedback: count, averageRating: avg.toFixed(2), feedbacks });
};

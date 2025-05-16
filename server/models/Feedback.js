const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  createdAt: Date,
  rating: Number,
  comment: String,
});
module.exports = mongoose.model('Feedback', feedbackSchema);

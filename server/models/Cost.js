const mongoose = require('mongoose');
const costSchema = new mongoose.Schema({
  createdAt: Date,
  amount: Number,
  description: String,
});
module.exports = mongoose.model('Cost', costSchema);

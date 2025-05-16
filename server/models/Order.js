const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  createdAt: Date,
  totalAmount: Number,
  employee: String,
  items: Array,
  type: String,
});
module.exports = mongoose.model('Order', orderSchema);

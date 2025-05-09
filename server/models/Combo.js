const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    products: [{
        productId: String,
        title: String,
        quantity: Number,
    }],
    totalStock:{
        type: Number,
        require: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Combo', comboSchema); 
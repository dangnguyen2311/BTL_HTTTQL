const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['fried-chicken', 'pizza', 'noodle', 'dessert', 'icecream', 'drink']
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        salePrice: {
            type: Number,
            min: 0,
            default: null
        },
        totalStock: {
            type: Number,
            required: true,
            min: 0
        },
        averageReview: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
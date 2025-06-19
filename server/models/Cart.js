const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                isCombo: {
                    type: Boolean,
                    default: false
                }
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
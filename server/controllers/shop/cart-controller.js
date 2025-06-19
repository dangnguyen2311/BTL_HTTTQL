const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Combo = require("../../models/Combo");

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, isCombo } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        // Check if product/combo exists
        let item;
        if (isCombo) {
            item = await Combo.findById(productId);
        } else {
            item = await Product.findById(productId);
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: isCombo ? "Combo not found" : "Product not found",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const findCurrentProductIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            cart.items.push({ 
                productId, 
                quantity,
                isCombo: isCombo || false
            });
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }

        await cart.save();
        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is manadatory!",
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        // Populate products and combos separately
        const populatedItems = await Promise.all(
            cart.items.map(async (item) => {
                if (item.isCombo) {
                    const combo = await Combo.findById(item.productId);
                    return {
                        productId: combo?._id,
                        image: combo?.image,
                        title: combo?.name,
                        price: combo?.price,
                        salePrice: combo?.salePrice,
                        quantity: item.quantity,
                        isCombo: true
                    };
                } else {
                    const product = await Product.findById(item.productId);
                    return {
                        productId: product?._id,
                        image: product?.image,
                        title: product?.title,
                        price: product?.price,
                        salePrice: product?.salePrice,
                        quantity: item.quantity,
                        isCombo: false
                    };
                }
            })
        );

        // Filter out items where product/combo was not found
        const validItems = populatedItems.filter(item => item.productId);

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: validItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        const findCurrentProductIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Cart item not present !",
            });
        }

        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();

        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.productId._id.toString() !== productId
        );

        await cart.save();

        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};

module.exports = {
    addToCart,
    updateCartItemQty,
    deleteCartItem,
    fetchCartItems,
};
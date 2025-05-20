const Combo = require('../../models/Combo');

// Add new combo
exports.addCombo = async (req, res) => {
    try {
        const { name, description, price, products, image, totalStock, category, salePrice } = req.body;
        
        const newCombo = new Combo({
            name,
            description,
            price,
            image,
            products,
            totalStock,
            category,
            salePrice,
            isActive : true
        });

        const savedCombo = await newCombo.save();
        res.status(201).json({
            success: true,
            data: savedCombo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all combos
exports.getAllCombos = async (req, res) => {
    try {
        const combos = await Combo.find().populate('products');
        res.status(200).json({
            success: true,
            data: combos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get combo by ID
exports.getComboById = async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id).populate('products');
        
        if (!combo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: combo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update combo
exports.updateCombo = async (req, res) => {
    try {
        const { name, description, price, products, image, totalStock, salePrice, category } = req.body;
        
        const updatedCombo = await Combo.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                products,
                image,
                totalStock,
                salePrice,
                category
            },
            { new: true, runValidators: true }
        ).populate('products');

        if (!updatedCombo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCombo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete combo
exports.deleteCombo = async (req, res) => {
    try {
        const deletedCombo = await Combo.findByIdAndDelete(req.params.id);

        if (!deletedCombo) {
            return res.status(404).json({
                success: false,
                message: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Combo deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 
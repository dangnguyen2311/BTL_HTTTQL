const express = require('express');
const router = express.Router();
const comboController = require('../../controllers/admin/combo-controller');

// Admin routes for combo management
router.post('/add', comboController.addCombo);
router.get('/get', comboController.getAllCombos);
router.get('/get/:id', comboController.getComboById);
router.put('/edit/:id', comboController.updateCombo);
router.delete('/delete/:id', comboController.deleteCombo);

module.exports = router; 
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user-controller');

// Get all users
router.get('/', userController.getAllUsers);

// Add new user
router.post('/', userController.addUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;

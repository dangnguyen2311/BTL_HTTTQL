const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user-controller');
// const { isAdmin } = require('../../middleware/auth');

// Apply admin middleware to all routes
// router.use(isAdmin);

// Get all users
router.get('/users', userController.getAllUsers);

// Add new user
router.post('/users', userController.addUser);

// Update user
router.put('/users/:id', userController.updateUser);

// Delete user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

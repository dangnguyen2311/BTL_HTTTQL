const UserService = require('../../services/user-service');

class UserController {
    // Get list of all users
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    // Get list of customer users
    async getCustomerUsers(req, res) {
        try {
            const customers = await UserService.getCustomerUsers();
            res.status(200).json(customers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching customer users', error });
        }
    }


    // Get user details by ID
    async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user details', error });
        }
    }
}

module.exports = new UserController();
// // Create a new user
// async createUser(req, res) {
//     try {
//         const userData = req.body;
//         const newUser = await UserService.createUser(userData);
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error });
//     }
// }

// // Update user details
// async updateUser(req, res) {
//     try {
//         const userId = req.params.id;
//         const updatedData = req.body;
//         const updatedUser = await UserService.updateUser(userId, updatedData);
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating user', error });
//     }
// }

// // Delete a user
// async deleteUser(req, res) {
//     try {
//         const userId = req.params.id;
//         const deletedUser = await UserService.deleteUser(userId);
//         if (!deletedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting user', error });
//     }
// }
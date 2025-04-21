const User = require('../models/User');

const penggunaController = {
    // Get all users (Admin only)
    async getUsers(req, res) {
        try {
            const users = await User.find({}).select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update user profile
    async updateProfile(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.findById(req.user._id);

            if (user) {
                user.name = name || user.name;
                user.email = email || user.email;
                if (password) {
                    user.password = password;
                }

                const updatedUser = await user.save();
                res.json({
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                });
            } else {
                res.status(404).json({ message: 'Pengguna tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update user role (Admin only)
    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true }
            ).select('-password');

            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'Pengguna tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Toggle user active status (Admin only)
    async toggleUserStatus(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                user.isActive = !user.isActive;
                const updatedUser = await user.save();
                res.json({
                    id: updatedUser._id,
                    isActive: updatedUser.isActive
                });
            } else {
                res.status(404).json({ message: 'Pengguna tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete user (Admin only)
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (user) {
                res.json({ message: 'Pengguna berhasil dihapus' });
            } else {
                res.status(404).json({ message: 'Pengguna tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = penggunaController;

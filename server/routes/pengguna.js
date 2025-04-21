const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// User routes
router.get('/profile', protect, penggunaController.getProfile);
router.put('/profile', protect, penggunaController.updateProfile);

// Admin routes
router.get('/', protect, admin, penggunaController.getUsers);
router.put('/:id/role', protect, admin, penggunaController.updateUserRole);
router.put('/:id/status', protect, admin, penggunaController.toggleUserStatus);
router.delete('/:id', protect, admin, penggunaController.deleteUser);

module.exports = router;

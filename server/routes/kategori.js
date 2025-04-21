const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', kategoriController.getCategories);

// Admin routes
router.post('/', protect, admin, kategoriController.createCategory);
router.put('/:id', protect, admin, kategoriController.updateCategory);
router.delete('/:id', protect, admin, kategoriController.deleteCategory);

module.exports = router;

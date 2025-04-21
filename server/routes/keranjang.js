const express = require('express');
const router = express.Router();
const keranjangController = require('../controllers/keranjangController');
const { protect } = require('../middlewares/auth');

// Route untuk items
router.get('/items', protect, keranjangController.getCart);
router.post('/items', protect, keranjangController.addItem);
router.put('/items/:productId', protect, keranjangController.updateQuantity);
router.delete('/items/:productId', protect, keranjangController.removeItem);

// Backup route untuk kompatibilitas
router.get('/', protect, keranjangController.getCart);

module.exports = router;

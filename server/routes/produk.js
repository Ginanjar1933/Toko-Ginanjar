const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// Pastikan semua method yang dipanggil sudah ada di controller
router.get('/', produkController.getProducts);
router.get('/:id', produkController.getProductById);
router.post('/', protect, admin, produkController.createProduct);
router.put('/:id', protect, admin, produkController.updateProduct);
router.delete('/:id', protect, admin, produkController.deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const kasir = require('../middlewares/kasir');

// Import controller
const transactionController = require('../controllers/transactionController');

// Admin routes
router.get('/all', protect, admin, transactionController.getAllTransactions);
router.put('/:id/status', protect, admin, transactionController.updateTransactionStatus);

// Kasir routes
router.post('/', protect, kasir, transactionController.createTransaction);
router.get('/:id', protect, kasir, transactionController.getTransactionById);

// User routes
router.get('/my-transactions', protect, transactionController.getUserTransactions);

module.exports = router;

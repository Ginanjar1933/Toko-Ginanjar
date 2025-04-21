const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// User routes
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);

// Admin routes
router.get('/', protect, admin, orderController.getAllOrders);
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;

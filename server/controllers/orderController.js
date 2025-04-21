const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const orderController = {
    async createOrder(req, res) {
        try {
            const { shippingAddress, paymentMethod } = req.body;
            
            // Validasi input
            if (!shippingAddress || !paymentMethod) {
                return res.status(400).json({ 
                    message: 'Data pengiriman dan pembayaran harus diisi' 
                });
            }

            // Ambil keranjang user
            const cart = await Cart.findOne({ user: req.user._id })
                                 .populate('items.product');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Keranjang kosong' });
            }

            // Hitung total dan siapkan items
            const orderItems = cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const totalAmount = orderItems.reduce(
                (total, item) => total + (item.price * item.quantity), 
                0
            );

            // Buat order baru
            const order = await Order.create({
                user: req.user._id,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod
            });

            // Kosongkan keranjang
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [] } }
            );

            // Populate order dengan detail produk
            await order.populate('items.product');

            res.status(201).json(order);
        } catch (error) {
            console.error('Order Error:', error);
            res.status(500).json({ 
                message: 'Terjadi kesalahan saat membuat pesanan',
                error: error.message 
            });
        }
    },

    async getUserOrders(req, res) {
        try {
            const orders = await Order.find({ user: req.user._id })
                .populate({
                    path: 'items.product',
                    select: 'title price image'
                })
                .sort('-createdAt');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getAllOrders(req, res) {
        try {
            const orders = await Order.find({})
                .populate('user', 'name email')
                .populate('items.product', 'name price')
                .sort('-createdAt');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = orderController;

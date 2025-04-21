const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

const transactionController = {
    async getAllTransactions(req, res) {
        try {
            const transactions = await Transaction.find({})
                .populate('order')
                .sort('-createdAt');
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createTransaction(req, res) {
        try {
            const { orderId, amount, paymentMethod, paymentDetails } = req.body;
            
            const transaction = await Transaction.create({
                order: orderId,
                amount,
                paymentMethod,
                paymentDetails
            });

            // Update order status jika transaksi berhasil
            await Order.findByIdAndUpdate(orderId, { status: 'paid' });

            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getTransactionById(req, res) {
        try {
            const transaction = await Transaction.findById(req.params.id)
                .populate('order');
            if (!transaction) {
                return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
            }
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateTransactionStatus(req, res) {
        try {
            const { status } = req.body;
            const transaction = await Transaction.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getUserTransactions(req, res) {
        try {
            const transactions = await Transaction.find({
                'order.user': req.user._id
            }).populate('order');
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = transactionController;

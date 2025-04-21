const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    paymentDetails: {
        type: Map,
        of: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

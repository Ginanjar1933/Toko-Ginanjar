const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: String,
    code: String,
    images: [String]
});

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true }, // Add this line
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['running', 'casual', 'sport']
    },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    colors: [colorSchema],
    sizes: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

const Cart = require('../models/Cart');
const Product = require('../models/Product');

const keranjangController = {
    async getCart(req, res) {
        try {
            let cart = await Cart.findOne({ user: req.user._id })
                                .populate('items.product');
            if (!cart) {
                cart = await Cart.create({ user: req.user._id, items: [] });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async addItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            let cart = await Cart.findOne({ user: req.user._id });
            
            if (!cart) {
                cart = await Cart.create({
                    user: req.user._id,
                    items: [{ product: productId, quantity }]
                });
            } else {
                const itemIndex = cart.items.findIndex(
                    item => item.product.toString() === productId
                );

                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    cart.items.push({ product: productId, quantity });
                }
                await cart.save();
            }

            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateQuantity(req, res) {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            
            // Validasi stok
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
            if (quantity > product.stock) {
                return res.status(400).json({ message: 'Stok tidak mencukupi' });
            }

            // Cari cart user
            let cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
            }

            // Update quantity item
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Update quantity jika item sudah ada
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Tambah item baru jika belum ada
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
            
            // Populate product details sebelum response
            await cart.populate('items.product');
            
            res.json({ cart });
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async removeItem(req, res) {
        try {
            const cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: req.params.productId } } },
                { new: true }
            );
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = keranjangController;

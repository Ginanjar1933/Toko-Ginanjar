const Product = require('../models/Product');

const produkController = {
    async getProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            
            const filter = {};
            if (req.query.category) {
                filter.category = req.query.category;
            }

            const products = await Product.find(filter)
                .populate('category')
                .skip(skip)
                .limit(limit);

            const total = await Product.countDocuments(filter);

            res.json({
                products,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createProduct(req, res) {
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteProduct(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
            res.json({ message: 'Produk berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id)
                                       .populate('category');
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = produkController;

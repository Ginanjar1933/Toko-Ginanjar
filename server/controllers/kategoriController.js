const Category = require('../models/Category');

const kategoriController = {
    async getCategories(req, res) {
        try {
            const categories = await Category.find({ isActive: true });
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            const category = await Category.create({ name, description });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateCategory(req, res) {
        try {
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteCategory(req, res) {
        try {
            await Category.findByIdAndUpdate(req.params.id, { isActive: false });
            res.json({ message: 'Kategori berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = kategoriController;

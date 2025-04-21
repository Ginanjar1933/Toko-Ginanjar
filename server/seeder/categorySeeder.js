require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/db');

const categories = [
    {
        name: "running",
        description: "Sepatu lari dan performa tinggi"
    },
    {
        name: "casual",
        description: "Sepatu kasual untuk sehari-hari"
    },
    {
        name: "sport",
        description: "Sepatu olahraga dan aktivitas fisik"
    }
];

const seedCategories = async () => {
    try {
        await connectDB();
        await Category.deleteMany();
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories seeded!');
        return createdCategories;
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

module.exports = seedCategories;

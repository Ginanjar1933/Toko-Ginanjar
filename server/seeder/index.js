require('dotenv').config();
const connectDB = require('../config/db');
const seedProducts = require('./productSeeder');

const seedDatabase = async () => {
    try {
        await connectDB();
        await seedProducts();
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();

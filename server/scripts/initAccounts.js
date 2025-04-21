require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const defaultAccounts = [
    {
        username: 'admin',
        name: 'Administrator',  // Tambahkan field name
        email: 'admin@tokoonline.com',
        password: 'Admin123!',
        fullname: 'Administrator',
        phone: '081234567890',
        role: 'admin'
    },
    {
        username: 'kasir',
        name: 'Kasir',  // Tambahkan field name
        email: 'kasir@tokoonline.com',
        password: 'Kasir123!',
        fullname: 'Kasir',
        phone: '081234567891',
        role: 'kasir'
    }
];

async function initializeAccounts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const account of defaultAccounts) {
            const existingUser = await User.findOne({ email: account.email });
            
            if (!existingUser) {
                // Buat user baru tanpa hash manual
                const user = new User({
                    ...account,
                    isVerified: true
                });
                await user.save(); // Password akan di-hash otomatis oleh pre-save hook
                console.log(`Created ${account.role} account:`, {
                    username: account.username,
                    email: account.email,
                    password: account.password
                });
            } else {
                console.log(`${account.role} account already exists`);
            }
        }

        console.log('Account initialization completed');
    } catch (error) {
        console.error('Error initializing accounts:', error);
    } finally {
        await mongoose.disconnect();
    }
}

initializeAccounts();

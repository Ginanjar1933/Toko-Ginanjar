require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // Change to false since we don't need credentials for now
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/produk'));
app.use('/api/categories', require('./routes/kategori'));
app.use('/api/users', require('./routes/pengguna'));
app.use('/api/cart', require('./routes/keranjang')); // Pastikan route ini terdaftar
app.use('/api/orders', require('./routes/order'));
app.use('/api/transactions', require('./routes/transaction'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

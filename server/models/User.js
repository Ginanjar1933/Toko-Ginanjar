const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Tambah field username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'kasir', 'customer'],
        default: 'customer'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hash password sebelum disimpan
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, 10);
});

// Metode untuk membandingkan password
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error('Password match error:', error);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);

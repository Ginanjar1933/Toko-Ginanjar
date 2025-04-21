const User = require('../models/User');
const { generateToken } = require('../config/auth');

const authController = {
    async register(req, res) {
        try {
            console.log('Received registration data:', req.body); // Debug log

            const { username, name, email, password, phone } = req.body;

            // Validasi field yang diperlukan
            if (!username || !name || !email || !password) {
                return res.status(400).json({ 
                    message: 'Semua field wajib diisi' 
                });
            }

            // Cek apakah username atau email sudah ada
            const userExists = await User.findOne({
                $or: [
                    { username: username.toLowerCase() },
                    { email: email.toLowerCase() }
                ]
            });

            if (userExists) {
                return res.status(400).json({ 
                    message: 'Username atau email sudah terdaftar' 
                });
            }

            // Buat user baru
            const user = await User.create({
                username: username.toLowerCase(),
                name,
                email: email.toLowerCase(),
                password,
                phone,
                role: 'customer'
            });

            res.status(201).json({
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                message: error.message || 'Terjadi kesalahan saat registrasi' 
            });
        }
    },

    async login(req, res) {
        try {
            console.log('Login attempt with:', req.body); // Debug log
            const { identifier, password, role } = req.body;

            // Pastikan identifier dan password ada
            if (!identifier || !password) {
                return res.status(400).json({ 
                    message: 'Username/Email dan password harus diisi' 
                });
            }

            // Cari user dengan case insensitive
            const user = await User.findOne({
                $or: [
                    { email: identifier.toLowerCase() },
                    { username: identifier.toLowerCase() }
                ]
            });

            console.log('Found user:', user); // Debug log

            if (!user) {
                return res.status(401).json({ 
                    message: 'Username/Email atau password salah' 
                });
            }

            const isMatch = await user.matchPassword(password);
            console.log('Password match:', isMatch); // Debug log

            if (!isMatch) {
                return res.status(401).json({ 
                    message: 'Username/Email atau password salah' 
                });
            }

            if (role && user.role !== role) {
                return res.status(401).json({ 
                    message: 'Role tidak sesuai' 
                });
            }

            const token = generateToken(user._id);
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: 'Terjadi kesalahan saat login' 
            });
        }
    }
};

module.exports = authController;

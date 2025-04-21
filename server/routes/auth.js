const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/google', async (req, res) => {
    try {
        const { email, name, imageUrl, googleId, token } = req.body;
        
        if (!email || !name || !googleId) {
            return res.status(400).json({ 
                message: 'Data Google tidak lengkap' 
            });
        }

        // Cek apakah user sudah ada
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });
        
        if (!user) {
            // Buat user baru
            user = new User({
                email,
                name,
                googleId,
                profileImage: imageUrl,
                role: 'customer',
                isVerified: true // karena sudah terverifikasi melalui Google
            });
            await user.save();
        } else {
            // Update informasi user jika sudah ada
            user.name = name;
            user.profileImage = imageUrl;
            user.googleId = googleId;
            await user.save();
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat autentikasi Google',
            error: error.message 
        });
    }
});

module.exports = router;

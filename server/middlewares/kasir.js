const kasir = (req, res, next) => {
    if (req.user && (req.user.role === 'kasir' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ 
            message: 'Akses ditolak. Hanya kasir yang diizinkan.' 
        });
    }
};

module.exports = kasir;

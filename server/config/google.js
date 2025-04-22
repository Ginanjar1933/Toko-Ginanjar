require('dotenv').config();

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://toko-ginanjar-production.up.railway.app/api/auth/google/callback',
    responseType: 'json',
    scope: ['email', 'profile']
};

module.exports = googleConfig;

require('dotenv').config();

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    responseType: 'json',
    scope: ['email', 'profile']
};

module.exports = googleConfig;

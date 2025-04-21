import { API_CONFIG, fetchAPI } from './config.js';

const AuthAPI = {
    async register(userData) {
        // Validasi data sebelum dikirim
        if (!userData.username) {
            throw new Error('Username tidak boleh kosong');
        }

        // Debug log
        console.log('Attempting to register with data:', userData);

        try {
            // Pastikan format data sesuai dengan yang diharapkan server
            const requestData = {
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                role: 'customer'
            };

            const response = await fetchAPI('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Registrasi gagal');
        }
    },

    login: async (credentials) => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }

            throw new Error('Token tidak ditemukan');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        console.log('Melakukan logout'); // Debug
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login.html';
    },

    isAuthenticated() {
        const isAuth = localStorage.getItem('token') !== null;
        console.log('Status autentikasi:', isAuth); // Debug
        return isAuth;
    }
};

export default AuthAPI;

import AuthAPI from '../api/auth-api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        try {
            const response = await fetch(`${window.API_CONFIG.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password, role })
            });

            const data = await response.json();
            
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                window.showAlert('Login berhasil!', 'success');
                
                // Redirect berdasarkan role
                const redirectMap = {
                    'admin': '/html/admin/dashboard.html',
                    'kasir': '/html/kasir/dashboard.html',
                    'customer': '/html/home.html'  // Pastikan path ini benar
                };

                const redirectPath = redirectMap[role] || '/html/home.html';
                
                setTimeout(() => {
                    window.location.href = redirectPath;
                }, 1000);
            } else {
                throw new Error(data.message || 'Login gagal');
            }
        } catch (error) {
            console.error('Login error:', error);
            window.showAlert(error.message || 'Terjadi kesalahan saat login', 'error');
        }
    });

    // Tambahkan fungsi untuk memeriksa token yang sudah ada
    const checkExistingToken = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (token && user.role) {
            const redirectMap = {
                'admin': '/html/admin/dashboard.html',
                'kasir': '/html/kasir/dashboard.html',
                'customer': '/html/home.html'
            };
            window.location.href = redirectMap[user.role] || '/html/home.html';
        }
    };

    // Cek token saat halaman dimuat
    checkExistingToken();

    // Toggle password visibility
    const togglePassword = document.querySelector('.eye-icon');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('i').className = 
            `fas fa-eye${type === 'password' ? '' : '-slash'}`;
    });
});

window.handleGoogleLogin = async function() {
    try {
        // Implementasi Google OAuth akan ditambahkan di sini
        window.showAlert('Fitur login dengan Google akan segera hadir', 'info');
    } catch (error) {
        console.error('Google login error:', error);
        window.showAlert('Gagal login dengan Google', 'error');
    }
}

const CLIENT_ID = '457807159027-25ijsc4a61se4nr27vovj7aa2qlocu6l.apps.googleusercontent.com';
const API_BASE_URL = 'https://toko-ginanjar-production.up.railway.app'; // Tambahkan base URL

function handleCredentialResponse(response) {
    try {
        const responsePayload = jwt_decode(response.credential);
        console.log('Google user data:', responsePayload); // Debug info
        
        const userData = {
            email: responsePayload.email,
            name: responsePayload.name,
            imageUrl: responsePayload.picture,
            googleId: responsePayload.sub,
            token: response.credential
        };

        fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }
            return data;
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.showAlert('Login berhasil', 'success');
                window.location.href = '/html/home.html';
            } else {
                throw new Error('Token tidak ditemukan');
            }
        })
        .catch(error => {
            console.error('Google login error details:', error);
            window.showAlert('Gagal login dengan Google: ' + error.message, 'error');
        });
    } catch (error) {
        console.error('Error processing Google response:', error);
        window.showAlert('Gagal memproses response dari Google', 'error');
    }
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    // Tampilkan tombol Google Sign In
    google.accounts.id.renderButton(
        document.querySelector('.google-signin'),
        { 
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with'
        }
    );
};

// Hapus fungsi handleGoogleSignIn yang lama karena akan menggunakan button yang di-render Google
window.handleGoogleSignIn = function() {
    google.accounts.id.prompt();
};

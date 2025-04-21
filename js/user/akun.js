import UserAPI from '../api/pengguna-api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Cek status login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Handle logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.showAlert('Berhasil keluar', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    loadCartBadge(); // Add this line
    updateUserDisplay();
});

async function updateUserDisplay() {
    try {
        const user = await UserAPI.getUserProfile();
        const initial = user.name.charAt(0).toUpperCase();
        
        // Update navbar account display
        const accountIcon = document.querySelector('.account-display');
        accountIcon.innerHTML = `
            <div class="user-initial">${initial}</div>
            <span class="tooltip">${user.name}</span>
        `;

        // Update profile display
        document.getElementById('user-initial').textContent = initial;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-phone').textContent = user.phone || 'Belum ada nomor telepon';
        
        // Update form fields
        document.getElementById('fullname').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
    } catch (error) {
        window.showAlert('Gagal memuat profil: ' + error.message, 'error');
    }
}

// Handle form submission
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const userData = {
            name: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        
        await UserAPI.updateUserProfile(userData);
        await updateUserDisplay(); // Reload profile after update
        window.showAlert('Profil berhasil diperbarui', 'success');
        
    } catch (error) {
        window.showAlert('Gagal memperbarui profil: ' + error.message, 'error');
    }
});

async function loadCartBadge() {
    try {
        const response = await fetch(`${window.API_CONFIG.baseURL}/cart/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateCartBadge(data.items ? data.items.length : 0);
        }
    } catch (error) {
        console.error('Error loading cart badge:', error);
    }
}

function updateCartBadge(itemCount) {
    const cartLink = document.querySelector('a[href="keranjang.html"]');
    
    let badge = cartLink.querySelector('.cart-badge');
    if (!badge && itemCount > 0) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartLink.appendChild(badge);
    }
    
    if (badge) {
        if (itemCount > 0) {
            badge.textContent = itemCount;
        } else {
            badge.remove();
        }
    }
}

import { API_CONFIG } from './api/config.js';

// Alert Utility
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Cart Management
const cart = {
    items: [],
    async addItem(product, quantity = 1) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: product._id, quantity })
            });
            if (!response.ok) throw new Error('Failed to add item');
            return response.json();
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    },
    
    async getItems() {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to get items');
            return response.json();
        } catch (error) {
            console.error('Error getting items:', error);
            throw error;
        }
    }
};

// Navbar Management
function initializeNavbar() {
    // Update user display
    const updateUserDisplay = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const accountIcon = document.querySelector('.account-display');
        
        if (user && accountIcon) {
            const initial = user.name.charAt(0).toUpperCase();
            accountIcon.innerHTML = `
                <div class="user-initial">${initial}</div>
                <span class="tooltip">${user.name}</span>
            `;
        }
    };

    // Load cart badge
    const loadCartBadge = async () => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
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
    };

    // Update cart badge
    const updateCartBadge = (itemCount) => {
        const cartLink = document.querySelector('a[href="keranjang.html"]');
        if (!cartLink) return;
        
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
    };

    // Handle logout
    const logout = document.getElementById('logout');
    if (logout) {
        logout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showAlert('Berhasil keluar', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Initialize navbar components
    updateUserDisplay();
    loadCartBadge();
}

// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar for all pages
    initializeNavbar();
    
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export functions and objects
export { 
    showAlert, 
    cart,
    initializeNavbar 
};

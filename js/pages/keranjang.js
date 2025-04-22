document.addEventListener('DOMContentLoaded', () => {
    // Cek status login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Update tampilan user
    const updateUserDisplay = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const accountIcon = document.querySelector('.account-display');
        
        if (user) {
            const initial = user.name.charAt(0).toUpperCase();
            accountIcon.innerHTML = `
                <div class="user-initial">${initial}</div>
                <span class="tooltip">${user.name}</span>
            `;
        }
    };

    // Handle logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.showAlert('Berhasil keluar', 'success');
        
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    });

    updateUserDisplay();

    loadCartItems();
});

async function loadCartItems() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal memuat keranjang');
        }
        const data = await response.json();
        const cartItems = data.items || [];
        
        // Update badge keranjang
        updateCartBadge(cartItems.length);
        
        renderCartItems(cartItems);
        updateCartSummary(cartItems);
    } catch (error) {
        window.showAlert('Gagal memuat keranjang: ' + error.message, 'error');
    }
}

// Tambahkan fungsi update badge
function updateCartBadge(itemCount) {
    const cartLink = document.querySelector('a[href="keranjang.html"]');
    
    // Hapus badge lama jika ada
    const oldBadge = cartLink.querySelector('.cart-badge');
    if (oldBadge) oldBadge.remove();
    
    // Tambah badge baru jika ada item
    if (itemCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = itemCount;
        cartLink.appendChild(badge);
    }
}

function renderCartItems(items) {
    const cartContainer = document.querySelector('.cart-items');
    if (items.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja kosong</p>
                <a href="produk.html" class="btn-shop">Belanja Sekarang</a>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.product.image}" alt="${item.product.title}">
            </div>
            <div class="item-details">
                <h3>${item.product.title}</h3>
                <p class="item-price">Rp ${item.product.price.toLocaleString('id-ID')}</p>
                <div class="item-quantity">
                    <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})" 
                            ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})"
                            ${item.quantity >= item.product.stock ? 'disabled' : ''}>+</button>
                </div>
            </div>
            <button class="btn-remove" onclick="removeItem('${item.product._id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateCartSummary(items) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

// Fungsi untuk update quantity
window.updateQuantity = async function(productId, newQuantity) {
    try {
        if (newQuantity < 1) {
            window.showAlert('Jumlah minimal adalah 1', 'error');
            return;
        }

        const response = await fetch(`${API_CONFIG.baseURL}/cart/items/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal update keranjang');
        }

        loadCartItems();
        window.showAlert('Jumlah produk berhasil diubah', 'success');
    } catch (error) {
        window.showAlert('Gagal mengubah jumlah: ' + error.message, 'error');
    }
};

// Fungsi untuk menghapus item
window.removeItem = async function(productId) {
    try {
        const confirmDelete = confirm('Apakah Anda yakin ingin menghapus produk ini?');
        if (!confirmDelete) return;

        const response = await fetch(`${API_CONFIG.baseURL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal hapus item');
        }

        window.showAlert('Produk berhasil dihapus dari keranjang', 'success');
        loadCartItems();
    } catch (error) {
        window.showAlert('Gagal menghapus produk: ' + error.message, 'error');
    }
};

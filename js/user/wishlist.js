document.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
});

async function loadWishlist() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/user/wishlist`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const items = await response.json();
        renderWishlistItems(items);
    } catch (error) {
        showAlert('Gagal memuat wishlist', 'error');
    }
}

async function toggleWishlist(productId) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/user/wishlist/toggle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });
        
        if (response.ok) {
            loadWishlist(); // Refresh wishlist
        }
    } catch (error) {
        showAlert('Gagal memperbarui wishlist', 'error');
    }
}

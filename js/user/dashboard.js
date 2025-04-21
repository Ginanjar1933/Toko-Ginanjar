document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadRecentOrders();
    loadWishlistPreview();
});

async function loadDashboardStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/user/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const stats = await response.json();
        
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('pending-orders').textContent = stats.pendingOrders;
        document.getElementById('wishlist-count').textContent = stats.wishlistItems;
    } catch (error) {
        showAlert('Gagal memuat statistik', 'error');
    }
}

async function loadRecentOrders() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/user/orders/recent`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const orders = await response.json();
        renderRecentOrders(orders);
    } catch (error) {
        showAlert('Gagal memuat pesanan terbaru', 'error');
    }
}

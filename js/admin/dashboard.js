document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    initSalesChart();
    loadRecentOrders();

    // Tambahkan event listener untuk tombol logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Konfirmasi logout
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                try {
                    // Hapus data login
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Tampilkan pesan sukses
                    window.showAlert('Berhasil keluar dari sistem', 'success');
                    
                    // Redirect ke halaman login
                    setTimeout(() => {
                        window.location.replace('../../html/auth/login.html');
                    }, 1000);
                } catch (error) {
                    console.error('Logout error:', error);
                    window.showAlert('Gagal keluar dari sistem', 'error');
                }
            }
        });
    }
});

async function loadDashboardStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const stats = await response.json();
        
        document.getElementById('total-sales').textContent = formatCurrency(stats.totalSales);
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('total-users').textContent = stats.totalUsers;
    } catch (error) {
        showAlert('Gagal memuat statistik', 'error');
    }
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    // Implementasi Chart.js
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}

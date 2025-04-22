import { API_CONFIG, fetchAPI } from '../api/config.js';

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    initSalesChart();
    loadRecentOrders();

    // Handle logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Hapus data auth dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Tampilkan pesan sukses
        showAlert('Berhasil keluar', 'success');
        
        // Redirect ke halaman index dengan path yang benar
        setTimeout(() => {
            window.location.href = '/index.html';  // Perbaiki path
        }, 1000);
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

document.addEventListener('DOMContentLoaded', () => {
    loadTodayStats();
    loadRecentTransactions();

    // Event listener untuk tombol logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
});

async function loadTodayStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/kasir/today-stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const stats = await response.json();
        
        document.getElementById('today-transactions').textContent = stats.totalTransactions;
        document.getElementById('today-sales').textContent = formatCurrency(stats.totalSales);
        document.getElementById('average-transaction').textContent = formatCurrency(stats.averageTransaction);
    } catch (error) {
        showAlert('Gagal memuat statistik hari ini', 'error');
    }
}

async function loadRecentTransactions() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/kasir/recent-transactions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const transactions = await response.json();
        renderTransactionList(transactions);
    } catch (error) {
        showAlert('Gagal memuat transaksi terbaru', 'error');
    }
}

// Fungsi logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}

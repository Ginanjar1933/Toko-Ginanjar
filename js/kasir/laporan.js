document.addEventListener('DOMContentLoaded', () => {
    setupDateFilters();
    loadInitialReport();
});

async function loadReport(startDate, endDate) {
    try {
        const response = await fetch(
            `${CONFIG.API_URL}/kasir/reports?start=${startDate}&end=${endDate}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        const report = await response.json();
        
        document.getElementById('total-transactions').textContent = report.totalTransactions;
        document.getElementById('total-sales').textContent = formatCurrency(report.totalSales);
        
        renderTransactionTable(report.transactions);
        updateSalesChart(report.dailySales);
    } catch (error) {
        showAlert('Gagal memuat laporan', 'error');
    }
}

function renderTransactionTable(transactions) {
    const tableBody = document.getElementById('transactions-list');
    tableBody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.invoiceNumber}</td>
            <td>${formatCurrency(transaction.total)}</td>
            <td>${transaction.paymentMethod}</td>
            <td>${transaction.status}</td>
        </tr>
    `).join('');
}

function exportDailyReport() {
    // Implementasi export laporan harian
}

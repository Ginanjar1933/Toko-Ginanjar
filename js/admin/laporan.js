document.addEventListener('DOMContentLoaded', () => {
    initDatePickers();
    setupReportFilters();
});

async function generateReport(startDate, endDate) {
    try {
        const response = await fetch(
            `${CONFIG.API_URL}/admin/reports/sales?start=${startDate}&end=${endDate}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        const data = await response.json();
        renderSalesReport(data);
        updateCharts(data);
    } catch (error) {
        showAlert('Gagal memuat laporan', 'error');
    }
}

function exportPDF() {
    // Implementasi export PDF menggunakan library seperti jsPDF
}

function updateCharts(data) {
    // Implementasi update grafik menggunakan Chart.js
    const salesChart = new Chart(document.getElementById('salesChart'), {
        // Konfigurasi chart
    });
}

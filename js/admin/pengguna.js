document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupUserFilters();
});

async function loadUsers(page = 1, filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            ...filters
        });

        const response = await fetch(
            `${CONFIG.API_URL}/admin/users?${queryParams}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        const data = await response.json();
        renderUserTable(data.users);
        setupPagination(data.totalPages);
    } catch (error) {
        showAlert('Gagal memuat daftar pengguna', 'error');
    }
}

async function updateUserStatus(userId, status) {
    try {
        await fetch(`${CONFIG.API_URL}/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        loadUsers();
        showAlert('Status pengguna berhasil diperbarui', 'success');
    } catch (error) {
        showAlert('Gagal memperbarui status pengguna', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

async function loadCategories() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        showAlert('Gagal memuat kategori', 'error');
    }
}

async function addCategory(formData) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            loadCategories();
            closeModal();
            showAlert('Kategori berhasil ditambahkan', 'success');
        }
    } catch (error) {
        showAlert('Gagal menambah kategori', 'error');
    }
}

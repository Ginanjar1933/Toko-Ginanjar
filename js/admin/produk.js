import { API_CONFIG, fetchAPI } from '../api/config.js';
import ProductAPI from '../api/produk-api.js';
import { showAlert } from '../main.js';

async function loadProducts() {
    try {
        const products = await ProductAPI.getAll();
        renderProductTable(products);
    } catch (error) {
        showAlert('Gagal memuat produk: ' + error.message, 'error');
    }
}

function renderProductTable(products) {
    const tbody = document.getElementById('product-list');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.images[0] || '../../assets/images/produk/placeholder.jpg'}" 
                     alt="${product.name}" class="product-thumb">
            </td>
            <td>${product.name}</td>
            <td>${product.category.name}</td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct('${product._id}')" class="btn-edit">Edit</button>
                <button onclick="deleteProduct('${product._id}')" class="btn-delete">Hapus</button>
            </td>
        </tr>
    `).join('');
}

window.editProduct = function(id) {
    window.location.href = `edit-produk.html?id=${id}`;
};

window.deleteProduct = async function(id) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        try {
            await ProductAPI.delete(id);
            showAlert('Produk berhasil dihapus', 'success');
            loadProducts();
        } catch (error) {
            showAlert('Gagal menghapus produk: ' + error.message, 'error');
        }
    }
};

document.addEventListener('DOMContentLoaded', loadProducts);

import { API_CONFIG, fetchAPI } from '../api/config.js';
import ProductAPI from '../api/produk-api.js';


let currentPage = 1;
let currentCategory = '';
let currentSort = '';
let isLoading = false;
let allProducts = []; // Menyimpan semua produk

document.addEventListener('DOMContentLoaded', () => {
    // Cek status login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Update tampilan user
    const updateUserDisplay = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const accountIcon = document.querySelector('.account-display');
        
        if (user) {
            const initial = user.name.charAt(0).toUpperCase();
            accountIcon.innerHTML = `
                <div class="user-initial">${initial}</div>
                <span class="tooltip">${user.name}</span>
            `;
        }
    };

    // Handle logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        showAlert('Berhasil keluar', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    updateUserDisplay();
    loadProducts();
    setupFilters();
    loadCartBadge();
});

function calculateItemsPerPage() {
    const screenWidth = window.innerWidth;
    const gridGap = 32; // gap antar produk
    const cardMinWidth = 280; // lebar minimum card produk
    const gridPadding = 32; // padding grid container
    const availableWidth = screenWidth - (gridPadding * 2);
    const cardsPerRow = Math.floor(availableWidth / (cardMinWidth + gridGap));
    // Hitung jumlah produk yang sesuai untuk 2 baris
    return cardsPerRow * 2;
}

async function loadProducts() {
    try {
        if (isLoading) return;
        isLoading = true;

        const searchQuery = document.getElementById('search').value.trim().toLowerCase();
        const productGrid = document.querySelector('.product-grid');
        const itemsPerPage = calculateItemsPerPage();
        
        // Tampilkan loading
        productGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Memuat produk...</p>
            </div>`;

        // Ambil semua produk tanpa limit
        const response = await ProductAPI.getAll({ limit: 100 }); // Tambahkan limit yang lebih besar
        allProducts = response.products;

        // Filter produk
        let filteredProducts = allProducts.filter(product => {
            const matchQuery = searchQuery === '' || 
                product.title.toLowerCase().includes(searchQuery);
            const matchCategory = currentCategory === '' || 
                product.category.toLowerCase() === currentCategory.toLowerCase();
            return matchQuery && matchCategory;
        });

        // Sorting
        if (currentSort === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        // Paginasi dengan jumlah item yang responsif
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada produk yang ditemukan</p>
                    <p class="search-info">
                        ${searchQuery ? `Pencarian: "${searchQuery}"` : ''}
                        ${currentCategory ? `<br>Kategori: ${currentCategory}` : ''}
                    </p>
                    <button onclick="resetFilters()" class="btn-reset">
                        <i class="fas fa-redo"></i> Reset Pencarian
                    </button>
                </div>`;
        } else {
            renderProducts(paginatedProducts);
            setupPagination(Math.ceil(filteredProducts.length / itemsPerPage));
        }

    } catch (error) {
        showAlert('Gagal memuat produk: ' + error.message, 'error');
    } finally {
        isLoading = false;
    }
}

// Tambahkan fungsi addToCart ke window scope
window.addToCart = async function(productId) {
    try {
        // Cek login
        if (!localStorage.getItem('token')) {
            showAlert('Silakan login terlebih dahulu', 'error');
            return;
        }

        const product = allProducts.find(p => p._id === productId);
        if (!product) {
            showAlert('Produk tidak ditemukan', 'error');
            return;
        }

        // Cek stok
        if (product.stock <= 0) {
            showAlert('Stok produk habis', 'error');
            return;
        }

        // Tambah ke keranjang
        const cartData = {
            productId: productId,
            quantity: 1
        };

        await fetchAPI('/cart/items', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(cartData)
        });

        showAlert('Produk berhasil ditambahkan ke keranjang', 'success');

        // Update tampilan keranjang (opsional)
        updateCartCount();
        loadCartBadge();

    } catch (error) {
        showAlert('Gagal menambahkan ke keranjang: ' + error.message, 'error');
    }
}

// Fungsi untuk update jumlah item di keranjang
async function updateCartCount() {
    try {
        const response = await fetchAPI('/cart', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        // Update badge keranjang jika ada
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge && response.items) {
            cartBadge.textContent = response.items.length;
            cartBadge.style.display = response.items.length > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

async function loadCartBadge() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateCartBadge(data.items ? data.items.length : 0);
        }
    } catch (error) {
        console.error('Error loading cart badge:', error);
    }
}

function updateCartBadge(itemCount) {
    const cartLink = document.querySelector('a[href="keranjang.html"]');
    
    let badge = cartLink.querySelector('.cart-badge');
    if (!badge && itemCount > 0) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartLink.appendChild(badge);
    }
    
    if (badge) {
        if (itemCount > 0) {
            badge.textContent = itemCount;
        } else {
            badge.remove();
        }
    }
}

function renderProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || '../assets/images/produk/placeholder.jpg'}" alt="${product.title}">
                <div class="category-badge ${product.category.toLowerCase()}">
                    ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <div class="product-overlay">
                    <button onclick="window.location.href='detail-produk.html?id=${product._id}'" class="btn-detail">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}">
                    <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                </p>
                <button onclick="addToCart('${product._id}')" 
                        class="btn-add-cart" 
                        ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                    ${product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                </button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');

    // Reset filters
    window.resetFilters = function() {
        searchInput.value = '';
        categorySelect.value = '';
        sortSelect.value = 'newest';
        currentCategory = '';
        currentSort = '';
        currentPage = 1;
        loadProducts();
    };

    // Event untuk pencarian realtime
    searchInput.addEventListener('input', debounce(() => {
        currentPage = 1;
        loadProducts();
    }, 300));

    // Event untuk tombol search
    searchBtn.addEventListener('click', () => {
        currentPage = 1;
        loadProducts();
    });
    
    // Event untuk enter key pada input search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            currentPage = 1;
            loadProducts();
        }
    });

    // Tambahkan opsi kategori
    const categories = ['running', 'casual', 'sport'];
    categorySelect.innerHTML = `
        <option value="">Semua Kategori</option>
        ${categories.map(cat => `
            <option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        `).join('')}
    `;

    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;
        currentPage = 1;
        loadProducts();
    });

    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        loadProducts();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setupPagination(totalPages) {
    const paginationDiv = document.querySelector('.pagination');
    let paginationHTML = '';
    
    if (totalPages > 1) {
        // Tombol Previous
        paginationHTML += `
            <button 
                onclick="changePage(${currentPage - 1})" 
                class="page-btn" 
                ${currentPage === 1 ? 'disabled' : ''}
            >Previous</button>
        `;

        // Nomor Halaman
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button 
                    onclick="changePage(${i})" 
                    class="page-btn ${i === currentPage ? 'active' : ''}"
                >${i}</button>
            `;
        }

        // Tombol Next
        paginationHTML += `
            <button 
                onclick="changePage(${currentPage + 1})" 
                class="page-btn"
                ${currentPage === totalPages ? 'disabled' : ''}
            >Next</button>
        `;
    }

    paginationDiv.innerHTML = paginationHTML;
}

// Tambahkan fungsi changePage
window.changePage = function(page) {
    if (page >= 1) {
        currentPage = page;
        loadProducts();
    }
};

// Tambahkan event listener untuk resize window
window.addEventListener('resize', debounce(() => {
    if (!isLoading) {
        loadProducts();
    }
}, 250));

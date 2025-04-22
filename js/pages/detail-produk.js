import { API_CONFIG, fetchAPI } from '../api/config.js';

async function getProductDetail(productId) {
    try {
        const response = await fetchAPI(`/products/${productId}`);
        window.currentProduct = response; // Simpan untuk referensi global
        return response;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
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

function renderDescription(product) {
    const descriptionContent = `
        <div class="description-grid">
            <div class="desc-item features">
                <h3><i class="fas fa-tag"></i> Kategori</h3>
                <div class="category-info">
                    <span class="category-badge ${product.category.toLowerCase()}">
                        ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                </div>
            </div>
            <div class="desc-item features">
                <h3><i class="fas fa-star"></i> Fitur Utama</h3>
                <ul>
                    <li>Upper material berkualitas tinggi</li>
                    <li>Sol yang nyaman dan tahan lama</li>
                    <li>Desain modern dan stylish</li>
                    <li>Cocok untuk casual dan olahraga</li>
                </ul>
            </div>
            <div class="desc-item specifications">
                <h3><i class="fas fa-info-circle"></i> Spesifikasi</h3>
                <div class="spec-grid">
                    <div>Brand: Nike</div>
                    <div>Material: Premium</div>
                    <div>Gender: Unisex</div>
                    <div>Tipe: Sneakers</div>
                </div>
            </div>
            <div class="desc-item care">
                <h3><i class="fas fa-hand-sparkles"></i> Perawatan</h3>
                <ul>
                    <li>Bersihkan secara rutin</li>
                    <li>Hindari paparan air berlebih</li>
                    <li>Simpan di tempat kering</li>
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('product-description').innerHTML = descriptionContent;
}

function renderProductVariants(product) {
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = '';

    // Render warna dari server
    product.colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color.code;
        if (color.name.toLowerCase().includes('white')) {
            colorDiv.style.border = '1px solid #ccc';
        }
        colorDiv.dataset.color = color.name;
        colorDiv.dataset.image = color.images[0];
        colorDiv.title = color.name;
        
        colorDiv.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => 
                opt.classList.remove('selected'));
            colorDiv.classList.add('selected');
            document.getElementById('main-image').src = color.images[0];
            updateAvailableSizes(color.name);
            updateProductImages(color.images);
        });
        
        colorOptions.appendChild(colorDiv);
    });

    // Render ukuran dari server
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = product.sizes.map(size => {
        const stock = product.stock;
        return `
            <div class="size-option" data-size="${size}">
                <span class="size-number">${size}</span>
                <span class="size-stock">${stock} tersisa</span>
            </div>
        `;
    }).join('');

    // Event listeners untuk ukuran
    sizeOptions.querySelectorAll('.size-option').forEach(sizeDiv => {
        sizeDiv.addEventListener('click', () => {
            if (sizeDiv.classList.contains('out-of-stock')) return;
            
            sizeOptions.querySelectorAll('.size-option').forEach(opt => 
                opt.classList.remove('selected'));
            sizeDiv.classList.add('selected');
            
            const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
            updateStock(selectedColor, sizeDiv.dataset.size);
        });
    });

    // Set warna dan ukuran default
    if (product.colors.length > 0) {
        const defaultColor = colorOptions.firstChild;
        defaultColor.classList.add('selected');
        document.getElementById('main-image').src = product.colors[0].images[0];
        updateProductImages(product.colors[0].images);
        updateAvailableSizes(product.colors[0].name);
    }
}

function updateProductImages(images) {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    thumbnailContainer.innerHTML = images.map(img => `
        <div class="thumbnail" onclick="changeMainImage('${img}')">
            <img src="${img}" alt="Product thumbnail">
        </div>
    `).join('');
}

// Add this to window scope for thumbnail clicks
window.changeMainImage = function(imageSrc) {
    document.getElementById('main-image').src = imageSrc;
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
        if(thumb.querySelector('img').src === imageSrc) {
            thumb.classList.add('active');
        }
    });
};

function updateStock(color, size) {
    const stockElement = document.getElementById('product-stock');
    const stock = window.currentProduct.stock;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    stockElement.textContent = stock;
    document.getElementById('quantity').max = stock;
    
    const addToCartBtn = document.querySelector('.add-to-cart');
    const buyNowBtn = document.querySelector('.buy-now');
    
    // Validasi stok dan tombol
    if (stock <= 0) {
        addToCartBtn.disabled = true;
        buyNowBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="fas fa-times"></i> Stok Habis';
        buyNowBtn.innerHTML = '<i class="fas fa-times"></i> Stok Habis';
    } else {
        addToCartBtn.disabled = false;
        buyNowBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Tambah ke Keranjang';
        buyNowBtn.innerHTML = '<i class="fas fa-bolt"></i> Beli Sekarang';
    }
}

// Tambahkan event listener untuk quantity
document.getElementById('quantity').addEventListener('change', (e) => {
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
    
    if (selectedColor && selectedSize) {
        const stock = window.currentProduct.stock;
        const quantity = parseInt(e.target.value) || 1;
        
        if (quantity > stock) {
            e.target.value = stock;
            showAlert('Jumlah melebihi stok yang tersedia', 'warning');
        }
    }
});

// Tambahkan event handler untuk tombol aksi
document.querySelector('.add-to-cart').addEventListener('click', async () => {
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (!selectedColor || !selectedSize) {
        showAlert('Silakan pilih warna dan ukuran terlebih dahulu', 'warning');
        return;
    }
    
    const stock = window.currentProduct.stock;
    if (quantity > stock) {
        showAlert('Stok tidak mencukupi', 'error');
        return;
    }
    
    // Tambahkan ke keranjang
    const product = window.currentProduct;
    try {
        await addToCart(product._id, quantity);
        await loadCartBadge();
        showAlert('Produk berhasil ditambahkan ke keranjang', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

document.querySelector('.buy-now').addEventListener('click', () => {
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (!selectedColor || !selectedSize) {
        showAlert('Silakan pilih warna dan ukuran terlebih dahulu', 'warning');
        return;
    }
    
    const stock = window.currentProduct.stock;
    if (quantity > stock) {
        showAlert('Stok tidak mencukupi', 'error');
        return;
    }
    
    // Redirect ke checkout dengan data produk
    const product = window.currentProduct;
    const checkoutData = {
        productId: product._id,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = 'checkout.html';
});

async function addToCart(productId, quantity) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                quantity
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Gagal menambahkan ke keranjang');
        }

        // Update badge setelah berhasil menambah ke keranjang
        loadCartBadge();
        
    } catch (error) {
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Update user account display
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
            window.location.href = '/index.html';
        }, 1000);
    });

    updateUserDisplay();

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            window.location.href = 'produk.html';
            return;
        }

        const product = await getProductDetail(productId);
        
        if (product) {
            document.getElementById('main-image').src = product.image;
            document.getElementById('product-name').textContent = product.title;
            document.getElementById('product-price').textContent = 
                `Rp ${product.price.toLocaleString('id-ID')}`;
            document.getElementById('product-stock').textContent = product.stock;

            // Update tombol berdasarkan stok
            const addToCartBtn = document.querySelector('.add-to-cart');
            const buyNowBtn = document.querySelector('.buy-now');
            const quantityInput = document.getElementById('quantity');

            if (product.stock <= 0) {
                addToCartBtn.disabled = true;
                buyNowBtn.disabled = true;
                quantityInput.disabled = true;
                addToCartBtn.textContent = 'Stok Habis';
                buyNowBtn.textContent = 'Stok Habis';
            }

            quantityInput.max = product.stock;

            renderDescription(product);
            renderProductVariants(product);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Gagal memuat detail produk', 'error');
    }

    loadCartBadge();
});

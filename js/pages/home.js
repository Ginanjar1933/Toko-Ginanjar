import { API_CONFIG, fetchAPI } from '../api/config.js';
import ProductAPI from '../api/produk-api.js';
import AuthAPI from '../api/auth-api.js';

let products = []; // Add this global variable
let currentSlide = 0;
const itemsPerView = Math.floor(window.innerWidth / 300);
const itemWidth = 312; // 280px card width + 32px gap
let currentPosition = 0;

async function loadFeaturedProducts() {
    try {
        const data = await ProductAPI.getAll({ limit: 12 });
        products = data.products; // Store products in global variable
        renderFeaturedProducts(products);
        initializeProductSlider();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function initializeProductSlider() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const productGrid = document.querySelector('.product-grid');
    const totalProducts = document.querySelectorAll('.product-card').length;
    const containerWidth = document.querySelector('.product-slider').offsetWidth;
    const maxPosition = (totalProducts * itemWidth) - containerWidth;
    
    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition = Math.max(currentPosition - itemWidth, 0);
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPosition < maxPosition) {
            currentPosition = Math.min(currentPosition + itemWidth, maxPosition);
            updateSliderPosition();
        }
    });

    updateSliderButtons();
}

function updateSliderPosition() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.style.transform = `translateX(-${currentPosition}px)`;
    updateSliderButtons();
}

function updateSliderButtons() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const productGrid = document.querySelector('.product-grid');
    const containerWidth = document.querySelector('.product-slider').offsetWidth;
    const totalWidth = productGrid.scrollWidth;
    
    prevBtn.disabled = currentPosition <= 0;
    nextBtn.disabled = currentPosition >= totalWidth - containerWidth;
    
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
}

function renderFeaturedProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                <div class="category-badge ${product.category.toLowerCase()}">
                    ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <div class="product-actions">
                    <button onclick="window.location.href='../html/detail-produk.html?id=${product._id}'" class="btn-detail">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="rating">⭐ ${product.rating}</p>
                <p class="stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}">
                    <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                </p>
                <div class="card-buttons">
                    <button onclick="addToCart('${product._id}')" class="btn-add-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> ${product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlideIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }

    // Auto slide setiap 5 detik
    setInterval(nextSlide, 5000);
}

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
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

// Tambahkan fungsi addToCart ke window scope
window.addToCart = async function(productId) {
    try {
        // Cek login
        if (!localStorage.getItem('token')) {
            window.showAlert('Silakan login terlebih dahulu', 'error');
            return;
        }

        const product = products.find(p => p._id === productId);
        if (!product) {
            window.showAlert('Produk tidak ditemukan', 'error');
            return;
        }

        // Cek stok
        if (product.stock <= 0) {
            window.showAlert('Stok produk habis', 'error');
            return;
        }

        // Tambah ke keranjang
        const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            throw new Error('Gagal menambahkan ke keranjang');
        }

        window.showAlert('Produk berhasil ditambahkan ke keranjang', 'success');
        loadCartBadge(); // Update badge counter

    } catch (error) {
        window.showAlert('Gagal menambahkan ke keranjang: ' + error.message, 'error');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Update welcome message with user's name
    const updateWelcomeMessage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const usernameElements = [
            document.getElementById('username'),
            document.getElementById('username2'),
            document.getElementById('username3')
        ];
        
        if (user && user.name) {
            usernameElements.forEach(element => {
                if (element) element.textContent = user.name;
            });
        }
    };

    updateWelcomeMessage();
    initHeroSlider();
    loadFeaturedProducts();
    initializeProductSlider();
    handleScrollAnimations();
    loadCartBadge();

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

    updateUserDisplay();

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
            window.location.href = '../html/index.html';  // Perbaiki path
        }, 1000);
    });

    // Smooth scroll untuk link navigasi
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

import { API_CONFIG } from '../api/config.js';

// Tambahkan config ke window untuk akses global
window.API_CONFIG = API_CONFIG;

document.addEventListener('DOMContentLoaded', () => {
    // Cek status login
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    loadCheckoutSummary();
    setupFormValidation();
});

async function loadCheckoutSummary() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/cart/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Gagal memuat keranjang');
        
        const data = await response.json();
        const cartItems = data.items || [];
        
        const summary = document.querySelector('.summary-details');
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        summary.innerHTML = `
            <div class="checkout-items">
                ${cartItems.map(item => `
                    <div class="checkout-item">
                        <div class="item-image">
                            <img src="${item.product.image}" alt="${item.product.title}">
                        </div>
                        <div class="item-info">
                            <h4>${item.product.title}</h4>
                            <div class="item-details">
                                <span>Jumlah: ${item.quantity}</span>
                                <span class="item-price">Rp ${(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="checkout-summary">
                <div class="summary-row">
                    <span>Total Item:</span>
                    <span>${cartItems.reduce((sum, item) => sum + item.quantity, 0)} barang</span>
                </div>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>Rp ${totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div class="summary-row total">
                    <span>Total Pembayaran:</span>
                    <span>Rp ${totalPrice.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        window.showAlert('Gagal memuat data keranjang', 'error');
    }
}

function setupFormValidation() {
    const form = document.getElementById('shipping-form');
    form.addEventListener('submit', handleCheckoutSubmit);
}

const placeOrderButton = document.getElementById('place-order');

async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const alamat = document.getElementById('alamat').value.trim();
    const telepon = document.getElementById('telepon').value.trim();

    // Validasi form
    if (!nama || !alamat || !telepon) {
        window.showAlert('Mohon lengkapi data pengiriman', 'error');
        return;
    }

    // Validasi metode pembayaran
    if (!window.selectedPaymentMethod) {
        window.showAlert('Mohon pilih metode pembayaran', 'error');
        return;
    }

    try {
        placeOrderButton.disabled = true;
        placeOrderButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

        const response = await fetch(`${API_CONFIG.baseURL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shippingAddress: { nama, alamat, telepon },
                paymentMethod: window.selectedPaymentMethod
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Gagal membuat pesanan');
        }

        const orderData = await response.json();
        showPaymentReceipt(orderData);
        window.showAlert('Pesanan berhasil dibuat!', 'success');

        // Redirect setelah 5 detik
        setTimeout(() => {
            window.location.href = 'keranjang.html';
        }, 5000);

    } catch (error) {
        window.showAlert('Gagal membuat pesanan: ' + error.message, 'error');
        placeOrderButton.disabled = false;
        placeOrderButton.innerHTML = 'Buat Pesanan';
    }
}

// Tambahkan event listener untuk tombol buat pesanan
document.getElementById('place-order').addEventListener('click', () => {
    document.getElementById('shipping-form').requestSubmit();
});

function showPaymentReceipt(order) {
    const modal = document.createElement('div');
    modal.className = 'payment-receipt-modal';
    
    modal.innerHTML = `
        <div class="receipt-content">
            <h2><i class="fas fa-check-circle"></i> Pesanan Berhasil!</h2>
            <div class="order-details">
                <div class="order-info">
                    <p><strong>No. Pesanan:</strong> ${order._id}</p>
                    <p><strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}</p>
                    <p><strong>Total:</strong> Rp ${order.totalAmount.toLocaleString('id-ID')}</p>
                </div>
                <div class="payment-info">
                    <h3>Informasi Pembayaran</h3>
                    <p><strong>Metode:</strong> ${order.paymentMethod.type}</p>
                    <p><strong>Provider:</strong> ${order.paymentMethod.provider}</p>
                    <p><strong>No. Rekening/Akun:</strong> ${getPaymentAccount(order.paymentMethod)}</p>
                </div>
                <div class="shipping-info">
                    <h3>Informasi Pengiriman</h3>
                    <p><strong>Nama:</strong> ${order.shippingAddress.nama}</p>
                    <p><strong>Alamat:</strong> ${order.shippingAddress.alamat}</p>
                    <p><strong>Telepon:</strong> ${order.shippingAddress.telepon}</p>
                </div>
            </div>
            <div class="receipt-actions">
                <button onclick="window.location.href='keranjang.html'" class="btn-back">
                    <i class="fas fa-arrow-left"></i> Kembali ke Keranjang
                </button>
                <button onclick="window.location.href='home.html'" class="btn-shop">
                    <i class="fas fa-shopping-cart"></i> Lanjut Belanja
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function getPaymentAccount(paymentMethod) {
    if (paymentMethod.type === 'bank') {
        const bankAccounts = {
            'bca': '8690333777',
            'bni': '0350999777',
            'mandiri': '1440099777',
            'bri': '0334401000777'
        };
        return bankAccounts[paymentMethod.provider];
    } else {
        const walletAccounts = {
            'gopay': '0821-2762-9387',
            'ovo': '0821-2762-9387',
            'dana': '0821-2762-9387'
        };
        return walletAccounts[paymentMethod.provider];
    }
}

window.showPaymentOptions = function(method) {
    const bankOptions = document.getElementById('bank-options');
    const ewalletOptions = document.getElementById('ewallet-options');
    const paymentInfo = document.getElementById('selected-payment-info');
    
    bankOptions.style.display = 'none';
    ewalletOptions.style.display = 'none';
    paymentInfo.style.display = 'none';
    
    if (method === 'transfer') {
        bankOptions.style.display = 'block';
    } else if (method === 'ewallet') {
        ewalletOptions.style.display = 'block';
    }
}

window.selectBank = function(bank) {
    const items = document.querySelectorAll('#bank-options .payment-item');
    items.forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    const bankAccounts = {
        'bca': '8690333777',
        'bni': '0350999777',
        'mandiri': '1440099777',
        'bri': '0334401000777'
    };

    const paymentInfo = document.getElementById('selected-payment-info');
    paymentInfo.innerHTML = `
        <div class="selected-payment">
            <h4>Informasi Rekening</h4>
            <p>No. Rekening: ${bankAccounts[bank]}</p>
            <p>Atas Nama: TOKO GINANJAR</p>
            <small>Silahkan transfer sesuai jumlah tagihan</small>
        </div>
    `;
    paymentInfo.style.display = 'block';
    
    window.selectedPaymentMethod = { type: 'bank', provider: bank };
}

window.selectEwallet = function(wallet) {
    const items = document.querySelectorAll('#ewallet-options .payment-item');
    items.forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    const walletAccounts = {
        'gopay': '0821-2762-9387',
        'ovo': '0821-2762-9387',
        'dana': '0821-2762-9387'
    };

    const paymentInfo = document.getElementById('selected-payment-info');
    paymentInfo.innerHTML = `
        <div class="selected-payment">
            <h4>Informasi E-Wallet</h4>
            <p>Nomor: ${walletAccounts[wallet]}</p>
            <p>Atas Nama: TOKO GINANJAR</p>
            <small>Silahkan transfer sesuai jumlah tagihan</small>
        </div>
    `;
    paymentInfo.style.display = 'block';
    
    window.selectedPaymentMethod = { type: 'ewallet', provider: wallet };
}

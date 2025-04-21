document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch(`${window.API_CONFIG.baseURL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Gagal memuat pesanan');
        const data = await response.json();

        // Populate product details
        const orders = await Promise.all(data.map(async (order) => {
            const populatedItems = await Promise.all(order.items.map(async (item) => {
                const productResponse = await fetch(`${window.API_CONFIG.baseURL}/products/${item.product}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (productResponse.ok) {
                    const product = await productResponse.json();
                    return { ...item, product };
                }
                return item;
            }));
            return { ...order, items: populatedItems };
        }));

        renderOrders(orders);
    } catch (error) {
        console.error('Error:', error);
        window.showAlert('Gagal memuat pesanan: ' + error.message, 'error');
    }
}

function renderOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) {
        console.error('Elemen orders-list tidak ditemukan');
        return;
    }
    
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <p>Belum ada pesanan</p>
                <a href="produk.html" class="btn-shop">Mulai Belanja</a>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">Order #${order._id.slice(-6)}</span>
                    <span class="order-date">${new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                <span class="status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-image">
                            <img src="${item.product.image}" 
                                alt="${item.product.title}"
                                onerror="this.style.display='none'">
                        </div>
                        <div class="item-info">
                            <h4>${item.product.title}</h4>
                            <div class="item-details">
                                <span class="item-quantity">Jumlah: ${item.quantity}</span>
                                <span class="item-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-details">
                <div class="shipping-info">
                    <h4><i class="fas fa-shipping-fast"></i> Info Pengiriman</h4>
                    <p>${order.shippingAddress.nama}</p>
                    <p>${order.shippingAddress.alamat}</p>
                    <p>${order.shippingAddress.telepon}</p>
                </div>
                <div class="payment-info">
                    <h4><i class="fas fa-money-bill"></i> Pembayaran</h4>
                    <p>Metode: ${getPaymentMethodText(order.paymentMethod.type)}</p>
                    <p>Provider: ${order.paymentMethod.provider.toUpperCase()}</p>
                </div>
            </div>
            
            <div class="order-footer">
                <div class="total-amount">
                    <span>Total Pembayaran:</span>
                    <strong>Rp ${order.totalAmount.toLocaleString('id-ID')}</strong>
                </div>
                ${renderOrderActions(order)}
            </div>
        </div>
    `).join('');
}

function renderOrderItems(items) {
    return items.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.product.image}" alt="${item.product.title}">
            </div>
            <div class="item-info">
                <h4>${item.product.title}</h4>
                <p>Jumlah: ${item.quantity}</p>
                <p class="item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
            </div>
        </div>
    `).join('');
}

function getPaymentMethodText(type) {
    const methods = {
        'bank': 'Transfer Bank',
        'ewallet': 'E-Wallet',
        'cod': 'Cash on Delivery'
    };
    return methods[type] || type;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu Pembayaran',
        'paid': 'Sudah Dibayar',
        'shipped': 'Dikirim',
        'delivered': 'Diterima',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

function renderOrderActions(order) {
    if (order.status === 'pending') {
        return `
            <button class="btn-pay" onclick="showPaymentDetails('${order._id}')">
                <i class="fas fa-money-bill"></i> Bayar Sekarang
            </button>
        `;
    }
    return '';
}

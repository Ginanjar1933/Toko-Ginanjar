let currentCart = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeScanner();
    setupSearchProduct();
});

async function searchProduct(query) {
    try {
        const response = await fetch(
            `${CONFIG.API_URL}/kasir/products/search?q=${query}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        const products = await response.json();
        showSearchResults(products);
    } catch (error) {
        showAlert('Gagal mencari produk', 'error');
    }
}

function addToCart(product, quantity = 1) {
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        currentCart.push({ ...product, quantity });
    }
    
    updateCartDisplay();
    calculateTotal();
}

async function processPayment() {
    try {
        const paymentAmount = document.getElementById('payment-amount').value;
        const total = calculateTotal();
        
        if (paymentAmount < total) {
            showAlert('Pembayaran kurang', 'error');
            return;
        }

        const transaction = {
            items: currentCart,
            total: total,
            payment: parseFloat(paymentAmount),
            change: paymentAmount - total
        };

        const response = await fetch(`${CONFIG.API_URL}/kasir/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (response.ok) {
            printReceipt(transaction);
            resetCart();
            showAlert('Transaksi berhasil', 'success');
        }
    } catch (error) {
        showAlert('Gagal memproses pembayaran', 'error');
    }
}

const OrderAPI = {
    async create(orderData) {
        return fetchAPI('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    async getById(orderId) {
        return fetchAPI(`/orders/${orderId}`);
    },

    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return fetchAPI(`/orders?${queryString}`);
    },

    async cancel(orderId) {
        return fetchAPI(`/orders/${orderId}/cancel`, {
            method: 'POST'
        });
    },

    async confirmPayment(orderId, paymentData) {
        return fetchAPI(`/orders/${orderId}/payment`, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }
};

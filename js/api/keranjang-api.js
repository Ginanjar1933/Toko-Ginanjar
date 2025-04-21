const CartAPI = {
    async get() {
        return fetchAPI('/cart');
    },

    async addItem(productId, quantity) {
        return fetchAPI('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    },

    async updateItem(itemId, quantity) {
        return fetchAPI(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },

    async removeItem(itemId) {
        return fetchAPI(`/cart/items/${itemId}`, {
            method: 'DELETE'
        });
    },

    async clear() {
        return fetchAPI('/cart/clear', {
            method: 'POST'
        });
    }
};

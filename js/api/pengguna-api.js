import { fetchAPI } from './config.js';

const UserAPI = {
    async getUserProfile() {
        try {
            const response = await fetchAPI('/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateUserProfile(userData) {
        try {
            const response = await fetchAPI('/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getOrders() {
        return fetchAPI('/user/orders');
    },

    async getWishlist() {
        return fetchAPI('/user/wishlist');
    },

    async toggleWishlist(productId) {
        return fetchAPI('/user/wishlist/toggle', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
    }
};

export default UserAPI;

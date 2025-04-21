import { fetchAPI } from './config.js';

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductAPI = {
    async getAll(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.page) queryParams.append('page', params.page);
            if (params.category) queryParams.append('category', params.category);
            if (params.sort) queryParams.append('sort', JSON.stringify(params.sort));
            if (params.search) queryParams.append('search', params.search);

            const response = await fetchAPI(`/products?${queryParams.toString()}`);
            return response;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await fetchAPI(`/products/${id}`, {
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    async create(productData) {
        return fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    async update(id, productData) {
        return fetchAPI(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    async delete(id) {
        return fetchAPI(`/products/${id}`, {
            method: 'DELETE'
        });
    }
};

export default ProductAPI;

const CategoryAPI = {
    async getAll() {
        return fetchAPI('/categories');
    },

    async create(categoryData) {
        return fetchAPI('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    },

    async update(id, categoryData) {
        return fetchAPI(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    },

    async delete(id) {
        return fetchAPI(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
};

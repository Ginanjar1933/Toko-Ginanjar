export const API_CONFIG = {
    baseURL: 'http://localhost:5000/api'
};

export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Terjadi kesalahan server');
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Tidak dapat terhubung ke server');
        }
        throw error;
    }
}

// config/api.js or services/api-config.js

export const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:10000'
        : 'https://plant-dashboard-github-io.onrender.com',
    
    ENDPOINTS: {
        NEW_ACTIVITY: '/api/new-activity',
        STATUS: '/status',
        HEALTH: '/'
    }
};

// Helper function to build full URLs
export function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
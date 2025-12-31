// ============================================
// STORAGE.JS - Local/Session Storage Service
// ============================================

/**
 * Save to localStorage
 */
export function saveToLocal(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Load from localStorage
 */
export function loadFromLocal(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove from localStorage
 */
export function removeFromLocal(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Save to sessionStorage
 */
export function saveToSession(key, value) {
    try {
        const serialized = JSON.stringify(value);
        sessionStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
    }
}

/**
 * Load from sessionStorage
 */
export function loadFromSession(key, defaultValue = null) {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from sessionStorage:', error);
        return defaultValue;
    }
}

/**
 * Get user preferences
 */
export function getUserPreferences() {
    return loadFromLocal('userPreferences', {
        theme: 'light',
        notifications: true,
        language: 'en'
    });
}

/**
 * Save user preferences
 */
export function saveUserPreferences(preferences) {
    return saveToLocal('userPreferences', preferences);
}
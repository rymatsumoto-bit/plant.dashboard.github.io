// ============================================
// SETTINGS.JS - Settings View Logic
// ============================================

import { getApiUrl, API_CONFIG } from '../services/api.js';

/**
 * Initialize settings view
 */
export function initializeSettings() {
    console.log('Settings view initialized');
    
    // Load user preferences
    loadUserPreferences();
    
    // Setup settings forms
    setupSettingsForms();

    // Setup event listeners
    setupSettingsListeners();

}

/**
 * Load user preferences
 */
function loadUserPreferences() {
    // TODO: Load from localStorage/database
    console.log('Loading account preferences...');

}

/**
 * Setup settings forms
 */
function setupSettingsForms() {
    // TODO: Setup theme toggle
    // TODO: Setup notification preferences
    // TODO: Setup backup/export options
    console.log('Settings forms ready');
}

/**
 * Save user preferences
 */
export function savePreferences(preferences) {
    console.log('Saving preferences:', preferences);
    // TODO: Save to localStorage/database
}


/**
 * Setup settings view listeners
 */
function setupSettingsListeners() {

    // Daily Batch Button
    const dailyBatchBtn = document.getElementById('daily-batch-btn');
    if (dailyBatchBtn) {
        dailyBatchBtn.addEventListener('click', async () => {
            try {
                // Call Python backend to run daily batch
                const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MANUAL_DAILY_BATCH), {
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(errorData.detail || 'Failed to launch daily batch');
                }                
            } catch (error) {
                console.error('Error launching daily batch:', error);
                showNotification('Error launching daily batch', 'error');
            }
        });
    }

    console.log('Settings listeners ready');
}
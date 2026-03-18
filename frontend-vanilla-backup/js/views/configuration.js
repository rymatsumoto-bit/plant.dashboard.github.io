// ============================================
// CONFIGURATION.JS - Main Configuration Orchestrator
// ============================================

import { loadHTML, logError } from '../utils.js';
import { initHabitatManager } from './configuration/habitat-manager.js';
import { initAddressManager } from './configuration/address-manager.js';

let currentTab = 'habitat';

/**
 * Initialize configuration view
 */
export function initializeConfiguration() {
    console.log('Configuration view initialized');
    
    // Setup tab switching
    setupTabSwitching();
    
    // Load initial tab (habitat by default)
    loadTabContent('habitat');
}

/**
 * Setup tab switching functionality
 */
function setupTabSwitching() {
    // Make tab switch function globally available
    window.switchConfigTab = async (tabName) => {
        currentTab = tabName;
        
        // Update active tab button
        updateActiveTab(tabName);
        
        // Load tab content
        await loadTabContent(tabName);
    };
}

/**
 * Update active tab styling
 */
function updateActiveTab(tabName) {
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
}

/**
 * Load tab content HTML and initialize appropriate manager
 */
async function loadTabContent(tabName) {
    const container = document.getElementById('config-tab-content');
    
    try {
        // Show loading state
        showLoadingState(container, tabName);
        
        // Load the HTML content for this tab
        const html = await loadHTML(`components/configuration-tabs/${tabName}.html`);
        container.innerHTML = html;
        
        // Initialize the appropriate manager
        if (tabName === 'habitat') {
            await initHabitatManager();
        } else if (tabName === 'address') {
            await initAddressManager();
        }
        
    } catch (error) {
        logError(error, `loading tab content for ${tabName}`);
        showErrorState(container, tabName, error);
    }
}

/**
 * Show loading state
 */
function showLoadingState(container, tabName) {
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <span class="loading-text">Loading ${tabName}...</span>
        </div>
    `;
}

/**
 * Show error state
 */
function showErrorState(container, tabName, error) {
    container.innerHTML = `
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <div class="error-title">Error Loading Tab</div>
            <div class="error-message">
                Failed to load ${tabName} content.<br>
                ${error.message}
            </div>
            <div class="error-actions">
                <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
            </div>
        </div>
    `;
}

/**
 * Get current active tab
 */
export function getCurrentTab() {
    return currentTab;
}

// ============================================
// TOOLBAR.JS - Toolbar Component Logic
// ============================================

import { capitalize } from '../utils.js';

/**
 * Update toolbar title based on current view
 */
export function updateToolbarTitle(viewName) {
    const toolbarTitle = document.getElementById('toolbar-title');
    const toolbarTagline = document.getElementById('toolbar-tagline');
    
    if (!toolbarTitle) return;
    
    const viewTitles = {
        'dashboard': 'Dashboard',
        'reports': 'Reports',
        'inventory': 'Inventory',
        'configuration': 'Configuration',
        'settings': 'Settings'
    };
    
    const viewTaglines = {
        'dashboard': 'Your plant care overview',
        'reports': 'Analytics and insights',
        'inventory': 'Manage all your plants',
        'configuration': 'Manage habitat and environmental settings for your plants',
        'settings': 'Configure your Plant Hub preferences'
    };

    toolbarTitle.textContent = viewTitles[viewName] || capitalize(viewName);
    toolbarTagline.textContent = viewTaglines[viewName] || capitalize(viewName);
}
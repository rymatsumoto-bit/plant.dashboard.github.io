// ============================================
// BREADCRUMB.JS - Breadcrumb Navigation Component
// ============================================

import { capitalize } from '../utils.js';

let router = null;

/**
 * Initialize breadcrumb component
 */
export function initializeBreadcrumb(routerInstance) {
    router = routerInstance;
    
    // Setup home link click handler
    const breadcrumbHome = document.querySelector('.breadcrumb-item.home');
    if (breadcrumbHome) {
        breadcrumbHome.addEventListener('click', () => {
            router.loadView('dashboard');
            sessionStorage.setItem('currentView', 'dashboard');
        });
    }
}

/**
 * Update breadcrumb text based on current view
 */
export function updateBreadcrumb(viewName) {
    const breadcrumbCurrent = document.querySelector('.breadcrumb-item.current');
    
    if (!breadcrumbCurrent) return;
    
    const viewNames = {
        'dashboard': 'Dashboard',
        'reports': 'Reports',
        'inventory': 'Inventory',
        'configuration': 'Configuration',
        'settings': 'Settings'
    };
    
    breadcrumbCurrent.textContent = viewNames[viewName] || capitalize(viewName);
}

/**
 * Add breadcrumb level (for nested views like plant details)
 */
export function addBreadcrumbLevel(text, onClick) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    // Add separator
    const separator = document.createElement('span');
    separator.className = 'breadcrumb-separator';
    separator.textContent = '/';
    breadcrumb.appendChild(separator);
    
    // Add new level
    const item = document.createElement('span');
    item.className = 'breadcrumb-item current';
    item.textContent = text;
    if (onClick) {
        item.classList.add('clickable');
        item.addEventListener('click', onClick);
    }
    breadcrumb.appendChild(item);
}

/**
 * Reset breadcrumb to single level
 */
export function resetBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    // Keep only home, separator, and current
    const children = Array.from(breadcrumb.children);
    if (children.length > 3) {
        children.slice(3).forEach(child => child.remove());
    }
}
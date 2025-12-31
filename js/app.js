// ============================================
// APP.JS - Main Application Entry Point
// ============================================

import { Router } from './router.js';
import { initializeBreadcrumb } from './components/breadcrumb.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Plant Hub Dashboard initializing...');
    
    // Initialize router
    const router = new Router();
    router.init();
    
    // Initialize breadcrumb component
    initializeBreadcrumb(router);
    
    console.log('✅ Plant Hub Dashboard initialized successfully!');
});
// ============================================
// APP.JS - Main Application Entry Point
// ============================================

import { Router } from './router.js';
import { initializeBreadcrumb } from './components/breadcrumb.js';
import { openPromptModal } from './modals/prompt-modal.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Plant Hub Dashboard initializing...');
    
    // Make modal function globally available
    window.openPromptModal = openPromptModal;
    
    // Initialize router
    const router = new Router();
    router.init();
    
    // Initialize breadcrumb component
    initializeBreadcrumb(router);
    
    console.log('✅ Plant Hub Dashboard initialized successfully!');
});
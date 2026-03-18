// ============================================
// APP.JS - Main Application Entry Point
// ============================================

import { Router } from './router.js';
import { openModal } from './modals/prompt-modal.js';
import { getCurrentUser, signOut } from './services/supabase.js';
import { getUser, getUserDisplayName, clearUserCache } from './services/user.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌱 Plant Hub Dashboard initializing...');

    // Check if user is authenticated
    const user = await getCurrentUser();

    // Make modal function globally available
    window.openModal = openModal;

    // Load and display user info
    await initializeUser();

    // Initialize router
    const router = new Router();
    router.init();
    
    console.log('✅ Plant Hub Dashboard initialized successfully!');
});


/**
 * Initialize user display
 */
async function initializeUser() {
    try {
        const user = await getUser();
        
        if (user) {
            // Update user display
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            
            if (userName) {
                userName.textContent = await getUserDisplayName();
            }
            
            if (userEmail) {
                userEmail.textContent = user.email || '';
            }
            
            const userInfo = document.getElementById('user-info');
            userInfo.addEventListener('click', () => {
                handleUserSignOut();
            });
            console.log('✅ User loaded:', user.email);
        } else {
            // No user logged in - redirect to login page (future)
            console.warn('⚠️ No user logged in');
        }
    } catch (error) {
        console.error('❌ Error loading user:', error);
    }
}

/**
 * Handle user sign out
 */
async function handleUserSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        try {
            await signOut();
            clearUserCache();
            
            // Redirect to login page
            window.location.href = 'index.html'; // Or wherever your login page is
            
        } catch (error) {
            console.error('❌ Sign out error:', error);
            alert('Error signing out. Please try again.');
        }
    }
}

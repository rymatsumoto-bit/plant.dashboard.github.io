// ============================================
// USER.JS - User Session Management
// ============================================

import { getCurrentUser } from './supabase.js';

let cachedUser = null;

/**
 * Get current user (with caching)
 */
export async function getUser() {
    // Return cached user if available
    if (cachedUser) {
        return cachedUser;
    }
    
    // Check sessionStorage first
    const storedUser = sessionStorage.getItem('current_user');
    if (storedUser) {
        cachedUser = JSON.parse(storedUser);
        return cachedUser;
    }
    
    // Fetch from Supabase
    const user = await getCurrentUser();
    if (user) {
        cachedUser = user;
        sessionStorage.setItem('current_user', JSON.stringify(user));
    }
    
    return user;
}

/**
 * Clear user cache (on logout)
 */
export function clearUserCache() {
    cachedUser = null;
    sessionStorage.removeItem('current_user');
}

/**
 * Get user display name
 */
export async function getUserDisplayName() {
    const user = await getUser();
    if (!user) return 'Guest';
    
    // Try user_metadata.full_name, then email, then 'User'
    return user.user_metadata?.full_name || 
           user.email?.split('@')[0] || 
           'User';
}
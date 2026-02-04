// ============================================
// TOOLBAR.JS - Toolbar Component Logic
// ============================================

import { openNewActivityModal } from '../modals/new-activity.controller.js';
import { openNewWateringModal } from '../modals/activity/watering.controller.js';

/**
 * Initialize toolbar
 */
export function initializeToolbar() {
    console.log('Toolbar initialized');
    
    // Set up buttons event listeners
    setupButtons();
}

/**
 * Update toolbar title based on current view
 */
function setupButtons() {
    // New Activity button
    const newActivityBtn = document.getElementById('new-activity-btn');
    if (newActivityBtn) {
        newActivityBtn.addEventListener('click', async () => {
            openNewActivityModal();
        });
    }

    // New watering button
    const newWateringBtn = document.getElementById('new-activity-watering-btn');
    if (newWateringBtn) {
        newWateringBtn.addEventListener('click', async () => {
            openNewWateringModal();
        });
    }
}
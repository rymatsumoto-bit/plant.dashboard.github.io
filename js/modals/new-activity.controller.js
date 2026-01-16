// ============================================
// NEW-ACTIVITY.CONTROLLER.JS - new-activity modal logic
// ============================================

import { openModal, populateDropdown } from '../modals/prompt-modal.js';
import { getActivityTypes, getActivePlants, addPlantActivity } from '../services/supabase.js';
import { showNotification } from '../utils.js';

export async function openNewActivityModal() {

    // Open modal first
    const modal = await openModal({
        title: 'Log New Activity',
        contentUrl: 'components/modals/new-activity.html',
        size: 'medium',
        buttons: [
            { label: 'LOG ACTIVITY', type: 'primary', action: 'submit' },
            { label: 'CANCEL', type: 'secondary', action: 'close' }
        ],
        onSubmit: async (data, modal) => {
            try {
                await addPlantActivity(data);
                showNotification('Activity logged successfully!', 'success');
                modal.querySelector('[data-action="close"]').click();
                this.loadView(this.currentView);
            } catch (error) {
                console.error('Error logging activity:', error);
                showNotification('Failed to log activity', 'error');
            }
        }
    });

    await populateForm(modal);
}

async function populateForm(modal) {
    try {
    // Fetch data from Supabase
    const [activityTypes, plants] = await Promise.all([
        getActivityTypes(),
        getActivePlants()
    ]);
    
    // Populate dropdowns
    populateDropdown('activity-type', activityTypes, 'activity_type_code', 'activity_label');
    populateDropdown('plant-select', plants, 'plant_id', 'full_plant_name');
    
    // Set today's date as default
    const dateInput = modal.querySelector('#activity-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    }
    catch (error) {
        console.error('Error loading form data:', error);
        showNotification('Error loading form data', 'error');
    }
}

console.log('openModal function:', typeof openModal);

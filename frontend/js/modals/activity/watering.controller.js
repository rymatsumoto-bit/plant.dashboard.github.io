// ============================================
// NEW-ACTIVITY.CONTROLLER.JS - new-activity modal logic
// ============================================

import { openModal, populateDropdown } from '../prompt-modal.js';
import { getActivePlants, addPlantActivity } from '../../services/supabase.js';
import { showNotification } from '../../utils.js';
import { getApiUrl, API_CONFIG } from '../../services/api.js';

export async function openNewWateringModal() {

    // Open modal first
    const modal = await openModal({
        title: 'Log New Watering',
        contentUrl: 'components/modals/activity/watering.html',
        size: 'medium',
        buttons: [
            { label: 'LOG ACTIVITY', type: 'primary', action: 'submit' },
            { label: 'CANCEL', type: 'secondary', action: 'close' }
        ],
        onSubmit: async (data, modal) => {
            try {
                // Prepare activity data
                const activityData = {
                    plant_id: data.plant_id,
                    activity_type_code: 'watering',
                    activity_date: data.activity_date,
                    notes: data.notes || null,
                    quantifier: data.quantifier || null
                };

                console.log('Activity data to save:', activityData);

                // STEP 1: Save activity to Supabase first
                await addPlantActivity(activityData);
                
                // STEP 2: Call Python backend to trigger calculations
                const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.NEW_ACTIVITY), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(activityData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to process activity');
                }

                const result = await response.json();
                console.log('Python backend response:', result);
                
                showNotification('Activity logged successfully!', 'success');
                modal.querySelector('[data-action="close"]').click();
                
                // Reload view if available
                if (this.loadView) {
                    this.loadView(this.currentView);
                }
                
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
        const [plants] = await Promise.all([
            getActivePlants()
        ]);
        
        // Populate dropdowns
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
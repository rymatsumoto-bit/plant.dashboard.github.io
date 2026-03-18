// ============================================
// PLANT-DETAILS.JS - Plant Detail Loader
// ============================================

import { getRouterInstance } from '../../router.js';
import { getPlantDetails, getPlantActivity } from '../../services/supabase.js';
import { logError, capitalize } from '../../utils.js';

let plantDetails = [];
let plantActivity = [];

/**
 * Initialize plant detail view
 */
export async function initializePlantDetail(plantId) {
    try {
        
        plantDetails = await getPlantDetails(plantId);
        plantActivity = await getPlantActivity(plantId);
        console.log('Plant details view initialized');
        
        // Load plant details
        loadPlantDetails();
        
        // Load plant activity history
        loadPlantActivity();

        // Setup event listeners
        const backBtn = document.getElementById('plant-detail-back-btn')
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                const router = getRouterInstance();
                // This triggers the full view loading logic in your Router class
                router.loadView('inventory');
            });
        }

    }  catch (error) {
            logError(error, 'loading plant details');
        }
}

/**
 * Load plant details
 */

function loadPlantDetails() {
    const plantDetailName = document.getElementById('plant-detail-name');
    const plantDetailCategory = document.getElementById('plant-detail-category');
    const plantDetailSpecies = document.getElementById('plant-detail-species');
    const plantDetailAcquisitionDate = document.getElementById('plant-detail-acquisition-date');
    const plantDetailSource = document.getElementById('plant-detail-source');
    const plantDetailHabitat = document.getElementById('plant-detail-habitat');

    plantDetailName.textContent = capitalize(plantDetails.plant_name);
    plantDetailCategory.textContent = capitalize(plantDetails.plant_category);
    plantDetailSpecies.textContent = capitalize(plantDetails.species);
    plantDetailAcquisitionDate.textContent = capitalize(plantDetails.acquisition_date);
    plantDetailSource.textContent = capitalize(plantDetails.source);
    plantDetailHabitat.textContent = capitalize(plantDetails.habitat);

}

/**
 * Load plant details
 */

function loadPlantActivity() {
    const plantDetailActivityList = document.getElementById('plant-detail-activity-rows');
    
    if (!plantDetailActivityList) {
        console.warn('plant-detail-activity element not found');
        return;
    }
    
    if (plantActivity.length === 0) {
        plantDetailActivityList.innerHTML = '<li class="empty-state">No activity.</li>';
        return;
    }
    
    // Load table
    plantDetailActivityList.innerHTML = plantActivity.map((activity, index) => `
        <div class="table-activity-row" data-plant-id="${activity.plant_id}">
            <div>${activity.activity_date}</div>
            <div class="table-activity-type-badge" style="background: ${activity.background_color}">${activity.activity_label}</div>
            <div>${activity.quantifier}</div>
            <div>${activity.unit}</div>
            <div>${activity.notes}</div>
            <div>${activity.result}</div>
        </div>
    `).join('');
}
// ============================================
// PLANT-DETAILS.JS - Plant Detail Loader
// ============================================

import { getPlantDetails } from '../../services/supabase.js';
import { loadHTML, logError, capitalize } from '../../utils.js';

let plantDetails = [];

/**
 * Initialize plant detail view
 */
export async function initializePlantDetail(plantId) {
    try {
        
        plantDetails = await getPlantDetails(plantId);
        console.log('Plant details view initialized');
        
        // Load plant inventory
        loadPlantDetails();
        
        // Setup event listeners
        //setupPlantDetailListeners();

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
    const plantDetailHabitat = document.getElementById('plant-detail-habitat');

    plantDetailName.textContent = capitalize(plantDetails.plant_name);
    plantDetailCategory.textContent = capitalize(plantDetails.plant_category);
    plantDetailSpecies.textContent = capitalize(plantDetails.species);
    plantDetailHabitat.textContent = capitalize(plantDetails.habitat);

}
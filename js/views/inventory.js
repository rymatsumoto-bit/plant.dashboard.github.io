// ============================================
// INVENTORY.JS - Inventory View Logic
// ============================================

import { loadHTML, logError } from '../utils.js';
import { getPlantInventory } from '../services/supabase.js';

let plants = [];

/**
 * Initialize inventory view
 */
export async function initializeInventory() {
    try {
        
        plants = await getPlantInventory();
        console.log('Inventory view initialized');
        
        // Load plant inventory
        loadPlantInventory();
        
        // Setup filters
        setupInventoryFilters();
    }  catch (error) {
            logError(error, 'loading inventory');
        }
}


/**
 * Load plant inventory
 */
function loadPlantInventory() {
    const plantList = document.getElementById('plant-inventory-table');
    
    if (!plantList) {
        console.warn('plant-inventory-table element not found');
        return;
    }
    
    if (plants.length === 0) {
        plantList.innerHTML = '<li class="empty-state">No plants.</li>';
        return;
    }
    
    plantList.innerHTML = plants.map((plant, index) => `
        <div class="table-row">
            <div class="plant-name-cell">
                <div class="plant-name-icon">🌿</div>
                <div class="plant-name-text">
                    <div class="name">${plant.plant_name}</div>
                    <div class="species">${plant.species}</div>
                </div>
            </div>
            <div>Living Room</div>
            <div><span class="status-icon">😎</span></div>
            <div>12 January 2026</div>
            <div class="menu-dots">⋯</div>
        </div>
    `).join('');
}





/**
 * Setup inventory filters
 */
function setupInventoryFilters() {
    // TODO: Setup location filter
    // TODO: Setup status filter
    // TODO: Setup search
    console.log('Inventory filters ready');
}

/**
 * Filter plants by criteria
 */
export function filterPlants(criteria) {
    console.log('Filtering plants:', criteria);
    // TODO: Implement filtering logic
}


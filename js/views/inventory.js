// ============================================
// INVENTORY.JS - Inventory View Logic
// ============================================

import { loadHTML, logError, formatDate } from '../utils.js';
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
    const plantList = document.getElementById('plant-inventory-rows');
    
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
                    <div class="name">${plant.plant_name || 'Unnamed Plant'}</div>
                    <div class="species">${plant.species || 'Unknown Species'}</div>
                </div>
            </div>
            <div>${plant.habitat || 'Habitat unknown'}</div>
            <div><span class="status-icon">${plant.status_icon || '❓'}</span>
                <div class="tooltip-text">${plant.status_label || 'unknown'}</div>
            </div>
            <div class="plant-name-cell">
                <div class="plant-name-text">
                    <div class="name">${formatDate(plant.last_activity_date) || 'no activity'}</div>
                    <div class="species">${plant.last_activity_label || '-'}</div>
                </div>
            </div>
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


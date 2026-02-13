// ============================================
// INVENTORY.JS - Inventory View Logic
// ============================================

import { loadHTML, logError, formatDate } from '../utils.js';
import { openModal, populateDropdown } from '../modals/prompt-modal.js';
import { getPlantInventory, getPlantTypes, getHabitats } from '../services/supabase.js';
import { addPlant } from '../services/supabase.js';
import { getDataMetrics } from '../services/data-metrics.js';
import { initializePlantDetail } from './inventory/plant-details.js';
import { showNotification, capitalize } from '../utils.js';

let plants = [];
let dataMetrics = [];

/**
 * Initialize inventory view
 */
export async function initializeInventory() {
    try {
        
        plants = await getPlantInventory();
        dataMetrics = await getDataMetrics();
        console.log('Inventory view initialized');
        
        // Load plant inventory
        loadPlantInventory();
        
        // Setup filters
        setupInventoryFilters();

        // Setup event listeners
        setupInventoryListeners();

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
    
    // Get KPIs
    document.getElementById('kpi-plant-count').textContent = dataMetrics.plant_active_total_count;
    document.getElementById('kpi-plant-healthy-perc').textContent = `${dataMetrics.plant_healthy_percentage}%`;
    document.getElementById('kpi-schedule-count').textContent = dataMetrics.alert_total_count;

    plantList.innerHTML = plants.map((plant, index) => `
        <div class="table-row" data-plant-id="${plant.plant_id}">
            <div class="plant-name-cell">
                <div class="plant-name-icon">
                    <img
                        src="${`assets/images/icons/plants/${plant.plant_icon}.svg`}" alt="${plant.plant_icon || 'plant'}" class="plant-icon-svg"
                        onerror="this.onerror=null; this.src='assets/images/icons/plants/default.svg';"
                    />
                </div>
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
            <div class="plant-detail-btn">
                <img src="assets/images/icons/nav-detail.svg" alt="detail">
            </div>
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

/**
 * Setup inventory view listeners
 */
function setupInventoryListeners() {

    // New Plant Button
    const newPlantBtn = document.getElementById('new-plant-btn');
    if (newPlantBtn) {
        newPlantBtn.addEventListener('click', async () => {
            // Open modal first
            const modal = await openModal({
                title: 'Create New Plant',
                contentUrl: 'components/modals/new-plant.html',
                size: 'medium',
                buttons: [
                    { label: 'SAVE', type: 'primary', action: 'submit' },
                    { label: 'CANCEL', type: 'secondary', action: 'close' }
                ],
                onSubmit: async (data, modal) => {
                    try {
                        await addPlant(data);
                        showNotification('Plant created successfully!', 'success');
                        plants = await getPlantInventory();
                        loadPlantInventory();
                        modal.querySelector('[data-action="close"]').click();
                    } catch (error) {
                        console.error('Error logging activity:', error);
                        showNotification('Failed to log activity', 'error');
                    }
                }
            });
            
            // After modal opens, load dropdown data
            try {
                // Fetch data from Supabase
                const [plantTypes, habitats] = await Promise.all([
                    getPlantTypes(),
                    getHabitats()
                ]);
                
                // Populate dropdowns
                populateDropdown('plant-type', plantTypes, 'plant_type_id', 'plant_type');
                populateDropdown('habitat-select', habitats, 'habitat_id', 'habitat_name');
                
                // Set today's date as default
                const dateInput = modal.querySelector('#acquisition-date');
                if (dateInput) {
                    dateInput.valueAsDate = new Date();
                }
                
            } catch (error) {
                console.error('Error loading form data:', error);
                showNotification('Error loading form data', 'error');
            }
        });
    }

    // Plant Detail Button
    const detailButtons = document.querySelectorAll('.plant-detail-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('.table-row');
            if (!row) return;
            const plantId = row.dataset.plantId;
            navigateToPlantDetail(plantId);
        });
    });

    console.log('Inventory filters ready');
}

/**
 * Navigate to plant detail view
 */
async function navigateToPlantDetail(plantId) {
    console.log('Navigating to plant detail:', plantId);

    try {
        const response = await fetch('components/inventory/plant-detail.html');

        if (!response.ok) {
            throw new Error('Failed to load plant detail view');
        }

        const html = await response.text();

        const container = document.getElementById('view-container');
        container.innerHTML = html;

        initializePlantDetail(plantId);

    } catch (error) {
        console.error('Error loading plant detail:', error);
        showNotification('Failed to load plant details', 'error');
    }
}

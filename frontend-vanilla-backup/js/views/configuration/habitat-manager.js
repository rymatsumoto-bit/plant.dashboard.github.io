// ============================================
// HABITAT-MANAGER.JS - View Logic
// ============================================

import { 
    getHabitats, 
    getHabitatById,
    getHabitatLightArtificial,
    getHabitatLightWindow,
    getHabitatLightOutdoor,
    getHumidityLevel
} from '../../services/supabase.js';

import { showNotification, logError } from '../../utils.js';
import { showLoadingState, showErrorState } from './shared-utils.js';

// ----------------------------
// Module-level state
// ----------------------------
let habitats = [];
let currentHabitatId = null;

/**
 * Entry point for Habitat view
 */
export async function initHabitatManager() {
    try {
        showLoadingState('habitat-list');

        habitats = await getHabitats();
        renderHabitatList();

        if (habitats.length > 0) {
            await loadHabitatDetails(habitats[0].habitat_id);
        } else {
            showEmptyState();
        }

    } catch (error) {
        logError(error, 'loading habitats');
        showErrorState('habitat-list', error);
    }
}

/**
 * Render habitat list (LEFT PANEL)
 */
function renderHabitatList() {
    const habitatList = document.getElementById('habitat-list');

    if (!habitatList) {
        console.warn('habitat-list element not found');
        return;
    }


    if (habitats.length === 0) {
        habitatList.innerHTML = '<li class="empty-state">No habitats configured yet.</li>';
        return;
    }

    habitatList.innerHTML = habitats.map((habitat, index) => `
        <li class="habitat-item ${index === 0 ? 'active' : ''}"
            data-habitat-id="${habitat.habitat_id}">
            <div>
                <div class="habitat-name">${habitat.habitat_name}</div>
                <div class="habitat-info">Loading details...</div>
            </div>
        </li>
    `).join('');

    attachHabitatListEvents();
}

/**
 * Click handling for habitat list
 */
function attachHabitatListEvents() {
    const habitatList = document.getElementById('habitat-list');
    if (!habitatList) return;

    habitatList.addEventListener('click', (event) => {
        const item = event.target.closest('.habitat-item');
        if (!item) return;

        loadHabitatDetails(item.dataset.habitatId);
    });
}

/**
 * Load and display habitat details (RIGHT PANEL)
 */
async function loadHabitatDetails(habitatId) {
    try {
        currentHabitatId = habitatId;

        // Update active state
        document.querySelectorAll('.habitat-item').forEach(item => {
            item.classList.toggle(
                'active',
                item.dataset.habitatId === habitatId
            );
        });
        
        // Show loading in form area
        showFormLoading();

        // Fetch all habitat data
        const habitat = await getHabitatById(habitatId);
        const humidityLevel = await getHumidityLevel(habitat.humidity_level_id);
        const lightArtificial = await getHabitatLightArtificial(habitatId);
        const lightWindow = await getHabitatLightWindow(habitatId);
        const lightOutdoor = await getHabitatLightOutdoor(habitatId);
        
        // Update habitat info in list
        updateHabitatListInfo(habitatId, {
            artificial: lightArtificial,
            window: lightWindow,
            outdoor: lightOutdoor
        });

        // Render form with data
        renderHabitatForm(
            habitat,
            humidityLevel,
            { artificial: lightArtificial, window: lightWindow, outdoor: lightOutdoor }
        );

        attachHabitatFormActions();

    } catch (error) {
        logError(error, `loading habitat ${habitatId}`);
        showNotification('Error loading habitat details', 'error');
    }
}

/**
 * Update info text under habitat name in list
 */
function updateHabitatListInfo(habitatId, lights) {
    const habitatItem = document.querySelector(`[data-habitat-id="${habitatId}"]`);
    if (!habitatItem) return;

    const infoElement = habitatItem.querySelector('.habitat-info');
    const lightTypes = [];

    if (lights.artificial && lights.artificial.length > 0) {
        lightTypes.push('Artificial light');
    }
    if (lights.window && lights.window.length > 0) {
        lightTypes.push('Window');
    }
    if (lights.outdoor && lights.outdoor.length > 0) {
        lightTypes.push('Outdoor');
    }

    infoElement.textContent = lightTypes.length
        ? lightTypes.join(' • ')
        : 'No light sources configured';
}

/**
 * Render habitat form fields
 */
function renderHabitatForm(habitat, humidityLevel, lights) {
    document.getElementById('habitat-name').value = habitat.habitat_name || '';

    if (habitat.temperature_controlled) {
        document.getElementById('temp-controlled').checked = true;
        document.getElementById('temp-details').style.display = 'block';
        document.getElementById('temp-min').value = habitat.temp_min || '';
        document.getElementById('temp-max').value = habitat.temp_max || '';
        document.getElementById('temp-avg').value = habitat.temp_avg || '';
    } else {
        document.getElementById('temp-uncontrolled').checked = true;
        document.getElementById('temp-details').style.display = 'none';
    }

    document.getElementById('appliance-ac').checked = habitat.appliance_ac || false;
    document.getElementById('appliance-heater').checked = habitat.appliance_heater || false;
    document.getElementById('appliance-fan').checked = habitat.appliance_fan || false;
    document.getElementById('appliance-humidifier').checked = habitat.appliance_humidifier || false;

    renderLightSources(lights);
}


/**
 * Render all light sources (unchanged)
 */
function renderLightSources(lights) {
    const container = document.getElementById('all-lights-list');

    if (!container) {
        console.warn('all-lights-list element not found');
        return;
    }

    let html = '';

    // Render artificial lights
    if (lights.artificial && lights.artificial.length > 0) {
        lights.artificial.forEach(light => {
            const startTime = light.start_time || 'Not set';
            const endTime = light.end_time || 'Not set';
            const strength = light.light_artificial_strength?.light_artificial_strength || 'Unknown';
            
            html += `
                <div class="habitat-light-item">
                    <div class="habitat-light-item-header">
                        <div>
                            <span class="habitat-light-item-title">${light.light_name || 'Unnamed Light'}</span>
                            <span style="font-size: 0.85em; color: var(--text-light); margin-left: 10px;">(Artificial Light)</span>
                        </div>
                        <div>
                            <button type="button" class="btn btn-small btn-delete" 
                                    onclick="window.deleteLight('${light.light_artificial_id}', 'artificial')">
                                Delete
                            </button>
                        </div>
                    </div>
                    <div class="habitat-light-item-details">
                        Strength: ${strength}<br>
                        Schedule: ${startTime} - ${endTime}
                    </div>
                </div>
            `;
        });
    }

    // Render window lights
    if (lights.window && lights.window.length > 0) {
        lights.window.forEach(light => {
            const direction = light.direction_code || 'Unknown';
            const size = light.window_size?.window_size || 'Unknown';
            const addressName = light.address?.address_name || 'Location not set';
            
            html += `
                <div class="habitat-light-item">
                    <div class="habitat-light-item-header">
                        <div>
                            <span class="habitat-light-item-title">${light.light_name || 'Unnamed Window'}</span>
                            <span style="font-size: 0.85em; color: var(--text-light); margin-left: 10px;">(Window)</span>
                        </div>
                        <div>
                            <button type="button" class="btn btn-small btn-delete" 
                                    onclick="window.deleteLight('${light.light_window_id}', 'window')">
                                Delete
                            </button>
                        </div>
                    </div>
                    <div class="habitat-light-item-details">
                        Direction: ${direction}<br>
                        Size: ${size}<br>
                        Location: ${addressName}
                    </div>
                </div>
            `;
        });
    }
    
    // Render outdoor lights
    if (lights.outdoor && lights.outdoor.length > 0) {
        lights.outdoor.forEach(light => {
            const directions = Array.isArray(light.direction) 
                ? light.direction.join(', ') 
                : 'Unknown';
            
            html += `
                <div class="habitat-light-item">
                    <div class="habitat-light-item-header">
                        <div>
                            <span class="habitat-light-item-title">${light.light_name || 'Unnamed Outdoor Area'}</span>
                            <span style="font-size: 0.85em; color: var(--text-light); margin-left: 10px;">(Outdoor)</span>
                        </div>
                        <div>
                            <button type="button" class="btn btn-small btn-delete" 
                                    onclick="window.deleteLight('${light.light_outdoor_id}', 'outdoor')">
                                Delete
                            </button>
                        </div>
                    </div>
                    <div class="habitat-light-item-details">
                        Exposure: ${directions}
                    </div>
                </div>
            `;
        });
    }
    
    // If no lights at all
    if (html === '') {
        html = '<div class="empty-state">No light sources configured yet.</div>';
    }
    
    container.innerHTML = html;
}

/**
 * UI helpers
 */
function showFormLoading() {
    console.log('Loading habitat details...');
}

function showEmptyState() {
    const habitatList = document.getElementById('habitat-list');
    if (!habitatList) return;

    habitatList.innerHTML = `
        <li class="empty-state">
            No habitats configured yet.
        </li>
    `;
}


/**
 * Listens to EDIT / DELETE buttons in form header
 */
function attachHabitatFormActions() {
  const editBtn = document.getElementById('habitat-edit-btn');
  const deleteBtn = document.getElementById('habitat-delete-btn');

  if (!editBtn || !deleteBtn) return;

  editBtn.addEventListener('click', () => {
    if (!currentHabitatId) return;
    editHabitat(currentHabitatId);
  });

  deleteBtn.addEventListener('click', () => {
    if (!currentHabitatId) return;
    deleteHabitat(currentHabitatId);
  });
}

/**
 * Placeholder functions for future implementation
 */
function editHabitat(habitatId) {
    console.log('Edit habitat:', habitatId);
    showNotification('Edit habitat feature coming soon', 'info');
}

function deleteHabitat(habitatId) {
    console.log('Delete habitat:', habitatId);
    showNotification('Delete habitat feature coming soon', 'info');
}

function editLight(lightId, type) {
    console.log('Edit light:', lightId, type);
    showNotification('Edit light feature coming soon', 'info');
}

function deleteLight(lightId, type) {
    console.log('Delete light:', lightId, type);
    showNotification('Delete light feature coming soon', 'info');
}

/**
 * Save configuration
 */
export function saveConfiguration(data) {
    console.log('Saving configuration:', data);
    showNotification('Save feature coming soon', 'info');
}


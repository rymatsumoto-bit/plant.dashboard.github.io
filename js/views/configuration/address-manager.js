// ============================================
// CONFIGURATION.JS - Configuration View Logic
// ============================================

import { 
    getAddressById,
    getAddresses
} from '../../services/supabase.js';
import { showNotification, logError } from '../../utils.js';
import { showLoadingState, showErrorState } from './shared-utils.js';

// Store loaded data
let addresses = [];
let currentAddressId = null;


/**
 * Load addresses data
 */
export async function initAddressManager() {
    try {
        showLoadingState('address-list');
        
        // Load all addresses
        addresses = await getAddresses();
        console.log('Loaded addresses:', addresses);
        
        // Render address list
        renderAddressList();
        
        // If we have addresses, load the first one
        if (addresses.length > 0) {
            await loadAddressDetails(addresses[0].address_id);
        } else {
            showEmptyStateAddress();
        }
        
    } catch (error) {
        logError(error, 'loading addresses');
        showErrorState('address-list', error);
    }
}

/**
 * Load and display address details
 */
async function loadAddressDetails(addressId) {
    try {
        currentAddressId = addressId;
        
        // Update active state in list
        document.querySelectorAll('[data-address-id]').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.addressId === addressId) {
                item.classList.add('active');
            }
        });
        
        // Fetch address data
        const address = await getAddressById(addressId);
        
        // Render form with data
        renderAddressForm(address);
        
    } catch (error) {
        logError(error, `loading address ${addressId}`);
        showNotification('Error loading address details', 'error');
    }
}


/**
 * Render address list in left panel
 */
function renderAddressList() {
    const addressList = document.getElementById('address-list');
    
    if (!addressList) {
        console.warn('address-list element not found');
        return;
    }
    
    if (addresses.length === 0) {
        addressList.innerHTML = '<li class="empty-state">No addresses configured yet.</li>';
        return;
    }
    
    addressList.innerHTML = addresses.map((address, index) => `
        <li class="habitat-item ${index === 0 ? 'active' : ''}" 
            data-address-id="${address.address_id}"
            onclick="window.loadAddressDetails('${address.address_id}')">
            <div>
                <div class="habitat-name">${address.address_name}</div>
                <div class="habitat-info">${address.city}, ${address.state_province || address.country}</div>
            </div>
        </li>
    `).join('');
}

/**
 * Render address form with data
 */
function renderAddressForm(address) {
    document.getElementById('address-name').value = address.address_name || '';
    document.getElementById('postal-code').value = address.postal_code || '';
    document.getElementById('city').value = address.city || '';
    document.getElementById('state-province').value = address.state_province || '';
    document.getElementById('country').value = address.country || '';
    document.getElementById('latitude').value = address.latitude || '';
    document.getElementById('longitude').value = address.longitude || '';
    document.getElementById('timezone').value = address.timezone || '';
}


/**
 * Setup configuration forms
 */
function setupConfigurationForms() {
    // Make functions globally available for onclick handlers
    window.loadAddressDetails = loadAddressDetails;
    window.editAddress = editAddress;
    window.deleteAddress = deleteAddress;
    
    console.log('Configuration forms ready');
}


/**
 * Show empty state for addresses
 */
function showEmptyStateAddress() {
    const addressList = document.getElementById('address-list');
    if (addressList) {
        addressList.innerHTML = `
            <li class="empty-state">
                No addresses configured yet.<br>
                <button class="btn btn-small btn-primary" 
                        style="margin-top: var(--spacing-md);" 
                        onclick="window.showNewAddressForm()">
                    + CREATE ADDRESS
                </button>
            </li>
        `;
    }
}


/**
 * Placeholder functions for future implementation
 */


function editAddress(addressId) {
    console.log('Edit address:', addressId);
    showNotification('Edit address feature coming soon', 'info');
}

function deleteAddress(addressId) {
    console.log('Delete address:', addressId);
    showNotification('Delete address feature coming soon', 'info');
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



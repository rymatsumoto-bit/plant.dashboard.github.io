// ============================================
// DASHBOARD.JS - Dashboard View Logic
// ============================================

import { getDataMetrics } from '../services/data-metrics.js';
import { getAlertsActive } from '../services/supabase.js';
import { logError } from '../utils.js';

let dataMetrics = [];
let dataAlerts = [];

/**
 * Initialize dashboard view
 */
export async function initializeDashboard() {
    try {
        
        dataMetrics = await getDataMetrics();
        dataAlerts = await getAlertsActive();
        console.log('Dashboard view initialized');
        
        // Load dashboard data
        loadKPIs();
        
        // Load list of alerts
        loadAlertsList();

    } catch (error) {
        logError(error, 'initializing Dashboard view');
    }

    console.log('Dashboard view initialized');
}

/**
 * Load dashboard data
 */
function loadKPIs() {

    // Get KPIs
    document.getElementById('kpi-plant-count').textContent = dataMetrics.plant_active_total_count;
    document.getElementById('kpi-plant-healthy-perc').textContent = `${dataMetrics.plant_healthy_percentage}%`;
    document.getElementById('kpi-alerts-count').textContent = dataMetrics.alert_total_count;

    console.log('Loading dashboard data...');
}

/**
 * Render Alerts List
 */
function loadAlertsList() {
    const alertsList = document.getElementById('dashboard-alerts-list');

    if (!alertsList) {
        alertsList.warn('dashboard-alert-list element not found');
        return;
    }

    if (dataAlerts.length === 0) {
        alertsList.innerHTML = '<div class="empty-state">NO ALERTS</div>';
        return;
    }

    alertsList.innerHTML = dataAlerts.map((data) => `
        <div data-alert-id="${data.alert_id}" class="dash-alert-item">
            <div class="dash-alert-plant">
                <div class="dash-alert-plant-icon" severity="${data.alert_severity}"></div>
                <div class="dash-alert-plant-info">
                    <div class="name">${data.plant_name}</div>
                    <div class="date">${data.target_date}</div>
                </div>
            </div>
            <div class="dash-alert-badge" alert-label="${data.alert_label}">${data.alert_label}</div>
        </div>
    `).join('');

    attachAlertsListListeners();

}


/**
 * Setup event listeners for Alerts List
 */
function attachAlertsListListeners() {
    const alertItem = document.querySelectorAll('.dash-alert-item');
    alertItem.forEach(item => {
        item.addEventListener('click', (e) => {
            const row = e.target.closest('.dash-alert-item');
            if (!row) return;
            const alertId = row.dataset.alertId
            console.log(alertId);
        // FUNCTION THAT WILL BE TRIGGERED WHEN CLICKING ON AN ALERT
        })
    });
    console.log('Dashboard event listeners ready');
}

/**
 * Show loading state
 */
function showLoadingState(container) {
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <span class="loading-text">Loading...</span>
        </div>
    `;
}
// ============================================
// DASHBOARD.JS - Dashboard View Logic
// ============================================

import { getDataMetrics } from '../services/data-metrics.js';
import { showNotification } from '../utils.js';

let dataMetrics = [];

/**
 * Initialize dashboard view
 */
export async function initializeDashboard() {
    try {
        
        dataMetrics = await getDataMetrics();
        console.log('Dashboard view initialized');
        
        // Load dashboard data
        loadDashboardData();
        
        // Setup event listeners
        setupDashboardEventListeners();

    }  catch (error) {
            logError(error, 'initializing Dashboard view');
        }

    console.log('Dashboard view initialized');
}

/**
 * Load dashboard data
 */
function loadDashboardData() {

    // Get KPIs
    document.getElementById('kpi-plant-count').textContent = dataMetrics.plant_active_total_count;
    document.getElementById('kpi-plant-healthy-perc').textContent = `${dataMetrics.plant_healthy_percentage}%`;
    document.getElementById('kpi-alerts-count').textContent = dataMetrics.alert_total_count;

    console.log('Loading dashboard data...');
}

/**
 * Setup dashboard event listeners
 */
function setupDashboardEventListeners() {
    // TODO: Setup alert action buttons
    // TODO: Setup quick action buttons
    console.log('Dashboard event listeners ready');
}

/**
 * Handle snooze alert action
 */
export function handleSnooze(plantId, actionType) {
    console.log(`Snoozing ${actionType} for plant ${plantId}`);
    showNotification(`Alert snoozed for 3 days`, 'info');
    // TODO: Implement snooze logic
}

/**
 * Handle mark as done action
 */
export function handleMarkAsDone(plantId, actionType) {
    console.log(`Marking ${actionType} as done for plant ${plantId}`);
    showNotification(`${actionType} marked as complete`, 'success');
    // TODO: Implement mark as done logic
}

/**
 * Refresh dashboard data
 */
export function refreshDashboard() {
    console.log('Refreshing dashboard...');
    loadDashboardData();
}
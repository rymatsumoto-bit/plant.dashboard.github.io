// ============================================
// DASHBOARD.JS - Dashboard View Logic
// ============================================

import { getDataMetrics } from '../services/data-metrics.js';
import { getScheduleActive } from '../services/supabase.js';
import { logError } from '../utils.js';

let dataMetrics = [];
let dataSchedule = [];

/**
 * Initialize dashboard view
 */
export async function initializeDashboard() {
    try {
        
        dataMetrics = await getDataMetrics();
        dataSchedule = await getScheduleActive();
        console.log('Dashboard view initialized');
        
        // Load dashboard data
        loadKPIs();
        
        // Load list of schedule items
        loadScheduleList();

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
    document.getElementById('kpi-schedule-count').textContent = dataMetrics.schedule_total_count;

    console.log('Loading dashboard data...');
}

/**
 * Render Schedule List
 */
function loadScheduleList() {
    const scheduleList = document.getElementById('dashboard-schedule-list');

    if (!scheduleList) {
        scheduleList.warn('dashboard-schedule-list element not found');
        return;
    }

    if (dataSchedule.length === 0) {
        scheduleList.innerHTML = '<div class="empty-state">NO ITEMS</div>';
        return;
    }

    scheduleList.innerHTML = dataSchedule.map((data) => `
        <div data-schedule-id="${data.schedule_id}" class="dash-schedule-item">
            <div class="dash-schedule-plant">
                <div class="dash-schedule-plant-icon" severity="${data.schedule_severity}"></div>
                <div class="dash-schedule-plant-info">
                    <div class="name">${data.plant_name}</div>
                    <div class="date">${data.schedule_date}</div>
                </div>
            </div>
            <div class="dash-schedule-badge" schedule-label="${data.schedule_label}">${data.schedule_label}</div>
        </div>
    `).join('');

    attachScheduleListListeners();

}


/**
 * Setup event listeners for Schedule List
 */
function attachScheduleListListeners() {
    const scheduleItem = document.querySelectorAll('.dash-schedule-item');
    scheduleItem.forEach(item => {
        item.addEventListener('click', (e) => {
            const row = e.target.closest('.dash-schedule-item');
            if (!row) return;
            const scheduleId = row.dataset.scheduleId
            console.log(scheduleId);
        // FUNCTION THAT WILL BE TRIGGERED WHEN CLICKING ON AN SCHEDULE ITEM
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
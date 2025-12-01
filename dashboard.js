// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://dciowholtqcpgzpryush.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Mzg2MDQsImV4cCI6MjA4MDExNDYwNH0.UdNGgOT_mpDrFQXjQp7XB6F0Bbdn-eGJi9mcjz-ZnIw';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// GLOBAL DATA STORAGE
// ============================================
let plants = [];
let locations = {};

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

// Load all data from Supabase
async function loadAllData() {
    try {
        // Load plants with care status
        const { data: plantsData, error: plantsError } = await supabase
            .from('plant_care_status')
            .select('*')
            .order('nickname');
        
        if (plantsError) throw plantsError;
        
        // Transform data to match our existing structure
        plants = plantsData.map(p => ({
            id: p.plant_id,
            scientificName: p.scientific_name,
            commonName: p.common_name,
            nickname: p.nickname,
            location: p.location_name,
            acquisitionDate: p.acquisition_date,
            lastWatered: p.last_watered,
            lastFertilized: p.last_fertilized,
            wateringFrequency: p.watering_frequency,
            wateringSnoozedUntil: p.watering_snoozed_until,
            fertilizingSnoozedUntil: p.fertilizing_snoozed_until,
            status: calculatePlantStatus(p)
        }));
        
        // Load locations
        const { data: locationsData, error: locationsError } = await supabase
            .from('locations')
            .select('*');
        
        if (locationsError) throw locationsError;
        
        // Transform locations data
        locationsData.forEach(loc => {
            const lightingSources = [];
            
            if (loc.north_window_exposure > 0) {
                lightingSources.push(`North window ${loc.north_window_exposure}%, ${loc.north_window_intensity}`);
            }
            if (loc.south_window_exposure > 0) {
                lightingSources.push(`South window ${loc.south_window_exposure}%, ${loc.south_window_intensity}`);
            }
            if (loc.east_window_exposure > 0) {
                lightingSources.push(`East window ${loc.east_window_exposure}%, ${loc.east_window_intensity}`);
            }
            if (loc.west_window_exposure > 0) {
                lightingSources.push(`West window ${loc.west_window_exposure}%, ${loc.west_window_intensity}`);
            }
            if (loc.grow_lights_exposure > 0) {
                lightingSources.push(`Grow lights ${loc.grow_lights_exposure}%, ${loc.grow_lights_intensity}`);
            }
            
            locations[loc.location_name] = {
                lighting: lightingSources.join('; ') || 'No lighting configured',
                humidity: loc.humidity_range || 'Not set',
                temperature: loc.temperature_range || 'Not set'
            };
        });
        
        console.log('Data loaded successfully:', plants.length, 'plants');
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data from database. Check console for details.');
    }
}

// Calculate plant status based on care dates
function calculatePlantStatus(plantData) {
    const daysWatered = plantData.days_since_watered || 0;
    const daysFertilized = plantData.days_since_fertilized || 0;
    
    // Check if snoozed
    const wateringSnoozed = plantData.watering_snoozed_until && new Date(plantData.watering_snoozed_until) >= new Date();
    const fertilizingSnoozed = plantData.fertilizing_snoozed_until && new Date(plantData.fertilizing_snoozed_until) >= new Date();
    
    const waterOverdue = !wateringSnoozed && daysWatered > plantData.watering_frequency;
    const fertilizeOverdue = !fertilizingSnoozed && daysFertilized > 60;
    
    return (waterOverdue || fertilizeOverdue) ? 'attention' : 'good';
}

// ============================================
// SNOOZE FUNCTIONALITY
// ============================================

async function snoozeAlert(plantId, actionType) {
    try {
        const plant = plants.find(p => p.id === plantId);
        
        // Calculate snooze until date (3 days from now)
        const snoozeUntil = new Date();
        snoozeUntil.setDate(snoozeUntil.getDate() + 3);
        const snoozeUntilStr = snoozeUntil.toISOString().split('T')[0];
        
        // Insert snooze record
        const { data, error } = await supabase
            .from('plant_snoozes')
            .insert({
                plant_id: plantId,
                snooze_type: actionType,
                snoozed_until: snoozeUntilStr
            });
        
        if (error) throw error;
        
        alert(`Snoozed ${actionType} reminder for ${plant.nickname} until ${snoozeUntilStr}`);
        
        // Reload data and refresh view
        await loadAllData();
        renderAttentionDashboard();
        
    } catch (error) {
        console.error('Error snoozing alert:', error);
        alert('Error snoozing alert. Check console for details.');
    }
}

// ============================================
// MARK AS DONE FUNCTIONALITY
// ============================================

async function markAsDone(plantId, actionType) {
    try {
        const plant = plants.find(p => p.id === plantId);
        const today = new Date().toISOString().split('T')[0];
        
        // Insert care action into database
        const { data, error } = await supabase
            .from('care_actions')
            .insert({
                plant_id: plantId,
                action_type: actionType === 'watering' ? 'Watered' : 'Fertilized',
                action_date: today
            });
        
        if (error) throw error;
        
        alert(`Marked ${plant.nickname} as ${actionType === 'watering' ? 'watered' : 'fertilized'}!`);
        
        // Reload data and refresh view
        await loadAllData();
        renderAttentionDashboard();
        
    } catch (error) {
        console.error('Error marking as done:', error);
        alert('Error updating plant care. Check console for details.');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Calculate days since last action
function daysSince(dateString) {
    if (!dateString) return 999;
    const today = new Date();
    const lastDate = new Date(dateString);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Calculate average fertilizing frequency
function calcFertilizingFreq(lastFertilized) {
    const days = daysSince(lastFertilized);
    return Math.round(days / 2);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

// Render attention dashboard
function renderAttentionDashboard() {
    const alertList = document.getElementById('alert-list');
    alertList.innerHTML = '';
    
    const plantsNeedingAttention = plants.filter(p => p.status === 'attention').map(plant => {
        const daysWatered = daysSince(plant.lastWatered);
        const daysFertilized = daysSince(plant.lastFertilized);
        
        // Check if snoozed
        const wateringSnoozed = plant.wateringSnoozedUntil && new Date(plant.wateringSnoozedUntil) >= new Date();
        const fertilizingSnoozed = plant.fertilizingSnoozedUntil && new Date(plant.fertilizingSnoozedUntil) >= new Date();
        
        const waterOverdue = !wateringSnoozed && daysWatered > plant.wateringFrequency;
        const fertilizeOverdue = !fertilizingSnoozed && daysFertilized > 60;
        
        return {
            plant,
            daysWatered,
            daysFertilized,
            waterOverdue,
            fertilizeOverdue,
            wateringSnoozed,
            fertilizingSnoozed,
            priority: waterOverdue ? daysWatered - plant.wateringFrequency : 0
        };
    }).filter(item => item.waterOverdue || item.fertilizeOverdue)
      .sort((a, b) => b.priority - a.priority);
    
    if (plantsNeedingAttention.length === 0) {
        alertList.innerHTML = '<p style="color: #5a5a5a; text-align: center; padding: 40px;">🎉 All plants are happy! No attention needed right now.</p>';
        return;
    }
    
    plantsNeedingAttention.forEach(item => {
        let reason = '';
        let daysText = '';
        let className = 'alert-item';
        
        if (item.waterOverdue) {
            const overdueDays = item.daysWatered - item.plant.wateringFrequency;
            reason = 'watering';
            daysText = `${overdueDays} days overdue`;
            className = 'alert-item';
        } else if (item.fertilizeOverdue) {
            reason = 'fertilizing';
            daysText = `${item.daysFertilized} days since last fertilized`;
            className = 'alert-item warning';
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = className;
        alertDiv.innerHTML = `
            <div class="alert-info">
                <div class="alert-plant-name">${item.plant.nickname}</div>
                <div class="alert-reason">${item.plant.nickname} needs attention because of ${reason}</div>
            </div>
            <div class="alert-days ${item.waterOverdue ? '' : 'warning'}">${daysText}</div>
            <div class="alert-actions">
                <button class="alert-btn snooze" onclick="snoozeAlert('${item.plant.id}', '${reason}'); event.stopPropagation();">Snooze 3 Days</button>
                <button class="alert-btn done" onclick="markAsDone('${item.plant.id}', '${reason}'); event.stopPropagation();">Done</button>
                <button class="alert-btn details" onclick="showPlantDetail('${item.plant.id}'); event.stopPropagation();">Details</button>
            </div>
        `;
        alertList.appendChild(alertDiv);
    });
}

// Render all plants grid
function renderAllPlants() {
    const grid = document.getElementById('plants-grid');
    grid.innerHTML = '';
    
    plants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.onclick = () => showPlantDetail(plant.id);
        
        card.innerHTML = `
            <div class="plant-icon">🪴</div>
            <div class="plant-nickname">${plant.nickname}</div>
            <span class="plant-status ${plant.status === 'good' ? 'good' : 'attention'}">
                ${plant.status === 'good' ? 'All Good' : 'Needs Attention'}
            </span>
        `;
        grid.appendChild(card);
    });
}

// Show plant detail
function showPlantDetail(plantId) {
    const plant = plants.find(p => p.id === plantId);
    const detailContent = document.getElementById('plant-detail-content');
    const location = locations[plant.location];
    
    const daysWatered = daysSince(plant.lastWatered);
    const daysFertilized = daysSince(plant.lastFertilized);
    const avgFertFreq = calcFertilizingFreq(plant.lastFertilized);
    
    // Load last 5 actions from database
    supabase
        .from('care_actions')
        .select('*')
        .eq('plant_id', plantId)
        .order('action_date', { ascending: false })
        .limit(5)
        .then(({ data: actions, error }) => {
            if (error) {
                console.error('Error loading actions:', error);
                return;
            }
            
            detailContent.innerHTML = `
                <h2 style="color: #401d0f; margin-bottom: 30px;">${plant.nickname}</h2>
                
                <div class="detail-section">
                    <h3>Profile Information</h3>
                    <div class="detail-row">
                        <div class="detail-label">Scientific Name:</div>
                        <div class="detail-value">${plant.scientificName || 'Not set'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Common Name:</div>
                        <div class="detail-value">${plant.commonName || 'Not set'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Nickname:</div>
                        <div class="detail-value">${plant.nickname}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">${plant.location || 'Not set'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Acquisition Date:</div>
                        <div class="detail-value">${plant.acquisitionDate || 'Not set'}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Location Details</h3>
                    <div class="detail-row">
                        <div class="detail-label">Lighting:</div>
                        <div class="detail-value">${location ? location.lighting : 'Not available'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Humidity:</div>
                        <div class="detail-value">${location ? location.humidity : 'Not available'}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Temperature:</div>
                        <div class="detail-value">${location ? location.temperature : 'Not available'}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Care Status</h3>
                    <div class="detail-row">
                        <div class="detail-label">Days Since Watered:</div>
                        <div class="detail-value">${daysWatered} days</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Days Since Fertilized:</div>
                        <div class="detail-value">${daysFertilized} days</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Avg Fertilizing Frequency:</div>
                        <div class="detail-value">Every ${avgFertFreq} days</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Last 5 Actions</h3>
                    <ul class="action-log">
                        ${actions.map(action => `
                            <li class="action-item">
                                <span class="action-type">${action.action_type}</span>
                                <span class="action-date">${action.action_date}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
    
    showView('detail');
}

// ============================================
// NAVIGATION
// ============================================

function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    if (viewName === 'attention') {
        document.getElementById('attention-view').classList.remove('hidden');
        document.querySelector('[data-view="attention"]').classList.add('active');
        renderAttentionDashboard();
    } else if (viewName === 'all-plants') {
        document.getElementById('all-plants-view').classList.remove('hidden');
        document.querySelector('[data-view="all-plants"]').classList.add('active');
        renderAllPlants();
    } else if (viewName === 'detail') {
        document.getElementById('detail-view').classList.remove('hidden');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            showView(item.dataset.view);
        });
    });
});

// ============================================
// INITIALIZATION
// ============================================

async function initializeApp() {
    try {
        await loadAllData();
        renderAttentionDashboard();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error connecting to database. Check console for details.');
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
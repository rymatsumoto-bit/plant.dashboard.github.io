// ============================================
// SETTINGS.JS - Settings View Logic
// ============================================

/**
 * Initialize settings view
 */
export function initializeSettings() {
    console.log('Settings view initialized');
    
    // Load user preferences
    loadUserPreferences();
    
    // Setup settings forms
    setupSettingsForms();
}

/**
 * Load user preferences
 */
function loadUserPreferences() {
    // TODO: Load from localStorage/database
    console.log('Loading user preferences...');

    document.getElementById("run-status").addEventListener("click", async () => {
    const output = document.getElementById("status-output");
    output.innerText = "Loading...";
    
    try {
        //const response = await fetch("http://localhost:10000/status");
        const response = await fetch("https://plant-dashboard-github-io.onrender.com/status", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors"  // Explicit CORS mode
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        output.innerText = JSON.stringify(data, null, 2);
        
    } catch (err) {
        console.error("Error calling backend:", err);
        output.innerText = `Error: ${err.message}`;
    }
    });

}

/**
 * Setup settings forms
 */
function setupSettingsForms() {
    // TODO: Setup theme toggle
    // TODO: Setup notification preferences
    // TODO: Setup backup/export options
    console.log('Settings forms ready');
}

/**
 * Save user preferences
 */
export function savePreferences(preferences) {
    console.log('Saving preferences:', preferences);
    // TODO: Save to localStorage/database
}
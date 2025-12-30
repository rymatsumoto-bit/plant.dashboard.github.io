// ============================================
// APP.JS - Main Application Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const viewContainer = document.getElementById('view-container');

    // Function to load a view
    async function loadView(viewName) {
        try {
            // Show loading state
            viewContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">Loading...</p>';
            
            // Fetch the external HTML file
            const response = await fetch(`./views/${viewName}.html`);
            
            if (!response.ok) {
                // If view file doesn't exist yet, show placeholder
                if (response.status === 404) {
                    viewContainer.innerHTML = `
                        <div style="text-align: center; padding: 60px;">
                            <h2 style="color: var(--text-primary); margin-bottom: 20px;">${capitalize(viewName)}</h2>
                            <p style="color: var(--text-light); font-size: 1.1em;">This view is coming soon!</p>
                            <p style="color: var(--text-light); margin-top: 10px;">The ${viewName} feature is currently under development.</p>
                        </div>
                    `;
                    updateActiveNav(viewName);
                    return;
                }
                throw new Error(`Failed to load view: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Inject the content into the container
            viewContainer.innerHTML = html;

            // Update active styling
            updateActiveNav(viewName);
            
            // Initialize any view-specific JavaScript
            initializeView(viewName);
            
        } catch (error) {
            console.error('Error loading view:', error);
            viewContainer.innerHTML = `
                <div style="text-align: center; padding: 60px;">
                    <h2 style="color: var(--danger-text); margin-bottom: 20px;">Error Loading View</h2>
                    <p style="color: var(--text-light);">${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--btn-primary-bg); color: var(--btn-primary-text); border: none; border-radius: 5px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    // Update active navigation item
    function updateActiveNav(viewName) {
        navItems.forEach(item => item.classList.remove('active'));
        const activeItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Capitalize first letter for display
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Initialize view-specific functionality
    function initializeView(viewName) {
        switch(viewName) {
            case 'dashboard':
                initializeDashboard();
                break;
            case 'reports':
                initializeReports();
                break;
            case 'inventory':
                initializeInventory();
                break;
            case 'configuration':
                initializeConfiguration();
                break;
            default:
                console.log(`No initialization function for ${viewName}`);
        }
    }

    // ============================================
    // VIEW-SPECIFIC INITIALIZATION FUNCTIONS
    // ============================================

    function initializeDashboard() {
        console.log('Dashboard view initialized');
        // Add dashboard-specific initialization here
        // Example: Load plant alerts, setup event listeners, etc.
    }

    function initializeReports() {
        console.log('Reports view initialized');
        // Add reports-specific initialization here
        // Example: Load chart data, setup date pickers, etc.
    }

    function initializeInventory() {
        console.log('Inventory view initialized');
        // Add inventory-specific initialization here
        // Example: Load plant grid, setup filters, etc.
    }

    function initializeConfiguration() {
        console.log('Configuration view initialized');
        // Add configuration-specific initialization here
        // Example: Load settings, setup form handlers, etc.
    }

    // ============================================
    // NAVIGATION EVENT LISTENERS
    // ============================================

    // Add click listeners to sidebar navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            loadView(view);
            
            // Store current view in sessionStorage for page refresh
            sessionStorage.setItem('currentView', view);
        });
    });

    // ============================================
    // GLOBAL HELPER FUNCTIONS
    // ============================================

    // Make these functions globally available for inline event handlers
    window.loadView = loadView;

    // Function to handle back navigation
    window.goBack = function(defaultView = 'dashboard') {
        loadView(defaultView);
    };

    // Function to navigate to specific plant detail (for future use)
    window.showPlantDetail = function(plantId) {
        console.log(`Showing plant detail for ID: ${plantId}`);
        // This will be implemented when plant detail view is created
        // For now, you can load a detail view or modal
    };

    // ============================================
    // INITIALIZATION ON PAGE LOAD
    // ============================================

    // Check if there's a stored view from previous session
    const storedView = sessionStorage.getItem('currentView');
    const initialView = storedView || 'dashboard'; // Default to dashboard

    // Load initial view
    loadView(initialView);

    // Optional: Listen for browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view) {
            loadView(event.state.view);
        }
    });

    // Optional: Update URL without page reload (for bookmarking)
    function updateURL(viewName) {
        const url = new URL(window.location);
        url.searchParams.set('view', viewName);
        window.history.pushState({ view: viewName }, '', url);
    }

    // You can uncomment this if you want URL-based navigation
    // Modify loadView to call: updateURL(viewName);
});

// ============================================
// UTILITY FUNCTIONS (Available Globally)
// ============================================

// Format date for display
window.formatDate = function(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

// Calculate days between dates
window.daysBetween = function(date1, date2 = new Date()) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Show notification (for future use)
window.showNotification = function(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can implement a toast notification system here
    // For now, just using console.log
};

// Log errors
window.logError = function(error, context = '') {
    console.error(`Error ${context}:`, error);
    // You can send errors to a logging service here
};

console.log('Plant Hub Dashboard initialized successfully! 🌱');
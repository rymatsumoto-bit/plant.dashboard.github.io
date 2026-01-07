// ============================================
// ROUTER.JS - View Loading and Navigation
// ============================================

import { updateBreadcrumb } from './components/breadcrumb.js';
import { initializeDashboard } from './views/dashboard.js';
import { initializeReports } from './views/reports.js';
import { initializeInventory } from './views/inventory.js';
import { initializeConfiguration } from './views/configuration.js';
import { initializeSettings } from './views/settings.js';
import { capitalize } from './utils.js';

export class Router {
    constructor() {
        this.viewContainer = document.getElementById('view-container');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentView = null;
    }

    // Initialize router
    init() {
        this.setupNavigation();
        this.loadInitialView();
    }

    // Setup navigation event listeners
    setupNavigation() {
        // Sidebar navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.loadView(view);
                sessionStorage.setItem('currentView', view);
            });
        });

        // New Activity button (not in sidebar)
        const newActivityBtn = document.getElementById('new-activity-btn');
        if (newActivityBtn) {
            newActivityBtn.addEventListener('click', () => {
                // load form for new activity
            });
        }

        // Browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.view) {
                this.loadView(event.state.view);
            }
        });
    }

    // Load initial view on page load
    loadInitialView() {
        const storedView = sessionStorage.getItem('currentView');
        const initialView = storedView || 'dashboard';
        this.loadView(initialView);
    }

    // Load a view by name
    async loadView(viewName) {
        try {
            this.currentView = viewName;
            
            // Show loading state
            this.showLoading();
            
            // Fetch the view HTML
            const response = await fetch(`./views/${viewName}.html`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    this.showPlaceholder(viewName);
                    this.updateNavigation(viewName);
                    return;
                }
                throw new Error(`Failed to load view: ${response.statusText}`);
            }
            
            const html = await response.text();
            this.viewContainer.innerHTML = html;
            
            // Update navigation state
            this.updateNavigation(viewName);
            
            // Initialize view-specific logic
            this.initializeView(viewName);
            
        } catch (error) {
            console.error('Error loading view:', error);
            this.showError(error);
        }
    }

    // Show loading state
    showLoading() {
        this.viewContainer.innerHTML = `
            <p style="text-align: center; padding: 40px; color: var(--text-light);">
                Loading...
            </p>
        `;
    }

    // Show placeholder for views under development
    showPlaceholder(viewName) {
        this.viewContainer.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <h2 style="color: var(--text-primary); margin-bottom: 20px;">
                    ${capitalize(viewName)}
                </h2>
                <p style="color: var(--text-light); font-size: 1.1em;">
                    This view is coming soon!
                </p>
                <p style="color: var(--text-light); margin-top: 10px;">
                    The ${viewName} feature is currently under development.
                </p>
            </div>
        `;
    }

    // Show error state
    showError(error) {
        this.viewContainer.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <h2 style="color: var(--danger-text); margin-bottom: 20px;">
                    Error Loading View
                </h2>
                <p style="color: var(--text-light);">${error.message}</p>
                <button onclick="location.reload()" 
                        style="margin-top: 20px; padding: 10px 20px; 
                               background: var(--btn-primary-bg); 
                               color: var(--btn-primary-text); 
                               border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }

    // Update navigation active states
    updateNavigation(viewName) {
        this.updateActiveNav(viewName);
        updateBreadcrumb(viewName);
    }

    // Update sidebar active state
    updateActiveNav(viewName) {
        this.navItems.forEach(item => item.classList.remove('active'));
        const activeItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Initialize view-specific functionality
    initializeView(viewName) {
        const initializers = {
            'dashboard': initializeDashboard,
            'reports': initializeReports,
            'inventory': initializeInventory,
            'configuration': initializeConfiguration,
            'settings': initializeSettings
        };

        const initializer = initializers[viewName];
        if (initializer) {
            initializer();
        } else {
            console.log(`No initialization function for ${viewName}`);
        }
    }

    // Get current view name
    getCurrentView() {
        return this.currentView;
    }
}

// Make router available globally for inline handlers
let routerInstance = null;

export function setRouterInstance(router) {
    routerInstance = router;
}

export function getRouterInstance() {
    return routerInstance;
}
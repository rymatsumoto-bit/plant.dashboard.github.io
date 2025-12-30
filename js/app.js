document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const viewContainer = document.getElementById('view-container');

    // Function to load a view
    async function loadView(viewName) {
        try {
            // Fetch the external HTML file
            const response = await fetch(`./views/${viewName}.html`);
            if (!response.ok) throw new Error('Failed to load view');
            
            const html = await response.text();
            
            // Inject the content into the container
            viewContainer.innerHTML = html;

            // Optional: Update active styling
            navItems.forEach(item => item.classList.remove('active'));
            document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        } catch (error) {
            viewContainer.innerHTML = `<p>Error loading page: ${error.message}</p>`;
        }
    }

    // Add click listeners to sidebar items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            loadView(view);
        });
    });

    // Load initial default view (Actionable Items)
    loadView('actionable-items');
});

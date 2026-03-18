// ============================================
// LOGIN.JS - Entry Points
// ============================================

import { openModal } from './modals/prompt-modal.js';
import { getCurrentUser, signIn } from './services/supabase.js';

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});


// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌱 Plant Hub Dashboard initializing...');

    // Check if user is authenticated
    const user = await getCurrentUser();
    console.log(user);
    if (!user) {
        // Show login screen
        openLoginForm();
        return;

    // Make modal function globally available
    window.openModal = openModal;
    }
    else {
        // User is already authenticated - proceed normally
        window.location.href = 'app.html'; 
    }
    
    console.log('✅ Plant Hub Dashboard initialized successfully!');
});


function openLoginForm() {
    document.getElementById('signin-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        // Open modal first
        const modal = await openModal({
            title: 'Login',
            contentUrl: 'components/auth/login.html',
            size: 'medium',
            buttons: [
                { label: 'LOGIN', type: 'primary', action: 'submit' },
                { label: 'CANCEL', type: 'secondary', action: 'close' }
            ],
            onSubmit: async (data , modal) => {
                try {
                    await signIn(data.email, data.password);
                    window.location.href = 'app.html'; 
                } catch (error) {
                    alert('Login failed: ' + error.message);
                }
            }
        });

    });
}
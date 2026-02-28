import { useState } from 'react';
import LoginModal from '../components/modals/LoginModal';

export default function Landing() {
  // State to control login modal visibility
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Handler for opening login modal
  const handleSignInClick = () => {
    setShowLoginModal(true);
  };

  // Handler for closing login modal
  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  // Handler for successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Reload the page to trigger App.jsx auth check
    // This will cause App to re-check auth and show Dashboard
    window.location.reload();
  };

  return (
    <div className="landing-body">
      {/* Floating leaves decoration */}
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>

      <div className="landing-container">
        {/* Navigation */}
        <nav className="landing-nav">
          <div className="landing-logo">PlantDash</div>
          <div className="landing-nav-buttons">
            <button 
              className="landing-btn landing-btn-outline" 
              onClick={handleSignInClick}
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Nurture every <em>leaf</em>, one day at a time</h1>
            <p>Transform your plant care routine with intelligent tracking, personalized reminders, and a thriving community of plant lovers.</p>
            <div className="hero-cta">
              <a href="#signup" className="landing-btn landing-btn-primary landing-btn-large">Start Growing Free</a>
              <a href="#features" className="landing-btn landing-btn-outline landing-btn-large">Learn More</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="landing-plant-card-showcase">
              <div className="landing-floating-card landing-card-1">
                <span className="landing-plant-icon">🌿</span>
                <h3 className="landing-plant-name">Monstera</h3>
                <div className="landing-plant-stat">
                  <span>Health</span>
                  <div className="landing-stat-bar">
                    <div className="landing-stat-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="landing-plant-stat">
                  <span>Water in 2 days</span>
                </div>
              </div>

              <div className="landing-floating-card landing-card-2">
                <span className="landing-plant-icon">🪴</span>
                <h3 className="landing-plant-name">Pothos</h3>
                <div className="landing-plant-stat">
                  <span>Health</span>
                  <div className="landing-stat-bar">
                    <div className="landing-stat-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="landing-plant-stat">
                  <span>Thriving!</span>
                </div>
              </div>

              <div className="landing-floating-card landing-card-3">
                <span className="landing-plant-icon">🌵</span>
                <h3 className="landing-plant-name">Succulent</h3>
                <div className="landing-plant-stat">
                  <span>Health</span>
                  <div className="landing-stat-bar">
                    <div className="landing-stat-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="landing-plant-stat">
                  <span>Water today</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features" id="features">
          <div className="landing-section-title">
            <h2>Everything you need to thrive</h2>
            <p>Powerful tools to keep your plants healthy and happy</p>
          </div>

          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">💧</div>
              <h3>Smart Watering</h3>
              <p>Never forget to water again. Get personalized reminders based on each plant's unique needs and your local climate.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">📊</div>
              <h3>Growth Tracking</h3>
              <p>Watch your garden flourish with photo journals, growth metrics, and health insights over time.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🌞</div>
              <h3>Care Guidance</h3>
              <p>Get expert tips on light, water, and nutrients tailored to every plant in your collection.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="landing-cta" id="signup">
          <div className="landing-cta-content">
            <h2>Ready to grow together?</h2>
            <p>Join thousands of plant parents creating their perfect green space</p>
            <a href="#create-account" className="landing-btn landing-btn-primary landing-btn-large">Create Your Free Account</a>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2024 PlantDash. Cultivating green spaces, one plant at a time.</p>
        </footer>
      </div>

      {/* Login Modal - conditionally rendered */}
      {showLoginModal && (
        <LoginModal 
          onClose={handleCloseModal}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
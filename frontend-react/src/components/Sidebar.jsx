import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '../services/supabase';

function Sidebar({ currentView = 'dashboard' }) {
  const [user, setUser] = useState(null);

  // Load user info on mount
  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    loadUser();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        // Redirect to landing page
        window.location.href = '/';
      } catch (error) {
        console.error('Sign out error:', error);
        alert('Error signing out. Please try again.');
      }
    }
  };

  // Get display name from user
  const getUserDisplayName = () => {
    if (!user) return 'Loading...';
    return user.user_metadata?.full_name || 
           user.email?.split('@')[0] || 
           'User';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/images/icons/main-logo.svg" alt="Plant Hub Logo" className="logo" />
        <h1>Plant Hub <span className="version">v0.1.2</span></h1>
      </div>
      <p className="tagline">A dashboard for plant care</p>
      
      <nav className="sidebar-nav">
        <div className="sidebar-nav-top">
          <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}>
            <img src="/assets/images/icons/nav-dashboard.svg" alt="" className="nav-icon" />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}>
            <img src="/assets/images/icons/nav-reports.svg" alt="" className="nav-icon" />
            <span>Reports</span>
          </div>
          <div className={`nav-item ${currentView === 'inventory' ? 'active' : ''}`}>
            <img src="/assets/images/icons/nav-inventory.svg" alt="" className="nav-icon" />
            <span>Inventory</span>
          </div>
          <div className={`nav-item ${currentView === 'configuration' ? 'active' : ''}`}>
            <img src="/assets/images/icons/nav-configuration.svg" alt="" className="nav-icon" />
            <span>Configuration</span>
          </div>
        </div>
        <div className="sidebar-nav-bottom">
          <div className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}>
            <img src="/assets/images/icons/nav-settings.svg" alt="" className="nav-icon" />
            <span>Settings</span>
          </div>
          <div className="user-info" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
            <img src="/assets/images/icons/nav-user.svg" alt="" className="nav-icon" />
            <div className="user-details">
              <div className="user-name">{getUserDisplayName()}</div>
              <div className="user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
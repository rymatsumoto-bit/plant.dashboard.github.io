import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '../../services/supabase';

function Sidebar({ currentView = 'dashboard', onNavigate }) {
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

  // Handle navigation clicks
  const handleNavClick = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <>
      <div className="flex flex-col sticky top-0 h-screen w-60 bg-forest-teal py-8 px-5 shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-2 mb-4">
          <img src="assets/images/icons/main-logo.svg" alt="Plant Hub Logo" className="w-12 h-12 shrink-0"/>
          <h1 className="m-0 leading-6 text-2xl text-clay">Plant Hub <span className="text-2xs font-normal opacity-75">v0.5.0.2</span></h1>
        </div>
        <p className="text-base text-clay mb-10 opacity-90">A dashboard for plant care</p>
        
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto gap-2">

            {[
              { title: 'Dashboard', body: 'dashboard', icon: 'assets/images/icons/nav-dashboard.svg' },
              { title: 'Reports', body: 'reports', icon: 'assets/images/icons/nav-reports.svg' },
              { title: 'Inventory', body: 'inventory', icon: 'assets/images/icons/nav-inventory.svg' },
              { title: 'Configuration', body: 'configuration', icon: 'assets/images/icons/nav-configuration.svg' },
            ].map(({ title, body, icon }) => (
              <div
                key={body}
                onClick={() => handleNavClick(body)}
                className={`flex items-center gap-3 px-5 py-4 mb-1 rounded-lg cursor-pointer text-clay transition-colors duration-300 ease-in-out
                  ${currentView === body
                  ? 'bg-white/10 font-semibold' : 'hover:bg-white/10'}
                `}
              >
                <img src={icon} alt="" className="w-5 h-5 shrink brightness-0 invert-100" />
                <span>{title}</span>
              </div>
            ))}


          </div>

          <div className="mt-auto shrink-0">

            <div 
              onClick={() => handleNavClick('settings')}
              className={`flex items-center gap-3 px-5 py-4 mb-1 rounded-lg cursor-pointer text-clay transition-colors duration-300 ease-in-out
                  ${currentView === 'settings'
                  ? 'bg-white/10 font-semibold' : 'hover:bg-white/10'}
                `}              
            >
              <img src="assets/images/icons/nav-settings.svg" alt="" className="w-5 h-5 shrink brightness-0 invert-100" />
              <span>Settings</span>
            </div>

            <div className="flex items-center jusify-center gap-4 p-4 rounded-lg cursor-pointer  bg-white/10" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
              <img src="assets/images/icons/nav-user.svg" alt="" className="w-5 h-5 shrink brightness-0 invert-100" />
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-clay wrap-break-word">{getUserDisplayName()}</div>
                
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
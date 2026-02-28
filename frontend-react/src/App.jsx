import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getActivityTypes } from './services/supabase';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // Load global color configuration on app start
  // =============================================
  useEffect(() => {
    async function loadGlobalConfig() {
      try {
        // Fetch color mappings from Supabase
        const colors = await getActivityTypes();
        
        if (!colors) {
          console.warn('Could not load color config:', error);
          return;
        }
        
        // Set CSS variables globally
        if (colors) {
          colors.forEach(config => {
            document.documentElement.style.setProperty(
              `--schedule-${config.activity_type_code}`,
              config.background_color
            );
          });
          console.log('✅ Global colors loaded from Supabase',colors);
        }
      } catch (err) {
        console.warn('Error loading color config:', err);
      }
    }
    
    loadGlobalConfig();
  }, []);




  // Check authentication on app load
  // =============================================
  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f0ece4',
            borderTop: '4px solid #5A8A4A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#5A8A4A' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show Landing or Dashboard based on auth state
  return user ? <Dashboard /> : <Landing />;
}

export default App;
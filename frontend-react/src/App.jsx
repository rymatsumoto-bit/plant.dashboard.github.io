import { useState, useEffect } from 'react';
import { getCurrentUser, getActivityTypes } from './services/supabase';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Landing from './pages/Landing';
import PlantDetail from './pages/PlantDetail';
import Settings from './pages/Settings'

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewParams, setViewParams] = useState('plant_id');

  // Load global color configuration on app start
  // =============================================
  useEffect(() => {
    async function loadGlobalConfig() {
      try {
        // Fetch color mappings from Supabase
        const colors = await getActivityTypes();
        
        if (!colors) {
          console.warn('Could not load color config');
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
          console.log('✅ Global colors loaded from Supabase', colors);
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

  // Load saved view from sessionStorage
  // =============================================
  useEffect(() => {
    if (user) {
      const savedView = sessionStorage.getItem('currentView');
      if (savedView) {
        setCurrentView(savedView);
      }
    }
  }, [user]);

  // Navigation handler
  // =============================================
  const handleNavigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);               // new state: const [viewParams, setViewParams] = useState({});
    sessionStorage.setItem('currentView', view);
    console.log('Navigating to:', view);
  };

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

  // Show Landing page if not authenticated
  if (!user) {
    return <Landing />;
  }

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'inventory':
        return <Inventory onNavigate={handleNavigate} />;
      case 'plant-detail':
        return <PlantDetail
          plantId={viewParams.plantId}
          onBack={() => handleNavigate('inventory')}
          onNavigate={handleNavigate}
        />;
      // Add more views as you convert them to React
      // case 'reports':
      //   return <Reports onNavigate={handleNavigate} />;
      // case 'configuration':
      //   return <Configuration onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return renderView();
}

export default App;
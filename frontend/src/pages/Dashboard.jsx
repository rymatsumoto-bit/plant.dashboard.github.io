import { useState, useEffect } from 'react';
import { getDataMetrics } from '../services/metrics';
import { getScheduleActive } from '../services/supabase';
import PageLayout from '../components/navigation/PageLayout';
import KPICard from '../components/dashboard/KPICard';
import ScheduleCard from '../components/dashboard/ScheduleCard';

export default function Dashboard({ onNavigate }) {
  // State for data
  const [metrics, setMetrics] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async() => {
    try {
      setIsLoading(true);
      
      // Fetch both data sources in parallel
      const [metricsData, scheduleData] = await Promise.all([
        getDataMetrics(),
        getScheduleActive()
      ]);
      
      setMetrics(metricsData);
      setSchedule(scheduleData || []);
      setError(null);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout currentView="dashboard" onNavigate={onNavigate} onActivitySuccess={loadDashboardData}>
      {/* Loading State */}
      {isLoading && (
        <div  style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !error && metrics && (
        <div className="grid grid-cols-[1fr_2fr] gap-8 mb-8 items-start">
          {/* KPIs Section */}
          <div className="grid grid-cols-1 gap-6 items-start">
            <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">KPIs</div>
            
            <KPICard
              title="Plants"
              metric={metrics.plant_active_total_count || 0}
              tagline="Total"
              iconSrc="assets/images/icons/kpi-plant-count.svg"
            />
            
            <KPICard
              title="Healthy"
              metric={`${metrics.plant_healthy_percentage || 0}%`}
              tagline="of Total"
              iconSrc="assets/images/icons/kpi-plant-healthy.svg"
            />
            
            <KPICard
              title="Active Alerts"
              metric={metrics.schedule_alert_count || 0}
              tagline="Total"
              iconSrc="assets/images/icons/kpi-plant-attention.svg"
            />
          </div>

          {/* Schedule Section */}
          <div className="grid grid-cols-1 gap-6 items-start">
            <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">Schedule</div>
              <ScheduleCard schedule={schedule} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
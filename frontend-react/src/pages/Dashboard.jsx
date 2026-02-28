import { useState, useEffect } from 'react';
import { getDataMetrics } from '../services/metrics';
import { getScheduleActive } from '../services/supabase';
import Sidebar from '../components/Sidebar';
import KPICard from '../components/KPICard';
import ScheduleItem from '../components/ScheduleItem';

export default function Dashboard() {
  // State for data
  const [metrics, setMetrics] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    async function loadDashboardData() {
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
    }

    loadDashboardData();
  }, []);

  return (
    <div className="page-container">
      {/* Sidebar Navigation */}
      <Sidebar currentView="dashboard" />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-title-section">
            <h1 className="toolbar-title">Dashboard</h1>
            <p className="toolbar-tagline">Your plant care overview</p>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading dashboard...</span>
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
            <div className="chunk-container-1-2">
              {/* KPIs Section */}
              <div className="chunk-container-single-column">
                <div className="chunk-title">KPIs</div>
                
                <KPICard
                  title="Plants"
                  metric={metrics.plant_active_total_count || 0}
                  tagline="Total"
                  iconSrc="/assets/images/icons/kpi-plant-count.svg"
                />
                
                <KPICard
                  title="Healthy"
                  metric={`${metrics.plant_healthy_percentage || 0}%`}
                  tagline="of Total"
                  iconSrc="/assets/images/icons/kpi-plant-healthy.svg"
                />
                
                <KPICard
                  title="Active Alerts"
                  metric={metrics.schedule_alert_count || 0}
                  tagline="Total"
                  iconSrc="/assets/images/icons/kpi-plant-attention.svg"
                />
              </div>

              {/* Schedule Section */}
              <div className="chunk-container-single-column">
                <div className="chunk-title">Schedule</div>
                <div className="card">
                  <div className="chunk-container-single-column">
                    {schedule.length === 0 ? (
                      <div className="empty-state">NO ITEMS</div>
                    ) : (
                      schedule.map((item) => (
                        <ScheduleItem key={item.schedule_id} schedule={item} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { getPlantInventory } from '../services/supabase';
import { getDataMetrics } from '../services/metrics';
import KPICard from '../components/inventory/KPICard';
import PlantTable from '../components/inventory/PlantTable';
import Sidebar from '../components/navigation/Sidebar';
import Toolbar from '../components/navigation/Toolbar';

export default function Inventory({ onNavigate }) {
  const [plants, setPlants] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);

  // Load inventory data on mount
  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);
      const [plantsData, metricsData] = await Promise.all([
        getPlantInventory(),
        getDataMetrics()
      ]);
      
      setPlants(plantsData || []);
      setMetrics(metricsData || null);
      console.log('Inventory data loaded:', { 
        plantCount: plantsData?.length, 
        metrics: metricsData 
      });
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPlantClick = () => {
    setShowAddPlantModal(true);
    console.log('Open add plant modal');
    // TODO: Implement modal
  };

  const handlePlantClick = (plantId) => {
    console.log('Navigate to plant detail:', plantId);
    // TODO: Implement navigation to plant detail view
  };

  if (isLoading) {
    return (
      <>
        <Sidebar currentView="inventory" onNavigate={onNavigate} />
        <div className="main-content">
          <Toolbar currentView="inventory" />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <div className="loading-spinner">Loading inventory...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar currentView="inventory" onNavigate={onNavigate} />
      <div className="main-content">
        <Toolbar currentView="inventory" />
        
        {/* KPI Cards */}
        <div className="card-kpi-container">
          <KPICard
            title="Plants"
            value={metrics?.plant_active_total_count || 0}
            tagline="Total"
            icon="/assets/images/icons/kpi-plant-count.svg"
            iconAlt="total"
          />
          <KPICard
            title="Healthy"
            value={`${metrics?.plant_healthy_percentage || 0}%`}
            tagline="of Total"
            icon="/assets/images/icons/kpi-plant-healthy.svg"
            iconAlt="healthy"
          />
          <KPICard
            title="Active Alerts"
            value={metrics?.schedule_alert_count || 0}
            tagline="Total"
            icon="/assets/images/icons/kpi-plant-attention.svg"
            iconAlt="attention"
          />
        </div>

        {/* Plant Table */}
        <div className="chunk-title">
          Plant List
          <div className="card-title-btn">
            <button 
              id="new-plant-btn" 
              className="btn-small btn-add"
              onClick={handleNewPlantClick}
            >
              NEW
            </button>
          </div>
        </div>

        <PlantTable 
          plants={plants} 
          onPlantClick={handlePlantClick} 
        />
      </div>
    </>
  );
}
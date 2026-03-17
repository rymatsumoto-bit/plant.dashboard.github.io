import { useState,useEffect } from 'react';
import { getHabitats, getAddresses } from '../services/supabase';
import PageLayout from '../components/navigation/PageLayout';
import AddressList from '../components/configuration/AddressList';
import HabitatList from '../components/configuration/HabitatList';

export default function Configuration({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [habitats, setHabitats] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Load configuratiion data on mount
  useEffect(() => {
    loadConfigurationData();
  }, []);

  const loadConfigurationData = async () => {
    try {
      setIsLoading(true);
      const [habitatsData, addressesData] = await Promise.all([
        getHabitats(),
        getAddresses()
      ]);
      
      setHabitats(habitatsData || []);
      setAddresses(addressesData || []);
      console.log('Configuration data loaded:', { 
        habitatCount: habitatsData?.length,
        addressCount: addressesData?.length
      });
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHabitatClick = (habitatId) => {
    onNavigate('plant-detail', { habitatId });
  };

  const handleAddressClick = (addressId) => {
    onNavigate('plant-detail', { addressId });
  };

  if (isLoading) {
    return (
      <PageLayout currentView="configuration" onNavigate={onNavigate}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div className="loading-spinner">Loading configurations...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout currentView="configuration" onNavigate={onNavigate}>
      {/* Habitats */}
      <div className="chunk-title">
        Habitat List
        <div className="card-title-btn">
          <button 
            id="config-new-habitat-btn" 
            className="btn-small btn-add"
            onClick={handleHabitatClick}
          >
            NEW
          </button>
        </div>
      </div>
    
      <HabitatList
        habitats={habitats} 
        onHabitatClick={handleHabitatClick}
      />

      <br/>

      {/* Addresses */}
      <div className="chunk-title">
        Address List
        <div className="card-title-btn">
          <button 
            id="config-new-address-btn" 
            className="btn-small btn-add"
            onClick={handleAddressClick}
          >
            NEW
          </button>
        </div>
      </div>

      <AddressList
        addresses={addresses} 
        onAddressClick={handleAddressClick}
      />


    </PageLayout>
  );
}
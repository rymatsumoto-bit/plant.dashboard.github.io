// ============================================
// Configuration.jsx
// ============================================

import { useState,useEffect } from 'react';
import { getHabitats, getAddresses } from '../services/supabase';
import PageLayout from '../components/navigation/PageLayout';
import AddressList from '../components/configuration/AddressList';
import HabitatList from '../components/configuration/HabitatList';
import HabitatDetailModal from '../components/modals/HabitatDetailModal';
import AddressDetailModal from '../components/modals/AddressDetailModal';

export default function Configuration({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [habitats, setHabitats] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedHabitatId, setSelectedHabitatId] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

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

  // ── Modal handlers ──────────────────────────────────────────────────────────
 
  const handleHabitatClick = (habitatId) => {
    setSelectedHabitatId(habitatId);
  };
 
  const handleModalClose = () => {
    setSelectedHabitatId(null);
  };
 
  const handleHabitatEdit = (habitatId) => {
    // TODO: open edit form/modal
    console.log('Edit habitat:', habitatId);
  };
 
  const handleHabitatArchive = (habitatId) => {
    // Optimistically remove from list; re-fetch or filter locally
    setHabitats((prev) => prev.filter((h) => h.habitat_id !== habitatId));
    console.log('Archived habitat:', habitatId);
    // TODO: call supabase update({ is_active: false }) here
  };
 
  const handleAddressClick = (addressId) => {
    setSelectedAddressId(addressId);
  };
 
  const handleAddressModalClose = () => {
    setSelectedAddressId(null);
  };
 
  const handleAddressEdit = (addressId) => {
    // TODO: open edit form/modal
    console.log('Edit address:', addressId);
  };
 
  const handleAddressArchive = (addressId) => {
    setAddresses((prev) => prev.filter((a) => a.address_id !== addressId));
    console.log('Archived address:', addressId);
    // TODO: call supabase .update({ is_active: false }).eq('address_id', addressId)
  };

 // ── Loading state ───────────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageLayout currentView="configuration" onNavigate={onNavigate}>
      {/* Habitats */}
      <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">
        Habitat List
        <div className="flex justify-end gap-2">
          <button 
            id="config-new-habitat-btn" 
            className="btn btn-small btn-add"
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
      <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">
        Address List
        <div className="flex justify-end gap-2">
          <button 
            id="config-new-address-btn" 
            className="btn btn-small btn-add"
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


      {/* Habitat Detail Modal */}
      {selectedHabitatId && (
        <HabitatDetailModal
          habitatId={selectedHabitatId}
          onClose={handleModalClose}
          onEdit={handleHabitatEdit}
          onArchive={handleHabitatArchive}
        />
      )}

      {/* Address Detail Modal */}
      {selectedAddressId && (
        <AddressDetailModal
          addressId={selectedAddressId}
          onClose={handleAddressModalClose}
          onEdit={handleAddressEdit}
          onArchive={handleAddressArchive}
        />
      )}
      
    </PageLayout>
  );
}
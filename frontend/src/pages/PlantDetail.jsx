import { useState, useEffect } from 'react';
import { getPlantDetails, getPlantActivity } from '../services/supabase';
import PageLayout from '../components/navigation/PageLayout';
import PlantActivityRow from '../components/inventory/PlantActivityRow';

export default function PlantDetail({ plantId, onBack, onNavigate }) {
  const [details, setDetails] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlantData() {
      try {
        setIsLoading(true);
        const [detailsData, activityData] = await Promise.all([
          getPlantDetails(plantId),
          getPlantActivity(plantId)
        ]);
        setDetails(detailsData);
        setActivity(activityData || []);
        setError(null);
      } catch (err) {
        console.error('Error loading plant details:', err);
        setError('Failed to load plant details');
      } finally {
        setIsLoading(false);
      }
    }

    if (plantId) loadPlantData();
  }, [plantId]);

  const capitalize = (str) => {
    if (!str) return '-';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <PageLayout currentView="inventory" onNavigate={onNavigate}>

      {/* BACK */}
      <button className="btn btn-edit" onClick={onBack}>
        BACK ↩
      </button>
      <br/>
      <br/>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-spinner">Loading plant details...</div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-message">{error}</div>
      )}

      {/* Content */}
      {!isLoading && !error && details && (
        <div className="grid grid-cols-[1fr_2fr] gap-8 mb-8 items-start">

          {/* Left Column — Characteristics */}
          <div className="grid grid-cols-1 gap-6 items-start" style={{width: '360px'}}>
            <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">
              Details
              <div className="flex justify-end gap-2">
                <button className="btn btn-small btn-edit">
                  EDIT
                </button>
              </div>
            </div>

            <div className="card">
              <h1>{capitalize(details.plant_name)}</h1>
              <div>{capitalize(details.species)}</div>
              
              <div className="block text-center justify-center mt-4 mb-5">
                <img
                  src={`assets/images/habitat-desert.jpg`}
                  alt={details.species || 'plant'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'assets/images/icons/plants/default.svg';
                  }}
                />
              </div>
              <br/>
              <div className="grid grid-cols-[1fr_1fr] gap-8 mb-8 items-start">
                <div>
                  <h4>Category</h4>
                  <div>{capitalize(details.plant_category)}</div>
                  <br />
                  <h4>Habitat</h4>
                  <div>{capitalize(details.habitat)}</div>
                </div>
                <div>
                  <h4>Acquisition Date</h4>
                  <div>{formatDate(details.acquisition_date)}</div>
                  <br />
                  <h4>Source</h4>
                  <div>{capitalize(details.source)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Activity History */}
          <div className="grid grid-cols-1 gap-6 items-start">
            <div className="grid grid-cols-[1fr_auto] text-xl font-semibold items-center mb-3">Activity History</div>

            <div className="bg-white rounded-xl shadow-md cursor-pointer">
              <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr_1.5fr] p-5 gap-x-4 font-semibold text-base text-font-base pr-9">
                <div>Date</div>
                <div>Type</div>
                <div>Qty</div>
                <div>Unit</div>
                <div>Notes</div>
                <div>Results</div>
              </div>

              <div className="scrollbar overflow-y-auto max-h-100 [scrollbar-width:thin] [scrollbar-gutter:stable]">
                {activity.length === 0 ? (
                  <div className="text-center p-5 text-font-light text-sm">No activity recorded.</div>
                ) : (
                  activity.map((a) => (
                    <PlantActivityRow key={a.activity_id} activity={a} />
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </PageLayout>
  );
}
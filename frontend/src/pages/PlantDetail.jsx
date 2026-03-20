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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading plant details...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-message">{error}</div>
      )}

      {/* Content */}
      {!isLoading && !error && details && (
        <div className="chunk-container-1-2">

          {/* Left Column — Characteristics */}
          <div className="chunk-container-single-column" style={{width: '360px'}}>
            <div className="chunk-title">
              Details
              <div className="card-title-btn">
                <button className="btn-small btn-edit">
                  EDIT
                </button>
              </div>
            </div>

            <div className="card">
              <h1>{capitalize(details.plant_name)}</h1>
              <div>{capitalize(details.species)}</div>
              
              <div className="card-image">
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
              <div className="chunk-container-1-1">
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
          <div className="chunk-container-single-column">
            <div className="chunk-title">Activity History</div>

            <div className="table-activity">
              <div className="table-activity-header">
                <div>Date</div>
                <div>Type</div>
                <div>Qty</div>
                <div>Unit</div>
                <div>Notes</div>
                <div>Results</div>
              </div>

              <div className="table-activity-body">
                {activity.length === 0 ? (
                  <div className="empty-state">No activity recorded.</div>
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
// ============================================
// Toolbar.jsx - with New Activity + Watering modals
// ============================================

import { useState } from 'react';
import NewActivityModal from '../modals/NewActivityModal';
import WateringModal from '../modals/activities/WateringModal';

function Toolbar({ currentView, onActivitySuccess }) {
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showWateringModal, setShowWateringModal] = useState(false);

  const handleActivitySuccess = () => {
    console.log('Activity logged successfully!');
    if (onActivitySuccess) onActivitySuccess();
  };

  const viewInfo = {
    dashboard:     { title: 'Dashboard',       tagline: 'Your plant care overview' },
    inventory:     { title: 'Plant Inventory',  tagline: 'Manage your plant collection' },
    reports:       { title: 'Reports',          tagline: 'Analyze your plant care data' },
    configuration: { title: 'Configuration',    tagline: 'Set up plant care parameters' },
    settings:      { title: 'Settings',         tagline: 'Manage your account and preferences' },
  };

  const info = viewInfo[currentView] || viewInfo.dashboard;

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title-section">
          <h1 className="toolbar-title">{info.title}</h1>
          <p className="toolbar-tagline">{info.tagline}</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            id="search-input"
            className="search-input"
            placeholder="Search..."
          />
        </div>

        <div className="toolbar-button-container">
          <button
            className="btn btn-primary"
            onClick={() => setShowWateringModal(true)}
          >
            + WATERING
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewActivityModal(true)}
          >
            + ACTIVITY
          </button>
        </div>
      </div>

      {/* Generic activity modal — all fields free */}
      {showNewActivityModal && (
        <NewActivityModal
          onClose={() => setShowNewActivityModal(false)}
          onSuccess={handleActivitySuccess}
        />
      )}

      {/* Watering modal — type and unit locked, no pre-selected plant */}
      {showWateringModal && (
        <WateringModal
          onClose={() => setShowWateringModal(false)}
          onSuccess={handleActivitySuccess}
        />
      )}
    </>
  );
}

export default Toolbar;
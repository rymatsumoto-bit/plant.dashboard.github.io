// ============================================
// Toolbar.jsx - Toolbar with New Activity Modal
// ============================================

import { useState } from 'react';
import NewActivityModal from '../modals/NewActivityModal';

function Toolbar({ currentView }) {
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showNewWateringModal, setShowNewWateringModal] = useState(false);

  const handleNewActivityClick = () => setShowNewActivityModal(true);
  const handleNewWateringClick = () => {
    setShowNewWateringModal(true);
    console.log('Open new watering modal'); // TODO: Implement watering modal
  };

  const handleActivitySuccess = () => {
    console.log('Activity logged successfully!');
    // TODO: optionally trigger a data refresh in parent via a prop callback
  };

  // Map view names to display titles and taglines
  const viewInfo = {
    dashboard:     { title: 'Dashboard',      tagline: 'Your plant care overview' },
    inventory:     { title: 'Plant Inventory', tagline: 'Manage your plant collection' },
    reports:       { title: 'Reports',         tagline: 'Analyze your plant care data' },
    configuration: { title: 'Configuration',   tagline: 'Set up plant care parameters' },
    settings:      { title: 'Settings',        tagline: 'Manage your account and preferences' },
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

        {/* Buttons */}
        <div className="toolbar-button-container">
          <button
            className="btn btn-primary"
            id="new-activity-watering-btn"
            title="ADD WATERING"
            onClick={handleNewWateringClick}
          >
            + WATERING
          </button>

          <button
            className="btn btn-primary"
            id="new-activity-btn"
            title="NEW ACTIVITY"
            onClick={handleNewActivityClick}
          >
            + ACTIVITY
          </button>
        </div>
      </div>

      {/* New Activity Modal */}
      {showNewActivityModal && (
        <NewActivityModal
          onClose={() => setShowNewActivityModal(false)}
          onSuccess={handleActivitySuccess}
        />
      )}
    </>
  );
}

export default Toolbar;
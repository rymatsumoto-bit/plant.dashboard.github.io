import { useState, useEffect } from 'react';

function Toolbar({ currentView }) {
  const [showShowNewActivityModal, setShowNewActivityModal] = useState(false);  
  const [showShowNewWateringModal, setShowNewWateringModal] = useState(false);


  // Set button handling
  const handleNewActivityClick = () => {
    setShowNewActivityModal(true);
    console.log('Open new activity modal');
    // TODO: Implement modal
  };
  const handleNewWateringClick = () => {
    setShowNewWateringModal(true);
    console.log('Open new watering modal');
    // TODO: Implement modal
  };

  // Map view names to display titles and taglines
  const viewInfo = {
    dashboard: {
      title: 'Dashboard',
      tagline: 'Your plant care overview'
    },
    inventory: {
      title: 'Plant Inventory',
      tagline: 'Manage your plant collection'
    },
    reports: {
      title: 'Reports',
      tagline: 'Analyze your plant care data'
    },
    configuration: {
      title: 'Configuration',
      tagline: 'Set up plant care parameters'
    },
    settings: {
      title: 'Settings',
      tagline: 'Manage your account and preferences'
    }
  };

  const info = viewInfo[currentView] || viewInfo.dashboard;

  return (
    <div className="toolbar">
      <div className="toolbar-title-section">
        <h1 className="toolbar-title">{info.title}</h1>
        <p className="toolbar-tagline">{info.tagline}</p>
      </div>

      <div className="search-container">
        <input type="text" id="search-input" className="search-input" placeholder="Search..."></input>
      </div>

      {/* buttons section */}
      <div className="toolbar-button-container">
          <button
            className="btn btn-primary"
            id="new-activity-watering-btn"
            title="ADD WATERING"
            onClick={handleNewWateringClick}>
              + WATERING
          </button>

          <button
            className="btn btn-primary"
            id="new-activity-btn"
            title="NEW ACTIVITY"
            onClick={handleNewActivityClick}>
              + ACTIVITY
          </button>
      </div>
    </div>
  );
}

export default Toolbar;
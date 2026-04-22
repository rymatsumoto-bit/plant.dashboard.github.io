// ============================================
// Toolbar.jsx - with New Activity + Watering modals
// ============================================

import { useState } from 'react';
import NewActivityModal from '../modals/activities/NewActivityModal';
import WateringModal from '../modals/activities/WateringModal';

function Toolbar({ currentView, onActivitySuccess }) {
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showWateringModal, setShowWateringModal] = useState(false);

  const handleActivitySuccess = () => {
    console.log('Activity logged successfully!');
    if (onActivitySuccess) onActivitySuccess();
  };

  const viewInfo = {
    dashboard:     { title: 'Dashboard',        tagline: 'Your plant care overview' },
    inventory:     { title: 'Plant Inventory',  tagline: 'Manage your plant collection' },
    reports:       { title: 'Reports',          tagline: 'Analyze your plant care data' },
    configuration: { title: 'Configuration',    tagline: 'Set up plant care parameters' },
    settings:      { title: 'Settings',         tagline: 'Manage your account and preferences' },
  };

  const info = viewInfo[currentView] || viewInfo.dashboard;

  return (
    <>
      <div className="sticky top-0 z-10 grid grid-cols-[minmax(500px,auto)_1fr_auto] shrink-0 items-center justify-between border-b border-clay bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-4xl text-forest-deep">{info.title}</h1>
          <p className="text-md opacity-80 m-0">{info.tagline}</p>
        </div>

        <div className="flex w-full max-w-100 justify-self-start">
          <input
            type="text"
            id="search-input"
            className="w-full px-4 py-2.5 border border-clay rounded-lg text-base transition-colors duration-200 ease-in bg-white shadow-md focus:outline-none focus:border-botanical"
            placeholder="Search..."
          />
        </div>

        <div className="flex flex-row items-end gap-4">
          <button
            className="btn btn-primary w-36 h-12"
            onClick={() => setShowWateringModal(true)}
          >
            + WATERING
          </button>
          <button
            className="btn btn-primary w-36 h-12"
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
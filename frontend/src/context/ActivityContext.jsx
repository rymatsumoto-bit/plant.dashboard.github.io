// ============================================
// ActivityContext.jsx - Global Activity Launcher
// ============================================
// Provides a centralized way to open activity modals
// from anywhere in the app, with optional pre-filled
// activity_type_code and plant_id.
// ============================================

import { createContext, useContext, useState } from 'react';

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [activeActivity, setActiveActivity] = useState(null);
  // activeActivity shape: { type: 'watering' | 'fertilizing' | ... , plantId: string | null }
  // null means no modal is open

  const openActivity = ({ activityType = null, plantId = null } = {}) => {
    setActiveActivity({ activityType, plantId });
  };

  const closeActivity = () => {
    setActiveActivity(null);
  };

  return (
    <ActivityContext.Provider value={{ activeActivity, openActivity, closeActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
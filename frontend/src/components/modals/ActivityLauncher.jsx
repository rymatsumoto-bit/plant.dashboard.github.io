// ============================================
// ActivityLauncher.jsx - Activity Modal Switchboard
// ============================================
// Listens to activeActivity from context and renders
// the correct modal based on activity type.
// Mount this once in PageLayout.jsx so it is always
// present on every authenticated page.
// ============================================

import { useActivity } from '../../context/ActivityContext';
import WateringModal from './activities/WateringModal';
import NewActivityModal from './activities/NewActivityModal';

export default function ActivityLauncher() {
  const { activeActivity, closeActivity } = useActivity();

  // Nothing is open
  if (!activeActivity) return null;

  const { activityType, plantId } = activeActivity;

  switch (activityType) {
    case 'watering':
      return (
        <WateringModal
          defaultPlantId={plantId}
          onClose={closeActivity}
          onSuccess={closeActivity}
        />
      );

    case null:
    default:
      // Generic modal for unknown or unspecified activity types
      return (
        <NewActivityModal
          defaultActivityType={activityType}
          defaultPlantId={plantId}
          onClose={closeActivity}
          onSuccess={closeActivity}
        />
      );
  }
}
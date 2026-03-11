// ============================================
// ActivityTypeSelect.jsx - Layer 2: Activity Type Field
// ============================================
// Renders a dropdown when free, or static label
// when locked (e.g. WateringModal pre-selects this).
// ============================================

import { useState, useEffect } from 'react';
import { getActivityTypes } from '../../../services/supabase';

export default function ActivityTypeSelect({ value, onChange, disabled = false }) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getActivityTypes();
        setActivityTypes(data || []);
      } catch (err) {
        console.error('Error loading activity types:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const selectedType = activityTypes.find((t) => t.activity_type_code === value);

  return (
    <div className="form-group">
      <label className="form-label">Activity Type *</label>

      {disabled ? (
        <>
          <div className="form-static-value">
            {isLoading ? 'Loading...' : (selectedType?.activity_label || value)}
          </div>
          <input type="hidden" name="activity_type_code" value={value} />
        </>
      ) : (
        <select
          name="activity_type_code"
          value={value}
          onChange={onChange}
          className="form-input"
          disabled={isLoading}
        >
          <option value="">
            {isLoading ? 'Loading types...' : 'Select activity type...'}
          </option>
          {activityTypes.map((type) => (
            <option key={type.activity_type_code} value={type.activity_type_code}>
              {type.activity_label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
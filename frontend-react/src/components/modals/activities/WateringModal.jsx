// ============================================
// WateringModal.jsx - Layer 3: Watering Activity Modal
// ============================================
// Pre-selects activity_type_code = 'watering'
// and unit = '%' (both locked).
// Plant is locked when defaultPlantId is provided
// (e.g. called from Plant Detail page).
// ============================================

import { useState } from 'react';
import { getApiUrl, API_CONFIG } from '../../../services/api';
import { getCurrentUserId } from '../../../services/supabase';

import ActivityModalBase from '../ActivityModalBase';
import ActivityTypeSelect from '../fields/ActivityTypeSelect';
import PlantSelect from '../fields/PlantSelect';
import DatePicker from '../fields/DatePicker';
import WateringLevelSelect from '../fields/WateringLevelSelect';
import UnitSelect from '../fields/UnitSelect';
import ResultField from '../fields/ResultField';
import NotesField from '../fields/NotesField';

export default function WateringModal({ onClose, onSuccess, defaultPlantId = null }) {
  const [formData, setFormData] = useState({
    activity_type_code: 'watering',
    plant_id: defaultPlantId || '',
    activity_date: new Date().toISOString().split('T')[0],
    quantifier: '',
    unit: '%',
    result: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.plant_id || !formData.activity_date || !formData.quantifier) {
      setError('Please fill in all required fields (Plant, Date, and Watering Level).');
      return;
    }

    setIsLoading(true);

    try {
      const user_id = await getCurrentUserId();

      const activityData = {
        plant_id: formData.plant_id,
        activity_type_code: 'watering',
        activity_date: formData.activity_date,
        quantifier: parseFloat(formData.quantifier),
        unit: '%',
        result: formData.result || null,
        notes: formData.notes || null,
        user_id,
      };

      console.log('Submitting watering activity:', activityData);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.NEW_ACTIVITY), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to log watering.');
      }

      console.log('Watering logged successfully.');
      onSuccess?.();
      onClose();

    } catch (err) {
      console.error('Error logging watering:', err);
      setError(err.message || 'Failed to log watering. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityModalBase
      title="Log Watering"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      submitLabel="LOG WATERING"
    >
      {/* Activity Type — always locked to 'watering' */}
      <ActivityTypeSelect
        value={formData.activity_type_code}
        onChange={handleChange}
        disabled={true}
      />

      {/* Plant — locked if defaultPlantId was provided */}
      <PlantSelect
        value={formData.plant_id}
        onChange={handleChange}
        disabled={!!defaultPlantId}
      />

      {/* Date */}
      <DatePicker
        value={formData.activity_date}
        onChange={handleChange}
      />

      {/* Optional Details Section */}
      <div className="form-section">
        <h3 className="form-section-title">Optional Details</h3>

        <div className="form-grid">
          {/* Watering Level — replaces free QuantifierInput */}
          <WateringLevelSelect
            value={formData.quantifier}
            onChange={handleChange}
          />

          {/* Unit — always locked to '%' */}
          <UnitSelect
            value={formData.unit}
            onChange={handleChange}
            disabled={true}
          />
        </div>

        <div className="form-grid">
          <ResultField value={formData.result} onChange={handleChange} />
          <NotesField value={formData.notes} onChange={handleChange} />
        </div>
      </div>
    </ActivityModalBase>
  );
}
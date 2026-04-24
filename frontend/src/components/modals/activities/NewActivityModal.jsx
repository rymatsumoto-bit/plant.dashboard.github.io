// ============================================
// NewActivityModal.jsx - Layer 3: Generic Activity Modal
// ============================================
// Accepts optional defaultActivityType and defaultPlantId
// from ActivityLauncher. When provided, the corresponding
// field is pre-filled and locked.
// ============================================

import { useState } from 'react';
import { getApiUrl, API_CONFIG } from '../../../services/api';
import { getCurrentUserId } from '../../../services/supabase';

import ActivityModalBase from '../ActivityModalBase';
import ActivityTypeSelect from '../fields/ActivityTypeSelect';
import PlantSelect from '../fields/PlantSelect';
import DatePicker from '../fields/DatePicker';
import QuantifierInput from '../fields/QuantifierInput';
import UnitSelect from '../fields/UnitSelect';
import ResultField from '../fields/ResultField';
import NotesField from '../fields/NotesField';

export default function NewActivityModal({
  onClose,
  onSuccess,
  defaultActivityType = null,
  defaultPlantId = null,
}) {
  const [formData, setFormData] = useState({
    activity_type_code: defaultActivityType || '',
    plant_id: defaultPlantId || '',
    activity_date: new Date().toISOString().split('T')[0],
    quantifier: '',
    unit: '',
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

    if (!formData.activity_type_code || !formData.plant_id || !formData.activity_date) {
      setError('Please fill in all required fields (Activity Type, Plant, and Date).');
      return;
    }

    setIsLoading(true);

    try {
      const user_id = await getCurrentUserId();

      const activityData = {
        plant_id: formData.plant_id,
        activity_type_code: formData.activity_type_code,
        activity_date: formData.activity_date,
        quantifier: formData.quantifier ? parseFloat(formData.quantifier) : null,
        unit: formData.unit || null,
        result: formData.result || null,
        notes: formData.notes || null,
        user_id,
      };

      console.log('Submitting activity:', activityData);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.NEW_ACTIVITY), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to log activity.');
      }

      console.log('Activity logged successfully.');
      onSuccess?.();
      onClose();

    } catch (err) {
      console.error('Error logging activity:', err);
      setError(err.message || 'Failed to log activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityModalBase
      title="Log New Activity"
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    >
      {/* Activity Type — locked if defaultActivityType was provided */}
      <ActivityTypeSelect
        value={formData.activity_type_code}
        onChange={handleChange}
        disabled={!!defaultActivityType}
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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <QuantifierInput value={formData.quantifier} onChange={handleChange} />
          <UnitSelect value={formData.unit} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <ResultField value={formData.result} onChange={handleChange} />
          <NotesField value={formData.notes} onChange={handleChange} />
        </div>
      </div>
    </ActivityModalBase>
  );
}
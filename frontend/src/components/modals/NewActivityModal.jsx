// ============================================
// NewActivityModal.jsx - Log New Activity Modal
// ============================================

import { useState, useEffect } from 'react';
import { getActivityTypes, getActivePlants } from '../../services/supabase';
import { getApiUrl, API_CONFIG } from '../../services/api';
import { getCurrentUserId } from '../../services/supabase';

export default function NewActivityModal({ onClose, onSuccess }) {
  // Form state
  const [formData, setFormData] = useState({
    activity_type_code: '',
    plant_id: '',
    activity_date: new Date().toISOString().split('T')[0], // Default to today
    quantifier: '',
    unit: '',
    result: '',
    notes: '',
  });

  // Dropdown data
  const [activityTypes, setActivityTypes] = useState([]);
  const [plants, setPlants] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Load dropdowns on mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [typesData, plantsData] = await Promise.all([
          getActivityTypes(),
          getActivePlants(),
        ]);
        setActivityTypes(typesData || []);
        setPlants(plantsData || []);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data. Please try again.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFormData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError('');

    // Validation
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

      const result = await response.json();
      console.log('Activity logged:', result);

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
    <>
      {/* Backdrop */}
      <div
        className='form-backdrop'
        onClick={onClose}
      >
        {/* Modal panel */}
        <div
          onClick={(e) => e.stopPropagation()}
          className='form-panel'
        >
          {/* Header */}
          <header>
            <h2>
              Log New Activity
            </h2>
            <button
              onClick={onClose}
              className='form-panel-close'
            >
              ×
            </button>
          </header>

          {/* Loading state */}
          {isLoadingData ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem 0' }}>
              Loading form data...
            </p>
          ) : (
            <>
              {/* ── Required Fields ── */}

              {/* Activity Type */}
              <div className='form-group'>
                <label>Activity Type *</label>
                <select
                  name="activity_type_code"
                  value={formData.activity_type_code}
                  onChange={handleChange}
                >
                  <option value="">Select activity type...</option>
                  {activityTypes.map((type) => (
                    <option key={type.activity_type_code} value={type.activity_type_code}>
                      {type.activity_label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plant */}
              <div className='form-group'>
                <label>Plant *</label>
                <select
                  name="plant_id"
                  value={formData.plant_id}
                  onChange={handleChange}
                >
                  <option value="">Select plant...</option>
                  {plants.map((plant) => (
                    <option key={plant.plant_id} value={plant.plant_id}>
                      {plant.full_plant_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className='form-group'>
                <label>Date *</label>
                <input
                  name="activity_date"
                  type="date"
                  value={formData.activity_date}
                  onChange={handleChange}
                />
              </div>

              {/* ── Optional Details Section ── */}
              <div className='form-section'>
                <h3>
                  <span style={{
                    display: 'inline-block', width: '4px', height: '20px',
                    background: 'var(--c-botanical-green)', borderRadius: '2px',
                  }} />
                  Optional Details
                </h3>

                {/* Quantity + Unit — side by side */}
                <div className='form-grid'>
                  <div className='form-group'>
                    <label>Quantity</label>
                    <input
                      name="quantifier"
                      type="number"
                      value={formData.quantifier}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="e.g., 250"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="">Select unit...</option>
                      <option value="%">Percentage (%)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="oz">Ounces (oz)</option>
                      <option value="cups">Cups</option>
                      <option value="grams">Grams (g)</option>
                      <option value="tsp">Teaspoons (tsp)</option>
                    </select>
                  </div>
                </div>

                {/* Result + Notes — side by side */}
                <div className='form-grid'>
                  <div className='form-group'>
                    <label>Results</label>
                    <textarea
                      name="result"
                      value={formData.result}
                      onChange={handleChange}
                      rows={3}
                      placeholder="e.g., recovered"
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Optional notes about this activity..."
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p style={{
                  color: 'var(--danger-text)',
                  backgroundColor: 'var(--danger-bg)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '15px',
                  fontSize: '0.9em',
                }}>
                  {error}
                </p>
              )}

              {/* ── Footer Buttons ── */}
              <div style={{
                display: 'flex',
                gap: '15px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-light)',
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="btn btn-secondary"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? 'SAVING...' : 'LOG ACTIVITY'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
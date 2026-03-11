// ============================================
// PlantSelect.jsx - Layer 2: Plant Field
// ============================================
// Renders a dropdown when free, or static plant
// name when locked (e.g. called from Plant Detail).
// ============================================

import { useState, useEffect } from 'react';
import { getActivePlants } from '../../../services/supabase';

export default function PlantSelect({ value, onChange, disabled = false }) {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getActivePlants();
        setPlants(data || []);
      } catch (err) {
        console.error('Error loading plants:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Find the plant name for static display when disabled
  const selectedPlant = plants.find((p) => String(p.plant_id) === String(value));

  return (
    <div className="form-group">
      <label className="form-label">Plant *</label>

      {disabled ? (
        // Static display when called from Plant Detail
        <>
          <div className="form-static-value">
            {isLoading ? 'Loading...' : (selectedPlant?.full_plant_name || '—')}
          </div>
          {/* Hidden input so the value is still available on submit */}
          <input type="hidden" name="plant_id" value={value} />
        </>
      ) : (
        <select
          name="plant_id"
          value={value}
          onChange={onChange}
          className="form-input"
          disabled={isLoading}
        >
          <option value="">
            {isLoading ? 'Loading plants...' : 'Select plant...'}
          </option>
          {plants.map((plant) => (
            <option key={plant.plant_id} value={plant.plant_id}>
              {plant.full_plant_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
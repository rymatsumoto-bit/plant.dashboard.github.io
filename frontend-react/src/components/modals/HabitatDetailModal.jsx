// ============================================
// HabitatDetailModal.jsx - Habitat Detail Modal
// ============================================
// Opens when a habitat card is clicked.
// Shows read-only habitat details with EDIT and ARCHIVE actions.
// ============================================

import { useState, useEffect } from 'react';
import {
  getHabitatById,
  getHumidityLevel,
  getHabitatLightArtificial,
  getHabitatLightWindow,
  getHabitatLightOutdoor,
} from '../../services/supabase';

export default function HabitatDetailModal({ habitatId, onClose, onEdit, onArchive }) {
  const [habitat, setHabitat]           = useState(null);
  const [humidityLevel, setHumidityLevel] = useState(null);
  const [lights, setLights]             = useState({ artificial: [], window: [], outdoor: [] });
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState('');

  // ── Load data on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!habitatId) return;
    loadHabitatDetails();
  }, [habitatId]);

  const loadHabitatDetails = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [habitatData, lightArtificial, lightWindow, lightOutdoor] = await Promise.all([
        getHabitatById(habitatId),
        getHabitatLightArtificial(habitatId),
        getHabitatLightWindow(habitatId),
        getHabitatLightOutdoor(habitatId),
      ]);

      const humidityData = habitatData.humidity_level_id
        ? await getHumidityLevel(habitatData.humidity_level_id)
        : null;

      setHabitat(habitatData);
      setHumidityLevel(humidityData);
      setLights({
        artificial: lightArtificial || [],
        window:     lightWindow     || [],
        outdoor:    lightOutdoor    || [],
      });

    } catch (err) {
      console.error('Error loading habitat details:', err);
      setError('Failed to load habitat details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Archive confirmation ────────────────────────────────────────────────────
  const handleArchive = () => {
    const confirmed = window.confirm(
      `Archive "${habitat?.habitat_name}"?\n\nArchived habitats are hidden from the list but not permanently deleted.`
    );
    if (confirmed) {
      onArchive?.(habitatId);
      onClose();
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getApplianceList = () => {
    if (!habitat) return '—';
    const map = {
      appliance_ac:         'Air Conditioning',
      appliance_heater:     'Heater',
      appliance_fan:        'Fan',
      appliance_humidifier: 'Humidifier',
    };
    const active = Object.entries(map)
      .filter(([key]) => habitat[key])
      .map(([, label]) => label);
    return active.length ? active.join(', ') : 'None';
  };

  const hasLights =
    lights.artificial.length > 0 ||
    lights.window.length > 0     ||
    lights.outdoor.length > 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="form-backdrop"
        onClick={onClose}
      >
        {/* Modal panel */}
        <div
          className="modal-panel"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="modal-panel-header">
            <h3>{isLoading ? 'Loading...' : 'Habitat Details'}</h3>
            <button className="close-modal" onClick={onClose} aria-label="Close">&#x2715;</button>
          </div>

          {/* ── Body ── */}
          <div style={{ minHeight: '200px' }}>

            {/* Loading */}
            {isLoading && (
              <div className="loading-inline" style={{ padding: 'var(--spacing-xl) 0' }}>
                <div className="loading-spinner"></div>
                <span>Loading habitat details...</span>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="modal-error">{error}</div>
            )}

            {/* Content */}
            {!isLoading && !error && habitat && (
              <>
                {/* Basic Info */}
                <div className="form-section">
                  <div className="form-group">
                    <label>Habitat Name</label>
                    <p className="modal-detail-value">{habitat.habitat_name || '—'}</p>
                  </div>
                </div>

                {/* Light Exposure */}
                <div className="form-section">
                  <h3>Light Exposure</h3>

                  {!hasLights && (
                    <p className="modal-detail-value">No light sources configured.</p>
                  )}

                  {lights.artificial.map((light) => (
                    <div key={light.light_artificial_id} className="habitat-light-item">
                      <div className="habitat-light-item-header">
                        <span className="habitat-light-item-title">
                          {light.light_name || 'Unnamed Light'}
                        </span>
                        <span style={{ fontSize: '0.85em', color: 'var(--text-light)' }}>
                          (Artificial)
                        </span>
                      </div>
                      <div className="habitat-light-item-details">
                        Strength: {light.light_artificial_strength?.light_artificial_strength || 'Unknown'}
                        &nbsp;|&nbsp;
                        Schedule: {light.start_time || 'Not set'} – {light.end_time || 'Not set'}
                      </div>
                    </div>
                  ))}

                  {lights.window.map((light) => (
                    <div key={light.light_window_id} className="habitat-light-item">
                      <div className="habitat-light-item-header">
                        <span className="habitat-light-item-title">
                          {light.light_name || 'Unnamed Window'}
                        </span>
                        <span style={{ fontSize: '0.85em', color: 'var(--text-light)' }}>
                          (Window)
                        </span>
                      </div>
                      <div className="habitat-light-item-details">
                        Direction: {light.direction?.full_name || 'Unknown'}
                        &nbsp;|&nbsp;
                        Size: {light.window_size?.window_size || 'Unknown'}
                        &nbsp;|&nbsp;
                        Address: {light.address?.address_name || 'Not linked'}
                      </div>
                    </div>
                  ))}

                  {lights.outdoor.map((light) => (
                    <div key={light.light_outdoor_id} className="habitat-light-item">
                      <div className="habitat-light-item-header">
                        <span className="habitat-light-item-title">
                          {light.light_name || 'Unnamed Outdoor Area'}
                        </span>
                        <span style={{ fontSize: '0.85em', color: 'var(--text-light)' }}>
                          (Outdoor)
                        </span>
                      </div>
                      <div className="habitat-light-item-details">
                        Exposure: {Array.isArray(light.direction) ? light.direction.join(', ') : 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Temperature */}
                <div className="form-section">
                  <h3>Temperature</h3>
                  <div className="form-group">
                    <label>Control</label>
                    <p className="modal-detail-value">
                      {habitat.temperature_controlled ? 'Controlled' : 'Non-Controlled'}
                    </p>
                  </div>

                  {habitat.temperature_controlled && (
                    <div className="form-section-single-row">
                      <div className="form-group">
                        <label>Min (°F)</label>
                        <p className="detail-value">{habitat.temp_min ?? '—'}</p>
                      </div>
                      <div className="form-group">
                        <label>Max (°F)</label>
                        <p className="detail-value">{habitat.temp_max ?? '—'}</p>
                      </div>
                      <div className="form-group">
                        <label>Avg (°F)</label>
                        <p className="detail-value">{habitat.temp_avg ?? '—'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Humidity */}
                <div className="form-section">
                  <h3>Humidity</h3>
                  <div className="form-group">
                    <label>Level</label>
                    <p className="detail-value">{humidityLevel?.humidity_level || '—'}</p>
                  </div>
                </div>

                {/* Appliances */}
                <div className="form-section">
                  <h3>Appliances</h3>
                  <div className="form-group">
                    <p className="detail-value">{getApplianceList()}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="modal-buttons">
            <button
              className="btn btn-edit"
              onClick={() => { onEdit?.(habitatId); onClose(); }}
              disabled={isLoading}
            >
              EDIT
            </button>
            <button
              className="btn btn-delete"
              onClick={handleArchive}
              disabled={isLoading}
            >
              ARCHIVE
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              CLOSE
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
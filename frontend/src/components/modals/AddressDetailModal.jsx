// ============================================
// AddressDetailModal.jsx - Address Detail Modal
// ============================================
// Opens when an address card is clicked.
// Shows read-only address details with EDIT and ARCHIVE actions.
// ============================================

import { useState, useEffect } from 'react';
import { getAddressById } from '../../services/supabase';

export default function AddressDetailModal({ addressId, onClose, onEdit, onArchive }) {
  const [address, setAddress]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');

  // ── Load data on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!addressId) return;
    loadAddressDetails();
  }, [addressId]);

  const loadAddressDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getAddressById(addressId);
      setAddress(data);
    } catch (err) {
      console.error('Error loading address details:', err);
      setError('Failed to load address details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Archive confirmation ────────────────────────────────────────────────────
  const handleArchive = () => {
    const confirmed = window.confirm(
      `Archive "${address?.address_name}"?\n\nArchived addresses are hidden from the list but not permanently deleted.`
    );
    if (confirmed) {
      onArchive?.(addressId);
      onClose();
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatLocation = () => {
    if (!address) return '—';
    const parts = [address.city, address.state_province, address.country].filter(Boolean);
    return parts.join(', ') || '—';
  };

  const formatCoordinates = () => {
    if (!address || (address.latitude == null && address.longitude == null)) return null;
    return `${address.latitude ?? '—'}, ${address.longitude ?? '—'}`;
  };

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
          className="bg-white rounded-xl p-8 max-w-150 w-[90%] max-h-[90vh] overflow-y-auto shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-clay">
            <h3>{isLoading ? 'Loading...' : (address?.address_name || 'Address Details')}</h3>
            <button className="bg-transparent border-none text-2xl text-font-light p-0 leading-none cursor-pointer hover:text-font-base" onClick={onClose} aria-label="CLOSE">×</button>
          </div>

          {/* ── Body ── */}
          <div style={{ minHeight: '160px' }}>

            {/* Loading */}
            {isLoading && (
              <div className="loading-spinner">Loading address details...</div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="error-message">{error}</div>
            )}

            {/* Content */}
            {!isLoading && !error && address && (
              <>
                {/* Basic Information */}
                <div className="form-section">
                  <div className="form-section-title">Basic Information</div>

                  <div className="form-group">
                    <label>Address Name</label>
                    <p className="detail-value">{address.address_name || '—'}</p>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <p className="detail-value">{formatLocation()}</p>
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <p className="detail-value">{address.postal_code || '—'}</p>
                  </div>
                </div>

                {/* Coordinates */}
                {formatCoordinates() && (
                  <div className="form-section">
                    <div className="form-section-title">Coordinates</div>
                    <div className="flex flex-row gap-8">
                      <div className="form-group">
                        <label>Latitude</label>
                        <p className="detail-value">{address.latitude ?? '—'}</p>
                      </div>
                      <div className="form-group">
                        <label>Longitude</label>
                        <p className="detail-value">{address.longitude ?? '—'}</p>
                      </div>
                    </div>
                    <p className="help-text">Used for weather data and sunrise/sunset calculations</p>
                  </div>
                )}

                {/* Timezone */}
                <div className="form-section">
                  <div className="form-section-title">Timezone</div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <p className="detail-value">{address.timezone || '—'}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex gap-4 mt-4 pt-2.5 border-t border-clay">
            <button
              className="btn btn-edit"
              onClick={() => { onEdit?.(addressId); onClose(); }}
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
            <button className="btn btn-small btn-secondary" onClick={onClose}>
              CLOSE
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
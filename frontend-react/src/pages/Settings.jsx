import { useState } from 'react';
import PageLayout from '../components/navigation/PageLayout';
import { getApiUrl, API_CONFIG } from '../services/api';

export default function Settings({ onNavigate }) {
  const [batchStatus, setBatchStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [batchMessage, setBatchMessage] = useState('');

  const handleRunDailyBatch = async () => {
    try {
      setBatchStatus('loading');
      setBatchMessage('');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MANUAL_DAILY_BATCH), {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to launch daily batch');
      }

      setBatchStatus('success');
      setBatchMessage('Daily batch started successfully.');
    } catch (error) {
      console.error('Error launching daily batch:', error);
      setBatchStatus('error');
      setBatchMessage(error.message || 'Error launching daily batch.');
    }
  };

  return (
    <PageLayout currentView="settings" onNavigate={onNavigate}>

      <div className="header">
        <p>Configure your app settings.</p>
      </div>

      {/* Admin Actions */}
      <div className="chunk-title">Admin</div>

      <div className="card">
        <h4>Daily Batch</h4>
        <p>Manually trigger the daily batch to recalculate plant factors, statuses, and schedules.</p>

        <button
          className="btn btn-primary"
          onClick={handleRunDailyBatch}
          disabled={batchStatus === 'loading'}
        >
          {batchStatus === 'loading' ? 'Running...' : 'RUN DAILY BATCH'}
        </button>

        {/* Feedback */}
        {batchStatus === 'success' && (
          <p className="mt-md" style={{ color: 'var(--success-text)' }}>
            ✅ {batchMessage}
          </p>
        )}
        {batchStatus === 'error' && (
          <p className="mt-md" style={{ color: 'var(--danger-text)' }}>
            ❌ {batchMessage}
          </p>
        )}
      </div>

    </PageLayout>
  );
}
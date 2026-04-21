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

      {/* Admin Actions */}
      <div className="card">
        <h1>Daily Batch</h1>
        <p>Manually trigger the daily batch to recalculate plant factors, statuses, and schedules.</p>

        <button
          className="btn btn-primary w-48 h-12"
          onClick={handleRunDailyBatch}
          disabled={batchStatus === 'loading'}
        >
          {batchStatus === 'loading' ? 'Running...' : 'RUN DAILY BATCH'}
        </button>

        {/* Feedback */}
        {batchStatus === 'success' && (
          <p className="mt-4 text-success">
            ✅ {batchMessage}
          </p>
        )}
        {batchStatus === 'error' && (
          <p className="mt-4 text-danger">
            ❌ {batchMessage}
          </p>
        )}
      </div>

    </PageLayout>
  );
}
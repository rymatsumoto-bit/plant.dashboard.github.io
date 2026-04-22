import { useState } from 'react';
import PageLayout from '../components/navigation/PageLayout';

export default function Reports({ onNavigate }) {
const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return (
      <PageLayout currentView="reports" onNavigate={onNavigate}>
        <div className="flex justify-center items-center min-h-100">
          <div className="loading-spinner">Loading reports...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout currentView="reports" onNavigate={onNavigate}>

      <div>
        <p>Reports will be here...</p>
      </div>

    </PageLayout>
  );
}
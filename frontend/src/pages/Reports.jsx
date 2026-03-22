import { useState } from 'react';
import PageLayout from '../components/navigation/PageLayout';

export default function Reports({ onNavigate }) {
const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return (
      <PageLayout currentView="reports" onNavigate={onNavigate}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div className="loading-spinner">Loading reports...</div>
          <div className="bg-red-500 text-white p-4">Tailwind works!</div>
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
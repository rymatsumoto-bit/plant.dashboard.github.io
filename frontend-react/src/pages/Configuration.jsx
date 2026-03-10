import { useState } from 'react';
import PageLayout from '../components/navigation/PageLayout';

export default function Configuration({ onNavigate }) {
const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return (
      <PageLayout currentView="configuration" onNavigate={onNavigate}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div className="loading-spinner">Loading configurations...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout currentView="configuration" onNavigate={onNavigate}>

      <div>
        <p>Configurations will be here...</p>
      </div>

    </PageLayout>
  );
}
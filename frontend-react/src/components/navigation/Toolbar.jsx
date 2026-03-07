function Toolbar({ currentView }) {
  // Map view names to display titles and taglines
  const viewInfo = {
    dashboard: {
      title: 'Dashboard',
      tagline: 'Your plant care overview'
    },
    inventory: {
      title: 'Plant Inventory',
      tagline: 'Manage your plant collection'
    },
    reports: {
      title: 'Reports',
      tagline: 'Analyze your plant care data'
    },
    configuration: {
      title: 'Configuration',
      tagline: 'Set up plant care parameters'
    },
    settings: {
      title: 'Settings',
      tagline: 'Manage your account and preferences'
    }
  };

  const info = viewInfo[currentView] || viewInfo.dashboard;

  return (
    <div className="toolbar">
      <div className="toolbar-title-section">
        <h1 className="toolbar-title">{info.title}</h1>
        <p className="toolbar-tagline">{info.tagline}</p>
      </div>
    </div>
  );
}

export default Toolbar;
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

function PageLayout({ children, currentView, onNavigate, onActivitySuccess }) {
  return (
    <div className="page-container">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Toolbar */}
        <Toolbar currentView={currentView} onActivitySuccess={onActivitySuccess} />

        {/* Page Content */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
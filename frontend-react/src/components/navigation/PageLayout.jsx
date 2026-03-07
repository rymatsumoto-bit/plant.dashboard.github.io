import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

function PageLayout({ children, title, subtitle, currentView }) {
  return (
    <div className="page-container">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Toolbar */}
        <Toolbar title={title} subtitle={subtitle} />

        {/* Page Content */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
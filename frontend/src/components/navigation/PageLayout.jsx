import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

function PageLayout({ children, currentView, onNavigate, onActivitySuccess }) {
  return (
    <div className="flex flex-1 w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Toolbar */}
        <Toolbar currentView={currentView} onActivitySuccess={onActivitySuccess} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full p-8 mb-8]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
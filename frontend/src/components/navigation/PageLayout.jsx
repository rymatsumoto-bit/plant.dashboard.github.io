// ============================================
// PageLayout.jsx - Page Shell
// ============================================
// Wraps every authenticated page with the sidebar,
// toolbar, and ActivityLauncher. The launcher is
// mounted here so it is always present and always
// has access to the ActivityContext.
// ============================================

import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import ActivityLauncher from '../modals/ActivityLauncher';

function PageLayout({ children, currentView, onNavigate }) {
  return (
    <div className="flex flex-1 w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Toolbar */}
        <Toolbar currentView={currentView} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full p-8 mb-8">
          {children}
        </div>
      </div>

      {/* Activity Modal Launcher — always mounted, renders the correct modal */}
      <ActivityLauncher />
    </div>
  );
}

export default PageLayout;
// ============================================
// ActivityModalBase.jsx - Layer 1: Modal Shell
// ============================================
// Provides: backdrop, panel, header, footer buttons,
// error message, and loading state.
// Knows nothing about specific form fields.
// ============================================

export default function ActivityModalBase({
  title,
  onClose,
  onSubmit,
  isLoading = false,
  isLoadingData = false,
  error = '',
  submitLabel = 'LOG ACTIVITY',
  children,
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="form-backdrop" onClick={onClose}>

        {/* Modal Panel */}
        <div
          className="modal-panel"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-panel-header">
            <h2 className="modal-panel-title">{title}</h2>
            <button className="modal-panel-close" onClick={onClose}>×</button>
          </div>

          {/* Body */}
          {isLoadingData ? (
            <p className="modal-loading-text">Loading form data...</p>
          ) : (
            <>
              {/* Form fields injected here by Layer 3 */}
              <div className="modal-panel-body">
                {children}
              </div>

              {/* Error Message */}
              {error && (
                <p className="modal-error">{error}</p>
              )}

              {/* Footer Buttons */}
              <div className="modal-panel-footer">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="btn btn-secondary"
                >
                  CANCEL
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? 'SAVING...' : submitLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
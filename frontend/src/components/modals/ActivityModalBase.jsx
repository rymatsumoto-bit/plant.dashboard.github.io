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
          className="bg-white rounded-xl p-8 max-w-150 w-[90%] max-h-[90vh] overflow-y-auto shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-clay">
            <h2 className="m-0 text-botanical text-2xl">{title}</h2>
            <button className="bg-transparent border-none text-2xl text-font-light p-0 leading-none cursor-pointer hover:text-font-base" onClick={onClose} aria-label="CLOSE">×</button>
          </div>

          {/* Body */}
          {isLoadingData ? (
            <p className="loading-spinner">Loading form data...</p>
          ) : (
            <>
              {/* Form fields injected here by Layer 3 */}
              <div className="mb-5">
                {children}
              </div>

              {/* Error Message */}
              {error && (
                <p className="error-message">{error}</p>
              )}

              {/* Footer Buttons */}
              <div className="flex gap-4 pt-5 border-t border-clay justify-end">
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
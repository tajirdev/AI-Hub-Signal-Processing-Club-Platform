import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitText = 'Save Changes',
  submitColor = 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
  submitting = false,
  maxWidth = 'max-w-xl',
  hideFooter = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Frosted Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-950/65 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/25 border border-white/60 w-full ${maxWidth} overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ring-1 ring-black/5`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100/80 flex items-center justify-between bg-gray-50/60 backdrop-blur-md">
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100/80 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>

        {/* Body */}
        {onSubmit ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4 flex-1">{children}</div>

            {/* Footer */}
            {!hideFooter && (
              <div className="px-6 py-3.5 border-t border-gray-100/80 bg-gray-50/60 backdrop-blur-md flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center space-x-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 transition-all transform active:scale-95 ${submitColor}`}
                >
                  {submitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />}
                  <span>{submitText}</span>
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4 flex-1">{children}</div>
            {!hideFooter && (
              <div className="px-6 py-3.5 border-t border-gray-100/80 bg-gray-50/60 backdrop-blur-md flex items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

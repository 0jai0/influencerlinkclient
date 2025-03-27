import React, { useEffect, useState,useCallback  } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  onConfirm, 
  onCancel, 
  duration = 30000 
}) => {
  const [visible, setVisible] = useState(true);

  // Handle closing the alert
 

const handleClose = useCallback(() => {
  setVisible(false);
  onClose?.();
}, [onClose]); // Only depends on `onClose`


  // Handle cancel action
  const handleCancel = () => {
    setVisible(false);
    onCancel?.(); // Safely call onCancel if provided
  };

  // Handle confirm action
  const handleConfirm = () => {
    setVisible(false);
    onConfirm?.(); // Safely call onConfirm if provided
  };

  useEffect(() => {
    // Only set timer if duration is provided and positive
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!visible) return null;

  // Alert styling configuration
  const alertConfig = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex flex-col p-4 border-l-4 rounded-lg shadow-lg ${config.bg} ${config.border} ${config.text}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-2">{config.icon}</div>
        <div className="text-sm font-semibold">{message}</div>
        <button
          onClick={handleClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
          aria-label="Close alert"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Action buttons - only render if handlers are provided */}
      {(onConfirm || onCancel) && (
        <div className="flex justify-end space-x-4 mt-4">
          {onCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
            >
              OK
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  duration: PropTypes.number
};

export default Alert;
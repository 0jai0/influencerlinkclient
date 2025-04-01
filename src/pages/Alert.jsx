import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  onConfirm, 
  onCancel, 
  duration = 30000,
  title,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 300); // Match this with the transition duration
  }, [onClose]);

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      onCancel?.();
    }, 300);
  };

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      onConfirm?.();
    }, 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!visible) return null;

  // Alert styling configuration
  const alertConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      button: 'bg-green-600 hover:bg-green-700 text-white',
      cancelButton: 'text-green-700 hover:bg-green-100'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      button: 'bg-red-600 hover:bg-red-700 text-white',
      cancelButton: 'text-red-700 hover:bg-red-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      cancelButton: 'text-yellow-700 hover:bg-yellow-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      cancelButton: 'text-blue-700 hover:bg-blue-100'
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`fixed top-28 right-4 z-50 w-fit max-w-sm transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div
        className={`relative p-4 rounded-lg shadow-lg ${config.bg} ${config.border} ${config.text} border-l-4`}
        role="alert"
      >
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.text} mr-3`}>
            {config.icon}
          </div>
          <div className="flex-1 pt-0.5">
            {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
            <div className="text-sm">{message}</div>
            
            {(onConfirm || onCancel) && (
              <div className="flex justify-end space-x-3 mt-4">
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${config.cancelButton} transition-colors duration-200`}
                  >
                    {cancelText}
                  </button>
                )}
                {onConfirm && (
                  <button
                    onClick={handleConfirm}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${config.button} transition-colors duration-200`}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20">
            <div 
              className="h-full bg-current transition-all duration-300 ease-linear" 
              style={{ 
                width: isExiting ? '100%' : '0%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  duration: PropTypes.number,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default Alert;
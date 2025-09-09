import React, { useEffect, useState } from 'react';
import './Alert.css';

const Alert = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
      case 'warning':
        return 'Warning!';
      case 'info':
        return 'Information';
      default:
        return 'Alert';
    }
  };

  return (
    <div className={`custom-alert-overlay ${isLeaving ? 'leaving' : ''}`}>
      <div className={`custom-alert custom-alert-${type} ${isLeaving ? 'slide-out' : 'slide-in'}`}>
        <div className="alert-icon-wrapper">
          <span className="alert-icon">{getIcon()}</span>
        </div>
        <div className="alert-content">
          <h3 className="alert-title">{getTitle()}</h3>
          <p className="alert-message">{message}</p>
        </div>
        <button className="alert-close" onClick={handleClose} aria-label="Close alert">
          <span>✕</span>
        </button>
        <div className="alert-progress">
          <div 
            className="alert-progress-bar" 
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
};

// Alert Manager Component for managing multiple alerts
export const AlertManager = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Listen for custom alert events
    const handleAlert = (event) => {
      const { message, type, duration } = event.detail;
      addAlert(message, type, duration);
    };

    window.addEventListener('showAlert', handleAlert);
    return () => window.removeEventListener('showAlert', handleAlert);
  }, []);

  const addAlert = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

// Utility function to show alerts programmatically
export const showAlert = (message, type = 'info', duration = 5000) => {
  const event = new CustomEvent('showAlert', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

// Login specific alert component
export const LoginAlert = ({ error, onClose }) => {
  if (!error) return null;

  const getErrorMessage = (error) => {
    if (error.includes('password') || error.includes('Password')) {
      return 'Incorrect password. Please try again.';
    } else if (error.includes('email') || error.includes('Email')) {
      return 'Invalid email address. Please check and try again.';
    } else if (error.includes('user') || error.includes('User')) {
      return 'User not found. Please check your credentials.';
    } else if (error.includes('network') || error.includes('Network')) {
      return 'Network error. Please check your connection.';
    } else {
      return error || 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="login-alert-wrapper">
      <div className="login-alert login-alert-error">
        <div className="login-alert-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="login-alert-content">
          <span className="login-alert-message">{getErrorMessage(error)}</span>
        </div>
        {onClose && (
          <button className="login-alert-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path 
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" 
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Toast notification component
export const Toast = ({ message, type = 'info', position = 'top-right', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${position} toast-${type} ${isLeaving ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>✕</button>
    </div>
  );
};

export default Alert;

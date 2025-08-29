import { Snackbar, Alert, Slide, Fade, Grow } from '@mui/material';
import { useState, useEffect, createContext, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, severity = 'info', duration = 6000, action = null) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      duration,
      action,
      open: true,
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  };

  const hideNotification = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, open: false }
          : notification
      )
    );

    // Remove from array after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  };

  const showSuccess = (message, duration, action) => {
    return showNotification(message, 'success', duration, action);
  };

  const showError = (message, duration, action) => {
    return showNotification(message, 'error', duration, action);
  };

  const showWarning = (message, duration, action) => {
    return showNotification(message, 'warning', duration, action);
  };

  const showInfo = (message, duration, action) => {
    return showNotification(message, 'info', duration, action);
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            top: `${80 + index * 70}px !important`,
            zIndex: 9999,
          }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'left' }}
        >
          <Alert
            onClose={() => hideNotification(notification.id)}
            severity={notification.severity}
            variant="filled"
            action={notification.action}
            sx={{
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              minWidth: 300,
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const NotificationToast = ({ 
  open, 
  onClose, 
  message, 
  severity = 'info', 
  action = null,
  transition = 'slide',
  anchorOrigin = { vertical: 'top', horizontal: 'right' }
}) => {
  const getTransitionComponent = () => {
    switch (transition) {
      case 'fade':
        return Fade;
      case 'grow':
        return Grow;
      case 'slide':
      default:
        return Slide;
    }
  };

  const TransitionComponent = getTransitionComponent();
  const transitionProps = transition === 'slide' ? { direction: 'left' } : {};

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={TransitionComponent}
      TransitionProps={transitionProps}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        action={action}
        sx={{
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          minWidth: 300,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

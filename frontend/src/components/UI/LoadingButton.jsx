import { Button, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

const LoadingButton = forwardRef(({
  loading = false,
  children,
  disabled,
  startIcon,
  loadingPosition = 'start',
  loadingIndicator,
  ...props
}, ref) => {
  const getLoadingIndicator = () => {
    if (loadingIndicator) return loadingIndicator;
    return <CircularProgress size={20} color="inherit" />;
  };

  const getStartIcon = () => {
    if (loading && loadingPosition === 'start') {
      return getLoadingIndicator();
    }
    return startIcon;
  };

  const getEndIcon = () => {
    if (loading && loadingPosition === 'end') {
      return getLoadingIndicator();
    }
    return props.endIcon;
  };

  return (
    <Button
      ref={ref}
      disabled={disabled || loading}
      startIcon={getStartIcon()}
      endIcon={getEndIcon()}
      {...props}
      sx={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover:not(:disabled)': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx,
      }}
    >
      {loading && loadingPosition === 'center' ? getLoadingIndicator() : children}
    </Button>
  );
});

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;

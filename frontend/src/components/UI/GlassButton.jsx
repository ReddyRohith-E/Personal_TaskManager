import { Button, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

const GlassButton = forwardRef(({
  children,
  variant = 'contained', // contained, outlined, text, glass
  size = 'medium',
  loading = false,
  disabled = false,
  glowEffect = false,
  ...props
}, ref) => {
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 16,
      fontWeight: 500,
      textTransform: 'none',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover:not(:disabled)': {
        transform: 'translateY(-2px) scale(1.02)',
        '&::before': {
          opacity: 1,
        },
      },
      '&:active:not(:disabled)': {
        transform: 'translateY(0) scale(0.98)',
      },
    };

    const sizeStyles = {
      small: {
        padding: 'clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)',
        fontSize: 'clamp(0.75rem, 1vw, 0.8125rem)',
      },
      medium: {
        padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
        fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
      },
      large: {
        padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 5vw, 32px)',
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      },
    };

    const variantStyles = {
      contained: {
        background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
        '&:hover:not(:disabled)': {
          background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
          boxShadow: '0 12px 40px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
        },
      },
      outlined: {
        background: 'rgba(51, 65, 85, 0.3)',
        color: '#2dd4bf',
        border: '1px solid #14b8a6',
        '&:hover:not(:disabled)': {
          background: 'rgba(30, 41, 59, 0.4)',
          borderColor: '#2dd4bf',
          boxShadow: '0 8px 24px rgba(20, 184, 166, 0.2)',
        },
      },
      text: {
        background: 'transparent',
        color: '#2dd4bf',
        '&:hover:not(:disabled)': {
          background: 'rgba(20, 184, 166, 0.1)',
        },
      },
      glass: {
        background: 'rgba(30, 41, 59, 0.4)',
        color: '#f8fafc',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        '&:hover:not(:disabled)': {
          background: 'rgba(30, 41, 59, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    };

    const glowStyles = glowEffect ? {
      '&::after': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: 'linear-gradient(45deg, #14b8a6, #0ea5e9, #2dd4bf)',
        borderRadius: 'inherit',
        zIndex: -1,
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover:not(:disabled)::after': {
        opacity: 0.7,
        animation: 'pulse 2s infinite',
      },
    } : {};

    const disabledStyles = (disabled || loading) ? {
      background: 'rgba(15, 23, 42, 0.6) !important',
      color: 'rgba(148, 163, 184, 0.5) !important',
      border: '1px solid rgba(255, 255, 255, 0.05) !important',
      transform: 'none !important',
      boxShadow: 'none !important',
      cursor: 'not-allowed',
    } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...glowStyles,
      ...disabledStyles,
    };
  };

  return (
    <Button
      ref={ref}
      disabled={disabled || loading}
      {...props}
      sx={{
        ...getButtonStyles(),
        ...props.sx,
      }}
    >
      {loading && (
        <CircularProgress
          size={16}
          sx={{
            color: 'inherit',
            mr: 1,
          }}
        />
      )}
      {children}
    </Button>
  );
});

GlassButton.displayName = 'GlassButton';

export default GlassButton;

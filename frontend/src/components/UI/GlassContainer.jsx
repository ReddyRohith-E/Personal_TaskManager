import { Box } from '@mui/material';
import { forwardRef } from 'react';

const GlassContainer = forwardRef(({
  children,
  variant = 'default', // default, dark, light, accent, card
  blur = 20,
  opacity = 0.4,
  interactive = false,
  floating = false,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    const baseStyles = {
      backdropFilter: `blur(${blur}px)`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (variant) {
      case 'dark':
        return {
          ...baseStyles,
          background: `rgba(15, 23, 42, ${opacity + 0.2})`,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
        };
      case 'light':
        return {
          ...baseStyles,
          background: `rgba(51, 65, 85, ${opacity - 0.1})`,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
        };
      case 'accent':
        return {
          ...baseStyles,
          background: `rgba(20, 184, 166, ${opacity - 0.3})`,
          border: '1px solid rgba(20, 184, 166, 0.2)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)',
        };
      case 'card':
        return {
          ...baseStyles,
          background: `rgba(30, 41, 59, ${opacity})`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(20, 184, 166, 0.1)',
        };
      case 'default':
      default:
        return {
          ...baseStyles,
          background: `rgba(30, 41, 59, ${opacity})`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        };
    }
  };

  const floatingAnimation = floating ? {
    animation: 'morphFloat 6s ease-in-out infinite',
  } : {};

  const interactiveStyles = interactive ? {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.01)',
      borderColor: variant === 'accent' 
        ? 'rgba(20, 184, 166, 0.3)' 
        : 'rgba(255, 255, 255, 0.2)',
      boxShadow: variant === 'accent'
        ? '0 12px 48px rgba(20, 184, 166, 0.25), 0 8px 24px rgba(0, 0, 0, 0.3)'
        : '0 12px 40px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(20, 184, 166, 0.15)',
    },
    '&:active': {
      transform: 'translateY(0) scale(0.99)',
    },
  } : {};

  const containerStyles = {
    ...getVariantStyles(),
    ...floatingAnimation,
    ...interactiveStyles,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: variant === 'accent'
        ? 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      pointerEvents: 'none',
      borderRadius: 'inherit',
    },
    ...props.sx,
  };

  return (
    <Box ref={ref} {...props} sx={containerStyles}>
      {children}
    </Box>
  );
});

GlassContainer.displayName = 'GlassContainer';

export default GlassContainer;

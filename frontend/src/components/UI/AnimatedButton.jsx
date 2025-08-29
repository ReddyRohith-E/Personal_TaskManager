import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-4px) scale(1.02); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

const StyledButton = styled(Button)(({ theme, variant, gloweffect }) => ({
  borderRadius: 16,
  fontWeight: 500,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
  padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',

  // Glass morphism base
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

  // Shimmer effect overlay
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },

  // Variants
  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
  }),

  ...(variant === 'secondary' && {
    background: 'rgba(51, 65, 85, 0.3)',
    color: '#2dd4bf',
    border: '1px solid #14b8a6',
  }),

  ...(variant === 'glass' && {
    background: 'rgba(30, 41, 59, 0.4)',
    color: '#f8fafc',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  }),

  ...(variant === 'outlined' && {
    background: 'transparent',
    color: '#2dd4bf',
    border: '1px solid #14b8a6',
  }),

  // Hover effects
  '&:hover:not(:disabled)': {
    transform: 'translateY(-2px) scale(1.02)',
    animation: `${float} 3s ease-in-out infinite`,
    
    '&::before': {
      opacity: 1,
    },

    '&::after': {
      left: '100%',
    },

    ...(variant === 'primary' && {
      background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
      boxShadow: '0 12px 40px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
    }),

    ...(variant === 'secondary' && {
      background: 'rgba(30, 41, 59, 0.4)',
      borderColor: '#2dd4bf',
      boxShadow: '0 8px 24px rgba(20, 184, 166, 0.2)',
    }),

    ...(variant === 'glass' && {
      background: 'rgba(30, 41, 59, 0.6)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }),

    ...(variant === 'outlined' && {
      background: 'rgba(20, 184, 166, 0.1)',
      borderColor: '#2dd4bf',
    }),
  },

  '&:active:not(:disabled)': {
    transform: 'translateY(0) scale(0.98)',
    animation: 'none',
  },

  // Glow effect
  ...(gloweffect && {
    position: 'relative',
    '&::before': {
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
    '&:hover:not(:disabled)::before': {
      opacity: 0.7,
      animation: `${pulse} 2s infinite`,
    },
  }),

  // Disabled state
  '&:disabled': {
    background: 'rgba(15, 23, 42, 0.6) !important',
    color: 'rgba(148, 163, 184, 0.5) !important',
    border: '1px solid rgba(255, 255, 255, 0.05) !important',
    transform: 'none !important',
    boxShadow: 'none !important',
    cursor: 'not-allowed',
    animation: 'none !important',
  },

  // Responsive sizing
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(0.75rem, 3vw, 0.8125rem)',
    padding: 'clamp(8px, 3vw, 10px) clamp(16px, 6vw, 20px)',
  },
}));

const AnimatedButton = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  glowEffect = false,
  ...props
}) => {
  return (
    <StyledButton
      variant="contained"
      disabled={disabled || loading}
      gloweffect={glowEffect}
      {...props}
      sx={{
        variant,
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
    </StyledButton>
  );
};

export default AnimatedButton;

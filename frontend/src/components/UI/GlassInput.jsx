import { TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const StyledTextField = styled(TextField)(({ theme, variant }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
    
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderRadius: 16,
      
      '& legend': {
        fontSize: '0.75em',
        maxWidth: '100%',
        padding: '0 8px',
        '& span': {
          paddingLeft: '5px',
          paddingRight: '5px',
        },
      },
    },

    // Hide any browser default password icons
    '&::-ms-reveal, &::-ms-clear': {
      display: 'none !important',
    },

    '&:hover:not(.Mui-focused):not(.Mui-error)': {
      background: 'rgba(30, 41, 59, 0.5)',
      
      '& fieldset': {
        borderColor: 'rgba(45, 212, 191, 0.3)',
      },
    },

    '&.Mui-focused:not(.Mui-error)': {
      background: 'rgba(30, 41, 59, 0.6)',
      
      '& fieldset': {
        borderColor: '#14b8a6',
        borderWidth: 2,
        
        '& legend': {
          fontSize: '0.75em',
        },
      },
    },

    '&.Mui-error': {
      '& fieldset': {
        borderColor: '#ef4444',
      },
      
      '&:hover': {
        '& fieldset': {
          borderColor: '#dc2626',
        },
      },
      
      '&.Mui-focused': {
        '& fieldset': {
          borderColor: '#dc2626',
          borderWidth: 2,
        },
      },
    },

    '&.Mui-disabled': {
      background: 'rgba(15, 23, 42, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.05)',
      
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.05)',
      },
    },

    // Input text styling
    '& input': {
      color: '#f8fafc',
      padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 16px)',
      fontSize: 'inherit',
      fontWeight: 400,
      
      '&::placeholder': {
        color: 'rgba(148, 163, 184, 0.7)',
        opacity: 1,
      },
      
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px rgba(30, 41, 59, 0.8) inset',
        WebkitTextFillColor: '#f8fafc',
        borderRadius: 'inherit',
      },

      // Hide browser default password reveal button
      '&::-ms-reveal': {
        display: 'none',
      },
      '&::-ms-clear': {
        display: 'none',
      },
      '&::-webkit-credentials-auto-fill-button': {
        display: 'none !important',
        visibility: 'hidden',
        pointerEvents: 'none',
        position: 'absolute',
        right: '0',
      },
    },

    // Textarea styling
    '& textarea': {
      color: '#f8fafc',
      fontSize: 'inherit',
      fontWeight: 400,
      
      '&::placeholder': {
        color: 'rgba(148, 163, 184, 0.7)',
        opacity: 1,
      },
    },
  },

  // Label styling
  '& .MuiInputLabel-root': {
    color: 'rgba(148, 163, 184, 0.8)',
    fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    backgroundColor: 'transparent',
    padding: '0 8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    
    '&.Mui-focused': {
      color: '#2dd4bf',
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      transform: 'translate(14px, -9px) scale(0.75)',
    },
    
    '&.MuiInputLabel-shrink': {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      transform: 'translate(14px, -9px) scale(0.75)',
    },
    
    '&.Mui-error': {
      color: '#ef4444',
      
      '&.Mui-focused, &.MuiInputLabel-shrink': {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
      },
    },
  },

  // Helper text styling
  '& .MuiFormHelperText-root': {
    color: 'rgba(148, 163, 184, 0.7)',
    fontSize: 'clamp(0.75rem, 1vw, 0.8125rem)',
    fontFamily: 'Inter, sans-serif',
    marginTop: 8,
    
    '&.Mui-error': {
      color: '#ef4444',
    },
  },

  // Variant styles
  ...(variant === 'glass-light' && {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(45, 212, 191, 0.4)',
      },
      
      '&.Mui-focused': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#2dd4bf',
      },
    },
  }),

  ...(variant === 'glass-dark' && {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      
      '&:hover': {
        background: 'rgba(15, 23, 42, 0.7)',
        borderColor: 'rgba(45, 212, 191, 0.2)',
      },
      
      '&.Mui-focused': {
        background: 'rgba(15, 23, 42, 0.8)',
        borderColor: '#14b8a6',
      },
    },
  }),

  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    '& .MuiOutlinedInput-root': {
      fontSize: 'clamp(0.75rem, 3vw, 0.8125rem)',
      
      '& input': {
        padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 14px)',
      },
    },
    
    '& .MuiInputLabel-root': {
      fontSize: 'clamp(0.75rem, 3vw, 0.8125rem)',
    },
  },
}));

const GlassInput = forwardRef(({
  variant = 'default',
  startIcon,
  endIcon,
  glowOnFocus = false,
  ...props
}, ref) => {
  const { InputProps: originalInputProps, ...otherProps } = props;
  
  // Build InputProps carefully to avoid conflicts
  const inputProps = {
    ...(originalInputProps || {}),
  };

  // Always clear any existing endAdornment if we're providing our own endIcon
  if (endIcon) {
    delete inputProps.endAdornment;
  }

  // Only add startAdornment if startIcon is provided
  if (startIcon) {
    inputProps.startAdornment = (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    );
  }

  // Only add endAdornment if endIcon is provided, this will override any existing endAdornment
  if (endIcon) {
    inputProps.endAdornment = (
      <InputAdornment position="end">
        {endIcon}
      </InputAdornment>
    );
  }

  return (
    <StyledTextField
      ref={ref}
      variant="outlined"
      fullWidth
      {...otherProps}
      InputProps={inputProps}
      sx={{
        variant,
        ...otherProps.sx,
      }}
    />
  );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;
